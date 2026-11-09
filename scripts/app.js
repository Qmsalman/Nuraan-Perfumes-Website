/**
 * ==============================================================================
 * NURAAN PERFUMES — MAIN APPLICATION LOGIC
 * Clean Latin Luxury • Living Botanical Animations • Custom & Curated Discovery Boxes
 * ==============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  renderBrandHeader();
  initHeroBanner();
  applyFilters();
  renderCombos(window.NURAAN_COMBOS || []);
  initCustomBoxBuilder();
  setupFilterTabs();
  setupCompassFilters();
  setupSearch();
  setupModalEvents();
  setupStickyMobileBar();
  updateSelectionUI();
}

/**
 * Update Hero Banner (Custom Image or Built-in Luxury Artwork)
 */
window.updateHeroBanner = function(url) {
  const img = document.getElementById("hero-banner-img");
  const defaultArt = document.getElementById("hero-art-default");
  if (!img) return;

  if (url && typeof url === 'string' && url.trim().length > 5) {
    let cleanUrl = url.trim();
    // Convert Google Drive links if needed
    if (cleanUrl.includes('drive.google.com') || cleanUrl.includes('docs.google.com')) {
      const fileIdMatch = cleanUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        cleanUrl = `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
      }
    }
    img.src = cleanUrl;
    img.style.display = "block";
    if (defaultArt) defaultArt.style.display = "none";
  } else {
    img.style.display = "none";
    if (defaultArt) defaultArt.style.display = "flex";
  }
};

function initHeroBanner() {
  const config = window.NURAAN_CONFIG || {};
  const bannerUrl = config.heroBannerUrl || config.heroImageOverride;
  if (bannerUrl) {
    window.updateHeroBanner(bannerUrl);
  }
}

/**
 * Update dynamic brand text from config
 */
function renderBrandHeader() {
  const config = window.NURAAN_CONFIG || {};
  
  const annEl = document.getElementById("announcement-text");
  if (annEl && config.announcement) {
    annEl.textContent = config.announcement;
  }

  const headerWa = document.getElementById("header-wa-btn");
  if (headerWa && config.whatsappNumber) {
    headerWa.href = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent("Hello Nuraan Perfumes, I would like to inquire about your pure attars.")}`;
  }

  const igUrl = config.instagramUrl || (config.instagramHandle ? `https://instagram.com/${config.instagramHandle}` : "https://www.instagram.com/nuraan_perfumes?srtk=MTh1Z241OHdwcm00Yw==");

  const headerIg = document.getElementById("header-ig-btn");
  if (headerIg) {
    headerIg.href = igUrl;
  }

  const footerWaNumber = document.getElementById("footer-wa-number");
  if (footerWaNumber && config.whatsappDisplayNumber) {
    footerWaNumber.textContent = config.whatsappDisplayNumber;
  }

  const footerIgHandle = document.getElementById("footer-ig-handle");
  if (footerIgHandle) {
    footerIgHandle.href = igUrl;
    footerIgHandle.textContent = `@${config.instagramHandle || 'nuraan_perfumes'}`;
  }

  // Floating Social Dock & Mobile Sticky Dock
  const dockWa = document.getElementById("floating-dock-wa");
  if (dockWa && config.whatsappNumber) {
    dockWa.href = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent("Hello Nuraan Perfumes, I would like to inquire about your pure attars.")}`;
  }

  const dockIg = document.getElementById("floating-dock-ig");
  if (dockIg) {
    dockIg.href = igUrl;
  }

  const mobileIg = document.getElementById("mobile-sticky-ig");
  if (mobileIg) {
    mobileIg.href = igUrl;
  }
}

/**
 * State tracking for each product's active selected size ('12ml' or '3ml')
 */
const productSelectedSizes = {};

/**
 * Indian Consumer Occasion & Season Helpers
 */
function formatOccasion(occ) {
  switch ((occ || '').toLowerCase()) {
    case 'office': return '👔 Office Wear';
    case 'casual': return '👕 Casual Wear';
    case 'party': return '🎉 Party Wear';
    case 'travelling': return '✈️ Travelling';
    default: return occ;
  }
}

function formatSeason(sea) {
  switch ((sea || '').toLowerCase()) {
    case 'summer': return '☀️ Summer Wear';
    case 'winter': return '❄️ Winter Wear';
    case 'rainy': return '🌧️ Rainy Season';
    case 'all-season': return '⛅ All Season';
    default: return sea;
  }
}

/**
 * Clean Consumer Inspiration Helper
 * Formats "Inspired by {Fragrance} — {Brand}" and "Formulated in the style of {Fragrance} by {Brand}"
 */
function getInspirationInfo(product) {
  if (!product) return { badgeText: '', modalLead: '', modalTitleSubtitle: '' };

  const rawDna = product.fragranticaDna || '';
  let shortName = product.inspiration || '';

  let brand = '';
  let scent = shortName;

  if (rawDna && rawDna.includes(' - ')) {
    const parts = rawDna.split(' - ');
    brand = parts[0].trim();
    const rest = parts.slice(1).join(' - ').replace(/\([^)]*\)/g, '').trim();
    if (!scent || scent === rawDna) {
      scent = rest;
    }
  }

  // Handle BR 540 / Baccarat Rouge 540 alias
  if (scent.toLowerCase().includes('baccarat') || scent.toLowerCase().includes('br 540') || scent.toLowerCase().includes('br 450') || product.id === 'garnet-540') {
    scent = 'BR 540';
    brand = brand || 'Maison Francis Kurkdjian';
  }

  if (!brand && rawDna && rawDna !== scent) {
    brand = rawDna;
  }

  if (!scent && !brand) {
    return { badgeText: '', modalLead: '', modalTitleSubtitle: '' };
  }

  // 1. For Catalog Card Badge: "Inspired by BR 540 — Maison Francis Kurkdjian"
  const badgeText = brand ? `${scent} — ${brand}` : scent;

  // 2. For Modal Banner: "Formulated in the style of BR 540 by Maison Francis Kurkdjian"
  const modalLead = brand 
    ? `Formulated in the style of <strong>${scent}</strong> by <strong>${brand}</strong>` 
    : `Formulated in the style of <strong>${scent}</strong>`;

  // 3. For Modal Title: "— Inspired by BR 540"
  const modalTitleSubtitle = `— Inspired by ${scent}`;

  return {
    scent,
    brand,
    badgeText,
    modalLead,
    modalTitleSubtitle
  };
}

/**
 * Render Fragrance Catalog
 */
function renderCatalog(products) {
  const grid = document.getElementById("fragrance-grid");
  if (!grid) return;

  if (products.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
        <h3 style="font-size: 1.5rem; margin-bottom: 8px;">No fragrances found matching your search</h3>
        <p style="color: var(--color-text-muted); margin-bottom: 20px;">Try searching for ingredients like "Oud", "Saffron", "Rose", or "Amber".</p>
        <button class="btn-primary-brass" onclick="resetFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  const currency = (window.NURAAN_CONFIG && window.NURAAN_CONFIG.currencySymbol) || "₹";

  grid.innerHTML = products.map((product) => {
    if (!productSelectedSizes[product.id]) {
      productSelectedSizes[product.id] = '12ml';
    }
    const currentSize = productSelectedSizes[product.id];
    const is12ml = currentSize === '12ml';
    const activePrice = is12ml ? product.price12ml : product.price3mlOption;

    const accordsHtml = (product.accords || [])
      .map(accord => `<span class="accord-pill">${accord}</span>`)
      .join("");

    const botanicalsHtml = (product.botanicals || []).map((bot, bIdx) => {
      const posClass = `pos-${bIdx + 1}`;
      return `
        <div class="natural-botanical-node ${posClass}">
          <div class="natural-botanical-pill" onclick="event.stopPropagation(); openNotesModal('${product.id}')" title="Inspect ${bot.name} in Olfactory Notes">
            <div class="natural-botanical-svg-wrap">
              ${renderBotanicalSVG(bot.type)}
            </div>
            <div class="natural-botanical-text">
              <div class="botanical-title">${bot.name}</div>
              <div class="botanical-role">${bot.role}</div>
            </div>
          </div>
        </div>
      `;
    }).join("");

    const signatureNotes = (product.accords && product.accords.length > 0)
      ? product.accords.slice(0, 3).join(" • ")
      : ([product.notes && product.notes.top && product.notes.top[0],
          product.notes && product.notes.heart && product.notes.heart[0],
          product.notes && product.notes.base && product.notes.base[0]].filter(Boolean).join(" • ") || product.tagline || "");

    const inspInfo = getInspirationInfo(product);

    return `
      <article class="perfume-card" id="card-${product.id}" data-category="${product.category}" onclick="openNotesModal('${product.id}')" role="button" tabindex="0" aria-label="Inspect ${product.name} details">
        <div class="card-visual-wrapper continuous-sheen">
          
          <div class="card-badges">
            <span class="badge badge-collection">${product.collection.toUpperCase()}</span>
            <span class="badge badge-subtle">100% PURE OIL</span>
          </div>

          <!-- Living Botanical Components -->
          ${botanicalsHtml}

          <!-- Bottle Illustration / Photo -->
          <div class="bottle-visual-container">
            ${renderProceduralBottle(product)}
          </div>

          <!-- Fragrance Notes Modal Inspection Trigger -->
          <button 
            type="button" 
            class="nudge-banner-btn" 
            id="nudge-${product.id}"
            onclick="event.stopPropagation(); openNotesModal('${product.id}')"
            aria-label="View ${product.name} Notes & Scent Pyramid"
          >
            <span>✨</span>
            <span class="nudge-label">View Fragrance Notes & Pyramid</span>
            <span>▸</span>
          </button>
        </div>

        <!-- Description Below the Image -->
        <div class="card-content">
          <!-- Compact Mobile & Desktop Header -->
          <div class="card-compact-header">
            <div class="card-meta">
              <span class="card-category">${product.category} COLLECTION</span>
              <div class="card-format-col">
                <span class="card-format-tag">PRECISION ROLL-ON</span>
                <span class="card-format-size">12ml</span>
              </div>
            </div>

            <h3 class="card-title">
              <span class="card-title-main">${product.name}</span>
            </h3>

            ${inspInfo.badgeText ? `
              <div class="card-inspired-tag" title="Inspired by ${inspInfo.badgeText}">
                <span class="inspired-sparkle">✨</span>
                <span class="inspired-text">Inspired by <strong>${inspInfo.badgeText}</strong></span>
              </div>
            ` : ''}

            <p class="card-signature-notes" title="${signatureNotes}">
              ${signatureNotes}
            </p>
          </div>

          <!-- Mobile 2-Column Compact Action Bar (Always visible with bottle & title on mobile) -->
          <div class="card-compact-price-row" onclick="event.stopPropagation()">
            <div class="compact-price-wrap">
              <span class="compact-price" id="compact-price-val-${product.id}">${currency}${activePrice.toLocaleString('en-IN')}</span>
              <span class="compact-size-label">12ml</span>
            </div>
            
            <div class="card-compact-dual-btns">
              <button 
                type="button" 
                class="btn-order-wa-compact" 
                onclick="event.stopPropagation(); triggerWhatsAppOrder('${product.id}')"
                aria-label="Order ${product.name} on WhatsApp"
                title="Order on WhatsApp"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span class="wa-full">WhatsApp</span>
                <span class="wa-short">WA</span>
              </button>

              <button 
                type="button" 
                class="btn-order-ig-compact" 
                onclick="event.stopPropagation(); triggerInstagramInquiry('${product.id}')"
                aria-label="Order ${product.name} on Instagram"
                title="Order on Instagram"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span class="ig-full">Instagram</span>
                <span class="ig-short">Insta</span>
              </button>
            </div>
          </div>

          <!-- Extended Sensory & Ordering Details (Desktop Full Face View) -->
          <div class="card-extended-details" onclick="event.stopPropagation()">
            <p class="card-tagline">"${product.tagline}"</p>
          
          <!-- Lifestyle Compass Tags: Occasion & Season -->
          <div class="card-lifestyle-tags">
            ${(product.occasions || []).map(o => `<span class="lifestyle-tag occ-tag">${formatOccasion(o)}</span>`).join('')}
            ${(product.seasons || []).map(s => `<span class="lifestyle-tag sea-tag">${formatSeason(s)}</span>`).join('')}
          </div>

          <p class="card-story">${product.description}</p>

          <div class="card-accords">
            ${accordsHtml}
          </div>

          <!-- Full Olfactory Notes Directly On Card Face -->
          <div class="card-notes-pyramid" aria-label="Olfactory notes for ${product.name}">
            <div class="card-note-tier">
              <span class="note-tier-label">TOP NOTES:</span>
              <div class="note-tier-pills">
                ${(product.notes.top || []).map(n => `<span class="card-note-pill note-top">${n}</span>`).join("")}
              </div>
            </div>
            <div class="card-note-tier">
              <span class="note-tier-label">HEART NOTES:</span>
              <div class="note-tier-pills">
                ${(product.notes.heart || []).map(n => `<span class="card-note-pill note-heart">${n}</span>`).join("")}
              </div>
            </div>
            <div class="card-note-tier">
              <span class="note-tier-label">BASE NOTES:</span>
              <div class="note-tier-pills">
                ${(product.notes.base || []).map(n => `<span class="card-note-pill note-base">${n}</span>`).join("")}
              </div>
            </div>
          </div>

          <!-- Price & Dual Ordering Action Buttons -->
          <div class="card-actions">
            <div class="current-price-display">
              <span class="price-currency">${currency}</span>
              <span class="price-val" id="price-val-${product.id}">${activePrice.toLocaleString('en-IN')}</span>
              <span class="price-note">All-India Free Dispatch</span>
            </div>

            <div class="card-order-controls">
              <!-- Multi-Item Scent Selection Button -->
              <button 
                type="button" 
                class="btn-add-selection" 
                id="btn-sel-${product.id}"
                onclick="toggleSelection('${product.id}')"
                aria-label="Add to Order List"
              >
                <span class="selection-icon">+</span>
                <span class="selection-label">Add to Order List</span>
              </button>

              <!-- Instant Order Dual Buttons (WhatsApp Left, Instagram Right) -->
              <div class="dual-action-buttons">
                <button 
                  type="button" 
                  class="btn-order-wa" 
                  onclick="triggerWhatsAppOrder('${product.id}')"
                  aria-label="Order on WhatsApp"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <span>Order on WhatsApp</span>
                </button>

                <button 
                  type="button" 
                  class="btn-inquire-ig" 
                  onclick="triggerInstagramInquiry('${product.id}')"
                  aria-label="Order on Instagram"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Order on Instagram</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
    `;
  }).join("");

  // Re-attach 3D tilt engine to all newly rendered flacons
  if (window.Nuraan3D && window.Nuraan3D.SingleBottle3D) {
    window.Nuraan3D.SingleBottle3D.attachAll();
  }
}
window.renderCatalog = renderCatalog;

/**
 * Toggle Living Botanicals on Mobile / Tap
 */
window.toggleCardBotanicals = function(productId) {
  const card = document.getElementById(`card-${productId}`);
  if (!card) return;
  card.classList.toggle("ingredients-active");
  const nudgeBtn = document.getElementById(`nudge-${productId}`);
  if (nudgeBtn) {
    const label = nudgeBtn.querySelector(".nudge-label");
    if (label) {
      if (card.classList.contains("ingredients-active")) {
        label.textContent = "Tap ingredient to inspect • Close ✕";
      } else {
        label.textContent = "Click here to see the ingredients";
      }
    }
  }
};

/**
 * Render Authentic Botanical Component Illustrations in their Original Form
 * (Free-floating natural organic shapes - zero circular badge clipping)
 */
function renderBotanicalSVG(type) {
  const normType = (type || '').toLowerCase();

  // 1. TAIF / CENTIFOLIA ROSE (Layered blooming petals in velvet crimson & soft pink)
  if (normType === 'rose') {
    return `
      <svg viewBox="0 0 40 40" class="organic-art anim-rose-breathe" width="34" height="34" xmlns="http://www.w3.org/2000/svg">
        <!-- Natural Calyx Leaf -->
        <path d="M12 28 Q18 34 26 31 Q20 26 12 28 Z" fill="#2E7D32" opacity="0.85" />
        <path d="M22 28 Q28 35 34 30 Q28 25 22 28 Z" fill="#388E3C" opacity="0.85" />
        <!-- Outer Velvet Petals -->
        <path d="M20 32 C10 32 6 23 8 16 C9 10 16 8 20 8 C24 8 31 10 32 16 C34 23 30 32 20 32 Z" fill="#880E4F" opacity="0.95" />
        <path d="M11 20 C9 13 15 9 20 10 C25 9 31 13 29 20 C27 26 13 26 11 20 Z" fill="#C2185B" />
        <!-- Middle Rose Petals -->
        <path d="M13 18 C14 12 18 11 22 12 C26 13 27 18 25 22 C23 25 15 24 13 18 Z" fill="#E91E63" />
        <path d="M16 15 C17 12 21 12 23 14 C25 16 24 20 21 21 C18 21 15 18 16 15 Z" fill="#F06292" />
        <!-- Inner Petal Core -->
        <path d="M18 16 C19 14 21 14 22 16 C22 18 20 19 19 18 Z" fill="#FFD54F" />
      </svg>
    `;
  }

  // 2. KASHMIRI SAFFRON (Slender natural stigmata threads swaying gracefully)
  if (normType === 'saffron') {
    return `
      <svg viewBox="0 0 40 40" class="organic-art anim-saffron-sway" width="34" height="34" xmlns="http://www.w3.org/2000/svg">
        <!-- Three natural Mogra saffron threads -->
        <!-- Thread 1 (Left curved thread) -->
        <path d="M20 36 C18 28 12 21 11 12 C10 8 13 6 15 8 C16 10 14 16 18 26 C19 30 20 34 20 36 Z" fill="#D32F2F" />
        <ellipse cx="14" cy="7.5" rx="2" ry="2.5" fill="#FFC107" />
        <!-- Thread 2 (Center tall thread) -->
        <path d="M20 36 C20 26 19 16 20 8 C20.5 5 23 5 23.5 8 C23 16 22 26 21 36 Z" fill="#B71C1C" />
        <ellipse cx="22" cy="6" rx="2" ry="2.8" fill="#FFD54F" />
        <!-- Thread 3 (Right curved thread) -->
        <path d="M21 36 C23 28 28 20 30 13 C31 9 28 7 26 9 C25 11 26 17 23 26 C22 30 21 34 21 36 Z" fill="#E64A19" />
        <ellipse cx="28" cy="8.5" rx="2" ry="2.5" fill="#FFC107" />
      </svg>
    `;
  }

  // 3. AGED AGARWOOD / OUD (Natural dark heartwood bark with curling incense smoke trails)
  if (normType === 'oud') {
    return `
      <svg viewBox="0 0 40 40" class="organic-art anim-oud-smoke" width="34" height="34" xmlns="http://www.w3.org/2000/svg">
        <!-- Natural Agarwood Chunk -->
        <path d="M10 22 L20 18 L31 21 L33 34 L21 36 L9 32 Z" fill="#2E1C14" />
        <path d="M12 24 L20 20 L29 23 L28 32 L20 34 L11 30 Z" fill="#4E342E" />
        <path d="M15 25 L21 22 L26 24 L25 30 L20 32 L14 29 Z" fill="#6D4C41" />
        <!-- Golden Amber Resin Vein -->
        <path d="M17 24 C19 23 22 24 23 26 C24 28 22 30 20 31 C18 31 16 28 17 24 Z" fill="#C59B27" />
        <!-- Curling Translucent Incense Smoke Trails -->
        <path d="M18 19 C16 15 22 13 20 9 C18 6 22 4 20 2" stroke="#E6D3B3" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.85" class="anim-smoke-trail-1" />
        <path d="M23 18 C25 14 20 11 23 7 C25 4 21 2 24 1" stroke="#F4EDE2" stroke-width="1.4" stroke-linecap="round" fill="none" opacity="0.7" class="anim-smoke-trail-2" />
      </svg>
    `;
  }

  // 4. MYSORE SANDALWOOD / CEDAR (Carved natural heartwood cross-section with organic grain rings)
  if (normType === 'sandal') {
    return `
      <svg viewBox="0 0 40 40" class="organic-art anim-sandal-warmth" width="34" height="34" xmlns="http://www.w3.org/2000/svg">
        <!-- Natural Bark Contour -->
        <path d="M20 4 C30 3 37 11 37 20 C37 29 29 37 19 37 C10 36 3 29 3 19 C4 10 11 4 20 4 Z" fill="#4E342E" />
        <!-- Outer Sapwood -->
        <path d="M20 7 C28 6 34 12 34 20 C33 27 27 34 19 34 C12 33 6 27 6 19 C7 11 13 7 20 7 Z" fill="#BCAAA4" />
        <!-- Golden Heartwood -->
        <path d="M20 10 C26 9 31 14 30 20 C30 26 25 31 19 31 C13 30 9 25 9 19 C10 13 14 10 20 10 Z" fill="#C5A059" />
        <!-- Concentric Growth Rings -->
        <ellipse cx="19.5" cy="19.5" rx="8" ry="7.5" fill="none" stroke="#8D6E63" stroke-width="1" opacity="0.6" />
        <ellipse cx="19.5" cy="19.5" rx="5" ry="4.5" fill="none" stroke="#6D4C41" stroke-width="1" opacity="0.7" />
        <ellipse cx="19.5" cy="19.5" rx="2.5" ry="2" fill="#3E2723" />
        <!-- Golden Aura Radiance -->
        <circle cx="19.5" cy="19.5" r="14" fill="none" stroke="#FFD54F" stroke-width="0.8" opacity="0.4" stroke-dasharray="2 3" />
      </svg>
    `;
  }

  // 5. ROASTED ESPRESSO / COFFEE BEANS (Dark whole beans with rising aromatic steam)
  if (normType === 'coffee') {
    return `
      <svg viewBox="0 0 40 40" class="organic-art anim-coffee-steam" width="34" height="34" xmlns="http://www.w3.org/2000/svg">
        <!-- Bean 1 (Tilted Left) -->
        <g transform="rotate(-20 16 26)">
          <ellipse cx="16" cy="26" rx="7.5" ry="11" fill="#2E1C14" />
          <path d="M16 16 C18 20 14 26 17 31 C18 33 17 36 17 36" stroke="#C59B27" stroke-width="1.3" fill="none" stroke-linecap="round" />
          <path d="M12 20 Q14 24 13 28" stroke="#5D4037" stroke-width="0.8" fill="none" />
        </g>
        <!-- Bean 2 (Tilted Right) -->
        <g transform="rotate(35 26 24)">
          <ellipse cx="26" cy="24" rx="6" ry="8.5" fill="#4E342E" />
          <path d="M26 16 C27.5 19 24.5 24 26.5 28" stroke="#D7CCC8" stroke-width="1.1" fill="none" stroke-linecap="round" />
        </g>
        <!-- Rising Aromatic Steam Waves -->
        <path d="M15 15 C13 11 18 9 16 5" stroke="#E6D3B3" stroke-width="1.4" stroke-linecap="round" fill="none" opacity="0.8" class="anim-steam-1" />
        <path d="M22 13 C24 9 20 7 23 3" stroke="#F4EDE2" stroke-width="1.3" stroke-linecap="round" fill="none" opacity="0.7" class="anim-steam-2" />
      </svg>
    `;
  }

  // 6. BOURBON VANILLA PODS (Dark slender vanilla pods with tiny orchid blossom)
  if (normType === 'vanilla') {
    return `
      <svg viewBox="0 0 40 40" class="organic-art anim-vanilla-gleam" width="34" height="34" xmlns="http://www.w3.org/2000/svg">
        <!-- Pod 1 -->
        <path d="M8 8 C14 16 20 25 32 34" stroke="#1C140D" stroke-width="3.5" stroke-linecap="round" fill="none" />
        <path d="M9 9 C15 17 21 26 31 33" stroke="#5D4037" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.8" />
        <!-- Pod 2 -->
        <path d="M12 6 C16 15 24 24 35 30" stroke="#2E1C14" stroke-width="3" stroke-linecap="round" fill="none" />
        <!-- Vanilla Bean Specks -->
        <circle cx="16" cy="18" r="0.8" fill="#FFD54F" />
        <circle cx="24" cy="26" r="0.8" fill="#FFD54F" />
        <circle cx="20" cy="22" r="0.7" fill="#FFF9C4" />
        <!-- Tiny Vanilla Orchid Bloom Accent -->
        <path d="M10 8 C9 6 12 5 13 7 C14 8 12 9 10 8 Z" fill="#FFF9C4" />
        <circle cx="11.5" cy="7" r="1.2" fill="#FBC02D" />
      </svg>
    `;
  }

  // 7. CITRUS / BERGAMOT / BITTER ORANGE (Sunlit sliced citrus half with glistening pulp)
  if (normType === 'citrus') {
    return `
      <svg viewBox="0 0 40 40" class="organic-art anim-citrus-glisten" width="34" height="34" xmlns="http://www.w3.org/2000/svg">
        <!-- Outer Vibrant Peel -->
        <path d="M6 22 C6 13 12 7 20 7 C28 7 34 13 34 22 Z" fill="#E65100" />
        <!-- White Pith Ring -->
        <path d="M8 22 C8 14 13 9 20 9 C27 9 32 14 32 22 Z" fill="#FFF9C4" />
        <!-- Translucent Citrus Pulp Segments -->
        <path d="M10 21 C11 16 14 12 18 11 L18 21 Z" fill="#FFB300" />
        <path d="M20 11 C24 12 28 16 29 21 L20 21 Z" fill="#FF8F00" />
        <path d="M12 21 L16 15 L19 21 Z" fill="#FFC107" />
        <path d="M21 21 L24 15 L28 21 Z" fill="#FFA000" />
        <!-- Glistening Juice Dew Droplets -->
        <circle cx="14" cy="17" r="1" fill="#FFFFFF" opacity="0.9" />
        <circle cx="25" cy="16" r="1.2" fill="#FFFFFF" opacity="0.9" />
        <path d="M20 24 C19 26 21 29 20 31 C19 31 18 29 19 26 Z" fill="#FFB300" />
      </svg>
    `;
  }

  // 8. CARAMEL / HONEY (Viscous golden drop of salted caramel / raw forest honey)
  if (normType === 'caramel' || normType === 'honey') {
    return `
      <svg viewBox="0 0 40 40" class="organic-art anim-caramel-drip" width="34" height="34" xmlns="http://www.w3.org/2000/svg">
        <!-- Molten Caramel Droplet -->
        <path d="M20 6 C20 6 25 16 26 22 C27 28 24 33 20 33 C16 33 13 28 14 22 C15 16 20 6 20 6 Z" fill="#D97706" />
        <!-- Amber Translucent Inner Layer -->
        <path d="M20 9 C20 9 23 17 24 22 C25 26 23 30 20 30 C17 30 15 26 16 22 C17 17 20 9 20 9 Z" fill="#F59E0B" />
        <!-- Light Refraction Highlight -->
        <path d="M17 19 C18 16 19 14 20 12 C19 14 18 17 17 21 C16.5 24 17 27 18 29 C17 27 16 23 17 19 Z" fill="#FEF3C7" opacity="0.9" />
        <ellipse cx="20" cy="27" rx="2" ry="1.2" fill="#FFFBEB" opacity="0.8" />
      </svg>
    `;
  }

  // 9. CEYLON CINNAMON & SPICES (Rolled cinnamon quill with spice dust motes)
  if (normType === 'cinnamon' || normType === 'spice') {
    return `
      <svg viewBox="0 0 40 40" class="organic-art anim-spice-float" width="34" height="34" xmlns="http://www.w3.org/2000/svg">
        <!-- Rolled Cinnamon Quill Cylinder -->
        <path d="M10 26 L26 10 L30 14 L14 30 Z" fill="#8D4925" />
        <path d="M12 25 L26 11 L28 13 L14 27 Z" fill="#A0522D" />
        <!-- Curled Inner Layer -->
        <ellipse cx="12" cy="28" rx="3.5" ry="2.2" transform="rotate(-45 12 28)" fill="#5C2C16" stroke="#C67C48" stroke-width="1" />
        <ellipse cx="28" cy="12" rx="3.5" ry="2.2" transform="rotate(-45 28 12)" fill="#8D4925" stroke="#C67C48" stroke-width="1" />
        <!-- Floating Golden Spice Dust Motes -->
        <circle cx="8" cy="16" r="1" fill="#FFC107" opacity="0.85" />
        <circle cx="22" cy="6" r="1.2" fill="#FFA000" opacity="0.85" />
        <circle cx="32" cy="22" r="0.9" fill="#FFD54F" opacity="0.85" />
        <circle cx="24" cy="32" r="1" fill="#FF8F00" opacity="0.85" />
      </svg>
    `;
  }

  // 10. FRENCH LAVENDER & WHITE FLORALS (Flowering lavender sprig with violet florets)
  if (normType === 'flower' || normType === 'lavender') {
    return `
      <svg viewBox="0 0 40 40" class="organic-art anim-flower-nod" width="34" height="34" xmlns="http://www.w3.org/2000/svg">
        <!-- Slender Green Stem -->
        <path d="M16 35 C17 26 21 16 23 6" stroke="#4CAF50" stroke-width="1.8" stroke-linecap="round" fill="none" />
        <!-- Lavender Buds / Florets -->
        <ellipse cx="23" cy="6" rx="2" ry="3" fill="#7E57C2" />
        <ellipse cx="20" cy="10" rx="2.5" ry="2.2" fill="#9575CD" />
        <ellipse cx="24" cy="11" rx="2.5" ry="2.2" fill="#673AB7" />
        <ellipse cx="19" cy="15" rx="3" ry="2.5" fill="#B39DDB" />
        <ellipse cx="24" cy="16" rx="3" ry="2.5" fill="#7E57C2" />
        <ellipse cx="18" cy="21" rx="3" ry="2.5" fill="#9575CD" />
        <ellipse cx="23" cy="22" rx="3" ry="2.5" fill="#512DA8" />
        <!-- Soft Leaf -->
        <path d="M17 26 Q12 24 10 26 Q14 28 17 26 Z" fill="#81C784" />
      </svg>
    `;
  }

  // 11. CURED TOBACCO LEAF (Golden russet cured leaf with branching veins)
  if (normType === 'tobacco') {
    return `
      <svg viewBox="0 0 40 40" class="organic-art anim-leaf-flutter" width="34" height="34" xmlns="http://www.w3.org/2000/svg">
        <!-- Tobacco Leaf Body -->
        <path d="M20 5 C28 9 32 18 28 28 C25 34 20 36 20 36 C20 36 15 34 12 28 C8 18 12 9 20 5 Z" fill="#8D6E63" />
        <path d="M20 7 C26 11 29 18 26 27 C23 32 20 34 20 34 C20 34 17 32 14 27 C11 18 14 11 20 7 Z" fill="#A1887F" />
        <!-- Central Rib & Lateral Veins -->
        <path d="M20 8 L20 33" stroke="#4E342E" stroke-width="1.2" stroke-linecap="round" />
        <path d="M20 14 Q24 16 26 18" stroke="#5D4037" stroke-width="0.8" fill="none" />
        <path d="M20 16 Q16 18 14 20" stroke="#5D4037" stroke-width="0.8" fill="none" />
        <path d="M20 22 Q24 24 25 26" stroke="#5D4037" stroke-width="0.8" fill="none" />
        <path d="M20 24 Q16 26 15 28" stroke="#5D4037" stroke-width="0.8" fill="none" />
      </svg>
    `;
  }

  // 12. TAHARA WHITE MUSK & LOTUS PETAL (Pure pristine lotus blossom with morning dew)
  if (normType === 'musk') {
    return `
      <svg viewBox="0 0 40 40" class="organic-art anim-musk-float" width="34" height="34" xmlns="http://www.w3.org/2000/svg">
        <!-- Ethereal Pearlescent Lotus Petals -->
        <path d="M20 6 C24 13 27 21 27 27 C27 32 24 35 20 35 C16 35 13 32 13 27 C13 21 16 13 20 6 Z" fill="#FFFFFF" stroke="#E1BEE7" stroke-width="0.8" />
        <path d="M12 18 C17 17 22 23 21 31 C17 32 12 27 12 18 Z" fill="#F3E5F5" opacity="0.9" />
        <path d="M28 18 C23 17 18 23 19 31 C23 32 28 27 28 18 Z" fill="#EDE7F6" opacity="0.9" />
        <!-- Golden Core -->
        <circle cx="20" cy="27" r="2.5" fill="#FFD54F" />
        <!-- Glistening Dewdrops -->
        <circle cx="20" cy="14" r="1.1" fill="#80DEEA" opacity="0.85" />
        <circle cx="16" cy="22" r="0.8" fill="#80DEEA" opacity="0.85" />
      </svg>
    `;
  }

  // 13. EXOTIC FRUITS / PINEAPPLE / BERRIES (Sunlit tropical fruit slice)
  if (normType === 'fruit') {
    return `
      <svg viewBox="0 0 40 40" class="organic-art anim-fruit-bob" width="34" height="34" xmlns="http://www.w3.org/2000/svg">
        <!-- Sliced Exotic Tropical Fruit / Passionfruit & Berries -->
        <path d="M8 20 C8 11 13 6 20 6 C27 6 32 11 32 20 C32 29 27 34 20 34 C13 34 8 29 8 20 Z" fill="#FF6F00" />
        <path d="M10 20 C10 13 14 8 20 8 C26 8 30 13 30 20 C30 27 26 32 20 32 C14 32 10 27 10 20 Z" fill="#FFD54F" />
        <!-- Glistening Fruit Seeds -->
        <ellipse cx="16" cy="16" rx="1.5" ry="2.2" fill="#3E2723" transform="rotate(20 16 16)" />
        <ellipse cx="23" cy="15" rx="1.5" ry="2.2" fill="#3E2723" transform="rotate(-30 23 15)" />
        <ellipse cx="22" cy="23" rx="1.5" ry="2.2" fill="#3E2723" transform="rotate(40 22 23)" />
        <ellipse cx="16" cy="24" rx="1.5" ry="2.2" fill="#3E2723" transform="rotate(-15 16 24)" />
        <circle cx="17.5" cy="14.5" r="0.8" fill="#FFFFFF" opacity="0.8" />
      </svg>
    `;
  }

  // 14. DEFAULT / SOLAR AMBER CRYSTAL (Faceted warm golden resin with light radiance)
  return `
    <svg viewBox="0 0 40 40" class="organic-art anim-amber-pulse" width="34" height="34" xmlns="http://www.w3.org/2000/svg">
      <!-- Faceted Golden Amber Crystal -->
      <polygon points="20,5 31,14 27,33 13,33 9,14" fill="#F59E0B" />
      <polygon points="20,5 27,15 20,28 13,15" fill="#FBBF24" />
      <polygon points="20,5 31,14 27,15" fill="#D97706" />
      <polygon points="20,28 27,15 27,33" fill="#B45309" />
      <polygon points="20,28 13,15 13,33" fill="#92400E" />
      <polygon points="20,5 9,14 13,15" fill="#FDE68A" />
      <!-- Specular Facet Gleam -->
      <circle cx="18" cy="12" r="1.2" fill="#FFFFFF" opacity="0.9" />
    </svg>
  `;
}

/**
 * Procedural Luxury Roll-on Bottle Visual
 */
function renderProceduralBottle(product) {
  const accent = product.bottleColor || "#C59B27";
  const name = product.name;

  const hasRealImage = Boolean(product.image && (product.image.startsWith('http://') || product.image.startsWith('https://') || product.image.startsWith('//') || product.image.startsWith('data:')));

  return `
    <div class="procedural-bottle bottle-3d-stage" data-product-id="${product.id}" title="${name} by Nuraan Perfumes">
      <div class="bottle-3d-chassis">
        ${product.image ? `
          <img 
            src="${product.image}" 
            alt="${name} by Nuraan Perfumes" 
            class="real-product-photo"
            style="max-height: 220px; width: auto; object-fit: contain; border-radius: 6px; ${hasRealImage ? 'display: block;' : 'display: none;'}"
            onload="const s = this.parentElement.querySelector('.svg-bottle-wrapper'); if(s) s.style.display='none'; this.style.display='block';"
            onerror="this.style.display='none'; const s = this.parentElement.querySelector('.svg-bottle-wrapper'); if(s) s.style.display='flex';"
            loading="lazy"
          />
        ` : ''}

        <div class="svg-bottle-wrapper" style="width: 100%; height: 100%; display: ${hasRealImage ? 'none' : 'flex'}; align-items: center; justify-content: center;">
          <svg viewBox="0 0 200 320" class="svg-bottle" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="goldCapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#9A783E" />
                <stop offset="25%" stop-color="#E5CA85" />
                <stop offset="50%" stop-color="#FDF4DC" />
                <stop offset="75%" stop-color="#D4AF37" />
                <stop offset="100%" stop-color="#84652F" />
              </linearGradient>

              <linearGradient id="oilGrad-${product.id}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${accent}" stop-opacity="0.9" />
                <stop offset="60%" stop-color="${accent}" stop-opacity="0.96" />
                <stop offset="100%" stop-color="#1A1208" stop-opacity="0.95" />
              </linearGradient>
            </defs>

            <ellipse cx="100" cy="305" rx="55" ry="10" fill="#140E0A" opacity="0.18" filter="blur(4px)" />

            <rect x="76" y="25" width="48" height="75" rx="3" fill="url(#goldCapGrad)" />
            <line x1="77" y1="40" x2="123" y2="40" stroke="#7A5D2A" stroke-width="0.8" opacity="0.6"/>
            <line x1="77" y1="65" x2="123" y2="65" stroke="#7A5D2A" stroke-width="0.8" opacity="0.6"/>
            <line x1="77" y1="90" x2="123" y2="90" stroke="#7A5D2A" stroke-width="0.8" opacity="0.6"/>
            <rect x="73" y="97" width="54" height="8" rx="2" fill="url(#goldCapGrad)" />

            <rect x="62" y="105" width="76" height="188" rx="7" fill="#FFFFFF" stroke="#C5A059" stroke-width="1.5" />
            <rect class="oil-pulse" x="70" y="115" width="60" height="170" rx="4" fill="url(#oilGrad-${product.id})" />
            <line x1="72" y1="120" x2="72" y2="280" stroke="#FFFFFF" stroke-width="2.5" opacity="0.6" stroke-linecap="round" />

            <g transform="translate(68, 145)">
              <rect x="0" y="0" width="64" height="105" rx="2" fill="#FAF8F5" stroke="#C5A059" stroke-width="1" />
              <rect x="3" y="3" width="58" height="99" rx="1" fill="none" stroke="#D4AF37" stroke-width="0.5" opacity="0.7" />
              
              <text x="32" y="26" text-anchor="middle" font-family="'Cinzel', serif" font-size="8" fill="#14171E" font-weight="bold" letter-spacing="1">NURAAN</text>
              <line x1="16" y1="34" x2="48" y2="34" stroke="#C5A059" stroke-width="0.7"/>

              <text x="32" y="58" text-anchor="middle" font-family="'Cormorant Garamond', serif" font-size="10" fill="#14171E" font-weight="bold">
                ${name.length > 11 ? name.substring(0, 9) + '..' : name}
              </text>

              <text x="32" y="74" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="5" fill="#8C734F" font-weight="bold" letter-spacing="0.5">ATTAR OIL</text>
              <text x="32" y="85" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="5" fill="#8C734F">12ml • ROLL-ON</text>
            </g>

            <rect x="64" y="286" width="72" height="7" rx="2" fill="#E2E6ED" opacity="0.7"/>
          </svg>
        </div>

        <!-- Dynamic Specular Glare Layer (Light glint follows pointer) -->
        <div class="bottle-specular-glare"></div>
      </div>

      <!-- Reactive Dynamic Floor Shadow -->
      <div class="bottle-3d-floor-shadow"></div>

      <!-- Micro 3D Inspection Badge -->
      <span class="bottle-3d-hint">✦ 3D Refraction</span>
    </div>
  `;
}

window.comboSelectedSizes = window.comboSelectedSizes || {};

window.switchComboSize = function(comboId, size) {
  window.comboSelectedSizes[comboId] = size;
  const combo = (window.NURAAN_COMBOS || []).find(c => c.id === comboId);
  if (!combo) return;

  const currency = (window.NURAAN_CONFIG && window.NURAAN_CONFIG.currencySymbol) || "₹";
  const is12ml = size === '12ml';
  const price = is12ml ? (combo.price12ml || 2999) : (combo.price3ml || combo.price || 1299);
  const mrp = is12ml ? (combo.mrp12ml || 4299) : (combo.mrp3ml || combo.mrp || 3299);
  const savings = mrp - price;

  // Update Button States
  const btn3 = document.getElementById(`combo-btn-3ml-${comboId}`);
  const btn12 = document.getElementById(`combo-btn-12ml-${comboId}`);
  if (btn3 && btn12) {
    if (is12ml) {
      btn12.classList.add("active");
      btn3.classList.remove("active");
    } else {
      btn3.classList.add("active");
      btn12.classList.remove("active");
    }
  }

  // Update Price, MRP, Savings Badge
  const priceEl = document.getElementById(`combo-price-${comboId}`);
  if (priceEl) priceEl.textContent = `${currency}${price.toLocaleString('en-IN')}`;

  const mrpEl = document.getElementById(`combo-mrp-${comboId}`);
  if (mrpEl) mrpEl.textContent = `${currency}${mrp.toLocaleString('en-IN')}`;

  const saveEl = document.getElementById(`combo-save-${comboId}`);
  if (saveEl) saveEl.textContent = `SAVE ${currency}${savings.toLocaleString('en-IN')}`;

  const tagEl = document.getElementById(`combo-tag-${comboId}`);
  if (tagEl) {
    tagEl.textContent = is12ml ? "6 × 12ml LUXURY COFFRET" : "6 × 3ml PRECISION ROLL-ONS";
  }

  const lidTagEl = document.getElementById(`combo-lid-tag-${comboId}`);
  if (lidTagEl) {
    lidTagEl.textContent = is12ml ? "6 × 12ml LUXURY COFFRET" : "6 × 3ml PRECISION ROLL-ONS";
  }

  const boxEl = document.getElementById(`combo-box-${comboId}`);
  if (boxEl) {
    if (is12ml) {
      boxEl.classList.add("size-12ml");
    } else {
      boxEl.classList.remove("size-12ml");
    }
  }

  const illustEl = document.getElementById(`combo-illust-${comboId}`);
  if (illustEl) {
    if (is12ml) {
      illustEl.classList.add("size-12ml");
    } else {
      illustEl.classList.remove("size-12ml");
    }
  }
};

/**
 * Render Curated Discovery Boxes (Interactive 3ml Discovery vs 12ml Luxury Coffret)
 */
function renderCombos(combos) {
  const container = document.getElementById("combos-grid");
  if (!container) return;

  const currency = (window.NURAAN_CONFIG && window.NURAAN_CONFIG.currencySymbol) || "₹";

  container.innerHTML = combos.map(combo => {
    const selectedSize = window.comboSelectedSizes[combo.id] || '3ml';
    const is12ml = selectedSize === '12ml';
    const price3ml = combo.price3ml || combo.price || 1299;
    const mrp3ml = combo.mrp3ml || combo.mrp || 3299;
    const price12ml = combo.price12ml || 2999;
    const mrp12ml = combo.mrp12ml || 4299;

    const activePrice = is12ml ? price12ml : price3ml;
    const activeMRP = is12ml ? mrp12ml : mrp3ml;
    const activeSavings = activeMRP - activePrice;

    const itemsHtml = (combo.itemsIncluded || [])
      .map(item => `<li><span class="bullet">✦</span> <strong>${item}</strong></li>`)
      .join("");

    const hasRealComboImage = Boolean(combo.image && (combo.image.startsWith('http://') || combo.image.startsWith('https://') || combo.image.startsWith('//') || combo.image.startsWith('data:')));

    return `
      <div class="combo-card" id="combo-${combo.id}">
        <div class="combo-badge-wrapper">
          <span class="badge badge-collection">${combo.badge}</span>
          <span class="badge badge-subtle" id="combo-save-${combo.id}" style="font-weight: 800; color: var(--wa-green);">SAVE ${currency}${activeSavings.toLocaleString('en-IN')}</span>
        </div>

        <div class="combo-body">
          <div class="combo-visual">
            ${hasRealComboImage ? `
              <div class="combo-photo-container">
                <img 
                  src="${combo.image}" 
                  alt="${combo.name} by Nuraan Perfumes" 
                  class="combo-real-photo"
                  onerror="this.style.display='none'; const b = this.parentElement.querySelector('.combo-interactive-box'); if(b) b.style.display='block';"
                  loading="lazy"
                />
                <div class="combo-interactive-box is-open ${is12ml ? 'size-12ml' : ''}" id="combo-box-${combo.id}" style="display: none;" onclick="window.toggleComboUnbox('${combo.id}')" title="Tap to toggle magnetic unboxing">
                  <!-- 3D Box Lid (Lifts and tilts in 3D perspective) -->
                  <div class="combo-box-lid" id="combo-lid-${combo.id}">
                    <div class="combo-lid-face">
                      <span class="lid-foil-badge">✦ NURAAN LUXURY COFFRET ✦</span>
                      <div class="lid-gold-stripe"></div>
                      <span class="lid-size-tag" id="combo-lid-tag-${combo.id}">${is12ml ? '6 × 12ml LUXURY COFFRET' : '6 × 3ml PRECISION ROLL-ONS'}</span>
                    </div>
                  </div>

                  <!-- 3D Box Tray (Velvet cushion with 6 nestled flacons) -->
                  <div class="combo-box-tray">
                    <div class="combo-velvet-bed">
                      <div class="combo-flacons-row" id="combo-flacons-${combo.id}">
                        <div class="combo-flacon-slot cf-1"><div class="combo-flacon-cap"></div><div class="combo-flacon-body"></div></div>
                        <div class="combo-flacon-slot cf-2"><div class="combo-flacon-cap"></div><div class="combo-flacon-body"></div></div>
                        <div class="combo-flacon-slot cf-3"><div class="combo-flacon-cap"></div><div class="combo-flacon-body"></div></div>
                        <div class="combo-flacon-slot cf-4"><div class="combo-flacon-cap"></div><div class="combo-flacon-body"></div></div>
                        <div class="combo-flacon-slot cf-5"><div class="combo-flacon-cap"></div><div class="combo-flacon-body"></div></div>
                        <div class="combo-flacon-slot cf-6"><div class="combo-flacon-cap"></div><div class="combo-flacon-body"></div></div>
                      </div>
                    </div>
                  </div>

                  <!-- Micro unbox status badge -->
                  <button type="button" class="combo-unbox-toggle-pill" id="combo-unbox-pill-${combo.id}" aria-label="Toggle Unboxing">
                    <span class="unbox-icon">✦</span>
                    <span class="unbox-text">Lid Open • Tap to Close</span>
                  </button>
                </div>
              </div>
            ` : `
              <div class="combo-interactive-box is-open ${is12ml ? 'size-12ml' : ''}" id="combo-box-${combo.id}" onclick="window.toggleComboUnbox('${combo.id}')" title="Tap to toggle magnetic unboxing">
                <!-- 3D Box Lid (Lifts and tilts in 3D perspective) -->
                <div class="combo-box-lid" id="combo-lid-${combo.id}">
                  <div class="combo-lid-face">
                    <span class="lid-foil-badge">✦ NURAAN LUXURY COFFRET ✦</span>
                    <div class="lid-gold-stripe"></div>
                    <span class="lid-size-tag" id="combo-lid-tag-${combo.id}">${is12ml ? '6 × 12ml LUXURY COFFRET' : '6 × 3ml PRECISION ROLL-ONS'}</span>
                  </div>
                </div>

                <!-- 3D Box Tray (Velvet cushion with 6 nestled flacons) -->
                <div class="combo-box-tray">
                  <div class="combo-velvet-bed">
                    <div class="combo-flacons-row" id="combo-flacons-${combo.id}">
                      <div class="combo-flacon-slot cf-1"><div class="combo-flacon-cap"></div><div class="combo-flacon-body"></div></div>
                      <div class="combo-flacon-slot cf-2"><div class="combo-flacon-cap"></div><div class="combo-flacon-body"></div></div>
                      <div class="combo-flacon-slot cf-3"><div class="combo-flacon-cap"></div><div class="combo-flacon-body"></div></div>
                      <div class="combo-flacon-slot cf-4"><div class="combo-flacon-cap"></div><div class="combo-flacon-body"></div></div>
                      <div class="combo-flacon-slot cf-5"><div class="combo-flacon-cap"></div><div class="combo-flacon-body"></div></div>
                      <div class="combo-flacon-slot cf-6"><div class="combo-flacon-cap"></div><div class="combo-flacon-body"></div></div>
                    </div>
                  </div>
                </div>

                <!-- Micro unbox status badge -->
                <button type="button" class="combo-unbox-toggle-pill" id="combo-unbox-pill-${combo.id}" aria-label="Toggle Unboxing">
                  <span class="unbox-icon">✦</span>
                  <span class="unbox-text">Lid Open • Tap to Close</span>
                </button>
              </div>
            `}
          </div>

          <h3 class="combo-title">${combo.name}</h3>
          <p class="combo-tagline">"${combo.tagline}"</p>
          <p class="combo-description">${combo.description}</p>
          
          <!-- Interactive Size Selector for Discovery Box -->
          <div class="combo-size-selector-wrap">
            <div class="combo-size-selector" role="group" aria-label="Select box size">
              <button 
                type="button" 
                class="combo-size-pill ${!is12ml ? 'active' : ''}" 
                id="combo-btn-3ml-${combo.id}"
                onclick="switchComboSize('${combo.id}', '3ml')"
              >
                <span class="size-pill-qty">3ml Discovery</span>
                <span class="size-pill-price">${currency}${price3ml.toLocaleString('en-IN')}</span>
              </button>
              <button 
                type="button" 
                class="combo-size-pill ${is12ml ? 'active' : ''}" 
                id="combo-btn-12ml-${combo.id}"
                onclick="switchComboSize('${combo.id}', '12ml')"
              >
                <span class="size-pill-qty">12ml Coffret</span>
                <span class="size-pill-price">${currency}${price12ml.toLocaleString('en-IN')}</span>
              </button>
            </div>
          </div>

          <div class="combo-included-box">
            <span class="included-title">Attars in this Box Set:</span>
            <ul class="combo-items-grid">
              ${itemsHtml}
            </ul>
          </div>

          <div class="combo-pricing-bar">
            <div class="combo-prices">
              <span class="combo-current-price" id="combo-price-${combo.id}">${currency}${activePrice.toLocaleString('en-IN')}</span>
              <span class="combo-mrp" id="combo-mrp-${combo.id}">${currency}${activeMRP.toLocaleString('en-IN')}</span>
              <span class="combo-shipping">Free Express Dispatch</span>
            </div>

            <div class="combo-cta-buttons" style="display: flex; flex-direction: column; gap: 8px;">
              <button 
                type="button" 
                class="btn-order-wa" 
                onclick="triggerComboWhatsApp('${combo.id}')"
              >
                <span>Order Discovery Box on WhatsApp</span>
              </button>
              <button 
                type="button" 
                class="btn-inquire-ig" 
                onclick="triggerComboInstagram('${combo.id}')"
              >
                <span>Order Discovery Box on Instagram</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");

  // Initialize the moving carousel and pagination dots
  initComboCarousel();
}

// ==============================================================================
// 6.5. COMBO DISCOVERY BOXES MOVING CAROUSEL (DESKTOP & MOBILE REDUCED SCROLL)
// ==============================================================================
let comboCarouselTimer = null;
let comboCurrentIndex = 0;
let isComboUserInteracting = false;
let comboInteractionResumeTimer = null;

function initComboCarousel() {
  const track = document.getElementById("combos-grid");
  const dotsContainer = document.getElementById("combo-carousel-dots");
  if (!track) return;

  const cards = track.querySelectorAll(".combo-card");
  if (!cards.length) return;

  // Render Dots
  if (dotsContainer) {
    dotsContainer.innerHTML = Array.from(cards).map((_, i) => `
      <button 
        type="button" 
        class="combo-dot ${i === 0 ? 'active' : ''}" 
        data-index="${i}" 
        aria-label="Discovery box ${i + 1}"
        onclick="scrollToComboCard(${i})"
      ></button>
    `).join("");
  }

  // Real-time scroll listener to sync active dot
  track.addEventListener("scroll", () => {
    updateActiveComboDotFromScroll();
  }, { passive: true });

  // Interrupt auto-play on hover or touch
  const wrapper = document.getElementById("combo-carousel-wrapper") || track;

  wrapper.addEventListener("mouseenter", pauseComboAutoplay);
  wrapper.addEventListener("mouseleave", resumeComboAutoplay);
  wrapper.addEventListener("touchstart", pauseComboAutoplay, { passive: true });
  wrapper.addEventListener("touchend", resumeComboAutoplay, { passive: true });

  window.addEventListener("resize", () => {
    updateActiveComboDotFromScroll();
  }, { passive: true });

  // Start auto-slide
  startComboAutoplay();
}

function updateActiveComboDotFromScroll() {
  const track = document.getElementById("combos-grid");
  if (!track) return;

  const cards = track.querySelectorAll(".combo-card");
  if (!cards.length) return;

  const trackScrollLeft = track.scrollLeft;
  let closestIndex = 0;
  let minDiff = Infinity;

  cards.forEach((card, index) => {
    const cardLeft = card.offsetLeft - track.offsetLeft;
    const diff = Math.abs(cardLeft - trackScrollLeft);
    if (diff < minDiff) {
      minDiff = diff;
      closestIndex = index;
    }
  });

  comboCurrentIndex = closestIndex;
  syncComboDots(comboCurrentIndex);
}

function syncComboDots(index) {
  const dots = document.querySelectorAll("#combo-carousel-dots .combo-dot");
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

function scrollToComboCard(index) {
  const track = document.getElementById("combos-grid");
  if (!track) return;

  const cards = track.querySelectorAll(".combo-card");
  if (!cards.length) return;

  if (index < 0) index = cards.length - 1;
  if (index >= cards.length) index = 0;

  comboCurrentIndex = index;
  const targetCard = cards[comboCurrentIndex];
  if (targetCard) {
    const isMobile = window.innerWidth < 768;
    const targetLeft = targetCard.offsetLeft - track.offsetLeft - (isMobile ? 12 : 0);
    track.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: "smooth"
    });
  }

  syncComboDots(comboCurrentIndex);
}

