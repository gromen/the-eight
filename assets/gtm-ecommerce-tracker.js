/**
 * GTM E-commerce Event Tracker
 *
 * Listens to cart events and pushes data to GTM dataLayer.
 * Handles: add_to_cart, remove_from_cart, begin_checkout
 */

// @ts-ignore - GTM adds dataLayer to window
window.dataLayer = window.dataLayer || [];

class GTMEcommerceTracker extends HTMLElement {
  connectedCallback() {
    // Only run on production (not localhost)
    if (this.#isLocalhost()) {
      console.log('[GTM] Tracking disabled on localhost');
      return;
    }

    this.#attachEventListeners();
  }

  /**
   * Check if running on localhost
   * @returns {boolean}
   */
  #isLocalhost() {
    const hostname = window.location.hostname;
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.');
  }

  disconnectedCallback() {
    document.removeEventListener('theme:cart:update', this.#handleCartUpdate);
  }

  #attachEventListeners() {
    // Listen to theme's CartAddEvent (dispatched from product-form.js)
    document.addEventListener('theme:cart:update', this.#handleCartUpdate.bind(this));

    // Listen for checkout button clicks
    const checkoutButtons = document.querySelectorAll('[name="checkout"]');
    checkoutButtons.forEach(button => {
      button.addEventListener('click', this.#handleBeginCheckout.bind(this));
    });
  }

  /**
   * Handle cart update event (theme:cart:update)
   * @param {CustomEvent} event
   */
  async #handleCartUpdate(event) {
    const { detail } = event;

    // Skip if cart operation failed
    if (detail?.data?.didError) return;

    // For add to cart events, fetch the added item details
    try {
      const response = await fetch('/cart.js');
      if (!response.ok) return;

      const cart = await response.json();
      const sourceId = detail?.sourceId;

      // Find the item that was just added (match by variant ID)
      const addedItem = cart.items.find(/** @param {any} item */ (item) => item.variant_id?.toString() === sourceId);

      if (!addedItem) return;

      const dataLayerEvent = {
        event: 'add_to_cart',
        ecommerce: {
          currency: cart.currency,
          value: (addedItem.final_price / 100).toFixed(2),
          items: [{
            item_id: addedItem.sku || addedItem.variant_id,
            item_name: addedItem.product_title,
            item_variant: addedItem.variant_title,
            price: (addedItem.final_price / 100).toFixed(2),
            quantity: detail?.data?.itemCount || addedItem.quantity
          }]
        }
      };

      this.#pushToDataLayer(dataLayerEvent);
    } catch (error) {
      console.error('GTM add_to_cart error:', error);
    }
  }

  /**
   * Handle begin_checkout event
   */
  async #handleBeginCheckout() {
    try {
      const response = await fetch('/cart.js');
      if (!response.ok) return;

      const cart = await response.json();

      const dataLayerEvent = {
        event: 'begin_checkout',
        ecommerce: {
          currency: cart.currency,
          value: this.#formatPrice(cart.total_price),
          items: cart.items.map(item => ({
            item_id: item.sku || item.variant_id,
            item_name: item.product_title,
            item_variant: item.variant_title,
            price: this.#formatPrice(item.final_price),
            quantity: item.quantity
          }))
        }
      };

      this.#pushToDataLayer(dataLayerEvent);
    } catch (error) {
      console.error('GTM begin_checkout error:', error);
    }
  }

  /**
   * Format price from cents to currency
   * @param {number} priceInCents
   * @returns {string}
   */
  #formatPrice(priceInCents) {
    return (priceInCents / 100).toFixed(2);
  }

  /**
   * Push event to dataLayer
   * @param {object} event
   */
  #pushToDataLayer(event) {
    window.dataLayer.push({ ecommerce: null }); // Clear previous ecommerce data
    window.dataLayer.push(event);

    // Debug mode
    if (window.location.search.includes('gtm_debug=1')) {
      console.log('GTM Event:', event);
    }
  }
}

customElements.define('gtm-ecommerce-tracker', GTMEcommerceTracker);
