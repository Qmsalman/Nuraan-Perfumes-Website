/**
 * ==============================================================================
 * NURAAN PERFUMES — FRAGRANCE CATALOG DATABASE
 * Clean Latin Luxury • Living Botanical Components • Discovery Boxes
 * ==============================================================================
 * HEY VIBE CODER! 👋
 * To edit any perfume name, price, description, notes, or photo:
 * 1. Find the perfume in the list below.
 * 2. Change the text or numbers between quotes.
 * 3. Save the file and refresh your browser. That's it!
 * ==============================================================================
 */

const NURAAN_CATALOG = [
  // ==========================================
  // FRENCH COLLECTION (from Nuraan's Pick)
  // ==========================================
  {
    id: "garnet-540",
    name: "Garnet 540",
    inspiration: "Baccarat Rouge 540",
    fragranticaDna: "Maison Francis Kurkdjian - Baccarat Rouge 540",
    collection: "French",
    category: "French",
    badge: "Bestseller",
    tagline: "Luminous amber crystals, sweet saffron & cedar warmth",
    description: "An intoxicating extrait-strength pure attar that radiates pure warmth and charisma. Hand-harvested saffron threads melt into sweet mineral ambergris and crushed Himalayan cedarwood.",
    accords: ["Saffron", "Warm Ambergris", "Cedar", "Sweet Spices"],
    botanicals: [
      {
        type: "saffron",
        name: "Kashmiri Saffron",
        role: "Opening Spice • Top",
        desc: "Hand-harvested red Mongra stigmata threads providing a radiant warm spicy halo."
      },
      {
        type: "amber",
        name: "Solar Ambergris",
        role: "Heart Radiance",
        desc: "Sweet, crystalline mineral ambergris offering an unforgettable projection."
      },
      {
        type: "sandal",
        name: "Himalayan Cedar",
        role: "Woody Anchor • Base",
        desc: "Crushed mountain cedarwood anchoring the sweet accords for 16+ hours."
      }
    ],
    notes: {
      top: ["Bitter Almond","Saffron Threads","Jasmine Grandiflorum"],
      heart: ["Amberwood","Warm Ambergris","Egyptian Jasmine","Hedione"],
      base: ["Fir Resin","Himalayan Cedar","Warm Amber","Velvet Musk"]
    },
    longevity: "16+ Hours on Skin • 48 Hours on Clothes",
    sillage: "Radiant & Unforgettable",
    season: "All Season • Signature Evening",
    bottleColor: "#A63D40",
    price12ml: 799,
    occasions: ["party","casual"],
    seasons: ["winter","rainy","all-season"],
    price3mlOption: 299,
    image: "assets/images/garnet-540.jpg"
  },
  {
    id: "regent",
    name: "Regent",
    inspiration: "Dunhill Icon",
    fragranticaDna: "Alfred Dunhill - Icon",
    collection: "French",
    category: "French",
    badge: "Aristocratic Poise",
    tagline: "Mysore sandalwood, golden amber & dried spices",
    description: "A scent of aristocratic poise and calm majesty. Creamy vintage Mysore sandalwood intertwines with warm golden amber, sweet tonka bean, and a whisper of royal saffron.",
    accords: ["Mysore Sandal", "Golden Amber", "Tonka", "Warm Cashmere"],
    botanicals: [
      {
        type: "citrus",
        name: "Neroli & Bergamot",
        role: "Italian Citrus • Top",
        desc: "Sun-drenched Calabrian bergamot and bitter orange blossom petigrain."
      },
      {
        type: "spice",
        name: "Cardamom & Pepper",
        role: "Noble Spices • Heart",
        desc: "Crushed green cardamom and black pepper providing an aristocratic edge."
      },
      {
        type: "sandal",
        name: "Mysore Sandalwood",
        role: "Aged Woods • Base",
        desc: "Creamy vintage Indian sandalwood paired with dark smoked leather."
      }
    ],
    notes: {
      top: ["Neroli Petals","Italian Bergamot","Black Pepper","Petitgrain"],
      heart: ["Black Cardamom","Provence Lavender","Juniper Berries","Silver Sage"],
      base: ["Haitian Vetiver","Agarwood (Oud)","Smoked Leather","Oakmoss","Florentine Iris"]
    },
    longevity: "14+ Hours on Skin",
    sillage: "Refined & Sophisticated",
    season: "All Year Round • Everyday Luxury",
    bottleColor: "#C59B27",
    price12ml: 799,
    occasions: ["office","casual"],
    seasons: ["all-season","summer","rainy"],
    price3mlOption: 299,
    image: "assets/images/regent.jpg"
  },
  {
    id: "monarch",
    name: "Monarch",
    inspiration: "Aventus Creed",
    fragranticaDna: "Creed - Aventus",
    collection: "French",
    category: "French",
    badge: "Royal Collection",
    tagline: "Crowned spices, royal Assam agarwood & sovereign musk",
    description: "Crafted to embody leadership and ancient heritage. A commanding opening of nutmeg and coriander gives way to deep Assam agarwood, aged patchouli, and imperial ambergris.",
    accords: ["Assam Oud", "Spicy Nutmeg", "Patchouli", "Imperial Musk"],
    botanicals: [
      {
        type: "fruit",
        name: "Sunlit Pineapple",
        role: "Crisp Opening • Top",
        desc: "Juicy sun-drenched pineapple and crisp French apple for a bold opening."
      },
      {
        type: "oud",
        name: "Smoked Birch Wood",
        role: "Smoky Leather • Heart",
        desc: "Smoked silver birch wood and dark Indonesian patchouli."
      },
      {
        type: "amber",
        name: "Imperial Ambergris",
        role: "Regal Anchor • Base",
        desc: "Precious mineral ambergris ensuring 16+ hours of projection."
      }
    ],
    notes: {
      top: ["Sun-ripened Pineapple","Italian Bergamot","Blackcurrant","French Apple"],
      heart: ["Smoked Birch","Dark Patchouli","Moroccan Jasmine","Pink Rose"],
      base: ["Oakmoss","Precious Ambergris","Clean Musk","Madagascar Vanilla"]
    },
    longevity: "16+ Hours on Skin",
    sillage: "Grand & Majestic",
    season: "Autumn / Winter • Formal Banquets",
    bottleColor: "#581845",
    price12ml: 799,
    occasions: ["office","party","travelling"],
    seasons: ["all-season","summer","rainy"],
    price3mlOption: 299,
    image: "assets/images/monarch.jpg"
  },
  {
    id: "cedar",
    name: "Cedar",
    inspiration: "Tam Dao",
    fragranticaDna: "Diptyque - Tam Dao",
    collection: "French",
    category: "French",
    badge: "Woodland Pure",
    tagline: "Dry Atlas cedarwood, crushed pine needles & smoky vetiver roots",
    description: "A crisp, meditative olfactory journey through ancient mountain forests. Dry Atlas cedar shavings mingling with aromatic juniper berries, damp pine needles, and earthy Haitian vetiver.",
    accords: ["Atlas Cedarwood", "Pine Needles", "Haitian Vetiver", "Juniper Berry"],
    botanicals: [
      {
        type: "sandal",
        name: "Atlas Cedar",
        role: "Sacred Wood • Heart",
        desc: "Aromatic Atlas mountain cedarwood and Goa sandalwood."
      },
      {
        type: "spice",
        name: "Italian Cypress",
        role: "Cool Breeze • Top",
        desc: "Slender Italian cypress and aromatic myrtle leaves."
      },
      {
        type: "sandal",
        name: "Goa Sandalwood",
        role: "Creamy Core • Base",
        desc: "Smooth Brazilian rosewood and warm golden amber."
      }
    ],
    notes: {
      top: ["Italian Cypress","Myrtle Leaves","Soft Rose Water"],
      heart: ["Goa Sandalwood","Atlas Cedarwood"],
      base: ["Brazilian Rosewood","White Musk","Warm Spices","Golden Amber"]
    },
    longevity: "13+ Hours on Skin",
    sillage: "Crisp, Grounding & Woodsy",
    season: "Spring / Autumn • Daily Grounding",
    bottleColor: "#1E8449",
    price12ml: 799,
    occasions: ["office","casual","travelling"],
    seasons: ["summer","rainy","all-season"],
    price3mlOption: 299,
    image: "assets/images/cedar.jpg"
  },
  {
    id: "victor",
    name: "Victor",
    inspiration: "9PM Afnan",
    fragranticaDna: "Afnan - 9 PM (Ultra Male DNA)",
    collection: "French",
    category: "French",
    badge: "Crowd Favorite",
    tagline: "Crisp marine breeze, lavender fields & sun-drenched woods",
    description: "A triumphant, ultra-refreshing concentrated oil for the modern conqueror. Vibrant Italian citrus sparks through aromatic lavender and wet moss, resting on a buoyant bed of clean driftwood.",
    accords: ["Fresh Citrus", "Marine Breeze", "Lavender", "Clean Woods"],
    botanicals: [
      {
        type: "fruit",
        name: "Crisp Green Apple",
        role: "Fresh Orchard • Top",
        desc: "Tart green apple and wild bergamot giving a vibrant sparkling opening."
      },
      {
        type: "cinnamon",
        name: "Ceylon Cinnamon",
        role: "Spiced Warmth • Heart",
        desc: "Sweet whole cinnamon quills and French lavender."
      },
      {
        type: "vanilla",
        name: "Bourbon Vanilla",
        role: "Sweet Tonka • Base",
        desc: "Creamy Madagascar vanilla and roasted tonka bean."
      }
    ],
    notes: {
      top: ["Crisp Green Apple","Spiced Cinnamon","Wild Lavender","Bergamot Zest"],
      heart: ["Orange Blossom","Lily of the Valley"],
      base: ["Madagascar Vanilla","Tonka Bean","Golden Amber","Patchouli"]
    },
    longevity: "12+ Hours on Skin",
    sillage: "Crisp, Dynamic & Clean",
    season: "Spring / Summer • Daytime Dynamic",
    bottleColor: "#1A5276",
    price12ml: 799,
    occasions: ["casual","party","office"],
    seasons: ["summer","all-season","rainy"],
    price3mlOption: 299,
    image: "assets/images/victor.jpg"
  },
  {
    id: "rumo",
    name: "Rumo",
    inspiration: "Cheirosa 62",
    fragranticaDna: "Sol de Janeiro - Brazilian Crush Cheirosa 62",
    collection: "French",
    category: "French",
    badge: "Exotic Silk",
    tagline: "Caramelized Medjool dates, exotic bazaar spices & sweet amber",
    description: "A bewitching oriental elixir celebrating the rich caravans of the Silk Road. Sweet Medjool dates simmered in honey and cinnamon, accented by frankincense tears, benzoin, and warm agarwood.",
    accords: ["Medjool Dates", "Bazaar Spices", "Sweet Amber", "Benzoin Tears"],
    botanicals: [
      {
        type: "fruit",
        name: "Toasted Pistachio",
        role: "Nutty Glow • Top",
        desc: "Roasted pistachio nuts, almonds, and sea salted caramel."
      },
      {
        type: "caramel",
        name: "Salted Caramel",
        role: "Molten Ribbon • Heart",
        desc: "Sweet salted caramel drizzle and heliotrope petals."
      },
      {
        type: "vanilla",
        name: "Vanilla Bean",
        role: "Golden Beach • Base",
        desc: "Warm vanilla bean extract and creamy sandalwood."
      }
    ],
    notes: {
      top: ["Toasted Pistachio","Roasted Almond","Sea Salted Caramel"],
      heart: ["Heliotrope","Jasmine Petals"],
      base: ["Warm Vanilla Bean","Salted Caramel Drizzle","Creamy Sandalwood"]
    },
    longevity: "15+ Hours on Skin",
    sillage: "Heady, Sweet & Mystical",
    season: "Autumn / Winter • Festive Evenings",
    bottleColor: "#7D6608",
    price12ml: 799,
    occasions: ["party","casual","travelling"],
    seasons: ["winter","rainy"],
    price3mlOption: 299,
    image: "assets/images/rumo.jpg"
  },

  // ==========================================
  // ARABIC COLLECTION (from Nuraan's Pick)
  // ==========================================
  {
    id: "musk-safa",
    name: "Musk Safa",
    inspiration: "Musk Rijali",
    fragranticaDna: "Arabian Oud / Surrati - Musk Rijali (Royal White Musk)",
    collection: "Arabic",
    category: "Arabic",
    badge: "Pure Tahara",
    tagline: "Pristine white Tahara musk, clean cotton blossoms & soft rose water",
    description: "The quintessential Middle Eastern purity attar. Thick, creamy white Tahara musk with a silky, non-greasy skin finish. Smells like pristine white linens, cold well water, and innocent white petals.",
    accords: ["White Tahara Musk", "Cotton Blossom", "Rose Water", "Clean Powder"],
    botanicals: [
      {
        type: "musk",
        name: "Tahara White Musk",
        role: "Pure Purity • Heart",
        desc: "Authentic Tahara white musk offering velvet powdery cleanliness."
      },
      {
        type: "flower",
        name: "White Lotus & Iris",
        role: "Dewy Petals • Top",
        desc: "White lotus blossoms and powdery Florentine iris."
      },
      {
        type: "sandal",
        name: "Soft Sandalwood",
        role: "Gentle Anchor • Base",
        desc: "Smooth sandalwood and vanilla orchid."
      }
    ],
    notes: {
      top: ["White Lotus","Lily of the Valley","Morning Dew Drops"],
      heart: ["Royal Tahara White Musk","Powdery Violet","Florentine Iris"],
      base: ["Crystalline Amber","Soft Sandalwood","Vanilla Orchid"]
    },
    longevity: "14+ Hours on Skin • Intimate Radiance",
    sillage: "Pristine, Pure & Heavenly",
    season: "All Year Round • Daily Purity & Meditation",
    bottleColor: "#D5D8DC",
    price12ml: 799,
    occasions: ["casual","office","travelling"],
    seasons: ["summer","all-season","rainy"],
    price3mlOption: 299,
    image: "assets/images/musk-safa.jpg"
  },
  {
    id: "shaan",
    name: "Shaan",
    inspiration: "Al-Wisam Day",
    fragranticaDna: "Rasasi - Al Wisam Day",
    collection: "Arabic",
    category: "Arabic",
    badge: "Heritage Treasure",
    tagline: "Kashmiri saffron threads, Damascena rose & aged sandalwood",
    description: "Shaan represents pride, grandeur, and regal heritage. Precious crimson Kashmiri saffron threads distilled over vintage sandalwood oil and finished with velvety Damask rose water.",
    accords: ["Kashmiri Saffron", "Damask Rose", "Mysore Sandal", "Sweet Amber"],
    botanicals: [
      {
        type: "citrus",
        name: "Italian Bergamot",
        role: "Alpine Spark • Top",
        desc: "Crisp mountain citrus and refreshing French lavender."
      },
      {
        type: "rose",
        name: "Centifolia Rose",
        role: "Regal Floral • Heart",
        desc: "Centifolia rose petals balanced with clary sage and cedar."
      },
      {
        type: "musk",
        name: "White Tahara Musk",
        role: "Clean Velvet • Base",
        desc: "Pristine white musk and golden amber offering fresh daylong projection."
      }
    ],
    notes: {
      top: ["Crisp Bergamot","French Lavender","Wild Geranium"],
      heart: ["Centifolia Rose","Clary Sage","Sandalwood","Atlas Cedar"],
      base: ["Golden Amber","White Tahara Musk","Oakmoss","Whisper of Oud"]
    },
    longevity: "15+ Hours on Skin",
    sillage: "Stately, Rich & Beloved",
    season: "All Season • Festive & Weddings",
    bottleColor: "#D35400",
    price12ml: 799,
    occasions: ["office","casual","party"],
    seasons: ["summer","rainy","all-season"],
    price3mlOption: 299,
    image: "assets/images/shaan.jpg"
  },
  {
    id: "wazir",
    name: "Wazir",
    inspiration: "Kaaf",
    fragranticaDna: "Ahmed Al Maghribi - Kaaf",
    collection: "Arabic",
    category: "Arabic",
    badge: "Master Counselor",
    tagline: "Spiced cardamom pod, dark Indonesian patchouli & smoky woods",
    description: "A complex fragrance honoring the wisdom and authority of the royal vizier. Intense green cardamom crackles over dark aged patchouli, nutmeg, and dry vetiver roots.",
    accords: ["Green Cardamom", "Dark Patchouli", "Nutmeg", "Vetiver Root"],
    botanicals: [
      {
        type: "fruit",
        name: "Chilled Watermelon",
        role: "Crisp Marine • Top",
        desc: "Chilled juicy watermelon slices and Sicilian red fruits."
      },
      {
        type: "flower",
        name: "Blue Lotus",
        role: "Aquatic Floral • Heart",
        desc: "Dewy water lotus and night-blooming white jasmine."
      },
      {
        type: "musk",
        name: "Clean Ambroxan",
        role: "Oceanic Musk • Base",
        desc: "Velvety white musk and clean ambroxan for breezy longevity."
      }
    ],
    notes: {
      top: ["Juicy Red Fruits","Chilled Watermelon","Sicilian Orange","Lavender"],
      heart: ["Mineral Sea Spray","Blue Lotus","Night Jasmine","Lily of the Valley"],
      base: ["White Musk","Clean Ambroxan","Creamy Sandalwood"]
    },
    longevity: "14+ Hours on Skin",
    sillage: "Sharp, Authoritative & Intriguing",
    season: "Autumn / Winter / Rainy • Daily Power",
    bottleColor: "#4A235A",
    price12ml: 799,
    occasions: ["office","travelling","casual"],
    seasons: ["summer","rainy","all-season"],
    price3mlOption: 299,
    image: "assets/images/wazir.jpg"
  },
  {
    id: "nishan",
    name: "Nishan",
    inspiration: "Liquid Brun",
    fragranticaDna: "French Avenue - Liquid Brun (PDM Althaïr DNA)",
    collection: "Arabic",
    category: "Arabic",
    badge: "Unique Signature",
    tagline: "Bright Calabrian bergamot, Florentine iris & smoky vetiver",
    description: "Nishan signifies a distinguished mark of honor. A bright, aristocratic signature opening of sparkling Italian bergamot, leading to powdery iris root and a refined dry-down of smoky vetiver and ambergris.",
    accords: ["Calabrian Bergamot", "Florentine Iris", "Smoky Vetiver", "Ambergris"],
    botanicals: [
      {
        type: "cinnamon",
        name: "Ceylon Cinnamon",
        role: "Warm Spice • Top",
        desc: "Crushed Ceylon cinnamon bark, cardamom, and orange blossom."
      },
      {
        type: "vanilla",
        name: "Bourbon Vanilla",
        role: "Rich Pods • Heart",
        desc: "Bourbon vanilla pods and fragrant elemi resin."
      },
      {
        type: "spice",
        name: "Roasted Praline",
        role: "Nutty Warmth • Base",
        desc: "Roasted hazelnut praline, ambroxan, and guaiacwood."
      }
    ],
    notes: {
      top: ["Ceylon Cinnamon","Crushed Green Cardamom","Orange Blossom","Bergamot"],
      heart: ["Bourbon Vanilla Pods","Elemi Gum Resin"],
      base: ["Roasted Hazelnut Praline","Ambroxan","Guaiacwood","Sensual Musk"]
    },
    longevity: "14+ Hours on Skin",
    sillage: "Chic, Modern & Aristocratic",
    season: "All Season • Boardroom to Banquet",
    bottleColor: "#2874A6",
    price12ml: 799,
    occasions: ["party","casual"],
    seasons: ["winter","rainy"],
    price3mlOption: 299,
    image: "assets/images/nishan.jpg"
  },
  {
    id: "malik",
    name: "Malik",
    inspiration: "Marj",
    fragranticaDna: "Ahmed Al Maghribi - Marj",
    collection: "Arabic",
    category: "Arabic",
    badge: "Sovereign Crown",
    tagline: "Imperial aged Hindi oud, mineral ambergris & royal bridle leather",
    description: "The absolute crown jewel of the Nuraan collection. Fermented, vintage Assam Hindi agarwood oil blended with genuine tincture-profile ambergris and burnished royal saddlery leather.",
    accords: ["Vintage Hindi Oud", "Natural Ambergris", "Fine Leather", "Smoky Oak"],
    botanicals: [
      {
        type: "caramel",
        name: "Spiced Honey",
        role: "Opulent Nectar • Top",
        desc: "Wild honey, nutmeg, and pink pepper creating an imperial opening."
      },
      {
        type: "saffron",
        name: "Kashmiri Saffron",
        role: "Royal Spice • Heart",
        desc: "Crimson saffron threads and Ceylon cinnamon bark."
      },
      {
        type: "oud",
        name: "Aged Assam Oud",
        role: "Sovereign Wood • Base",
        desc: "Dark agarwood and saddlery leather giving commanding presence."
      }
    ],
    notes: {
      top: ["Spiced Honey","Nutmeg","Bergamot","Pink Pepper","Elemi Resin"],
      heart: ["Kashmiri Saffron","Damask Rose","Cashmere Wood","Ceylon Cinnamon"],
      base: ["Sovereign Leather","Golden Amber","Ripe Raspberry","Assam Agarwood"]
    },
    longevity: "24+ Hours on Skin • Indelible",
    sillage: "Imperial, Room-Filling & Rare",
    season: "Winter • Sovereign Milestones",
    bottleColor: "#2C1B0B",
    price12ml: 799,
    occasions: ["party","office"],
    seasons: ["winter","rainy"],
    price3mlOption: 299,
    image: "assets/images/malik.jpg"
  },
  {
    id: "raqeeq",
    name: "Raqeeq",
    inspiration: "Khofooq",
    fragranticaDna: "Ajmal - Khofooq",
    collection: "Arabic",
    category: "Arabic",
    badge: "Delicate Sublime",
    tagline: "Featherweight powdery floral musk, white lotus & vanilla silk",
    description: "Raqeeq translates to delicate, tender, and sublime. A sheer veil of clean white lotus, iris root powder, creamy vanilla bean, and silken musks that melt effortlessly into the wearer's skin.",
    accords: ["White Lotus", "Iris Powder", "Vanilla Silk", "Clean Musks"],
    botanicals: [
      {
        type: "rose",
        name: "Taif Rose Petals",
        role: "Dewy Romantic • Top",
        desc: "Fresh cut Taif rose petals distilled with sweet morning dew."
      },
      {
        type: "fruit",
        name: "White Peach Nectar",
        role: "Velvet Fruit • Top",
        desc: "Juicy white peach and ylang-ylang florals."
      },
      {
        type: "musk",
        name: "Tahara White Musk",
        role: "Powdery Silk • Base",
        desc: "Silken white musk and Virginian cedarwood."
      }
    ],
    notes: {
      top: ["Fresh Cut Rose","Sweet White Peach","Bergamot Breeze"],
      heart: ["Ylang-Ylang","Lily of the Valley","Soft Spicy Florals"],
      base: ["Powdery White Musk","Virginian Cedar","Smooth Sandalwood","Soft Amber"]
    },
    longevity: "12+ Hours on Skin",
    sillage: "Intimate, Caressing & Gentle",
    season: "All Year Round • Bedtime & Meditative",
    bottleColor: "#E8DAEF",
    price12ml: 799,
    occasions: ["casual","office","travelling"],
    seasons: ["summer","all-season"],
    price3mlOption: 299,
    image: "assets/images/raqeeq.jpg"
  },

  // ==========================================
  // WOMEN'S COLLECTION (from Nuraan's Pick)
  // ==========================================
  {
    id: "velvet-oud",
    name: "Velvet Oud",
    inspiration: "Purple Oud",
    fragranticaDna: "Dior - Purple Oud (Maison Christian Dior)",
    collection: "Women",
    category: "Women",
    badge: "Bestseller",
    tagline: "Plush velvet suede, cinnamon bark & sweet golden agarwood",
    description: "An effortlessly smooth, contemporary take on Arabian oud. Supple velvet suede enveloped in warm cinnamon, sweet amber, and a non-medicinal, warm golden agarwood that feels like wrapping yourself in cashmere.",
    accords: ["Velvet Suede", "Warm Cinnamon", "Golden Oud", "Cashmere Amber"],
    botanicals: [
      {
        type: "citrus",
        name: "Bitter Orange",
        role: "Citrus Spark • Top",
        desc: "Bitter orange zest and fiery pink peppercorn."
      },
      {
        type: "rose",
        name: "Damask Rose",
        role: "Velvet Bloom • Heart",
        desc: "Damask rose petals and Persian saffron threads."
      },
      {
        type: "oud",
        name: "Violet Agarwood",
        role: "Modern Oud • Base",
        desc: "Smooth approachably soft agarwood and smoky cedarwood."
      }
    ],
    notes: {
      top: ["Bitter Orange Zest","Pink Peppercorn"],
      heart: ["Persian Saffron Threads","Damask Rose"],
      base: ["Smooth Agarwood (Oud)","Smoky Cedarwood","Warm Spices"]
    },
    longevity: "16+ Hours on Skin",
    sillage: "Smooth, Luxuriously Cozy & Magnetic",
    season: "Autumn / Winter / Air-Conditioned Evenings",
    bottleColor: "#4A0E17",
    price12ml: 799,
    occasions: ["party","casual"],
    seasons: ["winter","rainy","all-season"],
    price3mlOption: 299,
    image: "assets/images/velvet-oud.jpg"
  },
  {
    id: "garden-bloom",
    name: "Garden Bloom",
    inspiration: "Gucci Flora",
    fragranticaDna: "Gucci - Flora Gorgeous Gardenia",
    collection: "Women",
    category: "Women",
    badge: "Natural Floral",
    tagline: "Lush white florals, night-blooming jasmine & dew-kissed tuberose",
    description: "A stroll through a royal pleasure garden at dusk. Heady Sambac jasmine and intoxicating Indian tuberose softened by green stems, white lilies, and a featherweight musk trail.",
    accords: ["Jasmine Sambac", "Tuberose", "White Lily", "Dewy Greens"],
    botanicals: [
      {
        type: "flower",
        name: "White Gardenia",
        role: "Dewy Blossom • Heart",
        desc: "Opulent white gardenia petals and frangipani blossoms in full bloom."
      },
      {
        type: "fruit",
        name: "Sunlit Berries",
        role: "Sparkling Fruity • Top",
        desc: "Italian mandarin and wild red berries sparkling in morning dew."
      },
      {
        type: "caramel",
        name: "Caramelized Sugar",
        role: "Warm Sweetness • Base",
        desc: "Golden brown sugar crystals and Indonesian patchouli."
      }
    ],
    notes: {
      top: ["Pear Blossom","Red Wild Berries","Italian Mandarin"],
      heart: ["Velvet White Gardenia","Solar Jasmine","Frangipani Blossom"],
      base: ["Caramelized Brown Sugar","Indonesian Patchouli"]
    },
    longevity: "12+ Hours on Skin",
    sillage: "Euphoric & Floral Aura",
    season: "Spring / Summer • Celebrations",
    bottleColor: "#229954",
    price12ml: 799,
    occasions: ["casual","party","office"],
    seasons: ["summer","rainy","all-season"],
    price3mlOption: 299,
    image: "assets/images/garden-bloom.jpg"
  },
  {
    id: "black-night",
    name: "Black Night",
    inspiration: "Black Opium",
    fragranticaDna: "Yves Saint Laurent - Black Opium",
    collection: "Women",
    category: "Women",
    badge: "Dark Elegance",
    tagline: "Nocturnal leather, smoky birch tar & brooding incense",
    description: "An enigmatic masterpiece formulated for bold evenings. Rich black leather combines with charred birch bark, aged dark woods, and resinous Omani frankincense.",
    accords: ["Black Leather", "Smoky Birch", "Incense", "Dark Woods"],
    botanicals: [
      {
        type: "coffee",
        name: "Roasted Espresso",
        role: "Dark Opening • Top",
        desc: "Dark roasted espresso beans delivering an energizing, addictive aroma."
      },
      {
        type: "vanilla",
        name: "Bourbon Vanilla",
        role: "Sweet Velvet • Base",
        desc: "Madagascar bourbon vanilla beans providing sweet, seductive warmth."
      },
      {
        type: "flower",
        name: "Orange Blossom",
        role: "Luminous Heart",
        desc: "Delicate white orange blossoms creating a soft radiant floral contrast."
      }
    ],
    notes: {
      top: ["Ripe Pear","Pink Pepper","Orange Blossom"],
      heart: ["Black Coffee","Jasmine Sambac","Bitter Almond","Licorice"],
      base: ["Bourbon Vanilla","Patchouli","Cashmere Wood","Cedar"]
    },
    longevity: "18+ Hours on Skin • 3+ Days on Fabrics",
    sillage: "Powerful & Magnetic",
    season: "Autumn / Winter • Formal Evening",
    bottleColor: "#1B1B1E",
    price12ml: 799,
    occasions: ["party"],
    seasons: ["winter","rainy"],
    price3mlOption: 299,
    image: "assets/images/black-night.jpg"
  },
  {
    id: "golden-musk",
    name: "Golden Musk",
    inspiration: "Aurum",
    fragranticaDna: "Ajmal - Aurum (Lady Million DNA)",
    collection: "Women",
    category: "Women",
    badge: "Warm Solar",
    tagline: "Honeyed musk crystals, warm solar amber & caramelized sugar",
    description: "A rich, honeyed nectar musk that glows like liquid gold on warm skin. Sweet sun-warmed amber, white musks, and a hint of golden honeycomb create an irresistible, comforting warmth.",
    accords: ["Honeyed Musk", "Solar Amber", "Sweet Honeycomb", "Benzoin"],
    botanicals: [
      {
        type: "citrus",
        name: "Amalfi Lemon",
        role: "Golden Citrus • Top",
        desc: "Sunlit Amalfi lemon zest and ripe summer raspberries."
      },
      {
        type: "flower",
        name: "White Gardenia",
        role: "Luminous Heart",
        desc: "Blooming white gardenia and orange blossom petals."
      },
      {
        type: "amber",
        name: "Golden Amber",
        role: "Liquid Glow • Base",
        desc: "Rich amber resin, royal musk, and bourbon vanilla."
      }
    ],
    notes: {
      top: ["Amalfi Lemon Zest","Ripe Summer Raspberry"],
      heart: ["White Gardenia","Orange Blossom","Jasmine Sambac","Spicy Accords"],
      base: ["Golden Amber","Royal Tahara Musk","Bourbon Vanilla","Light Woods"]
    },
    longevity: "14+ Hours on Skin",
    sillage: "Warm, Cozy & Addictive",
    season: "All Season • Daytime & Evening Glow",
    bottleColor: "#F39C12",
    price12ml: 799,
    occasions: ["casual","party","travelling"],
    seasons: ["all-season","summer","rainy"],
    price3mlOption: 299,
    image: "assets/images/golden-musk.jpg"
  },
  {
    id: "island-kiss",
    name: "Island Kiss",
    inspiration: "Island Kiss",
    fragranticaDna: "Escada - Island Kiss",
    collection: "Women",
    category: "Women",
    badge: "Tropical Fresh",
    tagline: "Exotic passion fruit nectar, coconut water & sun-kissed frangipani",
    description: "A joyful burst of tropical paradise captured in an alcohol-free concentrated oil. Luscious passion fruit, chilled coconut water, and fragrant white frangipani blossoms resting on a base of creamy solar musk.",
    accords: ["Passion Fruit", "Coconut Water", "Frangipani Blossom", "Solar Musk"],
    botanicals: [
      {
        type: "fruit",
        name: "Alphonso Mango",
        role: "Tropical Nectar • Top",
        desc: "Juicy Alphonso mango, passionfruit, and sweet orange."
      },
      {
        type: "flower",
        name: "Pink Hibiscus",
        role: "Island Bloom • Heart",
        desc: "White peach and blooming tropical hibiscus flowers."
      },
      {
        type: "musk",
        name: "Coconut Cream",
        role: "Velvet Breeze • Base",
        desc: "Creamy coconut milk and crystalline white musk."
      }
    ],
    notes: {
      top: ["Juicy Alphonso Mango","Passionfruit Nectar","Raspberry","Sweet Orange"],
      heart: ["White Peach","Magnolia Petals","Hibiscus Flower"],
      base: ["Creamy Coconut Milk","Light Tropical Woods","Clean White Musk"]
    },
    longevity: "11+ Hours on Skin",
    sillage: "Vibrant, Uplifting & Seductive",
    season: "Summer / Vacation • Sunny Days",
    bottleColor: "#E67E22",
    price12ml: 799,
    occasions: ["casual","travelling"],
    seasons: ["summer"],
    price3mlOption: 299,
    image: "assets/images/island-kiss.jpg"
  },

  // ==========================================
  // OUD COLLECTION (from Nuraan's Pick)
  // ==========================================
  {
    id: "bayan",
    name: "Bayan",
    inspiration: "Kalemat",
    fragranticaDna: "Arabian Oud - Kalemat",
    collection: "Oud",
    category: "Oud",
    badge: "Gourmand Wood",
    tagline: "Warm aromatic spiced tobacco, bourbon vanilla & honeyed tonka",
    description: "Bayan means eloquence and revelation. A rich, opulent gourmand attar celebrating honeyed pipe tobacco leaves, sweet cinnamon bark, roasted tonka bean, and Madagascan bourbon vanilla.",
    accords: ["Sweet Tobacco", "Vanilla Cream", "Cinnamon", "Roasted Tonka"],
    botanicals: [
      {
        type: "caramel",
        name: "Wild Forest Honey",
        role: "Golden Nectar • Base",
        desc: "Raw mountain honey providing rich, viscous, sweet balsamic warmth."
      },
      {
        type: "fruit",
        name: "Wild Bilberry",
        role: "Sweet Berries • Top",
        desc: "Sun-ripened bilberries and sweet star anise."
      },
      {
        type: "amber",
        name: "Cashmere Amber",
        role: "Velvet Resins • Heart",
        desc: "Warm fossilized tree resin and precious Tahara musk."
      }
    ],
    notes: {
      top: ["Wild Bilberry","Sweet Star Anise"],
      heart: ["Rosemary Sprig","Cashmere Wood","Exotic Floral Accords"],
      base: ["Wild Forest Honey","Warm Golden Amber","Precious Musk"]
    },
    longevity: "16+ Hours on Skin",
    sillage: "Intimate, Sweet & Hypnotic",
    season: "Autumn / Winter • Evening Intimacy",
    bottleColor: "#784212",
    price12ml: 799,
    occasions: ["party","casual"],
    seasons: ["winter","rainy"],
    price3mlOption: 299,
    image: "assets/images/bayan.jpg"
  },
  {
    id: "camel-oud",
    name: "Camel Oud",
    inspiration: "Camel Oud",
    fragranticaDna: "Caramel Oriental Oud Accord",
    collection: "Oud",
    category: "Oud",
    badge: "Desert Heritage",
    tagline: "Caravan spices, warm desert sand & smoky agarwood resin",
    description: "Inspired by ancient incense camel caravans crossing the Rub' al Khali desert. Sun-warmed desert minerals blend with wild Frankincense, scorched agarwood chips, and dry amber resin.",
    accords: ["Desert Minerals", "Wild Frankincense", "Aged Oud", "Dry Amber"],
    botanicals: [
      {
        type: "caramel",
        name: "Salted Caramel",
        role: "Gourmand Drip • Top",
        desc: "Rich molten salted caramel dripped over warm golden honey."
      },
      {
        type: "oud",
        name: "Cambodian Oud",
        role: "Smoldering Heart",
        desc: "Authentic wild Cambodian agarwood with rich balsam depth."
      },
      {
        type: "rose",
        name: "Damask Rose",
        role: "Velvet Petals • Heart",
        desc: "Centifolia rose petals softening the smoldering dark oud."
      }
    ],
    notes: {
      top: ["Gooey Salted Caramel","Spiced Honey","Citrus Bergamot"],
      heart: ["Cambodian Oud","Amber Resins","Damask Rose Petals","Kashmiri Saffron"],
      base: ["Aged Agarwood","Mysore Sandalwood","Animalic Tahara Musk","Bourbon Vanilla"]
    },
    longevity: "18+ Hours on Skin",
    sillage: "Evocative, Smoky & Deep",
    season: "Cool Weather • Contemplative",
    bottleColor: "#B7950B",
    price12ml: 799,
    occasions: ["travelling","party"],
    seasons: ["winter","all-season"],
    price3mlOption: 299,
    image: "assets/images/camel-oud.jpg"
  },
  {
    id: "amir-majlis",
    name: "Amir Majlis",
    inspiration: "Bin Shaikh",
    fragranticaDna: "Ahmed Al Maghribi - Bin Shaikh",
    collection: "Oud",
    category: "Oud",
    badge: "Gathering Special",
    tagline: "Bakhoor embers, Arabic spiced coffee, cardamom & frankincense",
    description: "The scent of Arab hospitality and sacred evening gatherings. Glowing bakhoor wood chips smoking gently alongside freshly roasted cardamom coffee, saffron tea, and amber resin.",
    accords: ["Bakhoor Smoke", "Arabic Qahwa", "Frankincense", "Cardamom"],
    botanicals: [
      {
        type: "oud",
        name: "Bakhoor Smoke",
        role: "Sacred Embers • Heart",
        desc: "Glowing agarwood chips slow-burned with frankincense."
      },
      {
        type: "saffron",
        name: "Royal Saffron",
        role: "Opening Spice • Top",
        desc: "French lavender and royal Kashmiri saffron."
      },
      {
        type: "oud",
        name: "Dark Assam Oud",
        role: "Resinous Depth • Base",
        desc: "15-year aged Indian agarwood oil anchoring royal hospitality."
      }
    ],
    notes: {
      top: ["French Lavender","Royal Saffron","Taif Rose","Citrus Zest"],
      heart: ["Incense Bakhoor Smoke","Night Jasmine","Royal Orchid","Caramelized Sugar"],
      base: ["Aged Assam Agarwood","Patchouli","Ambroxan","Precious Amber Resins"]
    },
    longevity: "16+ Hours on Skin",
    sillage: "Warm, Inviting & Euphoric",
    season: "Autumn / Winter / Jummah Gatherings",
    bottleColor: "#6E2C00",
    price12ml: 799,
    occasions: ["party","casual"],
    seasons: ["winter","rainy"],
    price3mlOption: 299,
    image: "assets/images/amir-majlis.jpg"
  },
  {
    id: "safwan-oud",
    name: "Safwan Oud",
    inspiration: "Arabian Tobacco",
    fragranticaDna: "Ibrahim Al-Qurashi - Arabian Tobacco",
    collection: "Oud",
    category: "Oud",
    badge: "Smooth Artisanal",
    tagline: "Smooth Cambodian agarwood, wild dried berries & sweet woods",
    description: "Safwan means pure, clear, and serene. Unlike heavy barnyard notes, Safwan Oud showcases the sweet, fruit-glazed, balsamic characteristics of wild Koh Kong Cambodian distillations.",
    accords: ["Cambodian Oud", "Dried Wild Berries", "Balsamic Wood", "Warm Resins"],
    botanicals: [
      {
        type: "tobacco",
        name: "Arabian Tobacco",
        role: "Cured Leaf • Top",
        desc: "Aromatic cured tobacco leaf, saffron, and Tuscan iris."
      },
      {
        type: "caramel",
        name: "Salted Caramel",
        role: "Sweet Core • Heart",
        desc: "Rich salted caramel nectar and Turkish rose."
      },
      {
        type: "coffee",
        name: "Arabic Qahwa",
        role: "Smoked Beans • Base",
        desc: "Dark roasted cardamom coffee and aged cedarwood."
      }
    ],
    notes: {
      top: ["Arabian Cured Tobacco Leaf","Saffron","Tuscan Iris"],
      heart: ["Salted Caramel Nectar","Damask Rose","Tonka Bean"],
      base: ["Smoked Arabic Coffee","Dark Amber","Patchouli","Aged Cedar"]
    },
    longevity: "16+ Hours on Skin",
    sillage: "Smooth, Elegant & Approachable",
    season: "All Seasons • Oud Lovers & Connoisseurs",
    bottleColor: "#512E5F",
    price12ml: 799,
    occasions: ["party","office"],
    seasons: ["winter","rainy"],
    price3mlOption: 299,
    image: "assets/images/safwan-oud.jpg"
  },
  {
    id: "surkh-oud",
    name: "Surkh Oud",
    inspiration: "Red Tobacco",
    fragranticaDna: "Mancera - Red Tobacco",
    collection: "Oud",
    category: "Oud",
    badge: "Signature Classic",
    tagline: "Crimson Taif rose married with deep Assam agarwood oil",
    description: "The eternal romance of royal perfumery: sweet crimson Taif roses distilled with dark, earthy Indian agarwood. An opulent duality of velvet petals and resinous forest depth.",
    accords: ["Crimson Taif Rose", "Assam Agarwood", "Geranium", "Warm Amber"],
    botanicals: [
      {
        type: "cinnamon",
        name: "Ceylon Cinnamon",
        role: "Fiery Spices • Top",
        desc: "Warm Ceylon cinnamon bark, green apple, and white pear."
      },
      {
        type: "tobacco",
        name: "Cuban Tobacco",
        role: "Rich Leaf • Base",
        desc: "Cured Cuban tobacco leaves steeped in bourbon vanilla."
      },
      {
        type: "oud",
        name: "Dark Agarwood",
        role: "Resinous Smoke • Base",
        desc: "Smoky agarwood heartwood and golden amber."
      }
    ],
    notes: {
      top: ["Ceylon Cinnamon","Dark Agarwood (Oud)","Incense Embers","Saffron","Green Apple","White Pear"],
      heart: ["Indonesian Patchouli","Delicate Jasmine"],
      base: ["Cuban Tobacco Leaf","Madagascar Vanilla","Golden Amber","Guaiacwood","Haitian Vetiver"]
    },
    longevity: "18+ Hours on Skin",
    sillage: "Romantic, Heavy & Regal",
    season: "All Season • Romantic Evenings & Weddings",
    bottleColor: "#922B21",
    price12ml: 799,
    occasions: ["party","travelling"],
    seasons: ["winter","rainy","all-season"],
    price3mlOption: 299,
    image: "assets/images/surkh-oud.jpg"
  }
];