function moveComboCarousel(direction) {
  pauseComboAutoplay();
  scrollToComboCard(comboCurrentIndex + direction);
  resumeComboAutoplay();
}

function startComboAutoplay() {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  clearInterval(comboCarouselTimer);
  comboCarouselTimer = setInterval(() => {
    if (!isComboUserInteracting) {
      const track = document.getElementById("combos-grid");
      if (!track) return;
      const cards = track.querySelectorAll(".combo-card");
      if (!cards.length) return;

      let nextIndex = comboCurrentIndex + 1;
      if (nextIndex >= cards.length) {
        nextIndex = 0;
      }
      scrollToComboCard(nextIndex);
    }
  }, 4800);
}

function pauseComboAutoplay() {
  isComboUserInteracting = true;
  clearTimeout(comboInteractionResumeTimer);
}

function resumeComboAutoplay() {
  clearTimeout(comboInteractionResumeTimer);
  comboInteractionResumeTimer = setTimeout(() => {
    isComboUserInteracting = false;
  }, 4000);
}

window.moveComboCarousel = moveComboCarousel;
window.scrollToComboCard = scrollToComboCard;
window.initComboCarousel = initComboCarousel;

// ==============================================================================
// 7. BESPOKE "BUILD YOUR OWN" CUSTOM DISCOVERY BOX (UP TO 6 ATTARS)
// Limit sizes to: 3ml or 12ml roll-on box
// ==============================================================================
const customBoxState = {
  size: '3ml', // '3ml' or '12ml'
  selectedAttars: [] // array of product objects
};

