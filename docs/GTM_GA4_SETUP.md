# Google Tag Manager + GA4 Setup Guide

## ✅ Completed: GTM Installation in Theme

GTM Container ID: `GTM-NN78D2QH`

### Files Added/Modified:
- ✅ `snippets/tracking-scripts.liquid` - Centralized tracking scripts manager
- ✅ `snippets/gtm-datalayer.liquid` - E-commerce data layer helper
- ✅ `assets/gtm-ecommerce-tracker.js` - Web Component for cart events
- ✅ `layout/theme.liquid` - GTM snippets integrated
- ✅ `sections/product-information.liquid` - Product view tracking
- ✅ `sections/main-collection.liquid` - Collection view tracking

### Events Already Implemented (Client-Side):
- ✅ `view_item` - Product page views
- ✅ `view_item_list` - Collection page views
- ✅ `add_to_cart` - Add to cart button clicks
- ✅ `remove_from_cart` - Cart item removal
- ✅ `begin_checkout` - Checkout button clicks

---

## 📋 Next Steps: GA4 Configuration

### Step 1: Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com)
2. **Admin** → **Create Property**
3. Property name: `[Client Name] - The Eight`
4. Time zone: `Poland`
5. Currency: `PLN`
6. Click **Next** → Select industry/business size → **Create**

7. **Set up data stream:**
   - Platform: **Web**
   - Website URL: `https://[your-domain].com`
   - Stream name: `The Eight Website`
   - **Enhanced measurement:** Turn ON (automatic events)
   - Click **Create stream**

8. **Copy Measurement ID:** `G-XXXXXXXXXX` (will need this for GTM)

---

### Step 2: Connect GA4 to GTM

1. Go to [Google Tag Manager](https://tagmanager.google.com)
2. Select container: `GTM-NN78D2QH`

#### A) Create GA4 Configuration Tag

1. **Tags** → **New**
2. Tag name: `GA4 - Configuration`
3. Tag type: **Google Analytics: GA4 Configuration**
4. **Measurement ID:** Paste your `G-XXXXXXXXXX`
5. Triggering: **All Pages**
6. **Save**

#### B) Create E-commerce Event Tags

**Tag 1: View Item**
1. **Tags** → **New** → `GA4 - View Item`
2. Tag type: **Google Analytics: GA4 Event**
3. Configuration Tag: Select `GA4 - Configuration`
4. Event Name: `view_item`
5. **Event Parameters:** Send Ecommerce data from `ecommerce` object
6. Triggering: **Custom Event** → Event name = `view_item`
7. **Save**

**Tag 2: View Item List**
1. **Tags** → **New** → `GA4 - View Item List`
2. Tag type: **Google Analytics: GA4 Event**
3. Configuration Tag: Select `GA4 - Configuration`
4. Event Name: `view_item_list`
5. **Event Parameters:** Send Ecommerce data from `ecommerce` object
6. Triggering: **Custom Event** → Event name = `view_item_list`
7. **Save**

**Tag 3: Add to Cart**
1. **Tags** → **New** → `GA4 - Add to Cart`
2. Tag type: **Google Analytics: GA4 Event**
3. Configuration Tag: Select `GA4 - Configuration`
4. Event Name: `add_to_cart`
5. **Event Parameters:** Send Ecommerce data from `ecommerce` object
6. Triggering: **Custom Event** → Event name = `add_to_cart`
7. **Save**

**Tag 4: Remove from Cart**
1. **Tags** → **New** → `GA4 - Remove from Cart`
2. Tag type: **Google Analytics: GA4 Event**
3. Configuration Tag: Select `GA4 - Configuration`
4. Event Name: `remove_from_cart`
5. **Event Parameters:** Send Ecommerce data from `ecommerce` object
6. Triggering: **Custom Event** → Event name = `remove_from_cart`
7. **Save**

**Tag 5: Begin Checkout**
1. **Tags** → **New** → `GA4 - Begin Checkout`
2. Tag type: **Google Analytics: GA4 Event**
3. Configuration Tag: Select `GA4 - Configuration`
4. Event Name: `begin_checkout`
5. **Event Parameters:** Send Ecommerce data from `ecommerce` object
6. Triggering: **Custom Event** → Event name = `begin_checkout`
7. **Save**

---

### Step 3: Create Custom Event Triggers

For each event (view_item, view_item_list, add_to_cart, remove_from_cart, begin_checkout):

1. **Triggers** → **New**
2. Trigger name: e.g., `Custom Event - view_item`
3. Trigger type: **Custom Event**
4. Event name: `view_item` (match exact event name)
5. This trigger fires on: **All Custom Events**
6. **Save**

Repeat for all 5 events.

---

### Step 4: Add Purchase Tracking (Shopify Admin)

Since checkout is controlled by Shopify, use **Customer Events** for purchase tracking:

1. **Shopify Admin** → **Settings** → **Customer events**
2. **Add custom pixel** → **Google Tag Manager**
3. Select your GTM container
4. This automatically tracks: `purchase`, `page_view`, `search`, `collection_view`, `product_view`

OR manually add GA4 pixel:

1. **Add custom pixel** → **Google Analytics 4**
2. Enter your Measurement ID: `G-XXXXXXXXXX`
3. **Save**

---

### Step 5: Publish GTM Container

1. **Submit** (top right in GTM)
2. Version name: `Initial GA4 E-commerce Setup`
3. Version description: `GA4 config + 5 e-commerce events`
4. **Publish**

---

### Step 6: Test & Verify

#### A) Enable GTM Preview Mode
1. GTM → **Preview** (top right)
2. Enter your store URL
3. **Connect**

#### B) Test Events
1. Navigate to product page → Check `view_item` fires
2. Navigate to collection page → Check `view_item_list` fires
3. Click "Add to Cart" → Check `add_to_cart` fires
4. Go to cart, remove item → Check `remove_from_cart` fires
5. Click "Checkout" → Check `begin_checkout` fires

#### C) Verify in GA4 Real-Time
1. GA4 → **Reports** → **Realtime**
2. Perform test actions
3. Events should appear within seconds

---

### Step 7: Debug Mode (Optional)

Add `?gtm_debug=1` to any URL to see console logs of GTM events:

```
https://your-store.com/products/example?gtm_debug=1
```

Open DevTools → Console → See dataLayer pushes

---

## 📊 What You'll See in GA4

After 24-48 hours, data will appear in:

- **Reports** → **Realtime** - Live events
- **Reports** → **Engagement** → **Events** - All events
- **Reports** → **Monetization** → **Ecommerce purchases** - Purchase data
- **Explore** → Create custom funnels (View → Add to Cart → Checkout → Purchase)

---

## 🔧 Troubleshooting

**Events not firing?**
- Check GTM Preview mode - are events visible in dataLayer?
- Check browser console for errors
- Verify GTM container is published

**GA4 not receiving data?**
- Verify Measurement ID is correct
- Check GA4 Configuration tag fires on All Pages
- Wait 24-48h for full data processing

**E-commerce data missing?**
- Check `ecommerce` object in dataLayer (GTM Preview)
- Verify "Send Ecommerce" is enabled in GA4 Event tags

---

## 📝 Next Steps After GA4

Once GA4 is confirmed working:
1. ✅ Install Meta Pixel (for Facebook/Instagram ads)
2. ✅ Set up Shopify Email
3. ✅ Install Microsoft Clarity (heatmaps)
4. ✅ Install Judge.me Reviews

---

## Support

Questions? Check:
- [GA4 E-commerce Events Reference](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)
- [GTM Documentation](https://support.google.com/tagmanager)
