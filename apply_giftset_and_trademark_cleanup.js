const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, '..', 'scripts', 'catalog-data.js');
let content = fs.readFileSync(catalogPath, 'utf8');

// 1. Sanitize inspirations to clean model codes (dropping corporate brand houses)
const inspirationCleanups = [
  { from: 'inspiration: "Baccarat Rouge 540"', to: 'inspiration: "BR 540"' },
  { from: 'inspiration: "Dunhill Icon"', to: 'inspiration: "Icon"' },
  { from: 'inspiration: "Aventus Creed"', to: 'inspiration: "Aventus"' },
  { from: 'inspiration: "9PM Afnan"', to: 'inspiration: "9 PM"' },
  { from: 'inspiration: "Gucci Flora"', to: 'inspiration: "Flora"' },
];

inspirationCleanups.forEach(item => {
  content = content.replace(item.from, item.to);
});

// Clean corporate names in fragranticaDna
const dnaCleanups = [
  { from: 'fragranticaDna: "Maison Francis Kurkdjian - Baccarat Rouge 540"', to: 'fragranticaDna: "BR 540 Profile"' },
  { from: 'fragranticaDna: "Alfred Dunhill - Icon"', to: 'fragranticaDna: "Icon Profile"' },
  { from: 'fragranticaDna: "Creed - Aventus"', to: 'fragranticaDna: "Aventus Profile"' },
  { from: 'fragranticaDna: "Diptyque - Tam Dao"', to: 'fragranticaDna: "Tam Dao Profile"' },
  { from: 'fragranticaDna: "Afnan - 9 PM (Ultra Male DNA)"', to: 'fragranticaDna: "9 PM Profile"' },
  { from: 'fragranticaDna: "Sol de Janeiro - Brazilian Crush Cheirosa 62"', to: 'fragranticaDna: "Cheirosa 62 Profile"' },
  { from: 'fragranticaDna: "Gucci - Flora Gorgeous Gardenia"', to: 'fragranticaDna: "Flora Profile"' },
  { from: 'fragranticaDna: "Yves Saint Laurent - Black Opium"', to: 'fragranticaDna: "Black Opium Profile"' },
  { from: 'fragranticaDna: "Dior - Purple Oud (Maison Christian Dior)"', to: 'fragranticaDna: "Purple Oud Profile"' },
  { from: 'fragranticaDna: "Mancera - Red Tobacco"', to: 'fragranticaDna: "Red Tobacco Profile"' },
  { from: 'fragranticaDna: "Ahmed Al Maghribi - Kaaf"', to: 'fragranticaDna: "Kaaf Profile"' },
  { from: 'fragranticaDna: "French Avenue - Liquid Brun (PDM Althaïr DNA)"', to: 'fragranticaDna: "Liquid Brun Profile"' },
  { from: 'fragranticaDna: "Ahmed Al Maghribi - Marj"', to: 'fragranticaDna: "Marj Profile"' },
  { from: 'fragranticaDna: "Ahmed Al Maghribi - Bin Shaikh"', to: 'fragranticaDna: "Bin Shaikh Profile"' },
  { from: 'fragranticaDna: "Rasasi - Al Wisam Day"', to: 'fragranticaDna: "Al Wisam Day Profile"' },
  { from: 'fragranticaDna: "Ibrahim Al-Qurashi - Arabian Tobacco"', to: 'fragranticaDna: "Arabian Tobacco Profile"' },
  { from: 'fragranticaDna: "Arabian Oud - Kalemat"', to: 'fragranticaDna: "Kalemat Profile"' },
  { from: 'fragranticaDna: "Ajmal - Khofooq"', to: 'fragranticaDna: "Khofooq Profile"' },
  { from: 'fragranticaDna: "Ajmal - Aurum (Lady Million DNA)"', to: 'fragranticaDna: "Aurum Profile"' },
  { from: 'fragranticaDna: "Arabian Oud / Surrati - Musk Rijali (Royal White Musk)"', to: 'fragranticaDna: "Musk Rijali Profile"' },
  { from: 'fragranticaDna: "Escada - Island Kiss"', to: 'fragranticaDna: "Island Kiss Profile"' }
];