function initCustomBoxBuilder() {
  renderCustomBoxSlots();
  renderCustomBoxPillTray();
}

window.setCustomBoxSize = function(size) {
  customBoxState.size = size;
  
  const btn3 = document.getElementById("btn-custom-size-3ml");
  const btn12 = document.getElementById("btn-custom-size-12ml");
  if (btn3 && btn12) {
    if (size === '3ml') {
      btn3.classList.add("active");
      btn12.classList.remove("active");
    } else {
      btn12.classList.add("active");
      btn3.classList.remove("active");
    }
  }

  updateCustomBoxTotal();
};

function updateCustomBoxTotal() {
  const config = window.NURAAN_CONFIG || {};
  const currency = config.currencySymbol || "₹";
  const is3ml = customBoxState.size === '3ml';
  const price3ml = config.customBox3mlPrice || 1399;
  const price12ml = config.customBox12mlPrice || 3999;
  const activePrice = is3ml ? price3ml : price12ml;

  // Sync button tags so they always match the live configuration exactly
  const tag3 = document.getElementById("tag-custom-size-3ml");
  const tag12 = document.getElementById("tag-custom-size-12ml");
  if (tag3) tag3.textContent = `${currency}${price3ml.toLocaleString('en-IN')}`;
  if (tag12) tag12.textContent = `${currency}${price12ml.toLocaleString('en-IN')}`;

  const totalEl = document.getElementById("custom-box-total");
  if (totalEl) {
    totalEl.textContent = `${currency}${activePrice.toLocaleString('en-IN')}`;
  }

  const formatNotice = document.getElementById("custom-format-notice");
  if (formatNotice) {
    formatNotice.textContent = is3ml ? "3ml Precision Roll-on Flacons" : "12ml Full-Size Luxury Roll-ons";
  }
}

