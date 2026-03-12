/**
 * GTM E-commerce Event Tracker
 *
 * Listens to cart events and pushes data to GTM dataLayer.
 * Handles: add_to_cart, remove_from_cart, begin_checkout
 */

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
    document.removeEventListener('cart:item-added', this.#handleAddToCart);
    document.removeEventListener('cart:item-removed', this.#handleRemoveFromCart);
  }

  #attachEventListeners() {
    document.addEventListener('cart:item-added', this.#handleAddToCart.bind(this));
    document.addEventListener('cart:item-removed', this.#handleRemoveFromCart.bind(this));

    // Listen for checkout button clicks
    const checkoutButtons = document.querySelectorAll('[name="checkout"]');
    checkoutButtons.forEach(button => {
      button.addEventListener('click', this.#handleBeginCheckout.bind(this));
    });
  }

  /**
   * Handle add_to_cart event
   * @param {CustomEvent} event
   */
  #handleAddToCart(event) {
    const { items } = event.detail;
    if (!items || items.length === 0) return;

    const item = items[0];
    const dataLayerEvent = {
      event: 'add_to_cart',
      ecommerce: {
        currency: item.price_data?.currency || 'PLN',
        value: this.#formatPrice(item.final_price),
        items: [{
          item_id: item.sku || item.variant_id,
          item_name: item.product_title,
          item_variant: item.variant_title,
          price: this.#formatPrice(item.final_price),
          quantity: item.quantity
        }]
      }
    };

    this.#pushToDataLayer(dataLayerEvent);
  }

  /**
   * Handle remove_from_cart event
   * @param {CustomEvent} event
   */
  #handleRemoveFromCart(event) {
    const { item } = event.detail;
    if (!item) return;

    const dataLayerEvent = {
      event: 'remove_from_cart',
      ecommerce: {
        currency: 'PLN',
        items: [{
          item_id: item.sku || item.variant_id,
          item_name: item.product_title,
          quantity: item.quantity
        }]
      }
    };

    this.#pushToDataLayer(dataLayerEvent);
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
   * @param {Number} priceInCents
   * @returns {Number}
   */
  #formatPrice(priceInCents) {
    return (priceInCents / 100).toFixed(2);
  }

  /**
   * Push event to dataLayer
   * @param {Object} event
   */
  #pushToDataLayer(event) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null }); // Clear previous ecommerce data
    window.dataLayer.push(event);

    // Debug mode
    if (window.location.search.includes('gtm_debug=1')) {
      console.log('GTM Event:', event);
    }
  }
}

customElements.define('gtm-ecommerce-tracker', GTMEcommerceTracker);
