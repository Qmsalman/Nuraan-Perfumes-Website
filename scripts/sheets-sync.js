/**
 * ==============================================================================
 * NURAAN PERFUMES — GOOGLE SHEETS LIVE SYNC ENGINE
 * Synchronizes Olfactory Notes & Pricing directly from Google Sheets
 * ==============================================================================
 * Master Google Sheet ID: 1tYv3NN8dPWUWO0zTDuxyvogjDai9C2kVcr_44MfHssY
 * - Notes Tab GID: 356671977
 * - Pricing Structure Tab GID: 1429582422
 * 
 * HOW IT WORKS:
 * 1. Automatically fetches published/shared sheet CSV data on page load.
 * 2. Matches fragrance names (e.g., "Garnet 540", "Surkh Oud") case-insensitively.
 * 3. Updates 12ml & 3ml prices, Top/Heart/Base notes, and Box Set prices.
 * 4. Silently falls back to local catalog-data.js if offline or sheet is restricted.
 * ==============================================================================
 */

const NuraanSheetsSync = {
  /**
   * Initialize live sync
   */
  init: function() {
    const config = window.NURAAN_CONFIG || {};
    const sheetCfg = config.googleSheet || {};

    if (!sheetCfg.enabled || !sheetCfg.sheetId) {
      return;
    }

    if (sheetCfg.syncOnLoad) {
      NuraanSheetsSync.fetchAndApplyAll();
    }
  },

  /**
   * Build the CSV export endpoint for a specific GID
   */
  getCsvUrl: function(gid) {
    const config = window.NURAAN_CONFIG || {};
    const sheetCfg = config.googleSheet || {};
    const sheetId = sheetCfg.sheetId || "1tYv3NN8dPWUWO0zTDuxyvogjDai9C2kVcr_44MfHssY";
    const targetGid = gid || sheetCfg.gid || "1429582422";
    return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${targetGid}`;
  },

  /**
   * Fetch all configured tabs (Notes and Pricing Structure)
   */
  fetchAndApplyAll: async function() {
    const config = window.NURAAN_CONFIG || {};
    const sheetCfg = config.googleSheet || {};

    // 1. Fetch Website Control Panel if configured
    if (sheetCfg.controlPanelGid) {
      await NuraanSheetsSync.fetchTab(sheetCfg.controlPanelGid, 'controlPanel');
    }

    // 2. Fetch Notes Tab if configured
    if (sheetCfg.notesGid) {
      await NuraanSheetsSync.fetchTab(sheetCfg.notesGid, 'notes');
    }

    // 3. Fetch Pricing Structure Tab if configured
    if (sheetCfg.pricingGid) {
      await NuraanSheetsSync.fetchTab(sheetCfg.pricingGid, 'pricing');
    } else if (sheetCfg.gid) {
      await NuraanSheetsSync.fetchTab(sheetCfg.gid, 'pricing');
    }

    // 4. Fetch Orders & Shipment Tracking Tab (GID: 1607572912)
    await NuraanSheetsSync.fetchOrdersAndTracking();

    // Re-render UI components once data is merged
    NuraanSheetsSync.triggerUIRefresh();
  },

  /**
   * Fetch a single tab's CSV
   */
  fetchTab: async function(gid, type) {
    const url = NuraanSheetsSync.getCsvUrl(gid);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`[Nuraan Sheets Sync] Tab ${type} (${gid}) returned HTTP ${response.status}`);
        return false;
      }

      const text = await response.text();

      // Check if restricted sheet HTML login redirect
      if (text.includes("<!DOCTYPE html>") || text.includes("accounts.google.com")) {
        console.info(
          `[Nuraan Sheets Sync] Sheet tab ${type} is private/restricted. Using local catalog-data.js baseline.`
        );
        return false;
      }

      const rows = NuraanSheetsSync.parseCSV(text);
      if (!rows || rows.length < 2) return false;

      if (type === 'notes') {
        NuraanSheetsSync.applyNotesData(rows);
      } else if (type === 'controlPanel') {
        NuraanSheetsSync.applyControlPanelData(rows);
      } else {
        NuraanSheetsSync.applyPricingData(rows);
      }

      return true;
    } catch (err) {
      console.warn(`[Nuraan Sheets Sync] Offline or fetch failed for tab ${type}:`, err);
      return false;
    }
  },

  /**
   * Lightweight robust CSV parser
   */
  parseCSV: function(csvText) {
    const lines = [];
    let row = [];
    let inQuotes = false;
    let currentField = '';

    for (let i = 0; i < csvText.length; i++) {
      const char = csvText[i];
      const nextChar = csvText[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentField += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(currentField.trim());
        currentField = '';
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') i++;
        row.push(currentField.trim());
        if (row.length > 0 && row.some(cell => cell.length > 0)) {
          lines.push(row);
        }
        row = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }

    if (currentField.length > 0 || row.length > 0) {
      row.push(currentField.trim());
      lines.push(row);
    }

    return lines;
  },

  /**
   * Apply Olfactory Notes from the Notes tab
   */
  applyNotesData: function(rows) {
    if (!rows || rows.length < 2) return;
    const headers = rows[0].map(h => h.toLowerCase().trim().replace(/[^a-z0-9]/g, ''));
    const catalog = window.NURAAN_CATALOG || [];

    const findCol = (variants) => headers.findIndex(h => variants.some(v => h.includes(v)));

    const colName = findCol(["nuraansname", "name", "attar"]);
    const colTop = findCol(["topnotes", "top"]);
    const colHeart = findCol(["heartnotes", "heart", "middle"]);
    const colBase = findCol(["basenotes", "base"]);
    const colAccords = findCol(["mainaccords", "accords"]);
    const colInspiration = headers.findIndex(h => h === "inspiration" || (h.includes("inspiration") && !h.includes("dna")));
    const colDna = headers.findIndex(h => (h.includes("dnainspiration") || h === "dna" || h.startsWith("dna")) && !h.includes("fragrantica"));
    const colFragrantica = headers.findIndex(h => h.includes("fragranticareference") || h.includes("fragrantica"));
    const colImage2 = findCol(["image2", "photo2", "secondphoto", "boxphoto", "photo_2", "image_2"]);
    const colDesc = findCol(["description", "desc", "story"]);

    let count = 0;
    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      if (colName === -1 || !row[colName]) continue;

      const rowName = row[colName].toLowerCase().trim();
      const product = catalog.find(p => {
        const pName = p.name.toLowerCase().trim();
        return pName === rowName || pName.includes(rowName) || rowName.includes(pName);
      });

      if (product) {
        if (!product.notes) product.notes = {};
        if (colTop !== -1 && row[colTop]) {
          product.notes.top = row[colTop].split(/[,/•;]+/).map(n => n.trim()).filter(Boolean);
        }
        if (colHeart !== -1 && row[colHeart]) {
          product.notes.heart = row[colHeart].split(/[,/•;]+/).map(n => n.trim()).filter(Boolean);
        }
        if (colBase !== -1 && row[colBase]) {
          product.notes.base = row[colBase].split(/[,/•;]+/).map(n => n.trim()).filter(Boolean);
        }
        if (colAccords !== -1 && row[colAccords]) {
          product.accords = row[colAccords].split(/[,/•;]+/).map(a => a.trim()).filter(Boolean);
        }
        if (colInspiration !== -1 && row[colInspiration]) {
          const rawInsp = row[colInspiration].trim();
          // Auto-fix known typo in sheet: "BR 450" -> "BR 540"
          let cleanInsp = (rawInsp.toUpperCase() === 'BR 450' || rawInsp.toUpperCase() === 'BR450') ? 'BR 540' : rawInsp;
          // Strip parent corporate houses
          cleanInsp = cleanInsp
            .replace(/^Maison Francis Kurkdjian\s*[-–—]?\s*/i, '')
            .replace(/^Alfred Dunhill\s*[-–—]?\s*/i, '')
            .replace(/^Dunhill\s+/i, '')
            .replace(/^Creed\s*[-–—]?\s*/i, '')
            .replace(/\s+Creed$/i, '')
            .replace(/^Gucci\s+/i, '')
            .replace(/^Yves Saint Laurent\s*[-–—]?\s*/i, '')
            .replace(/^YSL\s*[-–—]?\s*/i, '')
            .replace(/^Afnan\s*[-–—]?\s*/i, '')
            .replace(/^Sol de Janeiro\s*[-–—]?\s*/i, '')
            .replace(/^Diptyque\s*[-–—]?\s*/i, '')
            .replace(/^Dior\s*[-–—]?\s*/i, '')
            .replace(/^Mancera\s*[-–—]?\s*/i, '')
            .replace(/Baccarat Rouge 540/i, 'BR 540')
            .trim();
          product.inspiration = cleanInsp || product.inspiration;
        }
        if (colDna !== -1 && row[colDna]) {
          const rawDna = row[colDna].trim();
          // Guarantee URLs NEVER leak into fragranticaDna
          if (!rawDna.startsWith('http://') && !rawDna.startsWith('https://') && !rawDna.includes('fragrantica.com')) {
            const cleanDna = rawDna.includes(' - ') ? rawDna.split(' - ').slice(1).join(' - ').trim() : rawDna;
            product.fragranticaDna = cleanDna;
          }
        }
        if (colFragrantica !== -1 && row[colFragrantica]) {
          product.fragranticaUrl = row[colFragrantica].trim();
        }
        if (colImage2 !== -1 && row[colImage2]) {
          const img2 = NuraanSheetsSync.convertGoogleDriveUrl(row[colImage2].trim());
          if (img2 && img2 !== product.image) {
            product.image2 = img2;
          }
        }
        if (colDesc !== -1 && row[colDesc]) {
          let rawDesc = row[colDesc].trim();
          // Sanitize roll-on wording consistency
          rawDesc = rawDesc
            .replace(/stainless-steel\s+roll-on/gi, 'precision roll-on')
            .replace(/stainless\s+steel/gi, 'precision')
            .replace(/glass\s+roll-on/gi, 'precision roll-on');
          product.description = rawDesc;
        }
        count++;
      }
    }
    console.log(`[Nuraan Sheets Sync] ✓ Synced Fragrantica notes for ${count} fragrances.`);
  },

  /**
   * Apply Global Site Variables from the Website Control Panel tab
   */
  applyControlPanelData: function(rows) {
    if (!rows || rows.length < 2) return;
    const config = window.NURAAN_CONFIG || {};
    const combos = window.NURAAN_COMBOS || [];

    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      if (!row || row.length < 2) continue;
      const key = (row[1] || '').trim().toLowerCase();
      if (!key) continue;

      // Check both Column D (index 3) and Column E (index 4)
      const valD = (row[3] || '').trim();
      const valE = (row[4] || '').trim();

      // Check if Column E contains placeholder/instruction text
      const isInstructionText = (text) => {
        const lower = text.toLowerCase();
        return lower.startsWith('paste ') || 
               lower.startsWith('image url for') || 
               lower.startsWith('price for') || 
               lower.startsWith('true to') || 
               lower.startsWith('true for') ||
               lower.includes('auto-convert');
      };

      // Determine effective value:
      // If Column E contains a custom URL (http, https, drive) or user override, prioritize Column E!
      let val = '';
      if (valE && (valE.startsWith('http://') || valE.startsWith('https://') || valE.startsWith('//') || (!isInstructionText(valE) && valD === ''))) {
        val = valE;
      } else if (valD && !valD.startsWith('assets/images/') && valD !== '') {
        val = valD;
      } else if (valE && !isInstructionText(valE)) {
        val = valE;
      } else {
        val = valD || valE;
      }

      if (val === '') continue;

      switch (key) {
        case 'brand_name':
          config.brandName = val;
          break;
        case 'brand_tagline':
          config.tagline = val;
          break;
        case 'brand_subtagline':
          config.subTagline = val;
          break;
        case 'announcement_bar':
          config.announcement = val;
          break;
        case 'shipping_notice':
          config.shippingNotice = val;
          break;
        case 'response_time':
          config.responseTime = val;
          break;
        case 'whatsapp_number':
          config.whatsappNumber = val.replace(/[^0-9]/g, '');
          break;
        case 'whatsapp_display':
          config.whatsappDisplayNumber = val;
          break;
        case 'instagram_handle': {
          const cleanHandle = val ? val.replace(/^@/, '').trim() : '';
          if (cleanHandle) {
            config.instagramHandle = cleanHandle;
            config.instagramUrl = `https://www.instagram.com/${cleanHandle}/`;
          }
          break;
        }
        case 'instagram_url': {
          if (val) {
            const clean = val.split('?')[0].trim();
            const normalized = clean.endsWith('/') ? clean : `${clean}/`;
            if (normalized.includes('instagram.com/')) {
              config.instagramUrl = normalized;
              const match = normalized.match(/instagram\.com\/([a-zA-Z0-9_\.]+)/i);
              if (match && match[1]) {
                config.instagramHandle = match[1];
              }
            }
          }
          break;
        }
        case 'curated_box_3ml_price':
        case 'curated_gift_set_price': {
          const num = parseInt(val.replace(/[^0-9]/g, ''), 10);
          // Standardize gift sets to 999 (ignore legacy 1299 from old control panel)
          const targetPrice = (num === 1299 || !num || isNaN(num)) ? 999 : num;
          config.defaultCuratedBoxPrice = targetPrice;
          combos.forEach(c => { c.price3ml = targetPrice; c.price = targetPrice; });
          break;
        }
        case 'curated_box_3ml_mrp':
        case 'curated_gift_set_mrp': {
          const num = parseInt(val.replace(/[^0-9]/g, ''), 10);
          const targetMRP = (num === 3299 || !num || isNaN(num)) ? 2499 : num;
          config.defaultCuratedBoxMRP = targetMRP;
          combos.forEach(c => { c.mrp3ml = targetMRP; c.mrp = targetMRP; });
          break;
        }
        case 'custom_box_3ml_price':
        case 'custom_gift_set_price': {
          const num = parseInt(val.replace(/[^0-9]/g, ''), 10);
          const targetCustom = (num === 1399 || !num || isNaN(num)) ? 999 : num;
          config.regularCustomBox3mlPrice = targetCustom;
          if (!config.introductoryOfferEnabled) {
            config.customBox3mlPrice = targetCustom;
          }
          break;
        }
        case 'combo_french_photo': {
          const c = combos.find(x => x.id === 'combo-french');
          if (c && val) {
            const urls = NuraanSheetsSync.parseMultiMediaUrls(val);
            if (urls.length > 0) {
              c.image = urls[0];
              c.images = urls;
              if (urls.length > 1) c.image2 = urls[1];
              else delete c.image2;
            }
          }
          break;
        }
        case 'combo_arabic_photo': {
          const c = combos.find(x => x.id === 'combo-arabic');
          if (c && val) {
            const urls = NuraanSheetsSync.parseMultiMediaUrls(val);
            if (urls.length > 0) {
              c.image = urls[0];
              c.images = urls;
              if (urls.length > 1) c.image2 = urls[1];
              else delete c.image2;
            }
          }
          break;
        }
        case 'combo_women_photo': {
          const c = combos.find(x => x.id === 'combo-women');
          if (c && val) {
            const urls = NuraanSheetsSync.parseMultiMediaUrls(val);
            if (urls.length > 0) {
              c.image = urls[0];
              c.images = urls;
              if (urls.length > 1) c.image2 = urls[1];
              else delete c.image2;
            }
          }
          break;
        }
        case 'combo_oud_photo': {
          const c = combos.find(x => x.id === 'combo-oud');
          if (c && val) {
            const urls = NuraanSheetsSync.parseMultiMediaUrls(val);
            if (urls.length > 0) {
              c.image = urls[0];
              c.images = urls;
              if (urls.length > 1) c.image2 = urls[1];
              else delete c.image2;
            }
          }
          break;
        }
        case 'presentation_box_photo': {
          if (val) {
            const urls = NuraanSheetsSync.parseMultiMediaUrls(val);
            if (urls.length > 0) config.presentationBoxPhoto = urls[0];
          }
          break;
        }
        case 'hero_image_override':
        case 'hero_banner':
        case 'hero_banner_url':
        case 'hero_image': {
          if (val) {
            const urls = NuraanSheetsSync.parseMultiMediaUrls(val, '=w1400-h1400-rw');
            if (urls.length > 0) {
              config.heroBannerUrls = urls;
              config.heroBannerUrl = urls[0];
              config.heroImageOverride = urls[0];
              if (window.updateHeroBanner) {
                window.updateHeroBanner(urls);
              }
            }
          }
          break;
        }
        case 'enable_3d_hero': {
          window.NURAAN_ENABLE_3D_HERO = val.toUpperCase() === 'TRUE';
          break;
        }
        case 'enable_3d_box_unboxing': {
          window.NURAAN_ENABLE_3D_UNBOXING = val.toUpperCase() === 'TRUE';
          break;
        }
        case 'reviews_enabled':
        case 'reviews_section_enabled':
        case 'enable_reviews': {
          const isEnabled = val.toLowerCase() === 'true' || val.toLowerCase() === 'yes' || val.toLowerCase() === 'enable' || val.toLowerCase() === '1';
          config.reviewsSectionEnabled = isEnabled;
          const revSec = document.getElementById('reviews-section');
          const bentoLink = document.getElementById('bentoReviewLink');
          if (revSec) {
            revSec.style.display = isEnabled ? 'block' : 'none';
          }
          if (bentoLink) {
            if (isEnabled) {
              bentoLink.classList.remove('is-disabled-link');
              bentoLink.innerHTML = '<span>✦ Read Verified Customer Stories ➔</span>';
            } else {
              bentoLink.classList.add('is-disabled-link');
              bentoLink.innerHTML = '<span>✦ Reviews Coming Soon</span>';
            }
          }
          console.log(`[Nuraan Sheets Sync] ✓ Reviews section enabled: ${isEnabled}`);
          break;
        }
        case 'offer_zone_enabled':
        case 'enable_offer_zone':
        case 'introductory_offer_enabled':
        case 'inaugural_offer_enabled':
        case 'introductory_offer':
        case 'enable_introductory_offer': {
          const isEnabled = val.toLowerCase() === 'true' || val.toLowerCase() === 'yes' || val.toLowerCase() === 'enable' || val.toLowerCase() === '1';
          config.introductoryOfferEnabled = isEnabled;
          console.log(`[Nuraan Sheets Sync] ✓ Offer Zone enabled: ${isEnabled}`);
          break;
        }
        case 'offer_name':
        case 'offer_campaign_name': {
          if (val) {
            config.introductoryBadgeText = val;
            console.log(`[Nuraan Sheets Sync] ✓ Offer Name set: ${val}`);
          }
          break;
        }
        case 'offer_price_12ml_classic': {
          const num = parseInt(val.replace(/[^0-9]/g, ''), 10);
          if (num && !isNaN(num)) {
            config.offerPrice12mlClassic = num;
            console.log(`[Nuraan Sheets Sync] ✓ Offer Price Classic 12ml: ${num}`);
          }
          break;
        }
        case 'offer_price_12ml_reserve': {
          const num = parseInt(val.replace(/[^0-9]/g, ''), 10);
          if (num && !isNaN(num)) {
            config.offerPrice12mlReserve = num;
            console.log(`[Nuraan Sheets Sync] ✓ Offer Price Reserve Oud 12ml: ${num}`);
          }
          break;
        }
        case 'offer_price_curated_combos': {
          const num = parseInt(val.replace(/[^0-9]/g, ''), 10);
          if (num && !isNaN(num)) {
            config.offerPriceCombos = num;
            console.log(`[Nuraan Sheets Sync] ✓ Offer Price Combos: ${num}`);
          }
          break;
        }
        case 'offer_price_custom_box': {
          const num = parseInt(val.replace(/[^0-9]/g, ''), 10);
          if (num && !isNaN(num)) {
            config.offerPriceCustomBox = num;
            if (config.introductoryOfferEnabled) {
              config.customBox3mlPrice = num;
            }
            console.log(`[Nuraan Sheets Sync] ✓ Offer Price Custom Box: ${num}`);
          }
          break;
        }
        case 'offer_banner_enabled':
        case 'enable_offer_banner': {
          const isEnabled = val.toLowerCase() === 'true' || val.toLowerCase() === 'yes' || val.toLowerCase() === 'enable' || val.toLowerCase() === '1';
          config.offerBannerEnabled = isEnabled;
          const bannerEl = document.getElementById('offer-banner-container');
          if (bannerEl) bannerEl.style.display = isEnabled ? 'block' : 'none';
          console.log(`[Nuraan Sheets Sync] ✓ Offer Banner enabled: ${isEnabled}`);
          break;
        }
        case 'offer_banner_image':
        case 'offer_banner_photo':
        case 'offer_banner_url': {
          if (val) {
            const converted = NuraanSheetsSync.convertGoogleDriveUrl(val);
            config.offerBannerImage = converted;
            const imgEl = document.getElementById('offer-banner-img');
            if (imgEl) imgEl.src = converted;
          }
          break;
        }
        case 'offer_banner_link': {
          if (val) {
            config.offerBannerLink = val;
            const linkEl = document.getElementById('offer-banner-link');
            if (linkEl) linkEl.href = val;
          }
          break;
        }
      }

      // Check if key is a product photo destination (e.g., photo_garnet_540, photo_regent)
      if (key.startsWith('photo_')) {
        let isImage2 = false;
        let rawId = key.replace('photo_', '').trim();
        if (rawId.endsWith('_2') || rawId.endsWith('-2')) {
          isImage2 = true;
          rawId = rawId.replace(/[-_]2$/, '').trim();
        }
        const normId = rawId.replace(/_/g, '-');
        const catalog = window.NURAAN_CATALOG || [];
        const prod = catalog.find(p => p.id === normId || p.id.replace(/-/g, '_') === rawId);
        if (prod && val) {
          const urls = NuraanSheetsSync.parseMultiMediaUrls(val);
          if (isImage2) {
            if (urls.length > 0 && urls[0] !== prod.image) {
              prod.image2 = urls[0];
              if (!prod.images) prod.images = [prod.image];
              if (!prod.images.includes(urls[0])) prod.images.push(urls[0]);
              console.log(`[Nuraan Sheets Sync] ✓ Mapped Image 2 for ${prod.name}: ${prod.image2}`);
            }
          } else {
            if (urls.length > 1) {
              prod.image = urls[0];
              prod.image2 = urls[1];
              prod.images = urls;
              console.log(`[Nuraan Sheets Sync] ✓ Mapped multiple photos for ${prod.name}: [${urls.length} images]`);
            } else if (urls.length === 1) {
              prod.image = urls[0];
              prod.images = [urls[0]];
              // If image2 matches image, delete duplicate
              if (prod.image2 === prod.image) {
                delete prod.image2;
              }
              console.log(`[Nuraan Sheets Sync] ✓ Mapped single photo for ${prod.name}: ${prod.image}`);
            }
          }
        }
      }
    }

    // Guarantee that active custom box price strictly mirrors master offer switch state
    if (config.introductoryOfferEnabled && config.offerPriceCustomBox) {
      config.customBox3mlPrice = config.offerPriceCustomBox;
    } else {
      config.customBox3mlPrice = config.regularCustomBox3mlPrice || 999;
    }

    console.log(`[Nuraan Sheets Sync] ✓ Synced live settings from Website Control Panel. Effective Custom Box Price: ₹${config.customBox3mlPrice} (Offer Mode: ${Boolean(config.introductoryOfferEnabled)})`);
    // Real-time DOM Refresh after syncing Offer Zone & Control Panel values
    if (typeof window.renderCatalog === 'function' && window.NURAAN_CATALOG) {
      window.renderCatalog(window.NURAAN_CATALOG);
    }
    if (typeof window.renderCombos === 'function' && window.NURAAN_COMBOS) {
      window.renderCombos(window.NURAAN_COMBOS);
      if (typeof window.initComboAutoSliders === 'function') {
        window.initComboAutoSliders();
      }
    }
    if (typeof window.initOfferBanner === 'function') {
      window.initOfferBanner();
    }
    if (typeof window.updateCustomBoxTotal === 'function') {
      window.updateCustomBoxTotal();
    }
  },

  /**
   * Split and convert raw string containing one or multiple URLs (comma, newline, or space separated)
   */
  parseMultiMediaUrls: function(rawText, customTransform) {
    if (!rawText || typeof rawText !== 'string') return [];
    const parts = rawText.split(/[\r\n,;]+/);
    const results = [];
    for (let part of parts) {
      let trimmed = part.trim();
      trimmed = trimmed.replace(/^["'\[]+|["'\]]+$/g, '').trim();
      if (!trimmed) continue;
      // Skip instruction placeholder text
      const lower = trimmed.toLowerCase();
      if (lower.startsWith('paste ') || lower.startsWith('image url') || lower.startsWith('http://...') || lower.startsWith('https://...')) {
        continue;
      }
      if (trimmed.includes('drive.google.com') || trimmed.includes('docs.google.com') || trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('//') || trimmed.startsWith('assets/')) {
        const converted = NuraanSheetsSync.convertGoogleDriveUrl(trimmed, customTransform);
        if (converted && !results.includes(converted)) {
          results.push(converted);
        }
      }
    }
    return results;
  },

  /**
   * Convert any Google Drive sharing or viewer link into a direct high-speed image CDN URL
   * Automatically applies Google's edge CDN WebP compression (=w800-h800-rw) to shrink multi-MB uploads
   * Supports:
   * - https://drive.google.com/file/d/{FILE_ID}/view?usp=sharing
   * - https://drive.google.com/open?id={FILE_ID}
   * - https://drive.google.com/uc?id={FILE_ID}
   * - Direct image URLs pass through untouched
   */
  convertGoogleDriveUrl: function(url, customTransform) {
    if (!url || typeof url !== 'string') return url;
    const trimmed = url.trim();
    if (!trimmed) return trimmed;

    // Preserve animated GIF playback by avoiding static WebP transcode (-rw) when a GIF is detected
    const isGif = trimmed.toLowerCase().includes('.gif') || trimmed.toLowerCase().includes('format=gif');
    const defaultTransform = isGif ? '=w800-h800' : '=w800-h800-rw';
    let cdnTransform = customTransform || defaultTransform;
    if (isGif && cdnTransform.includes('-rw')) {
      cdnTransform = cdnTransform.replace(/-rw/g, '');
    }

    if (trimmed.includes('drive.google.com') || trimmed.includes('docs.google.com')) {
      // Pattern 1: /file/d/{FILE_ID}/
      const fileIdMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}${cdnTransform}`;
      }
      // Pattern 2: id={FILE_ID}
      const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (idParamMatch && idParamMatch[1]) {
        return `https://lh3.googleusercontent.com/d/${idParamMatch[1]}${cdnTransform}`;
      }
    }

    // If already a Google CDN usercontent link without size transform:
    if (trimmed.includes('lh3.googleusercontent.com/d/') && !trimmed.includes('=')) {
      return `${trimmed}${cdnTransform}`;
    }

    return trimmed;
  },

  /**
   * Apply Pricing from Pricing Structure or Selling Price Calculator
   */
  applyPricingData: function(rows) {
    if (!rows || rows.length < 2) return;
    const catalog = window.NURAAN_CATALOG || [];
    const combos = window.NURAAN_COMBOS || [];

    // Check Discovery Boxes in rows 1 to 32
    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      if (!row || row.length < 2) continue;
      const firstCol = (row[0] || '').toLowerCase().trim();
      const secondCol = (row[1] || '').toLowerCase().trim();

      // Check combo box row
      if (firstCol === 'combo' || secondCol.includes('discovery box')) {
        const comboObj = combos.find(c => secondCol.includes(c.collection.toLowerCase()) || c.name.toLowerCase().includes(secondCol) || (c.collection && secondCol.includes(c.collection.toLowerCase())));
        if (comboObj) {
          // Column J is 3ml Selling Price (index 9)
          const priceRaw = row[9] || row[10];
          if (priceRaw) {
            const priceVal = parseInt(String(priceRaw).replace(/[^0-9]/g, ''), 10);
            if (priceVal && !isNaN(priceVal)) {
              const finalPrice = (priceVal === 1299) ? 999 : priceVal;
              comboObj.regularPrice = finalPrice;
              comboObj.price = finalPrice;
              comboObj.price3ml = finalPrice;
            }
          }
        }
      }

      // Check Custom Box row in Pricing Structure if present
      if (secondCol.includes('custom') && (secondCol.includes('box') || secondCol.includes('gift') || secondCol.includes('set'))) {
        const priceRaw = row[9] || row[10];
        if (priceRaw) {
          const priceVal = parseInt(String(priceRaw).replace(/[^0-9]/g, ''), 10);
          if (priceVal && !isNaN(priceVal)) {
            const finalPrice = (priceVal === 1399 || priceVal === 1299) ? 999 : priceVal;
            const cfg = window.NURAAN_CONFIG || {};
            cfg.regularCustomBox3mlPrice = finalPrice;
            if (!cfg.introductoryOfferEnabled) {
              cfg.customBox3mlPrice = finalPrice;
            }
          }
        }
      }

      // Check 3ml or 12ml single attar rows
      const productNameCol = row[1] || row[0];
      if (productNameCol) {
        const pNameLower = productNameCol.toLowerCase().trim();
        const product = catalog.find(p => p.name.toLowerCase() === pNameLower || pNameLower.includes(p.name.toLowerCase()));
        if (product) {
          // In Pricing Structure:
          // Rows 30-51: 3ml Selling Price in Column J (index 9)
          // Rows 53-74: 12ml Selling Price in Column J (index 9)
          const priceRaw = row[9];
          if (priceRaw) {
            const priceVal = parseInt(String(priceRaw).replace(/[^0-9]/g, ''), 10);
            if (priceVal && !isNaN(priceVal)) {
              if (r >= 52) {
                product.price12ml = priceVal;
              } else if (r >= 29) {
                product.price3mlOption = priceVal;
              }
            }
          }
        }
      }
    }
    console.log(`[Nuraan Sheets Sync] ✓ Synced pricing from Pricing Structure.`);
  },

  /**
   * Re-render UI components if available on page
   */
  triggerUIRefresh: function() {
    if (typeof renderBrandHeader === 'function') {
      renderBrandHeader();
    }
    if (typeof renderCombos === 'function') {
      renderCombos(window.NURAAN_COMBOS);
    }
    if (typeof renderCatalog === 'function') {
      renderCatalog(window.NURAAN_CATALOG);
    }
    if (typeof updateCustomBoxTotal === 'function') {
      updateCustomBoxTotal();
    }
    if (typeof updateSelectionUI === 'function') {
      updateSelectionUI();
    }
    if (typeof window.updateHeroBanner === 'function' && window.NURAAN_CONFIG) {
      const heroUrls = window.NURAAN_CONFIG.heroBannerUrls || window.NURAAN_CONFIG.heroBannerUrl || window.NURAAN_CONFIG.heroImageOverride;
      if (heroUrls) {
        window.updateHeroBanner(heroUrls);
      }
    }
  },

  // ==============================================================================
  // SHIPMENT & CONSIGNMENT TRACKING ENGINE (LIVE FROM GOOGLE SHEET)
  // Master Sheet Tab: 'Orders & Sales Tracker' (GID: 1607572912)
  // ==============================================================================
  orders: [],

  /**
   * Fetch live orders from 'Orders & Sales Tracker' tab
   */
  fetchOrdersAndTracking: async function() {
    try {
      const url = NuraanSheetsSync.getCsvUrl("1607572912");
      const res = await fetch(url);
      if (!res.ok) return;
      const csvText = await res.text();
      if (!csvText || csvText.includes("<!DOCTYPE html>")) return;

      const rows = NuraanSheetsSync.parseCSV(csvText);
      const parsedOrders = [];

      // Data rows start around row 5
      for (let i = 4; i < rows.length; i++) {
        const row = rows[i];
        if (!row || !row[0]) continue;
        const rawId = String(row[0]).trim();
        if (!rawId || rawId.toLowerCase() === 'order id') continue;

        const customerName = String(row[3] || '').trim();
        const nameParts = customerName.split(' ');
        const maskedName = nameParts.length > 1 
          ? `${nameParts[0]} ${nameParts[nameParts.length - 1].charAt(0)}.` 
          : customerName;

        parsedOrders.push({
          orderId: rawId,
          customerName: customerName,
          maskedName: maskedName,
          date: String(row[2] || '').trim(),
          city: String(row[4] || '').trim(),
          productType: String(row[5] || '').trim(),
          items: String(row[6] || '').trim(),
          paymentStatus: String(row[11] || 'Paid').trim(),
          status: String(row[12] || 'Processing').trim(),
          phone: String(row[13] || '').trim(),
          courier: String(row[14] || 'Express Logistics').trim(),
          awb: String(row[15] || '-').trim(),
          trackingUrl: String(row[16] || '').trim(),
          eta: String(row[17] || 'Estimated 2-3 Business Days').trim()
        });
      }

      if (parsedOrders.length > 0) {
        NuraanSheetsSync.orders = parsedOrders;
        console.log(`[Nuraan Sheets Sync] ✓ Loaded ${parsedOrders.length} live orders from Orders & Sales Tracker.`);
      }
    } catch (e) {
      console.warn("[Nuraan Sheets Sync] Note: Using baseline orders lookup.", e.message);
    }
  },

  /**
   * Lookup an order by Order ID (flexible matching: NP-1003, 1003, np1003)
   */
  lookupOrder: function(query) {
    if (!query) return null;
    const cleanQ = String(query).toUpperCase().replace(/[^A-Z0-9]/g, '');
    const pool = (NuraanSheetsSync.orders && NuraanSheetsSync.orders.length > 0)
      ? NuraanSheetsSync.orders
      : (window.NURAAN_SAMPLE_ORDERS || []);

    const match = pool.find(o => {
      const cleanId = String(o.orderId).toUpperCase().replace(/[^A-Z0-9]/g, '');
      return cleanId === cleanQ || cleanId.endsWith(cleanQ) || cleanQ.endsWith(cleanId);
    });

    if (!match) return null;

    // Determine current progression step (1 to 4)
    const normStatus = (match.status || '').toLowerCase();
    let step = 1;
    let stepName = 'Order Confirmed';

    if (normStatus.includes('deliver')) {
      step = 4;
      stepName = 'Delivered';
    } else if (normStatus.includes('transit') || normStatus.includes('dispatch') || normStatus.includes('shipped') || normStatus.includes('out for delivery')) {
      step = 3;
      stepName = normStatus.includes('out for delivery') ? 'Out for Delivery' : 'In Transit';
    } else if (normStatus.includes('process') || normStatus.includes('prepar') || normStatus.includes('bottle')) {
      step = 2;
      stepName = 'Handcrafting & Bottling';
    }

    return {
      ...match,
      activeStep: step,
      displayStatus: stepName
    };
  }
};

window.NuraanSheetsSync = NuraanSheetsSync;

document.addEventListener("DOMContentLoaded", () => {
  NuraanSheetsSync.init();
});