function renderCustomBoxSlots() {
  const slotsContainer = document.getElementById("custom-box-slots");
  if (!slotsContainer) return;

  const totalSlots = 6;
  let html = "";

  for (let i = 0; i < totalSlots; i++) {
    const item = customBoxState.selectedAttars[i];
    if (item) {
      html += `
        <div class="builder-slot filled" style="--slot-color: ${item.bottleColor || '#C59B27'};">
          <button class="slot-remove-btn" onclick="removeAttarFromCustomBox(${i})" aria-label="Remove">✕</button>
          <span class="slot-num-badge">Slot ${i + 1}</span>
          <div class="slot-filled-bottle"></div>
          <span class="slot-filled-name">${item.name}</span>
        </div>
      `;
    } else {
      html += `
        <div class="builder-slot">
          <span class="slot-num-badge">Slot ${i + 1}</span>
          <span class="slot-empty-icon">+</span>
          <span class="slot-empty-text">Empty Slot</span>
        </div>
      `;
    }
  }

  slotsContainer.innerHTML = html;

  // Counter indicator
  const indicator = document.getElementById("custom-box-count-indicator");
  if (indicator) {
    const count = customBoxState.selectedAttars.length;
    indicator.textContent = `${count} of 6 Attars Selected`;
    if (count === 6) {
      indicator.innerHTML = `<span style="color: var(--wa-green);">✓ Box Complete (6/6 Selected)</span>`;
    }
  }

  updateCustomBoxPillStates();
}

