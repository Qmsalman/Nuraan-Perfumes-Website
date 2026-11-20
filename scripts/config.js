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
  instagramHandle: "nuraan_perfumes",
  instagramUrl: "https://www.instagram.com/nuraan_perfumes?srtk=MTh1Z241OHdwcm00Yw==",
  googleMapsUrl: "https://www.google.com/maps/place/Nuraan+Perfumes/data=!4m2!3m1!1s0x3be7c39092405663:0xb15275cbcba777f4",

  // Hero Section Custom Banner Image (Leave empty to use built-in luxury artwork, or paste Google Drive / CDN link)
  heroBannerUrl: "",
  
  // Currency & Region
  currencySymbol: "₹",
  currencyCode: "INR",
  country: "India",
  shippingNotice: "Free Discreet Shipping Across India on All Orders",

  // Default Promotional Announcement Bar
  announcement: "✦ 100% Pure Alcohol-Free Attars • Precision Roll-on Bottles • Inquire & Order via WhatsApp & Instagram ✦",

  // Introductory Launch Offer Configuration (/founder-cfo & /founder-offer)
  introductoryOfferEnabled: true,
  introductoryBadgeText: "Inaugural Launch Offer",
  regularPrice12mlClassic: 499,
  offerPrice12mlClassic: 399,
  regularPrice12mlReserve: 699,
  offerPrice12mlReserve: 599,
  regularPriceCombos: 999,
  offerPriceCombos: 749,

  // Promotional Banner Controller (Controlled via Google Sheet Website Control Panel)
  offerBannerEnabled: false,
  offerBannerImage: "",
  offerBannerLink: "#catalog",
  offerBannerHeadline: "Special Inaugural Launch Privilege",

  // Default Pricing for Curated 6-Piece Gift Sets (6 × 3ml Precision Roll-Ons)
  defaultCuratedBoxPrice: 749,
  defaultCuratedBoxMRP: 2499,
  
  // Custom "Build Your Own" 6-Piece Gift Set Price:
  customBox3mlPrice: 749,   // Inaugural Launch Price for Custom 6-Piece Box
  customBoxMRP: 2499,

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

  // Visitor Tracking & Analytics (Google Tag Manager / GA4)
  googleAnalytics: {
    enabled: true,
    measurementId: "GTM-PWWT7P7W"
  },

  // Business Hours / Response Time
  responseTime: "Replies typically within 15–30 minutes on WhatsApp"
};

// Make accessible to all scripts
window.NURAAN_CONFIG = NURAAN_CONFIG;