// ==========================================
// PRE-CURATED DISCOVERY BOXES (from Nuraan's Pick)
// ==========================================
const NURAAN_COMBOS = [
  {
    id: "combo-french",
    name: "French Discovery Box",
    collection: "French",
    badge: "Nuraan's French Pick",
    tagline: "Garnet 540 • Regent • Monarch • Cedar • Victor • Rumo",
    description: "Experience our six acclaimed French-inspired extrait compositions. Handcrafted precision roll-ons housed in our signature luxury gift box.",
    itemsIncluded: ["Garnet 540", "Regent", "Monarch", "Cedar", "Victor", "Rumo"],
    price: 1299,
    mrp: 3299,
    price3ml: 1299,
    mrp3ml: 3299,
    price12ml: 2999,
    mrp12ml: 4299,
    image: "assets/images/combo-french.jpg",
    bottleColor: "#A63D40"
  },
  {
    id: "combo-arabic",
    name: "Arabic Discovery Box",
    collection: "Arabic",
    badge: "Nuraan's Arabic Pick",
    tagline: "Musk Safa • Shaan • Wazir • Nishan • Malik • Raqeeq",
    description: "The soul of traditional Arabian perfumery. Six regal roll-ons featuring authentic Tahara musk, saffron, and imperial aged Hindi oud.",
    itemsIncluded: ["Musk Safa", "Shaan", "Wazir", "Nishan", "Malik", "Raqeeq"],
    price: 1399,
    mrp: 3299,
    price3ml: 1399,
    mrp3ml: 3299,
    price12ml: 2999,
    mrp12ml: 4299,
    image: "assets/images/combo-arabic.jpg",
    bottleColor: "#C59B27"
  },
  {
    id: "combo-women",
    name: "Women's Discovery Box",
    collection: "Women",
    badge: "Nuraan's Women's Pick",
    tagline: "Velvet Oud • Garden Bloom • Black Night • Golden Musk • Island Kiss • Wazir",
    description: "A versatile feminine luxury wardrobe ranging from dewy night-blooming tuberose and tropical frangipani to velvety suede and dark amber.",
    itemsIncluded: ["Velvet Oud", "Garden Bloom", "Black Night", "Golden Musk", "Island Kiss", "Wazir"],
    price: 1299,
    mrp: 3299,
    price3ml: 1299,
    mrp3ml: 3299,
    price12ml: 2999,
    mrp12ml: 4299,
    image: "assets/images/combo-women.jpg",
    bottleColor: "#581845"
  },
  {
    id: "combo-oud",
    name: "Oud Discovery Box",
    collection: "Oud",
    badge: "Nuraan's Oud Pick",
    tagline: "Bayan • Camel Oud • Amir Majlis • Safwan Oud • Surkh Oud • Raqeeq",
    description: "For the true connoisseur of agarwood. Master distillations exploring wild Cambodian, Assam Hindi, and bakhoor amber formulations.",
    itemsIncluded: ["Bayan", "Camel Oud", "Amir Majlis", "Safwan Oud", "Surkh Oud", "Raqeeq"],
    price: 1399,
    mrp: 3599,
    price3ml: 1399,
    mrp3ml: 3599,
    price12ml: 2999,
    mrp12ml: 4299,
    image: "assets/images/combo-oud.jpg",
    bottleColor: "#3E2723"
  }
];

