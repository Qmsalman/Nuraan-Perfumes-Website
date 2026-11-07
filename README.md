# Nuraan Perfumes — Luxury Attar Storefront

Welcome to the **Nuraan Perfumes** website codebase!  
Built with a **clean, modern boutique aesthetic (Option C: Pristine Pearl & Luxe Charcoal)**, living botanical ingredient animations, continuous motion support (animated GIFs/WebP), curated Discovery Boxes, an interactive **Build Your Own Discovery Box** builder, a **Multi-Item Scent Selection Drawer** ("Order a Couple of Attars"), and right-aligned floating social CTAs for WhatsApp and Instagram.

Designed specifically for a **vibe coder**: zero node build steps, zero complex dependencies, and instant browser reloading.

---

## 🚀 Quick Start: How to Open Your Website

1. Simply double-click `index.html` on your computer, or right-click and choose **Open with > Chrome / Edge / Safari**.
2. To test the mobile experience inside a smartphone frame, double-click `mobile-preview.html`.
3. That's it! Your entire luxury storefront is immediately live.

---

## 🛍️ Multi-Item Scent Selection ("Order a Couple of Attars")

Customers who want to order 2, 3, or more fragrances together can easily do so:
1. Tap **`[ + Add to Order List ]`** on any fragrance card (with their selected 12ml or 3ml format).
2. A floating badge appears on the bottom-right showing the bottle count and total price (e.g., `🛍️ Order List (3) • ₹3,097`).
3. Tapping it opens the slide-out **Order List Drawer**, where customers can review their selection and dispatch together via:
   - **Order Selected Attars on WhatsApp** (sends a single, itemized, numbered list with all scents, sizes, prices, and shipping prompt).
   - **Inquire Selected Attars on Instagram DM** (copies the multi-item summary and opens Instagram).

---

## 🎨 Collections & Discovery Boxes (from Irfan's Pick)

All fragrances are categorized cleanly into four collections:
1. **French Collection**: Garnet 540, Regent, Monarch, Cedar, Victor, Rumo
2. **Arabic Collection**: Musk Safa, Shaan, Wazir, Nishan, Malik, Raqeeq
3. **Women's Collection**: Velvet Oud, Garden Bloom, Black Night, Golden Musk, Island Kiss, Wazir
4. **Oud Collection**: Bayan, Camel Oud, Amir Majlis, Safwan Oud, Surkh Oud, Raqeeq

Each collection has a matching curated **Discovery Box** containing all 6 roll-on attars from that category.

---

## 🎁 Bespoke "Build Your Own" Discovery Box Builder

Customers can also create their own personalized Discovery Box:
1. **Choose Bottle Size**: Select either **3ml Roll-on Box** (₹2,499) or **12ml Roll-on Box** (₹6,999).
2. **Select Up to 6 Attars**: Tap any scent pill to add it to the 6 luxury presentation slots.
3. **Instant Order / Inquiry**: Tap **Order Custom Box on WhatsApp** or **Inquire Custom Box on IG** to send the exact list of chosen attars with one tap.

You can adjust custom box prices easily in `scripts/config.js` (`customBox3mlPrice` and `customBox12mlPrice`).

---

## 💬 Right-Aligned Social CTAs (WhatsApp + Instagram)

- **Official Instagram Colors**: All Instagram DM buttons are styled with the authentic Instagram gradient (violet, crimson, and sunset orange).
- **Right-Aligned Floating Dock**: Floating on the bottom-right of the screen for natural thumb reach on mobile and standard placement on desktop.
- **Button Orientation**:
  - WhatsApp Order is always on the left (green)
  - Instagram DM is always on the right (Instagram gradient)

---

## 🛠️ How to Customize (For the Vibe Coder)

### 1. How to Change Prices, Names & Descriptions
Open `scripts/catalog-data.js` in VS Code or any text editor:
```javascript
{
  id: "garnet-540",
  name: "Garnet 540",
  collection: "French",
  tagline: "Luminous amber crystals, sweet saffron & cedar warmth",
  description: "An intoxicating extrait-strength pure attar...",
  
  // EDIT YOUR PRICES HERE (in ₹ INR):
  price12ml: 1299,        // 12ml Luxury Single Roll-on price
  price3mlOption: 499,    // 3ml Discovery Option price
  
  image: "assets/images/garnet-540.jpg" // Or garnet-540.gif!
}
```
**Change any number or word, save the file, and refresh your browser!**

---

### 2. How to Upload Animated GIFs or Real Product Photos
* **Animated GIFs / WebPs**: If you want continuous 24/7 movement (e.g. light glinting across the glass bottle or mist rising), save your file as `.gif` or `.webp` inside `assets/images/` and update the filename in `scripts/catalog-data.js` (e.g., `image: "assets/images/garnet-540.gif"`).
* **Static Photos**: JPG or PNG format (recommended size: `800 x 1000 px`).

---

### 3. How to Change Your WhatsApp Number or Instagram
Open `scripts/config.js`:
```javascript
const NURAAN_CONFIG = {
  whatsappNumber: "918591059608",      // Country code + 10 digits
  whatsappDisplayNumber: "+91 85910 59608",
  instagramHandle: "Nuraanperfumes",
  currencySymbol: "₹",
  customBox3mlPrice: 2499,
  customBox12mlPrice: 6999,
  announcement: "✦ 100% Pure Alcohol-Free Attars • Precision Roll-on Bottles • Inquire & Order via WhatsApp & Instagram ✦"
};
```
