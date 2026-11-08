/**
 * ==============================================================================
 * NURAAN PERFUMES — BRAND CONFIGURATION
 * ==============================================================================
 * HEY VIBE CODER! 👋
 * This is the easiest place to change your global brand settings.
 * Just change the values inside the quotes below and save this file.
 * The entire website will update automatically!
 * ==============================================================================
 */

const NURAAN_CONFIG = {
  // Brand Details (Clean Latin Luxury - Zero Arabic Calligraphy)
  brandName: "Nuraan Perfumes",
  tagline: "Artisanal Concentrated Perfume Oils",
  subTagline: "100% Pure Alcohol-Free Attars • Handcrafted with Rare Woods, Resins & Florals",

  // Contact & Social Media
  whatsappNumber: "918591059608",
  whatsappDisplayNumber: "+91 85910 59608",
  instagramHandle: "Nuraanperfumes",
  instagramUrl: "https://instagram.com/Nuraanperfumes",
  
  // Currency & Region
  currencySymbol: "₹",
  currencyCode: "INR",
  country: "India",
  shippingNotice: "Free Discreet Shipping Across India on All Orders",

  // Default Promotional Announcement Bar
  announcement: "✦ 100% Pure Alcohol-Free Attars • Precision Roll-on Bottles • Inquire & Order via WhatsApp & Instagram ✦",

  // Default Pricing Placeholders for Discovery Boxes (Change anytime!)
  defaultCuratedBoxPrice: 1299,
  defaultCuratedBoxMRP: 3299,
  defaultCuratedBox12mlPrice: 2999,
  defaultCuratedBox12mlMRP: 4299,
  
  // Custom "Build Your Own" Box Prices:
  customBox3mlPrice: 1399,   // Price for Custom 3ml Box (Pick up to 6 attars)
  customBox12mlPrice: 3999,  // Price for Custom 12ml Box (Pick up to 6 attars)

  // Google Sheets Live Sync (Pricing & Olfactory Notes)
  googleSheet: {
    enabled: true,
    sheetId: "1tYv3NN8dPWUWO0zTDuxyvogjDai9C2kVcr_44MfHssY",
    controlPanelGid: "1666220133",
    notesGid: "356671977",
    pricingGid: "1429582422",
    gid: "1429582422", // Default to Pricing Structure
    syncOnLoad: true
  },

  // Business Hours / Response Time
  responseTime: "Replies typically within 15–30 minutes on WhatsApp"
};

// Make accessible to all scripts
window.NURAAN_CONFIG = NURAAN_CONFIG;
