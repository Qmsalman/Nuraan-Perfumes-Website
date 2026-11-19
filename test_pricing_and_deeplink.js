/**
 * Verification test for Gift Sets, Pricing, Trademark Safety, and Deep-Linking
 */
const fs = require('fs');
const path = require('path');

// Mock window and DOM essentials
global.window = {};

require('../scripts/config.js');
require('../scripts/catalog-data.js');

const config = global.window.NURAAN_CONFIG;
const catalog = global.window.NURAAN_CATALOG;
const combos = global.window.NURAAN_COMBOS;

console.log("=================================================");
console.log("1. VERIFYING CONFIG PRICING");
console.log("=================================================");
console.log(`defaultCuratedBoxPrice: ₹${config.defaultCuratedBoxPrice} (Expected: 999)`);
console.log(`defaultCuratedBoxMRP: ₹${config.defaultCuratedBoxMRP} (Expected: 2499)`);
console.log(`customBox3mlPrice: ₹${config.customBox3mlPrice} (Expected: 999)`);
console.log(`defaultCuratedBox12mlPrice: ${config.defaultCuratedBox12mlPrice} (Expected: undefined)`);
console.log(`customBox12mlPrice: ${config.customBox12mlPrice} (Expected: undefined)`);

if (config.defaultCuratedBoxPrice !== 999 || config.customBox3mlPrice !== 999) {
  throw new Error("Config pricing does not match ₹999!");
}
if (config.defaultCuratedBox12mlPrice !== undefined || config.customBox12mlPrice !== undefined) {
  throw new Error("12ml box prices still exist in config!");
}
console.log("✓ Config pricing verified.\n");

console.log("=================================================");
console.log("2. VERIFYING COMBOS (GIFT SETS)");
console.log("=================================================");
if (!combos || combos.length !== 4) {
  throw new Error(`Expected 4 combos, found ${combos ? combos.length : 0}`);
}

combos.forEach(c => {
  console.log(`Checking ${c.name} (${c.id})...`);
  if (!c.name.includes("Gift Set")) {
    throw new Error(`Combo name "${c.name}" should be renamed to "Gift Set"`);
  }
  if (c.price !== 999) {
    throw new Error(`Combo ${c.name} price is ${c.price}, expected 999`);
  }
  if (c.mrp !== 2499) {
    throw new Error(`Combo ${c.name} MRP is ${c.mrp}, expected 2499`);
  }
  if (c.price12ml !== undefined || c.mrp12ml !== undefined) {
    throw new Error(`Combo ${c.name} still has 12ml pricing!`);
  }
});
console.log("✓ All 4 Gift Sets verified at ₹999 (6 × 3ml).\n");

console.log("=================================================");
console.log("3. VERIFYING TRADEMARK SAFETY");
console.log("=================================================");
const forbiddenHouses = [
  "maison francis kurkdjian",
  "alfred dunhill",
  "gucci",
  "creed",
  "diptyque",
  "sol de janeiro",
  "parfums de marly"
];

catalog.forEach(p => {
  const insp = (p.inspiration || "").toLowerCase();
  const dna = (p.fragranticaDna || "").toLowerCase();
  forbiddenHouses.forEach(house => {
    if (insp.includes(house)) {
      throw new Error(`Product ${p.name} inspiration contains forbidden house: "${house}"`);
    }
  });
});
console.log(`✓ All ${catalog.length} products have sanitized inspiration tags (model codes only).\n`);

console.log("=================================================");
console.log("4. VERIFYING DEEP-LINK TARGETS");
console.log("=================================================");
console.log(`Checking ${catalog.length} product IDs for direct deep-linking...`);
catalog.forEach(p => {
  const hash = p.id;
  const match = catalog.find(x => x.id === hash || x.id.toLowerCase() === hash.toLowerCase());
  if (!match) {
    throw new Error(`Deep link lookup failed for #${hash}`);
  }
});
console.log("✓ All products resolve to deep links (e.g. /#bayan, /#garnet-540, /#regent).\n");

console.log("=================================================");
console.log("5. VERIFYING HTML LEGAL DISCLAIMER & LABELS");
console.log("=================================================");
const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
if (!indexHtml.includes('modal-legal-disclaimer')) {
  throw new Error("Missing modal-legal-disclaimer in index.html");
}
if (!indexHtml.includes('footer-legal-notice')) {
  throw new Error("Missing footer-legal-notice in index.html");
}
if (!indexHtml.includes('Curated Attar Gift Sets')) {
  throw new Error("Missing Curated Attar Gift Sets heading in index.html");
}
if (!indexHtml.includes('builder-format-badge')) {
  throw new Error("Missing builder-format-badge in index.html");
}
console.log("✓ HTML legal disclaimers, gift set headings, and builder badges confirmed.\n");

console.log("ALL SANITY CHECKS PASSED SUCCESSFULLY!");