function renderCustomBoxPillTray() {
  const tray = document.getElementById("custom-box-attar-pills");
  if (!tray) return;

  const products = window.NURAAN_CATALOG || [];
  tray.innerHTML = products.map(product => {
    return `
      <button 
        type="button" 
        class="attar-picker-pill" 
        id="picker-${product.id}"
        data-pill-id="${product.id}"
        onclick="toggleAttarInCustomBox('${product.id}', event)"
      >
        <span>✦</span>
        <span>${product.name}</span>
      </button>
    `;
  }).join("");

  updateCustomBoxPillStates();
}

function updateCustomBoxPillStates() {
  const products = window.NURAAN_CATALOG || [];
  const selectedIds = customBoxState.selectedAttars.map(p => p.id);
  const isFull = customBoxState.selectedAttars.length >= 6;

  products.forEach(p => {
    const pill = document.getElementById(`picker-${p.id}`);
    if (pill) {
      const isSelected = selectedIds.includes(p.id);
      if (isSelected) {
        pill.classList.add("selected");
        pill.disabled = false;
      } else {
        pill.classList.remove("selected");
        pill.disabled = isFull;
      }
    }
  });
}

/**
 * Emil Kowalski Fluid Flacon Addition Animation & Subtle Brass Gleam
 */
window.toggleAttarInCustomBox = function(productId, evt) {
  const product = (window.NURAAN_CATALOG || []).find(p => p.id === productId);
  if (!product) return;

  const existingIdx = customBoxState.selectedAttars.findIndex(p => p.id === productId);

  if (existingIdx !== -1) {
    // Remove if already selected
    customBoxState.selectedAttars.splice(existingIdx, 1);
    renderCustomBoxSlots();
    return;
  }

  // Check if box is full (6 attars max)
  if (customBoxState.selectedAttars.length >= 6) {
    window.SocialCheckout.showToast("Your Discovery Box is full (6 attars max). Remove one to replace.", "info");
    return;
  }

  // Haptic Visual Pop on Flacon Addition (emil-design-eng)
  const pillBtn = (evt && evt.currentTarget) || document.getElementById(`picker-${productId}`);
  const targetSlotIdx = customBoxState.selectedAttars.length;
  const slots = document.querySelectorAll('.builder-slot');
  const targetSlot = slots[targetSlotIdx];

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (pillBtn && targetSlot && !prefersReducedMotion) {
    const startRect = pillBtn.getBoundingClientRect();
    const endRect = targetSlot.getBoundingClientRect();

    if (startRect.width > 0 && endRect.width > 0) {
      const ghost = document.createElement('div');
      ghost.className = 'flying-flacon-ghost';
      ghost.style.setProperty('--flacon-color', product.bottleColor || '#C59B27');
      ghost.innerHTML = `
        <div class="ghost-bottle">
          <div class="ghost-cap"></div>
          <div class="ghost-body">
            <span class="ghost-label">${product.name}</span>
          </div>
        </div>
      `;

      const startCenterX = startRect.left + startRect.width / 2;
      const startCenterY = startRect.top + startRect.height / 2;
      const endCenterX = endRect.left + endRect.width / 2;
      const endCenterY = endRect.top + endRect.height / 2;

      ghost.style.left = `${startCenterX}px`;
      ghost.style.top = `${startCenterY}px`;
      ghost.style.transform = 'translate(-50%, -50%) scale(0.6)';
      document.body.appendChild(ghost);

      const deltaX = endCenterX - startCenterX;
      const deltaY = endCenterY - startCenterY;
      const arcMidY = deltaY * 0.5 - 65; // Fluid high arc

      const anim = ghost.animate([
        {
          transform: 'translate(-50%, -50%) scale(0.6) rotate(0deg)',
          opacity: 0.85
        },
        {
          transform: `translate(calc(-50% + ${deltaX * 0.45}px), calc(-50% + ${arcMidY}px)) scale(1.18) rotate(6deg)`,
          opacity: 1,
          offset: 0.45
        },
        {
          transform: `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px)) scale(1) rotate(0deg)`,
          opacity: 1
        }
      ], {
        duration: 380,
        easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
      });

      anim.onfinish = () => {
        ghost.remove();
        customBoxState.selectedAttars.push(product);
        renderCustomBoxSlots();

        // Trigger subtle brass gleam on newly filled slot
        const filledSlots = document.querySelectorAll('.builder-slot.filled');
        const newlyFilled = filledSlots[customBoxState.selectedAttars.length - 1];
        if (newlyFilled) {
          newlyFilled.classList.add('slot-brass-gleam');
          setTimeout(() => newlyFilled.classList.remove('slot-brass-gleam'), 700);
        }
      };
      return;
    }
  }

  // Fallback if elements not visible
  customBoxState.selectedAttars.push(product);
  renderCustomBoxSlots();
};

