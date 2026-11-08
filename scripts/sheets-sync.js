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
    const colDna = findCol(["dnainspiration", "inspiration", "dna"]);

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
        if (colDna !== -1 && row[colDna]) {
          product.fragranticaDna = row[colDna];
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
      if (!row || row.length < 4) continue;
      const key = (row[1] || '').trim().toLowerCase();
      const val = (row[3] || '').trim();
      if (!key || val === '') continue;

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
        case 'instagram_handle':
          config.instagramHandle = val.replace(/^@/, '').trim();
          if (!config.instagramUrl) {
            config.instagramUrl = `https://www.instagram.com/${config.instagramHandle}/`;
          }
          break;
        case 'instagram_url': {
          config.instagramUrl = val.trim();
          const match = val.match(/instagram\.com\/([a-zA-Z0-9_\.]+)/i);
          if (match && match[1]) {
            config.instagramHandle = match[1];
          }
          break;
        }
        case 'curated_box_3ml_price': {
          const num = parseInt(val.replace(/[^0-9]/g, ''), 10);
          if (num && !isNaN(num)) {
            config.defaultCuratedBoxPrice = num;
            combos.forEach(c => { c.price3ml = num; c.price = num; });
          }
          break;
        }
        case 'curated_box_3ml_mrp': {
          const num = parseInt(val.replace(/[^0-9]/g, ''), 10);
          if (num && !isNaN(num)) {
            config.defaultCuratedBoxMRP = num;
            combos.forEach(c => { c.mrp3ml = num; c.mrp = num; });
          }
          break;
        }
        case 'curated_box_12ml_price': {
          const num = parseInt(val.replace(/[^0-9]/g, ''), 10);
          if (num && !isNaN(num)) {
            config.defaultCuratedBox12mlPrice = num;
            combos.forEach(c => { c.price12ml = num; });
          }
          break;
        }
        case 'curated_box_12ml_mrp': {
          const num = parseInt(val.replace(/[^0-9]/g, ''), 10);
          if (num && !isNaN(num)) {
            config.defaultCuratedBox12mlMRP = num;
            combos.forEach(c => { c.mrp12ml = num; });
          }
          break;
        }
        case 'custom_box_3ml_price': {
          const num = parseInt(val.replace(/[^0-9]/g, ''), 10);
          if (num && !isNaN(num)) config.customBox3mlPrice = num;
          break;
        }
        case 'custom_box_12ml_price': {
          const num = parseInt(val.replace(/[^0-9]/g, ''), 10);
          if (num && !isNaN(num)) config.customBox12mlPrice = num;
          break;
        }
        case 'combo_french_photo': {
          const c = combos.find(x => x.id === 'combo-french');
          if (c && val) c.image = NuraanSheetsSync.convertGoogleDriveUrl(val);
          break;
        }
        case 'combo_arabic_photo': {
          const c = combos.find(x => x.id === 'combo-arabic');
          if (c && val) c.image = NuraanSheetsSync.convertGoogleDriveUrl(val);
          break;
        }
        case 'combo_women_photo': {
          const c = combos.find(x => x.id === 'combo-women');
          if (c && val) c.image = NuraanSheetsSync.convertGoogleDriveUrl(val);
          break;
        }
        case 'combo_oud_photo': {
          const c = combos.find(x => x.id === 'combo-oud');
          if (c && val) c.image = NuraanSheetsSync.convertGoogleDriveUrl(val);
          break;
        }
        case 'presentation_box_photo': {
          if (val) config.presentationBoxPhoto = NuraanSheetsSync.convertGoogleDriveUrl(val);
          break;
        }
        case 'hero_image_override':
        case 'hero_banner':
        case 'hero_banner_url':
        case 'hero_image': {
          if (val) {
            const converted = NuraanSheetsSync.convertGoogleDriveUrl(val);
            config.heroBannerUrl = converted;
            config.heroImageOverride = converted;
            if (window.updateHeroBanner) {
              window.updateHeroBanner(converted);
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
      }

      // Check if key is a product photo destination (e.g., photo_garnet_540, photo_regent)
      if (key.startsWith('photo_')) {
        const rawId = key.replace('photo_', '').trim();
        const normId = rawId.replace(/_/g, '-');
        const catalog = window.NURAAN_CATALOG || [];
        const prod = catalog.find(p => p.id === normId || p.id.replace(/-/g, '_') === rawId);
        if (prod && val) {
          prod.image = NuraanSheetsSync.convertGoogleDriveUrl(val);
          console.log(`[Nuraan Sheets Sync] ✓ Mapped Google Drive photo for ${prod.name}: ${prod.image}`);
        }
      }
    }
    console.log(`[Nuraan Sheets Sync] ✓ Synced live settings from Website Control Panel.`);
  },

  /**
   * Convert any Google Drive sharing or viewer link into a direct high-speed image CDN URL
   * Supports:
   * - https://drive.google.com/file/d/{FILE_ID}/view?usp=sharing
   * - https://drive.google.com/open?id={FILE_ID}
   * - https://drive.google.com/uc?id={FILE_ID}
   * - Direct image URLs (jpg, png, webp) pass through untouched
   */
  convertGoogleDriveUrl: function(url) {
    if (!url || typeof url !== 'string') return url;
    const trimmed = url.trim();
    if (!trimmed) return trimmed;

    if (trimmed.includes('drive.google.com') || trimmed.includes('docs.google.com')) {
      // Pattern 1: /file/d/{FILE_ID}/
      const fileIdMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
      }
      // Pattern 2: id={FILE_ID}
      const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (idParamMatch && idParamMatch[1]) {
        return `https://lh3.googleusercontent.com/d/${idParamMatch[1]}`;
      }
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
      if (firstCol === 'combo') {
        const comboObj = combos.find(c => secondCol.includes(c.collection.toLowerCase()) || c.name.toLowerCase().includes(secondCol));
        if (comboObj) {
          // Column J is 3ml Selling Price (index 9)
          const priceRaw = row[9] || row[10];
          if (priceRaw) {
            const priceVal = parseInt(String(priceRaw).replace(/[^0-9]/g, ''), 10);
            if (priceVal && !isNaN(priceVal)) {
              comboObj.price = priceVal;
              comboObj.price3ml = priceVal;
            }
          }
          // Column U is 12ml Selling Price (index 20)
          const price12Raw = row[20];
          if (price12Raw) {
            const price12Val = parseInt(String(price12Raw).replace(/[^0-9]/g, ''), 10);
            if (price12Val && !isNaN(price12Val)) {
              comboObj.price12ml = price12Val;
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
          // Check if row is in 3ml or 12ml table
          // In 3ml table (rows 35-56), Column J (index 9) is 3ml Selling Price
          // In 12ml table (rows 59-81), Column J (index 9) is 12ml Selling Price
          const priceRaw = row[9];
          if (priceRaw) {
            const priceVal = parseInt(String(priceRaw).replace(/[^0-9]/g, ''), 10);
            if (priceVal && !isNaN(priceVal)) {
              if (r < 57) {
                product.price3mlOption = priceVal;
              } else {
                product.price12ml = priceVal;
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
      const heroUrl = window.NURAAN_CONFIG.heroBannerUrl || window.NURAAN_CONFIG.heroImageOverride;
      if (heroUrl) {
        window.updateHeroBanner(heroUrl);
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
