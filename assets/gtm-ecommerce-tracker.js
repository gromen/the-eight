/**
 * GTM E-commerce Event Tracker
 *
 * Listens to cart events and pushes data to GTM dataLayer.
 * Handles: add_to_cart, remove_from_cart, begin_checkout
 */

// @ts-ignore - GTM adds dataLayer to window
window.dataLayer = window.dataLayer || [];

class GTMEcommerceTracker extends HTMLElement {
  #lastTrackedVariantId = null;
  #lastTrackedTimestamp = 0;
  #DEBOUNCE_MS = 1000; // Don't track same variant twice within 1 second

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
    // Cleanup if needed
  }

  #attachEventListeners() {
    // Listen for add-to-cart button clicks
    this.#attachAddToCartButtonListeners();

    // Listen for checkout button clicks
    const checkoutButtons = document.querySelectorAll('[name="checkout"]');
    checkoutButtons.forEach(button => {
      button.addEventListener('click', this.#handleBeginCheckout.bind(this));
    });
  }

  /**
   * Attach listeners to all add-to-cart buttons
   */
  #attachAddToCartButtonListeners() {
    // Find all add-to-cart buttons (including pre-order buttons)
    const addToCartButtons = document.querySelectorAll('button[name="add"]');

    addToCartButtons.forEach(button => {
      button.addEventListener('click', this.#handleAddToCartButtonClick.bind(this));
    });

    // Use MutationObserver to catch dynamically added buttons
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            const buttons = node.querySelectorAll('button[name="add"]');
            buttons.forEach(btn => {
              btn.addEventListener('click', this.#handleAddToCartButtonClick.bind(this));
            });
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  /**
   * Handle add-to-cart button click
   * @param {MouseEvent} event
   */
  async #handleAddToCartButtonClick(event) {
    const button = /** @type {HTMLButtonElement} */ (event.currentTarget);
    if (!button) return;

    // Skip if button is disabled
    if (button.disabled) return;

    // Find the product form
    const form = button.closest('form[action*="/cart/add"]');
    if (!form) return;

    // Get variant ID from form
    const variantInput = /** @type {HTMLInputElement | null} */ (form.querySelector('input[name="id"]'));
    if (!variantInput) return;

    const variantId = variantInput.value;

    // Wait a bit for the cart to update, then fetch cart data
    setTimeout(async () => {
      try {
        const response = await fetch('/cart.js');
        if (!response.ok) return;

        const cart = await response.json();

        // Find the added item
        const addedItem = cart.items.find(/** @param {any} item */ (item) => item.variant_id?.toString() === variantId);

        if (!addedItem) {
          console.warn('[GTM] Could not find item in cart after button click. Variant ID:', variantId);
          return;
        }

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
              quantity: addedItem.quantity
            }]
          }
        };

        this.#pushToDataLayer(dataLayerEvent);
      } catch (error) {
        console.error('[GTM] Error tracking add to cart button click:', error);
      }
    }, 500); // Wait 500ms for cart API to update
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
   * @param {any} event
   */
  #pushToDataLayer(event) {
    // Deduplicate add_to_cart events
    if (event.event === 'add_to_cart') {
      const variantId = event.ecommerce?.items?.[0]?.item_id;
      const now = Date.now();

      // Skip if same variant was tracked within debounce window
      if (variantId && variantId === this.#lastTrackedVariantId && (now - this.#lastTrackedTimestamp) < this.#DEBOUNCE_MS) {
        console.log('[GTM] Skipping duplicate add_to_cart event for variant:', variantId);
        return;
      }

      // Update tracking state
      this.#lastTrackedVariantId = variantId;
      this.#lastTrackedTimestamp = now;
    }

    window.dataLayer.push({ ecommerce: null }); // Clear previous ecommerce data
    window.dataLayer.push(event);

    // Debug mode
    if (window.location.search.includes('gtm_debug=1')) {
      console.log('GTM Event:', event);
    }
  }
}

customElements.define('gtm-ecommerce-tracker', GTMEcommerceTracker);