window.removeAttarFromCustomBox = function(index) {
  customBoxState.selectedAttars.splice(index, 1);
  renderCustomBoxSlots();
};

window.clearCustomBox = function() {
  customBoxState.selectedAttars = [];
  renderCustomBoxSlots();
};

window.triggerCustomBoxWhatsApp = function() {
  const config = window.NURAAN_CONFIG || {};
  const is3ml = customBoxState.size === '3ml';
  const price = is3ml 
    ? (config.customBox3mlPrice || 1399) 
    : (config.customBox12mlPrice || 3999);
  const sizeLabel = is3ml ? "3ml Roll-on" : "12ml Roll-on";
  const names = customBoxState.selectedAttars.map(p => p.name);

  window.SocialCheckout.orderCustomBoxOnWhatsApp(sizeLabel, names, price);
};

window.triggerCustomBoxInstagram = function() {
  const config = window.NURAAN_CONFIG || {};
  const is3ml = customBoxState.size === '3ml';
  const price = is3ml 
    ? (config.customBox3mlPrice || 1399) 
    : (config.customBox12mlPrice || 3999);
  const sizeLabel = is3ml ? "3ml Roll-on" : "12ml Roll-on";
  const names = customBoxState.selectedAttars.map(p => p.name);

  window.SocialCheckout.orderCustomBoxOnInstagram(sizeLabel, names, price);
};

/**
 * Switch product size between 12ml and 3ml
 */
window.switchProductSize = function(productId, size) {
  productSelectedSizes[productId] = size;
  const product = (window.NURAAN_CATALOG || []).find(p => p.id === productId);
  if (!product) return;

  const is12ml = size === '12ml';
  const priceVal = is12ml ? product.price12ml : product.price3mlOption;

  const btn12 = document.getElementById(`btn-12ml-${productId}`);
  const btn3 = document.getElementById(`btn-3ml-${productId}`);
  if (btn12 && btn3) {
    if (is12ml) {
      btn12.classList.add("active");
      btn3.classList.remove("active");
    } else {
      btn12.classList.remove("active");
      btn3.classList.add("active");
    }
  }

  const labelEl = document.getElementById(`size-label-${productId}`);
  if (labelEl) {
    labelEl.textContent = is12ml ? "12ml Luxury Single" : "3ml Discovery Option";
  }

  const priceEl = document.getElementById(`price-val-${productId}`);
  if (priceEl) {
    priceEl.textContent = priceVal.toLocaleString('en-IN');
  }

  const compactPriceEl = document.getElementById(`compact-price-val-${productId}`);
  if (compactPriceEl) {
    const currency = (window.NURAAN_CONFIG && window.NURAAN_CONFIG.currencySymbol) || "₹";
    compactPriceEl.textContent = `${currency}${priceVal.toLocaleString('en-IN')}`;
  }

  const compactSizeEl = document.getElementById(`compact-size-label-${productId}`);
  if (compactSizeEl) {
    compactSizeEl.textContent = is12ml ? '12ml' : '3ml';
  }

  // Update in selection list if already added
  if (window.selectionList) {
    const existing = window.selectionList.find(item => item.id === productId);
    if (existing) {
      existing.size = size;
      existing.price = priceVal;
    }
  }
  updateSelectionUI();
};

window.triggerWhatsAppOrder = function(productId) {
  const product = (window.NURAAN_CATALOG || []).find(p => p.id === productId);
  if (!product) return;
  const size = productSelectedSizes[productId] || '12ml';
  window.SocialCheckout.orderOnWhatsApp(product, size);
};

window.triggerInstagramInquiry = function(productId) {
  const product = (window.NURAAN_CATALOG || []).find(p => p.id === productId);
  if (!product) return;
  const size = productSelectedSizes[productId] || '12ml';
  window.SocialCheckout.inquireOnInstagram(product, size);
};

window.triggerComboWhatsApp = function(comboId) {
  const combo = (window.NURAAN_COMBOS || []).find(c => c.id === comboId);
  if (!combo) return;
  const size = (window.comboSelectedSizes && window.comboSelectedSizes[comboId]) || '3ml';
  window.SocialCheckout.orderComboOnWhatsApp(combo, size);
};

window.triggerComboInstagram = function(comboId) {
  const combo = (window.NURAAN_COMBOS || []).find(c => c.id === comboId);
  if (!combo) return;
  const size = (window.comboSelectedSizes && window.comboSelectedSizes[comboId]) || '3ml';
  window.SocialCheckout.inquireComboOnInstagram(combo, size);
};

/**
 * Category & Indian Buyer's Compass Filtering
 * Divides the collection into distinct parts to eliminate long scrolling fatigue
 */
let currentCategory = "all";
let currentOccasion = "all";
let currentSeason = "all";
let showAllAttarsInHighlights = false;

window.toggleShowAllAttars = function() {
  showAllAttarsInHighlights = !showAllAttarsInHighlights;
  applyFilters();
  if (showAllAttarsInHighlights) {
    const grid = document.getElementById("fragrance-grid");
    if (grid) {
      grid.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  } else {
    const catalogHeader = document.getElementById("catalog");
    if (catalogHeader) {
      catalogHeader.scrollIntoView({ behavior: "smooth" });
    }
  }
};

function setupFilterTabs() {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.getAttribute("data-category");
      // Reset expanded state when changing categories
      showAllAttarsInHighlights = false;
      applyFilters();
    });
  });
}

function setupCompassFilters() {
  const occButtons = document.querySelectorAll("#occasion-filter-group .compass-chip");
  occButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      occButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentOccasion = btn.getAttribute("data-occasion");
      showAllAttarsInHighlights = true;
      applyFilters();
    });
  });

  const seaButtons = document.querySelectorAll("#season-filter-group .compass-chip");
  seaButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      seaButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentSeason = btn.getAttribute("data-season");
      showAllAttarsInHighlights = true;
      applyFilters();
    });
  });
}

window.resetCompassFilters = function() {
  currentOccasion = "all";
  currentSeason = "all";
  
  const occButtons = document.querySelectorAll("#occasion-filter-group .compass-chip");
  occButtons.forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-occasion") === "all");
  });

  const seaButtons = document.querySelectorAll("#season-filter-group .compass-chip");
  seaButtons.forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-season") === "all");
  });

  applyFilters();
};

function setupSearch() {
  const searchInput = document.getElementById("search-input");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    applyFilters(e.target.value.trim().toLowerCase());
  });
}

function applyFilters(query = "") {
  const searchInput = document.getElementById("search-input");
  const searchQuery = query || (searchInput ? searchInput.value.trim().toLowerCase() : "");

  let filtered = window.NURAAN_CATALOG || [];

  if (currentCategory !== "all") {
    filtered = filtered.filter(p => p.category === currentCategory || p.collection === currentCategory);
  }

  if (currentOccasion !== "all") {
    filtered = filtered.filter(p => (p.occasions || []).includes(currentOccasion));
  }

  if (currentSeason !== "all") {
    filtered = filtered.filter(p => (p.seasons || []).includes(currentSeason));
  }

  if (searchQuery) {
    filtered = filtered.filter(p => {
      const matchName = p.name.toLowerCase().includes(searchQuery);
      const matchDesc = p.description.toLowerCase().includes(searchQuery);
      const matchTag = p.tagline.toLowerCase().includes(searchQuery);
      const matchAccords = (p.accords || []).some(a => a.toLowerCase().includes(searchQuery));
      const matchNotes = (
        (p.notes.top || []).concat(p.notes.heart || []).concat(p.notes.base || [])
      ).some(n => n.toLowerCase().includes(searchQuery));

      return matchName || matchDesc || matchTag || matchAccords || matchNotes;
    });
  }

  // Update Compass Active Bar
  const compassBar = document.getElementById("compass-active-bar");
  const matchCountEl = document.getElementById("compass-match-count");
  const isCompassFiltering = currentOccasion !== "all" || currentSeason !== "all";

  if (compassBar) {
    if (isCompassFiltering) {
      compassBar.style.display = "flex";
      if (matchCountEl) {
        const occLabel = currentOccasion !== 'all' ? formatOccasion(currentOccasion) : '';
        const seaLabel = currentSeason !== 'all' ? formatSeason(currentSeason) : '';
        const filterSummary = [occLabel, seaLabel].filter(Boolean).join(" & ");
        matchCountEl.textContent = `${filtered.length} Attar${filtered.length === 1 ? '' : 's'} Found for ${filterSummary}`;
      }
    } else {
      compassBar.style.display = "none";
    }
  }

  // Handle dividing the list into parts
  const expandWrapper = document.getElementById("catalog-expand-wrapper");
  const isHighlightMode = currentCategory === "all" && !searchQuery && !isCompassFiltering;

  if (isHighlightMode) {
    const totalCount = filtered.length;
    if (!showAllAttarsInHighlights && totalCount > 6) {
      const topSix = filtered.slice(0, 6);
      renderCatalog(topSix);
      if (expandWrapper) {
        expandWrapper.innerHTML = `
          <button type="button" class="btn-primary-brass" onclick="toggleShowAllAttars()" style="padding: 14px 34px; font-size: 0.92rem; box-shadow: 0 8px 24px rgba(197, 160, 89, 0.25); border-radius: 30px; cursor: pointer;">
            <span>✨ Explore All Attars (${totalCount - 6} More)</span>
            <span style="margin-left: 6px;">▾</span>
          </button>
        `;
      }
      return;
    } else if (showAllAttarsInHighlights) {
      renderCatalog(filtered);
      if (expandWrapper) {
        expandWrapper.innerHTML = `
          <button type="button" class="btn-secondary-outline" onclick="toggleShowAllAttars()" style="padding: 12px 28px; font-size: 0.86rem; border-radius: 30px; cursor: pointer;">
            <span>Show Fewer (Top 6 Highlights)</span>
            <span style="margin-left: 6px;">▴</span>
          </button>
        `;
      }
      return;
    }
  }

  if (expandWrapper) {
    expandWrapper.innerHTML = "";
  }
  renderCatalog(filtered);
}

window.resetFilters = function() {
  currentCategory = "all";
  currentOccasion = "all";
  currentSeason = "all";
  showAllAttarsInHighlights = false;
  const searchInput = document.getElementById("search-input");
  if (searchInput) searchInput.value = "";
  
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-category") === "all");
  });

  const occButtons = document.querySelectorAll("#occasion-filter-group .compass-chip");
  occButtons.forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-occasion") === "all");
  });

  const seaButtons = document.querySelectorAll("#season-filter-group .compass-chip");
  seaButtons.forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-season") === "all");
  });

  applyFilters();
};

/**
 * Olfactory Notes Modal
 */
let currentModalProductId = null;

