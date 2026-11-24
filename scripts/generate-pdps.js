/**
 * ==============================================================================
 * NURAAN PERFUMES — AUTOMATED STATIC PDP & SITEMAP GENERATOR
 * Generates static, pre-rendered, crawlable Product Detail Pages for all 22
 * artisanal fragrances and 4 curated gift sets, plus updates sitemap.xml.
 * ==============================================================================
 */

const fs = require('fs');
const path = require('path');

// 1. Load catalog data
global.window = {};
eval(fs.readFileSync(path.join(__dirname, 'catalog-data.js'), 'utf8'));
const catalog = window.NURAAN_CATALOG || [];
const combos = window.NURAAN_COMBOS || [];

const BASE_URL = 'https://nuraanperfumes.in';
const SITEMAP_PATH = path.join(__dirname, '..', 'sitemap.xml');

// Helper to escape HTML entities
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Common template generator for individual perfume PDPs
function generatePerfumePage(product) {
  const title = `${escapeHtml(product.name)} Attar ${product.inspiration ? '(Inspired by ' + escapeHtml(product.inspiration) + ')' : ''} • 100% Alcohol-Free 12ml Roll-On | Nuraan Perfumes`;
  const metaDesc = `Buy ${escapeHtml(product.name)} artisanal perfume oil in India. 100% alcohol-free 12ml roll-on ${product.inspiration ? 'inspired by ' + escapeHtml(product.inspiration) + '. ' : ''}Features ${(product.accords || []).slice(0, 3).join(', ')}. 14+ hours longevity. Free dispatch.`;
  const canonical = `${BASE_URL}/perfumes/${product.id}/`;
  const photo = product.image || `${BASE_URL}/assets/images/logo.png`;
  const price = product.price12ml || 499;
  const mrp = product.originalMrp || 28000;
  const savingsPct = Math.round(((mrp - price) / mrp) * 100);

  const topNotes = (product.notes && product.notes.top) ? product.notes.top.join(' • ') : 'Natural Florals & Citrus';
  const heartNotes = (product.notes && product.notes.heart) ? product.notes.heart.join(' • ') : 'Rare Woods & Spices';
  const baseNotes = (product.notes && product.notes.base) ? product.notes.base.join(' • ') : 'Solar Ambergris, Himalayan Cedar';

  const schemaJson = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "@id": canonical,
    "name": `${product.name} Pure Concentrated Perfume Oil (12ml Roll-On)`,
    "image": photo,
    "description": product.description,
    "sku": product.sku || `NP-${product.id.toUpperCase()}-12ML`,
    "brand": {
      "@type": "Brand",
      "name": "Nuraan Perfumes"
    },
    "offers": {
      "@type": "Offer",
      "url": canonical,
      "priceCurrency": "INR",
      "price": price,
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "INR" },
        "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "IN" },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 1, "unitCode": "d" },
          "transitTime": { "@type": "QuantitativeValue", "minValue": 2, "maxValue": 4, "unitCode": "d" }
        }
      },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "IN",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 7,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/FreeReturn"
      }
    }
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${escapeHtml(metaDesc)}">
  <link rel="canonical" href="${canonical}">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="#14171E">

  <!-- Authentic Nuraan Kufic Favicon -->
  <link rel="icon" type="image/svg+xml" href="../../assets/brand/favicon.svg">
  <link rel="icon" type="image/png" sizes="32x32" href="../../assets/brand/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="../../assets/brand/favicon-16x16.png">
  <link rel="shortcut icon" href="../../favicon.ico">
  <link rel="apple-touch-icon" sizes="180x180" href="../../assets/brand/apple-touch-icon.png">

  <!-- Open Graph -->
  <meta property="og:site_name" content="Nuraan Perfumes">
  <meta property="og:title" content="${escapeHtml(product.name)} • 100% Pure Alcohol-Free Perfume Oil">
  <meta property="og:description" content="${escapeHtml(metaDesc)}">
  <meta property="og:type" content="product">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${photo}">
  <meta property="og:image:alt" content="${escapeHtml(product.name)} Flacon by Nuraan Perfumes">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(product.name)} • Nuraan Perfumes">
  <meta name="twitter:description" content="${escapeHtml(metaDesc)}">
  <meta name="twitter:image" content="${photo}">

  <!-- Structured Data -->
  <script type="application/ld+json">
  ${JSON.stringify(schemaJson, null, 2)}
  </script>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <style>
    :root {
      --color-gold: #C5A059;
      --color-gold-dark: #8C6A2E;
      --color-dark: #14171E;
      --color-bg: #FCFBF9;
      --color-card: #FFFFFF;
      --font-display: 'Cinzel', serif;
      --font-serif: 'Cormorant Garamond', serif;
      --font-sans: 'Plus Jakarta Sans', sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--color-bg);
      color: var(--color-dark);
      font-family: var(--font-sans);
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }
    header {
      background: #FFFFFF;
      border-bottom: 1px solid rgba(197, 160, 89, 0.25);
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .brand-logo {
      font-family: var(--font-display);
      font-size: 1.35rem;
      font-weight: 700;
      color: var(--color-dark);
      text-decoration: none;
      letter-spacing: 0.08em;
    }
    .back-nav {
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--color-gold-dark);
      text-decoration: none;
    }
    .pdp-main {
      max-width: 1080px;
      margin: 36px auto;
      padding: 0 20px;
    }
    .pdp-grid {
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: 40px;
      background: #FFFFFF;
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
    }
    .pdp-visual {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at 50% 50%, #FFFFFF 0%, #F5F2EB 100%);
      border-radius: 16px;
      padding: 30px;
      position: relative;
    }
    .pdp-visual img {
      max-width: 100%;
      max-height: 480px;
      object-fit: contain;
      filter: drop-shadow(0 16px 30px rgba(0,0,0,0.18));
    }
    .pdp-badges {
      position: absolute;
      top: 16px;
      left: 16px;
      display: flex;
      gap: 8px;
    }
    .badge-pill {
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      padding: 4px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      background: rgba(197, 160, 89, 0.15);
      color: var(--color-gold-dark);
    }
    .pdp-collection {
      font-size: 0.74rem;
      font-weight: 800;
      letter-spacing: 0.14em;
      color: var(--color-gold-dark);
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .pdp-title {
      font-family: var(--font-display);
      font-size: 2.4rem;
      line-height: 1.15;
      margin-bottom: 8px;
    }
    .pdp-insp {
      font-size: 0.88rem;
      color: var(--color-gold-dark);
      margin-bottom: 16px;
      font-weight: 600;
    }
    .pdp-insp strong { color: var(--color-dark); }
    .pdp-pricing {
      display: flex;
      align-items: baseline;
      gap: 12px;
      margin-bottom: 20px;
      padding-bottom: 18px;
      border-bottom: 1px solid rgba(0,0,0,0.08);
    }
    .price-main {
      font-size: 2rem;
      font-weight: 800;
      color: var(--color-dark);
    }
    .price-mrp {
      font-size: 1.1rem;
      color: #888888;
      text-decoration: line-through;
    }
    .price-save {
      font-size: 0.8rem;
      font-weight: 800;
      color: #059669;
      background: rgba(5, 150, 105, 0.1);
      padding: 3px 8px;
      border-radius: 4px;
    }
    .pdp-story {
      font-size: 0.95rem;
      line-height: 1.6;
      color: #444444;
      margin-bottom: 24px;
    }
    .pyramid-box {
      background: #FAF8F5;
      border-radius: 12px;
      padding: 18px 20px;
      margin-bottom: 24px;
    }
    .pyramid-tier {
      display: flex;
      gap: 12px;
      margin-bottom: 10px;
      font-size: 0.82rem;
    }
    .pyramid-tier:last-child { margin-bottom: 0; }
    .tier-label {
      font-weight: 800;
      letter-spacing: 0.06em;
      min-width: 60px;
      text-transform: uppercase;
      color: var(--color-gold-dark);
    }
    .tier-notes { color: #333333; }
    .pdp-specs {
      display: flex;
      gap: 16px;
      margin-bottom: 28px;
      flex-wrap: wrap;
    }
    .spec-item {
      font-size: 0.8rem;
      font-weight: 600;
      background: #F0EDE8;
      padding: 6px 12px;
      border-radius: 16px;
      color: #555555;
    }
    .btn-add-cart {
      width: 100%;
      background: var(--color-gold);
      color: #14171E;
      font-family: var(--font-sans);
      font-size: 1.05rem;
      font-weight: 800;
      padding: 16px 24px;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 18px rgba(197, 160, 89, 0.35);
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      text-decoration: none;
    }
    .btn-add-cart:hover {
      background: #D4AF37;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(197, 160, 89, 0.45);
    }
    .pdp-trust {
      display: flex;
      justify-content: space-around;
      margin-top: 24px;
      padding-top: 18px;
      border-top: 1px dashed rgba(0,0,0,0.1);
      font-size: 0.78rem;
      color: #666666;
    }
    footer {
      max-width: 1080px;
      margin: 60px auto 30px;
      text-align: center;
      font-size: 0.78rem;
      color: #888888;
      padding: 0 20px;
    }
    @media (max-width: 768px) {
      .pdp-grid { grid-template-columns: 1fr; padding: 24px 20px; }
      .pdp-title { font-size: 1.85rem; }
    }
  </style>
</head>
<body>
  <header>
    <a href="${BASE_URL}/" class="brand-logo"><img src="../../assets/brand/favicon.svg" alt="Nuraan Emblem" width="22" height="22" style="border-radius:4px; vertical-align:middle; margin-right:6px;">NURAAN</a>
    <a href="${BASE_URL}/#catalog" class="back-nav">← Explore The Entire Collection</a>
  </header>

  <main class="pdp-main">
    <div class="pdp-grid">
      <div class="pdp-visual">
        <div class="pdp-badges">
          <span class="badge-pill">${escapeHtml(product.collection || 'Luxury')}</span>
          <span class="badge-pill">100% Pure Oil</span>
        </div>
        <img src="${photo}" alt="${escapeHtml(product.name)} Flacon by Nuraan Perfumes" loading="eager" />
      </div>

      <div class="pdp-info">
        <div class="pdp-collection">${escapeHtml(product.collection || 'Artisanal')} Collection • 12ml Precision Roll-on</div>
        <h1 class="pdp-title">${escapeHtml(product.name)}</h1>
        ${product.inspiration ? `<div class="pdp-insp">✦ Formulated in the style of <strong>${escapeHtml(product.inspiration)}</strong></div>` : ''}

        <div class="pdp-pricing">
          <span class="price-main">₹${price.toLocaleString('en-IN')}</span>
          <span class="price-mrp">MRP ₹${mrp.toLocaleString('en-IN')}</span>
          <span class="price-save">Save ${savingsPct}%</span>
        </div>

        <p class="pdp-story">${escapeHtml(product.description)}</p>

        <div class="pyramid-box">
          <div class="pyramid-tier">
            <span class="tier-label">Top</span>
            <span class="tier-notes">${escapeHtml(topNotes)}</span>
          </div>
          <div class="pyramid-tier">
            <span class="tier-label">Heart</span>
            <span class="tier-notes">${escapeHtml(heartNotes)}</span>
          </div>
          <div class="pyramid-tier">
            <span class="tier-label">Base</span>
            <span class="tier-notes">${escapeHtml(baseNotes)}</span>
          </div>
        </div>

        <div class="pdp-specs">
          <span class="spec-item">⏳ ${escapeHtml(product.longevity || '14+ Hours on Skin')}</span>
          <span class="spec-item">✨ ${escapeHtml(product.sillage || 'Regal Aura')}</span>
          <span class="spec-item">🍂 ${escapeHtml(product.season || 'All Season')}</span>
        </div>

        <button type="button" class="btn-add-cart" onclick="addToCartAndOpenStore('${product.id}')">
          <span>+ Add to Cart (₹${price.toLocaleString('en-IN')})</span>
        </button>

        <div class="pdp-trust">
          <span>✦ 100% Alcohol-Free</span>
          <span>✦ Free Express Pan-India Courier</span>
          <span>✦ 12ml Precision Roll-on</span>
        </div>
      </div>
    </div>
  </main>

  <footer>
    &copy; 2026 Nuraan Perfumes. Artisanal Concentrated Perfume Oils. 100% Alcohol-Free.
  </footer>

  <script>
    function addToCartAndOpenStore(productId) {
      try {
        const item = {
          id: '${product.id}',
          name: '${escapeHtml(product.name)}',
          price: ${price},
          size: '12ml',
          collection: '${escapeHtml(product.collection || "French")}'
        };
        const current = JSON.parse(localStorage.getItem('nuraan_selection') || '[]');
        if (!current.some(x => x.id === item.id && x.size === item.size)) {
          current.push(item);
          localStorage.setItem('nuraan_selection', JSON.stringify(current));
        }
      } catch (e) {}
      window.location.href = '${BASE_URL}/#cart';
    }
  </script>
</body>
</html>`;
}

// Generate Combo / Gift Set PDP
function generateComboPage(combo) {
  const title = `${escapeHtml(combo.name)} (6 × 3ml Discovery Coffret) | Nuraan Perfumes India`;
  const metaDesc = `Experience six acclaimed artisanal attars in the ${escapeHtml(combo.name)}. 100% pure alcohol-free concentrated perfume oils in luxury presentation gift box. Free pan-India delivery.`;
  const canonical = `${BASE_URL}/combos/${combo.id}/`;
  const photo = combo.image || `${BASE_URL}/assets/images/combo-french.jpg`;
  const price = combo.price || 999;
  const mrp = combo.mrp || 2499;
  const savingsPct = Math.round(((mrp - price) / mrp) * 100);

  const itemsList = (combo.itemsIncluded || []).map(item => `<li>✦ <strong>${escapeHtml(item)}</strong> (3ml Roll-on)</li>`).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${escapeHtml(metaDesc)}">
  <link rel="canonical" href="${canonical}">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="#14171E">

  <!-- Authentic Nuraan Kufic Favicon -->
  <link rel="icon" type="image/svg+xml" href="../../assets/brand/favicon.svg">
  <link rel="icon" type="image/png" sizes="32x32" href="../../assets/brand/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="../../assets/brand/favicon-16x16.png">
  <link rel="shortcut icon" href="../../favicon.ico">
  <link rel="apple-touch-icon" sizes="180x180" href="../../assets/brand/apple-touch-icon.png">

  <!-- Open Graph -->
  <meta property="og:site_name" content="Nuraan Perfumes">
  <meta property="og:title" content="${escapeHtml(combo.name)} • 6 × 3ml Gift Coffret">
  <meta property="og:description" content="${escapeHtml(metaDesc)}">
  <meta property="og:type" content="product">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${photo}">

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <style>
    :root {
      --color-gold: #C5A059;
      --color-gold-dark: #8C6A2E;
      --color-dark: #14171E;
      --color-bg: #FCFBF9;
      --font-display: 'Cinzel', serif;
      --font-sans: 'Plus Jakarta Sans', sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--color-bg); color: var(--color-dark); font-family: var(--font-sans); line-height: 1.5; }
    header { background: #FFFFFF; border-bottom: 1px solid rgba(197, 160, 89, 0.25); padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; }
    .brand-logo { font-family: var(--font-display); font-size: 1.35rem; font-weight: 700; color: var(--color-dark); text-decoration: none; letter-spacing: 0.08em; }
    .back-nav { font-size: 0.82rem; font-weight: 600; color: var(--color-gold-dark); text-decoration: none; }
    .pdp-main { max-width: 1080px; margin: 36px auto; padding: 0 20px; }
    .pdp-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 40px; background: #FFFFFF; border-radius: 20px; padding: 40px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05); }
    .pdp-visual { display: flex; align-items: center; justify-content: center; background: radial-gradient(circle at 50% 50%, #FFFFFF 0%, #F5F2EB 100%); border-radius: 16px; padding: 30px; }
    .pdp-visual img { max-width: 100%; max-height: 480px; object-fit: contain; filter: drop-shadow(0 16px 30px rgba(0,0,0,0.18)); border-radius: 12px; }
    .pdp-collection { font-size: 0.74rem; font-weight: 800; letter-spacing: 0.14em; color: var(--color-gold-dark); text-transform: uppercase; margin-bottom: 8px; }
    .pdp-title { font-family: var(--font-display); font-size: 2.3rem; line-height: 1.15; margin-bottom: 12px; }
    .pdp-pricing { display: flex; align-items: baseline; gap: 12px; margin-bottom: 20px; padding-bottom: 18px; border-bottom: 1px solid rgba(0,0,0,0.08); }
    .price-main { font-size: 2rem; font-weight: 800; }
    .price-mrp { font-size: 1.1rem; color: #888888; text-decoration: line-through; }
    .price-save { font-size: 0.8rem; font-weight: 800; color: #059669; background: rgba(5, 150, 105, 0.1); padding: 3px 8px; border-radius: 4px; }
    .pdp-story { font-size: 0.95rem; line-height: 1.6; color: #444444; margin-bottom: 24px; }
    .included-box { background: #FAF8F5; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px; }
    .included-title { font-weight: 800; font-size: 0.85rem; color: var(--color-gold-dark); text-transform: uppercase; margin-bottom: 10px; display: block; }
    .included-box ul { list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.85rem; }
    .btn-add-cart { width: 100%; background: var(--color-gold); color: #14171E; font-family: var(--font-sans); font-size: 1.05rem; font-weight: 800; padding: 16px 24px; border-radius: 10px; border: none; cursor: pointer; box-shadow: 0 4px 18px rgba(197, 160, 89, 0.35); transition: all 0.2s ease; }
    .btn-add-cart:hover { background: #D4AF37; transform: translateY(-2px); }
    footer { max-width: 1080px; margin: 60px auto 30px; text-align: center; font-size: 0.78rem; color: #888888; }
    @media (max-width: 768px) { .pdp-grid { grid-template-columns: 1fr; padding: 24px 20px; } .included-box ul { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <header>
    <a href="${BASE_URL}/" class="brand-logo"><img src="../../assets/brand/favicon.svg" alt="Nuraan Emblem" width="22" height="22" style="border-radius:4px; vertical-align:middle; margin-right:6px;">NURAAN</a>
    <a href="${BASE_URL}/#combos" class="back-nav">← Back to Gift Sets</a>
  </header>

  <main class="pdp-main">
    <div class="pdp-grid">
      <div class="pdp-visual">
        <img src="${photo}" alt="${escapeHtml(combo.name)} by Nuraan Perfumes" />
      </div>

      <div class="pdp-info">
        <div class="pdp-collection">✦ Luxury Gift Coffret • 6 × 3ml Precision Roll-Ons</div>
        <h1 class="pdp-title">${escapeHtml(combo.name)}</h1>

        <div class="pdp-pricing">
          <span class="price-main">₹${price.toLocaleString('en-IN')}</span>
          <span class="price-mrp">MRP ₹${mrp.toLocaleString('en-IN')}</span>
          <span class="price-save">Save ${savingsPct}%</span>
        </div>

        <p class="pdp-story">${escapeHtml(combo.description)}</p>

        <div class="included-box">
          <span class="included-title">Attars Included in this Discovery Set:</span>
          <ul>
            ${itemsList}
          </ul>
        </div>

        <button type="button" class="btn-add-cart" onclick="addComboToCart('${combo.id}')">
          <span>+ Add Gift Set to Cart (₹${price.toLocaleString('en-IN')})</span>
        </button>
      </div>
    </div>
  </main>

  <footer>
    &copy; 2026 Nuraan Perfumes. Artisanal Concentrated Perfume Oils. 100% Alcohol-Free.
  </footer>

  <script>
    function addComboToCart(comboId) {
      try {
        const item = {
          id: '${combo.id}',
          name: '${escapeHtml(combo.name)}',
          price: ${price},
          size: '6 × 3ml Coffret',
          isGiftSet: true
        };
        const current = JSON.parse(localStorage.getItem('nuraan_selection') || '[]');
        if (!current.some(x => x.id === item.id)) {
          current.push(item);
          localStorage.setItem('nuraan_selection', JSON.stringify(current));
        }
      } catch (e) {}
      window.location.href = '${BASE_URL}/#cart';
    }
  </script>
</body>
</html>`;
}

// 2. Build directories & write files
const perfumesDir = path.join(__dirname, '..', 'perfumes');
const combosDir = path.join(__dirname, '..', 'combos');

if (!fs.existsSync(perfumesDir)) fs.mkdirSync(perfumesDir, { recursive: true });
if (!fs.existsSync(combosDir)) fs.mkdirSync(combosDir, { recursive: true });

const sitemapUrls = [
  { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'daily' }
];

console.log('Generating 22 Perfume Detail Pages (PDPs)...');
catalog.forEach(product => {
  const prodDir = path.join(perfumesDir, product.id);
  if (!fs.existsSync(prodDir)) fs.mkdirSync(prodDir, { recursive: true });
  const html = generatePerfumePage(product);
  fs.writeFileSync(path.join(prodDir, 'index.html'), html, 'utf8');
  sitemapUrls.push({
    loc: `${BASE_URL}/perfumes/${product.id}/`,
    priority: '0.8',
    changefreq: 'weekly'
  });
  console.log(`  ✓ Generated /perfumes/${product.id}/index.html`);
});

console.log('Generating 4 Curated Gift Set Detail Pages...');
combos.forEach(combo => {
  const cDir = path.join(combosDir, combo.id);
  if (!fs.existsSync(cDir)) fs.mkdirSync(cDir, { recursive: true });
  const html = generateComboPage(combo);
  fs.writeFileSync(path.join(cDir, 'index.html'), html, 'utf8');
  sitemapUrls.push({
    loc: `${BASE_URL}/combos/${combo.id}/`,
    priority: '0.8',
    changefreq: 'weekly'
  });
  console.log(`  ✓ Generated /combos/${combo.id}/index.html`);
});

// 3. Generate updated sitemap.xml
const today = new Date().toISOString().split('T')[0];
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(SITEMAP_PATH, sitemapXml, 'utf8');
console.log(`✓ Updated sitemap.xml with all ${sitemapUrls.length} canonical URLs!`);
