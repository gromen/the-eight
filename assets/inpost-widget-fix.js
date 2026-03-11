import { ThemeEvents } from "@theme/events";

/**
 * Fixes InPost Paczkomat widget disappearing after cart updates.
 * Re-initializes the widget when cart is updated via AJAX.
 */
class InPostWidgetFix {
  constructor() {
    this.init();
  }

  init() {
    document.addEventListener(ThemeEvents.cartUpdate, () => {
      this.reinitializeWidget();
    });

    document.addEventListener(ThemeEvents.discountUpdate, () => {
      this.reinitializeWidget();
    });
  }

  /**
   * Re-initializes the InPost Paczkomat widget
   */
  reinitializeWidget() {
    setTimeout(() => {
      if (window.easyPack) {
        try {
          if (typeof window.easyPack.init === "function") {
            window.easyPack.init();
          } else if (typeof window.easyPack.refresh === "function") {
            window.easyPack.refresh();
          } else if (typeof window.easyPack.reloadWidgets === "function") {
            window.easyPack.reloadWidgets();
          }
        } catch (error) {
          console.warn("InPost widget re-initialization failed:", error);
        }
      }

      // Alternative: Trigger widget re-initialization via custom event
      // Some InPost integrations use custom events
      const inpostElement = document.querySelector(
        "[data-inpost-widget], #inpost-geowidget",
      );
      if (inpostElement) {
        // Dispatch custom event that InPost widget might listen to
        inpostElement.dispatchEvent(
          new CustomEvent("inpost:reinit", { bubbles: true }),
        );
      }

      // Alternative: For Shopify app blocks, trigger Shopify section refresh
      const appBlockContainer = document.querySelector(
        '[id^="shopify-block-"][id*="inpost"]',
      );
      if (appBlockContainer && !window.easyPack) {
        // Widget is likely inside an app block - trigger app reinitialization
        const event = new CustomEvent("shopify:section:load", {
          detail: { sectionId: appBlockContainer.id },
        });
        document.dispatchEvent(event);
      }
    }, 300); // Wait for morph to complete
  }
}

// Initialize the fix
new InPostWidgetFix();