window.openNotesModal = function(productId) {
  const product = (window.NURAAN_CATALOG || []).find(p => p.id === productId);
  if (!product) return;

  currentModalProductId = productId;
  const modal = document.getElementById("notes-modal");
  if (!modal) return;

  const currency = (window.NURAAN_CONFIG && window.NURAAN_CONFIG.currencySymbol) || "₹";
  const is12ml = (productSelectedSizes[productId] || '12ml') === '12ml';

  const modalTitleEl = document.getElementById("modal-title");
  const modalInspiredEl = document.getElementById("modal-inspired-by");
  const inspInfo = getInspirationInfo(product);

  if (modalTitleEl) {
    if (inspInfo.modalTitleSubtitle) {
      modalTitleEl.innerHTML = `${product.name} <span class="modal-title-inspired">${inspInfo.modalTitleSubtitle}</span>`;
    } else {
      modalTitleEl.textContent = product.name;
    }
  }

  if (modalInspiredEl) {
    if (inspInfo.modalLead) {
      modalInspiredEl.innerHTML = `
        <div class="modal-inspired-banner">
          <span class="modal-inspired-pill">✦ INSPIRATION</span>
          <span class="modal-inspired-lead">${inspInfo.modalLead}</span>
        </div>
      `;
      modalInspiredEl.style.display = 'block';
    } else {
      modalInspiredEl.style.display = 'none';
    }
  }

  document.getElementById("modal-category").textContent = `${product.collection.toUpperCase()} COLLECTION • 100% ALCOHOL-FREE OIL`;
  document.getElementById("modal-tagline").textContent = `"${product.tagline}"`;
  document.getElementById("modal-story").textContent = product.description;

  document.getElementById("modal-top-notes").innerHTML = (product.notes.top || []).map(n => `<span class="note-tag">${n}</span>`).join("");
  document.getElementById("modal-heart-notes").innerHTML = (product.notes.heart || []).map(n => `<span class="note-tag">${n}</span>`).join("");
  document.getElementById("modal-base-notes").innerHTML = (product.notes.base || []).map(n => `<span class="note-tag">${n}</span>`).join("");

  document.getElementById("modal-longevity").textContent = product.longevity || "14+ Hours";
  document.getElementById("modal-sillage").textContent = product.sillage || "Regal Aura";
  
  const occEl = document.getElementById("modal-occasion");
  if (occEl) {
    occEl.textContent = (product.occasions || []).map(formatOccasion).join(" • ") || "All Occasions";
  }
  const seaEl = document.getElementById("modal-season");
  if (seaEl) {
    seaEl.textContent = (product.seasons || []).map(formatSeason).join(" • ") || product.season || "All Season";
  }

  document.getElementById("modal-bottle-container").innerHTML = renderProceduralBottle(product);

  document.getElementById("modal-price").textContent = `${currency}${is12ml ? product.price12ml.toLocaleString('en-IN') : product.price3mlOption.toLocaleString('en-IN')}`;
  document.getElementById("modal-format").textContent = is12ml ? "12ml Luxury Roll-On Single" : "3ml Discovery Option";

  const modalSelBtn = document.getElementById("modal-sel-btn");
  if (modalSelBtn) {
    const isSelected = window.selectionList.some(item => item.id === productId && item.size === (is12ml ? '12ml' : '3ml'));
    if (isSelected) {
      modalSelBtn.classList.add("added");
      modalSelBtn.innerHTML = `<span class="selection-icon">✓</span><span class="selection-label">In Order List (${is12ml ? '12ml' : '3ml'}) • Remove</span>`;
    } else {
      modalSelBtn.classList.remove("added");
      modalSelBtn.innerHTML = `<span class="selection-icon">+</span><span class="selection-label">Add to Order List</span>`;
    }
  }

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
};

window.closeNotesModal = function() {
  const modal = document.getElementById("notes-modal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
};

function setupModalEvents() {
  const modal = document.getElementById("notes-modal");
  const ritualModal = document.getElementById("ritual-modal");
  const trackingModal = document.getElementById("tracking-modal");

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.classList.contains("modal-overlay")) {
        closeNotesModal();
      }
    });
  }

  if (ritualModal) {
    ritualModal.addEventListener("click", (e) => {
      if (e.target === ritualModal || e.target.classList.contains("ritual-modal-backdrop")) {
        closeRitualModal();
      }
    });
  }

  if (trackingModal) {
    trackingModal.addEventListener("click", (e) => {
      if (e.target === trackingModal || e.target.classList.contains("tracking-modal-backdrop")) {
        closeTrackingModal();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (modal && modal.classList.contains("active")) {
        closeNotesModal();
      }
      if (ritualModal && ritualModal.classList.contains("active")) {
        closeRitualModal();
      }
      if (trackingModal && trackingModal.classList.contains("active")) {
        closeTrackingModal();
      }
    }
  });

  const modalWaBtn = document.getElementById("modal-wa-btn");
  if (modalWaBtn) {
    modalWaBtn.addEventListener("click", () => {
      if (currentModalProductId) {
        triggerWhatsAppOrder(currentModalProductId);
      }
    });
  }

  const modalIgBtn = document.getElementById("modal-ig-btn");
  if (modalIgBtn) {
    modalIgBtn.addEventListener("click", () => {
      if (currentModalProductId) {
        triggerInstagramInquiry(currentModalProductId);
      }
    });
  }
}

// ==============================================================================
// HOW TO APPLY RITUAL MASTER SUITE (INTERACTIVE POP-UP MODAL)
// ==============================================================================
const RITUAL_DATA = {
  1: {
    kicker: "RITUAL 01 • THE RADIAL PULSE POINT",
    title: "Inner Wrists",
    badge: "TOUCH • STRICTLY NEVER RUB",
    subtitle: "The Body Warmth Scent Awakener",
    rule: "Strict master rule: Never rub wrists together! Frictional shear generates heat exceeding 45°C that instantly bruises and evaporates fragile top-note volatile molecules (Taif rose, Kashmiri saffron, Italian bergamot), cutting longevity in half.",
    science: "The radial artery sits directly beneath thin wrist skin, delivering steady rhythmic micro-pulses of body warmth (36.5°C to 37°C). This gentle warmth acts as a slow-release hotplate, steadily activating pure perfume oil without degrading delicate florals.",
    steps: [
      "Glide the precision roll-on once or twice gently across the inner wrist over the radial artery pulse point.",
      "Lightly dab your wrists together—strictly touch without rubbing or friction.",
      "Allow 30 seconds for your body warmth to awaken the sparkling opening top notes."
    ],
    tags: ["✋ Radial Artery", "🚫 Never Rub (Preserves Notes)", "⏱️ 14+ Hours Anchor"]
  },
  2: {
    kicker: "RITUAL 02 • INTIMATE CONVECTION SILLAGE",
    title: "Neck & Behind Ears",
    badge: "CAROTID SILLAGE CHIMNEY",
    subtitle: "The Personal Projection Aura",
    rule: "Touch applicator behind your earlobes and along the carotid artery pulse groove. Never spray or douse; a gentle roll-on glide creates an intimate 2-to-3 foot projection cloud that moves with you.",
    science: "Because warm air naturally rises, the carotid pulse groove acts as a natural convection chimney. As your blood pumps, body heat carries the scent upwards, creating a personal aura whenever you turn your head, speak, or gesture.",
    steps: [
      "Tilt your head slightly and dab the roll-on behind each earlobe in the warm hollow.",
      "Touch lightly along the carotid pulse groove on the sides of the neck.",
      "Enjoy an intimate projection aura that greets anyone entering your conversational space."
    ],
    tags: ["👂 Carotid Pulse", "💨 Upward Convection Aura", "👑 Royal Awadhi Technique"]
  },
  3: {
    kicker: "RITUAL 03 • PROTECTED WARMTH TRAP",
    title: "Inner Elbow Crease",
    badge: "BODY HEAT POCKET",
    subtitle: "The Oud & Heavy Resin Anchor",
    rule: "The inner elbow fold (antecubital fossa) is shielded from open air, wind, and frequent handwashing. It is the single best location to anchor heavy Assam agarwood, amber, and leather base notes.",
    science: "Joint flexion creates a constant micro-climate of concentrated warmth and humidity. This natural warmth pocket slows down rapid evaporation, allowing deep base resins to linger undisturbed for 18+ hours.",
    steps: [
      "Roll a small amount into the soft crease of your inner arm.",
      "Bend arm gently once to spread the pure oil evenly along the skin fold.",
      "Ideal for evening occasions, deep ouds, and opulent amber compositions."
    ],
    tags: ["💪 Antecubital Fold", "⏳ Anchors Oud & Resins", "🛡️ Shielded from Handwashing"]
  },
  4: {
    kicker: "RITUAL 04 • PALM-WARMED CONDITIONING AURA",
    title: "Beard & Hair Scenting",
    badge: "WARM IN PALMS → STROKE BEARD",
    subtitle: "0% Alcohol Scent Halo",
    rule: "Never roll heavy perfume oil directly into beard roots. Warm 1 single drop between palms for 3 seconds, then lightly stroke through the outer beard and hair tips.",
    science: "Unlike commercial sprays with 80% drying ethanol, pure attar is 100% alcohol-free oil. Natural jojoba and sandalwood botanicals condition beard hair cuticles while creating a rich 24–48 hour scent halo that lingers with every breath.",
    steps: [
      "Roll one precision drop onto the center of one palm.",
      "Rub palms together gently for 3 seconds to warm and spread the pure oil.",
      "Lightly comb palms downward through the beard and hair ends for an all-day luxury halo."
    ],
    tags: ["🧔 0% Alcohol (Non-Drying)", "🤲 Warm in Palms First", "✨ 24–48H Hair Sillage"]
  },
  5: {
    kicker: "RITUAL 05 • 72H+ LONGEVITY WITHOUT STAINING",
    title: "Collars & 'Faha' Secret",
    badge: "INNER SEAMS • ZERO EXTERNAL STAINS",
    subtitle: "Awadhi Royal Fabric Infusion",
    rule: "Pure artisanal attars are concentrated natural oils and will stain white fabrics if rolled externally. Apply strictly to inner collar folds or cuff linings—or use the Awadhi Faha (फाहा) method.",
    science: "Natural plant and animal fibers (cotton, linen, pashmina, wool) lack skin enzymes and body heat, preserving the fragrance in a state of suspended animation for 72+ hours without degradation.",
    steps: [
      "Turn collar inside-out and dab the applicator lightly along the interior lining seam.",
      "Alternatively, prepare an Awadhi Faha (फाहा): scent a tiny wisp of raw cotton and tuck it into your shirt chest pocket.",
      "Your attire will hold the regal sillage for days, even through mild temperature changes."
    ],
    tags: ["👔 Inner Collar Seams", "🪙 Awadhi Cotton Faha (फाहा)", "⏳ 72H+ Fabric Longevity"]
  }
};

window.openRitualModal = function(id) {
  const data = RITUAL_DATA[id];
  if (!data) return;

  const modal = document.getElementById("ritual-modal");
  if (!modal) return;

  document.getElementById("ritual-modal-kicker").textContent = data.kicker;
  document.getElementById("ritual-modal-title").textContent = data.title;
  document.getElementById("ritual-modal-badge").textContent = data.badge;
  document.getElementById("ritual-modal-rule").textContent = data.rule;
  document.getElementById("ritual-modal-science").textContent = data.science;

  const stepsList = document.getElementById("ritual-modal-steps");
  if (stepsList) {
    stepsList.innerHTML = data.steps.map(s => `<li>${s}</li>`).join("");
  }

  // Clone visual artwork from corresponding guide card
  const guideCards = document.querySelectorAll('.guide-card');
  const sourceCard = guideCards[id - 1] ? guideCards[id - 1].querySelector('.guide-visual-container') : null;
  const modalVisual = document.getElementById("ritual-modal-visual");
  if (sourceCard && modalVisual) {
    modalVisual.innerHTML = sourceCard.innerHTML;
  }

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
};

window.closeRitualModal = function() {
  const modal = document.getElementById("ritual-modal");
  if (!modal) return;
  modal.classList.remove("active");
  document.body.style.overflow = "";
};

/**
 * Mobile Sticky Concierge Dock
 */
function setupStickyMobileBar() {
  const dock = document.getElementById("mobile-sticky-dock");
  if (!dock) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      dock.classList.add("visible");
      dock.style.display = "flex";
    } else {
      dock.classList.remove("visible");
      dock.style.display = "none";
    }
  }, { passive: true });
}

// ==============================================================================
// 14. MULTI-ITEM SCENT SELECTION LIST SYSTEM ("ORDER A COUPLE OF ATTARS")
// ==============================================================================
window.selectionList = [];