dnaCleanups.forEach(item => {
  content = content.replace(item.from, item.to);
});

// 2. Update NURAAN_COMBOS to "Gift Set", strictly 6x3ml, and price 999
const updatedCombosSection = `// ==========================================
// PRE-CURATED GIFT SETS (from Nuraan's Pick)
// 6 × 3ml Precision Roll-Ons • Signature Gift Coffret Box
// ==========================================
const NURAAN_COMBOS = [
  {
    id: "combo-french",
    name: "French Gift Set",
    collection: "French",
    badge: "Nuraan's French Pick",
    tagline: "Garnet 540 • Regent • Monarch • Cedar • Victor • Rumo",
    description: "Experience our six acclaimed French-style compositions. Handcrafted 3ml precision roll-ons housed in our signature luxury gift coffret.",
    itemsIncluded: ["Garnet 540", "Regent", "Monarch", "Cedar", "Victor", "Rumo"],
    price: 999,
    mrp: 2499,
    price3ml: 999,
    mrp3ml: 2499,
    image: "assets/images/combo-french.jpg",
    bottleColor: "#A63D40"
  },
  {
    id: "combo-arabic",
    name: "Arabic Gift Set",
    collection: "Arabic",
    badge: "Nuraan's Arabic Pick",
    tagline: "Musk Safa • Shaan • Wazir • Nishan • Malik • Raqeeq",
    description: "The soul of traditional Arabian perfumery. Six regal 3ml roll-ons featuring authentic Tahara musk, saffron, and imperial aged Hindi oud.",
    itemsIncluded: ["Musk Safa", "Shaan", "Wazir", "Nishan", "Malik", "Raqeeq"],
    price: 999,
    mrp: 2499,
    price3ml: 999,
    mrp3ml: 2499,
    image: "assets/images/combo-arabic.jpg",
    bottleColor: "#C59B27"
  },
  {
    id: "combo-women",
    name: "Women's Gift Set",
    collection: "Women",
    badge: "Nuraan's Women's Pick",
    tagline: "Velvet Oud • Garden Bloom • Black Night • Golden Musk • Island Kiss • Wazir",
    description: "A versatile feminine luxury wardrobe ranging from dewy night-blooming tuberose and tropical frangipani to velvety suede and dark amber.",
    itemsIncluded: ["Velvet Oud", "Garden Bloom", "Black Night", "Golden Musk", "Island Kiss", "Wazir"],
    price: 999,
    mrp: 2499,
    price3ml: 999,
    mrp3ml: 2499,
    image: "assets/images/combo-women.jpg",
    bottleColor: "#581845"
  },
  {
    id: "combo-oud",
    name: "Oud Gift Set",
    collection: "Oud",
    badge: "Nuraan's Oud Pick",
    tagline: "Bayan • Camel Oud • Amir Majlis • Safwan Oud • Surkh Oud • Raqeeq",
    description: "For the true connoisseur of agarwood. Six master 3ml distillations exploring wild Cambodian, Assam Hindi, and bakhoor amber formulations.",
    itemsIncluded: ["Bayan", "Camel Oud", "Amir Majlis", "Safwan Oud", "Surkh Oud", "Raqeeq"],
    price: 999,
    mrp: 2499,
    price3ml: 999,
    mrp3ml: 2499,
    image: "assets/images/combo-oud.jpg",
    bottleColor: "#3E2723"
  }
];`;

const combosRegex = /\/\/\s*={10,}\s*\n\/\/\s*PRE-CURATED DISCOVERY BOXES[\s\S]*?const NURAAN_COMBOS = \[[\s\S]*?\];/;
if (!combosRegex.test(content)) {
  console.error("Could not find NURAAN_COMBOS section via regex!");
  process.exit(1);
}

content = content.replace(combosRegex, updatedCombosSection);
fs.writeFileSync(catalogPath, content, 'utf8');
console.log("Successfully updated scripts/catalog-data.js!");