window.NURAAN_CATALOG = NURAAN_CATALOG;
window.NURAAN_COMBOS = NURAAN_COMBOS;

// ==============================================================================
// BASELINE ORDER & SHIPMENT TRACKING DATA (Synced live from Google Sheet)
// Master Sheet Tab: 'Orders & Sales Tracker' (GID: 1607572912)
// ==============================================================================
const NURAAN_SAMPLE_ORDERS = [
  {
    orderId: "NP-1001",
    customerName: "Zeeshan Khan",
    maskedName: "Zeeshan K.",
    date: "2026-11-01",
    city: "Mumbai",
    items: "Discovery 6-Pack (3ml Precision Roll-on Box)",
    paymentStatus: "Paid",
    status: "Delivered",
    courier: "Blue Dart",
    awb: "BLD82910392",
    trackingUrl: "https://www.bluedart.com",
    eta: "Delivered on Nov 4"
  },
  {
    orderId: "NP-1002",
    customerName: "Farhan Ahmed",
    maskedName: "Farhan A.",
    date: "2026-11-02",
    city: "Delhi",
    items: "Aventus Creed (Single 12ml Luxury Flacon)",
    paymentStatus: "Paid",
    status: "Delivered",
    courier: "Delhivery",
    awb: "128391823901",
    trackingUrl: "https://www.delhivery.com",
    eta: "Delivered on Nov 5"
  },
  {
    orderId: "NP-1003",
    customerName: "Ayesha Siddiqui",
    maskedName: "Ayesha S.",
    date: "2026-11-03",
    city: "Hyderabad",
    items: "BR 450 (Single 12ml Luxury Flacon)",
    paymentStatus: "Paid",
    status: "In Transit",
    courier: "Delhivery",
    awb: "128391823902",
    trackingUrl: "https://www.delhivery.com",
    eta: "Expected in 1-2 Days"
  },
  {
    orderId: "NP-1004",
    customerName: "Imran Hashmi",
    maskedName: "Imran H.",
    date: "2026-11-04",
    city: "Bangalore",
    items: "Discovery 6-Pack (3ml Precision Roll-on Box)",
    paymentStatus: "COD",
    status: "In Transit",
    courier: "Shiprocket",
    awb: "SR98210392",
    trackingUrl: "https://shiprocket.co",
    eta: "Expected in 2-3 Days"
  },
  {
    orderId: "NP-1005",
    customerName: "Tariq Mansoor",
    maskedName: "Tariq M.",
    date: "2026-11-05",
    city: "Lucknow",
    items: "Brazil (Single 12ml Luxury Flacon)",
    paymentStatus: "Paid",
    status: "Processing",
    courier: "Preparing Dispatch",
    awb: "Pending AWB",
    trackingUrl: "",
    eta: "Ships within 24 Hours"
  },
  {
    orderId: "NP-1006",
    customerName: "Sameer Malik",
    maskedName: "Sameer M.",
    date: "2026-11-06",
    city: "Pune",
    items: "Discovery 6-Pack (3ml Precision Roll-on Box)",
    paymentStatus: "Pending",
    status: "Processing",
    courier: "Preparing Dispatch",
    awb: "Pending AWB",
    trackingUrl: "",
    eta: "Ships within 24 Hours"
  }
];

window.NURAAN_SAMPLE_ORDERS = NURAAN_SAMPLE_ORDERS;