window.toggleSelection = function(productId) {
  const product = (window.NURAAN_CATALOG || []).find(p => p.id === productId);
  if (!product) return;

  const currentSize = productSelectedSizes[productId] || '12ml';
  const is12ml = currentSize === '12ml';
  const price = is12ml ? product.price12ml : product.price3mlOption;

  const existingIdx = window.selectionList.findIndex(item => item.id === productId && item.size === currentSize);

  if (existingIdx !== -1) {
    window.selectionList.splice(existingIdx, 1);
    window.SocialCheckout.showToast(`Removed "${product.name}" from your order list.`, "info");
  } else {
    window.selectionList.push({
      id: product.id,
      name: product.name,
      collection: product.collection,
      size: currentSize,
      price: price,
      bottleColor: product.bottleColor || "#C59B27"
    });
    window.SocialCheckout.showToast(`✓ Added "${product.name} (${currentSize})" to your order list! ✨`, "success");
  }

  updateSelectionUI();
};

window.removeFromSelection = function(index) {
  if (index >= 0 && index < window.selectionList.length) {
    const item = window.selectionList[index];
    window.selectionList.splice(index, 1);
    window.SocialCheckout.showToast(`Removed "${item.name}" from your selection.`, "info");
    updateSelectionUI();
  }
};

window.clearSelection = function() {
  window.selectionList = [];
  window.SocialCheckout.showToast("Your scent selection list has been cleared.", "info");
  updateSelectionUI();
};

window.openSelectionDrawer = function() {
  const overlay = document.getElementById("selection-drawer-overlay");
  if (overlay) overlay.classList.add("open");
  document.body.style.overflow = "hidden";
};

window.closeSelectionDrawer = function() {
  const overlay = document.getElementById("selection-drawer-overlay");
  if (overlay) overlay.classList.remove("open");
  document.body.style.overflow = "";
};

window.updateSelectionUI = function() {
  const currency = (window.NURAAN_CONFIG && window.NURAAN_CONFIG.currencySymbol) || "₹";
  const count = window.selectionList.length;
  const total = window.selectionList.reduce((acc, item) => acc + item.price, 0);

  // 1. Update Card buttons
  (window.NURAAN_CATALOG || []).forEach(product => {
    const btn = document.getElementById(`btn-sel-${product.id}`);
    if (btn) {
      const currentSize = productSelectedSizes[product.id] || '12ml';
      const isSelected = window.selectionList.some(item => item.id === product.id && item.size === currentSize);
      if (isSelected) {
        btn.classList.add("added");
        btn.innerHTML = `<span class="selection-icon">✓</span><span class="selection-label">In Order List (${currentSize}) • Remove</span>`;
      } else {
        btn.classList.remove("added");
        btn.innerHTML = `<span class="selection-icon">+</span><span class="selection-label">Add to Order List</span>`;
      }
    }
  });

  // 2. Update Header Count Badge
  const headerBadge = document.getElementById("header-selection-badge");
  if (headerBadge) {
    headerBadge.textContent = count;
    headerBadge.style.display = count > 0 ? "inline-flex" : "none";
  }

  // 3. Update Floating Pill
  const pill = document.getElementById("floating-selection-pill");
  if (pill) {
    if (count > 0) {
      pill.classList.add("active");
      const pillCount = document.getElementById("pill-selection-count");
      if (pillCount) pillCount.textContent = count;
      const pillTotal = document.getElementById("pill-selection-total");
      if (pillTotal) pillTotal.textContent = `${currency}${total.toLocaleString('en-IN')}`;
    } else {
      pill.classList.remove("active");
    }
  }

  // 4. Update Drawer Items
  const itemsContainer = document.getElementById("drawer-items-list");
  if (itemsContainer) {
    if (count === 0) {
      itemsContainer.innerHTML = `
        <div class="drawer-empty-state">
          <p style="font-size: 2.2rem; margin-bottom: 8px;">🛍️</p>
          <h4 style="font-size: 1.1rem; margin-bottom: 6px; color: var(--color-text-main);">Your Selection is Empty</h4>
          <p style="color: var(--color-text-muted); font-size: 0.82rem; line-height: 1.5; max-width: 260px; margin: 0 auto;">
            Tap <strong>"+ Add to Order List"</strong> on any fragrance card to build your personalized multi-bottle order.
          </p>
        </div>
      `;
    } else {
      itemsContainer.innerHTML = window.selectionList.map((item, idx) => `
        <div class="drawer-item-card">
          <div class="drawer-item-swatch" style="--item-color: ${item.bottleColor};"></div>
          <div class="drawer-item-info">
            <div class="drawer-item-name">${item.name}</div>
            <div class="drawer-item-format">${item.size === '12ml' ? '12ml Luxury Single' : '3ml Discovery Option'} • ${item.collection}</div>
            <div class="drawer-item-price">${currency}${item.price.toLocaleString('en-IN')}</div>
          </div>
          <button type="button" class="drawer-item-remove-btn" onclick="removeFromSelection(${idx})" aria-label="Remove item">✕</button>
        </div>
      `).join("");
    }
  }

  // 5. Update Drawer Totals
  const drawerSubtotal = document.getElementById("drawer-subtotal");
  if (drawerSubtotal) drawerSubtotal.textContent = `${currency}${total.toLocaleString('en-IN')}`;
  const drawerTotal = document.getElementById("drawer-total-amount");
  if (drawerTotal) drawerTotal.textContent = `${currency}${total.toLocaleString('en-IN')}`;

  const drawerWaBtn = document.getElementById("drawer-wa-btn");
  if (drawerWaBtn) drawerWaBtn.disabled = count === 0;
  const drawerIgBtn = document.getElementById("drawer-ig-btn");
  if (drawerIgBtn) drawerIgBtn.disabled = count === 0;
};

window.triggerSelectionWhatsApp = function() {
  const total = window.selectionList.reduce((acc, item) => acc + item.price, 0);
  window.SocialCheckout.orderSelectionListOnWhatsApp(window.selectionList, total);
};

window.triggerSelectionInstagram = function() {
  const total = window.selectionList.reduce((acc, item) => acc + item.price, 0);
  window.SocialCheckout.inquireSelectionListOnInstagram(window.selectionList, total);
};

// ==============================================================================
// 15. CONSIGNMENT & SHIPMENT TRACKING CONCIERGE SYSTEM
// ==============================================================================
window.openTrackingModal = function(orderId) {
  const modal = document.getElementById("tracking-modal");
  if (!modal) return;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";

  const input = document.getElementById("tracking-search-input");
  if (orderId && input) {
    input.value = orderId;
    window.executeOrderSearch();
  } else if (input) {
    setTimeout(() => input.focus(), 150);
  }
};

window.closeTrackingModal = function() {
  const modal = document.getElementById("tracking-modal");
  if (!modal) return;
  modal.classList.remove("active");
  document.body.style.overflow = "";
};

window.quickFillTrack = function(orderId) {
  const input = document.getElementById("tracking-search-input");
  if (input) {
    input.value = orderId;
    window.executeOrderSearch();
  }
};

window.executeOrderSearch = function() {
  const input = document.getElementById("tracking-search-input");
  if (!input) return;
  const query = input.value.trim();
  if (!query) return;

  const resultBox = document.getElementById("tracking-result-box");
  const errorBox = document.getElementById("tracking-error-box");
  if (!resultBox || !errorBox) return;

  const order = window.NuraanSheetsSync ? window.NuraanSheetsSync.lookupOrder(query) : null;

  if (order) {
    errorBox.style.display = "none";
    renderTrackingResult(order);
    resultBox.style.display = "block";
  } else {
    resultBox.style.display = "none";
    const errMsg = document.getElementById("tracking-error-message");
    if (errMsg) {
      errMsg.textContent = `Order "${query}" was not found in our live dispatch log. If you placed this order recently via WhatsApp, please allow up to 2-4 hours for your AWB to sync.`;
    }
    errorBox.style.display = "block";
  }
};

function renderTrackingResult(order) {
  const container = document.getElementById("tracking-result-box");
  if (!container) return;

  const step = order.activeStep || 1;
  const hasCourierUrl = order.trackingUrl && order.trackingUrl.startsWith("http");
  const courierButton = hasCourierUrl ? `
    <a href="${order.trackingUrl}" target="_blank" class="btn-primary-brass tracking-courier-btn">
      <span>Track Live on ${order.courier} Website</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
    </a>
  ` : '';

  const waInquiryUrl = `https://wa.me/${(window.NURAAN_CONFIG && window.NURAAN_CONFIG.whatsappNumber) || '918591059608'}?text=${encodeURIComponent(`Hello Nuraan Perfumes, I am inquiring about tracking for my order #${order.orderId}.`)}`;

  container.innerHTML = `
    <div class="tracking-card-header">
      <div class="tracking-id-group">
        <span class="tracking-kicker">CONSIGNMENT IDENTIFIER</span>
        <h3 class="tracking-order-id">${order.orderId}</h3>
        <span class="tracking-recipient">Recipient: ${order.maskedName} (${order.city || 'India'})</span>
      </div>
      <div class="tracking-status-badge status-${order.displayStatus.toLowerCase().replace(/[^a-z]/g, '')}">
        <span class="status-pulse-dot"></span>
        <span>${order.displayStatus}</span>
      </div>
    </div>

    <!-- Stepper Progression Bar -->
    <div class="tracking-stepper">
      <div class="stepper-step ${step >= 1 ? 'completed' : ''} ${step === 1 ? 'current' : ''}">
        <div class="step-circle">${step > 1 ? '✓' : '1'}</div>
        <span class="step-label">Order Confirmed</span>
      </div>
      <div class="stepper-line ${step >= 2 ? 'filled' : ''}"></div>
      <div class="stepper-step ${step >= 2 ? 'completed' : ''} ${step === 2 ? 'current' : ''}">
        <div class="step-circle">${step > 2 ? '✓' : '2'}</div>
        <span class="step-label">Handcrafted & Bottled</span>
      </div>
      <div class="stepper-line ${step >= 3 ? 'filled' : ''}"></div>
      <div class="stepper-step ${step >= 3 ? 'completed' : ''} ${step === 3 ? 'current' : ''}">
        <div class="step-circle">${step > 3 ? '✓' : '3'}</div>
        <span class="step-label">In Transit</span>
      </div>
      <div class="stepper-line ${step >= 4 ? 'filled' : ''}"></div>
      <div class="stepper-step ${step >= 4 ? 'completed current' : ''}">
        <div class="step-circle">${step === 4 ? '✓' : '4'}</div>
        <span class="step-label">Delivered</span>
      </div>
    </div>

    <!-- Consignment Logistics Summary Grid -->
    <div class="tracking-details-grid">
      <div class="tracking-detail-item">
        <span class="td-label">Logistics Partner</span>
        <span class="td-value">${order.courier || 'Express Air'}</span>
      </div>
      <div class="tracking-detail-item">
        <span class="td-label">Consignment AWB</span>
        <span class="td-value font-mono">${order.awb || 'Pending AWB'}</span>
      </div>
      <div class="tracking-detail-item">
        <span class="td-label">Fragrance Selection</span>
        <span class="td-value">${order.items || 'Pure Attar Coffret'}</span>
      </div>
      <div class="tracking-detail-item">
        <span class="td-label">Expected Arrival</span>
        <span class="td-value text-gold">${order.eta || '2–3 Business Days'}</span>
      </div>
    </div>

    <!-- Dual Action Controls -->
    <div class="tracking-card-actions">
      ${courierButton}
      <a href="${waInquiryUrl}" target="_blank" class="btn-order-wa tracking-wa-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
        <span>Direct WhatsApp Concierge Inquiries</span>
      </a>
    </div>
  `;
}

window.inquireMissingOrderWhatsApp = function() {
  const input = document.getElementById("tracking-search-input");
  const query = (input && input.value.trim()) || "Unknown";
  const num = (window.NURAAN_CONFIG && window.NURAAN_CONFIG.whatsappNumber) || '918591059608';
  window.open(`https://wa.me/${num}?text=${encodeURIComponent(`Hello Nuraan Perfumes, I would like to check the tracking status for my order #${query}.`)}`, '_blank');
};

function initTrackingDeepLink() {
  const hash = window.location.hash || '';
  const search = window.location.search || '';

  let orderId = '';
  if (hash.startsWith('#track')) {
    const hashParams = new URLSearchParams(hash.replace('#track', '').replace(/^\?/, ''));
    orderId = hashParams.get('id') || hashParams.get('order') || '';
    window.openTrackingModal(orderId);
  } else if (search) {
    const urlParams = new URLSearchParams(search);
    orderId = urlParams.get('order') || urlParams.get('track') || urlParams.get('id') || '';
    if (orderId) {
      window.openTrackingModal(orderId);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initTrackingDeepLink();
});
