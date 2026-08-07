const mongoose = require('mongoose');

// Category configurations with subcategories and pricing ranges
const CATEGORY_CONFIG = {
  makeup: {
    subcategories: [
      'foundation',
      'lipstick',
      'eyeshadow',
      'mascara',
      'blush',
      'concealer',
      'primer',
      'setting-spray',
    ],
    priceRange: { min: 8, max: 85 },
    weightRange: { min: 0.05, max: 0.3 },
    hasVariants: true, // colors
    imageKeywords: ['makeup', 'cosmetics', 'beauty', 'lipstick', 'foundation'],
  },
  perfumes: {
    subcategories: [
      'eau-de-parfum',
      'eau-de-toilette',
      'body-mist',
      'gift-sets',
      'cologne',
      'roll-on',
    ],
    priceRange: { min: 25, max: 250 },
    weightRange: { min: 0.1, max: 0.5 },
    hasVariants: true, // sizes
    imageKeywords: ['perfume', 'fragrance', 'bottle', 'cologne'],
  },
  clothing: {
    subcategories: [
      'dresses',
      'tops',
      'pants',
      'jackets',
      'accessories',
      'sweaters',
      'skirts',
      'activewear',
    ],
    priceRange: { min: 15, max: 180 },
    weightRange: { min: 0.2, max: 1.5 },
    hasVariants: true, // sizes and colors
    imageKeywords: ['fashion', 'clothing', 'dress', 'shirt', 'style'],
  },
  skincare: {
    subcategories: [
      'cleanser',
      'moisturizer',
      'serum',
      'sunscreen',
      'masks',
      'toner',
      'exfoliator',
      'eye-cream',
    ],
    priceRange: { min: 12, max: 120 },
    weightRange: { min: 0.05, max: 0.4 },
    hasVariants: true, // sizes
    imageKeywords: ['skincare', 'beauty', 'cream', 'serum', 'bottle'],
  },
  accessories: {
    subcategories: [
      'jewelry',
      'bags',
      'scarves',
      'belts',
      'watches',
      'sunglasses',
      'hats',
      'wallets',
    ],
    priceRange: { min: 10, max: 200 },
    weightRange: { min: 0.05, max: 0.8 },
    hasVariants: true, // colors and sizes
    imageKeywords: ['accessories', 'jewelry', 'bag', 'watch', 'fashion'],
  },
  home: {
    subcategories: [
      'decor',
      'kitchen',
      'bedding',
      'lighting',
      'furniture',
      'rugs',
      'curtains',
      'organization',
    ],
    priceRange: { min: 15, max: 300 },
    weightRange: { min: 0.3, max: 5.0 },
    hasVariants: true, // colors and sizes
    imageKeywords: ['home', 'decor', 'furniture', 'interior', 'living'],
  },
};

// Brand data for each category
const BRAND_DATA = {
  makeup: [
    {
      name: 'Glow Beauty',
      country: 'USA',
      description: 'Premium makeup for everyday radiance',
    },
    {
      name: 'Luxe Cosmetics',
      country: 'France',
      description: 'French-inspired luxury beauty products',
    },
    {
      name: 'Pure Palette',
      country: 'Korea',
      description: 'K-beauty essentials for flawless skin',
    },
    {
      name: 'Velvet Touch',
      country: 'Italy',
      description: 'Sophisticated makeup with Italian elegance',
    },
    {
      name: 'Radiance Labs',
      country: 'Japan',
      description: 'Innovative formulas from Tokyo',
    },
  ],
  perfumes: [
    {
      name: 'Essence Maison',
      country: 'France',
      description: 'Timeless French fragrances',
    },
    {
      name: 'Scent Studio',
      country: 'USA',
      description: 'Modern artisanal perfumery',
    },
    {
      name: 'Aroma Dreams',
      country: 'UAE',
      description: 'Oriental-inspired luxury scents',
    },
    {
      name: 'Bloom Fragrances',
      country: 'UK',
      description: 'Floral and fresh perfume collections',
    },
    {
      name: 'Mystic Scents',
      country: 'India',
      description: 'Exotic Eastern fragrances',
    },
  ],
  clothing: [
    {
      name: 'Urban Style',
      country: 'USA',
      description: 'Contemporary urban fashion',
    },
    {
      name: 'Elegance Mode',
      country: 'Italy',
      description: 'Italian luxury fashion house',
    },
    {
      name: 'Comfort Fit',
      country: 'Germany',
      description: 'Quality casual wear',
    },
    {
      name: 'Trend Setters',
      country: 'UK',
      description: 'Latest fashion trends',
    },
    {
      name: 'Classic Threads',
      country: 'Japan',
      description: 'Minimalist Japanese design',
    },
  ],
  skincare: [
    {
      name: 'Skin Pure',
      country: 'Korea',
      description: 'K-beauty innovations for radiant skin',
    },
    {
      name: 'Derm Essentials',
      country: 'USA',
      description: 'Dermatologist-approved skincare',
    },
    {
      name: 'Nature Glow',
      country: 'France',
      description: 'Natural ingredients for healthy skin',
    },
    {
      name: 'Bio Care',
      country: 'Germany',
      description: 'Scientific skincare solutions',
    },
    {
      name: 'Fresh Face',
      country: 'Australia',
      description: 'Organic skincare from down under',
    },
  ],
  accessories: [
    {
      name: 'Lux Adorn',
      country: 'Italy',
      description: 'Italian luxury accessories',
    },
    {
      name: 'Urban Chic',
      country: 'USA',
      description: 'Modern statement pieces',
    },
    {
      name: 'Time Pieces',
      country: 'Switzerland',
      description: 'Precision watches and timepieces',
    },
    {
      name: 'Style Forge',
      country: 'UK',
      description: 'Handcrafted leather goods',
    },
    {
      name: 'Glam Collection',
      country: 'France',
      description: 'Elegant fashion accessories',
    },
  ],
  home: [
    {
      name: 'Living Space',
      country: 'Sweden',
      description: 'Scandinavian home design',
    },
    {
      name: 'Comfort Home',
      country: 'USA',
      description: 'Cozy and functional home goods',
    },
    {
      name: 'Modern Living',
      country: 'Germany',
      description: 'Contemporary home solutions',
    },
    {
      name: 'Artisan Home',
      country: 'Morocco',
      description: 'Handcrafted home decor',
    },
    {
      name: 'Smart Living',
      country: 'Japan',
      description: 'Innovative home organization',
    },
  ],
};

// Product name templates for each category
const PRODUCT_TEMPLATES = {
  makeup: [
    'Matte {subcategory} Pro',
    'Hydrating {subcategory} Glow',
    'Long-wear {subcategory} Studio',
    'Natural {subcategory} Pure',
    'Velvet {subcategory} Luxe',
    'Radiant {subcategory} Beam',
    'Silky {subcategory} Touch',
    'Perfect {subcategory} Finish',
  ],
  perfumes: [
    '{subcategory} Essence',
    '{subcategory} Signature',
    '{subcategory} Mystique',
    '{subcategory} Elegance',
    '{subcategory} Allure',
    '{subcategory} Bloom',
    '{subcategory} Voyage',
    '{subcategory} Whisper',
  ],
  clothing: [
    'Classic {subcategory} Fit',
    'Modern {subcategory} Style',
    'Elegant {subcategory} Design',
    'Casual {subcategory} Comfort',
    'Premium {subcategory} Collection',
    'Trendy {subcategory} Look',
    'Luxury {subcategory} Edition',
    'Essential {subcategory} Basic',
  ],
  skincare: [
    'Gentle {subcategory} Care',
    'Deep {subcategory} Treatment',
    'Daily {subcategory} Routine',
    'Advanced {subcategory} Formula',
    'Natural {subcategory} Glow',
    'Refreshing {subcategory} Splash',
    'Intensive {subcategory} Repair',
    'Pure {subcategory} Balance',
  ],
  accessories: [
    'Designer {subcategory} Collection',
    'Premium {subcategory} Edition',
    'Classic {subcategory} Style',
    'Modern {subcategory} Design',
    'Elegant {subcategory} Piece',
    'Luxury {subcategory} Accent',
    'Trendy {subcategory} Accessory',
    'Signature {subcategory} Item',
  ],
  home: [
    'Modern {subcategory} Decor',
    'Cozy {subcategory} Collection',
    'Elegant {subcategory} Design',
    'Functional {subcategory} Solution',
    'Stylish {subcategory} Accent',
    'Premium {subcategory} Piece',
    'Contemporary {subcategory} Look',
    'Classic {subcategory} Charm',
  ],
};

// Color options for variants
const COLORS = [
  { name: 'Black', code: '#000000' },
  { name: 'White', code: '#FFFFFF' },
  { name: 'Red', code: '#FF0000' },
  { name: 'Blue', code: '#0000FF' },
  { name: 'Green', code: '#008000' },
  { name: 'Pink', code: '#FFC0CB' },
  { name: 'Purple', code: '#800080' },
  { name: 'Brown', code: '#A52A2A' },
  { name: 'Gray', code: '#808080' },
  { name: 'Beige', code: '#F5F5DC' },
  { name: 'Gold', code: '#FFD700' },
  { name: 'Silver', code: '#C0C0C0' },
];

// Size options for variants
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

// Size options for perfumes/skincare (ml)
const VOLUME_SIZES = ['30ml', '50ml', '75ml', '100ml', '150ml'];

// Materials for different categories
const MATERIALS = {
  makeup: ['Synthetic', 'Natural', 'Organic', 'Mineral-based', 'Vegan'],
  perfumes: ['Alcohol-based', 'Oil-based', 'Natural', 'Synthetic'],
  clothing: ['Cotton', 'Polyester', 'Silk', 'Wool', 'Linen', 'Denim', 'Blend'],
  skincare: ['Natural', 'Organic', 'Synthetic', 'Plant-based', 'Mineral'],
  accessories: ['Leather', 'Metal', 'Fabric', 'Synthetic', 'Wood', 'Glass'],
  home: ['Wood', 'Metal', 'Glass', 'Fabric', 'Ceramic', 'Plastic', 'Stone'],
};

// Helper functions
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function generateSKU(category, subcategory, index) {
  const catCode = category.substring(0, 3).toUpperCase();
  const subCode = subcategory.substring(0, 3).toUpperCase();
  const num = String(index).padStart(4, '0');
  return `${catCode}-${subCode}-${num}`;
}

function generateImageUrl(category, subcategory, index) {
  const validImageIds = [
    '1505740420928-5e560c06d30e',
    '1523275335684-37898b6baf30',
    '1571781926293-c47d0c347e32',
    '1596462502278-27bfdd403348',
    '1618354691373-d851c5c3a990',
    '1585386959984-435d4e2b309d',
    '1595429052747-dc871a19b2b6',
    '1572560412355-9668a3b5f0b3',
    '1584917865442-892d97a0154e',
    '1560343090-f0409e927848',
  ];
  const imageId = validImageIds[index % validImageIds.length];
  return `https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&w=800&q=80`;
}

function generateProductTitle(category, subcategory) {
  const templates = PRODUCT_TEMPLATES[category];
  const template = randomChoice(templates);
  return template.replace('{subcategory}', subcategory.replace('-', ' '));
}

function generateProductDescription(category, subcategory, title) {
  const descriptions = [
    `Experience the luxury of our premium ${title}. Crafted with attention to detail and designed for the modern lifestyle.`,
    `Discover the perfect ${title} that combines quality, style, and functionality. A must-have for your collection.`,
    `Elevate your daily routine with our exquisite ${title}. Made with the finest materials and expert craftsmanship.`,
    `Our ${title} represents the perfect blend of innovation and tradition. Designed to exceed your expectations.`,
    `Indulge in the sophistication of our ${title}. A timeless piece that adds elegance to any setting.`,
  ];
  return randomChoice(descriptions);
}

function generateVariants(category, subcategory, price) {
  const variants = [];
  const config = CATEGORY_CONFIG[category];

  if (!config.hasVariants) return variants;

  const numVariants = randomInt(1, 4);

  if (category === 'clothing' || category === 'accessories') {
    // Sizes and colors
    const selectedSizes = SIZES.slice(0, randomInt(3, 6));
    const selectedColors = COLORS.slice(0, randomInt(2, 5));

    selectedSizes.forEach((size, sizeIdx) => {
      selectedColors.forEach((color, colorIdx) => {
        variants.push({
          size,
          color: color.name,
          colorCode: color.code,
          stock: randomInt(0, 50),
          price: price * randomFloat(0.9, 1.1),
          sku: generateSKU(category, subcategory, randomInt(1000, 9999)),
        });
      });
    });
  } else if (category === 'perfumes' || category === 'skincare') {
    // Volume sizes
    const selectedVolumes = VOLUME_SIZES.slice(0, randomInt(2, 4));

    selectedVolumes.forEach((volume, idx) => {
      const volumeNum = parseInt(volume);
      const priceMultiplier = 0.5 + idx * 0.3;
      variants.push({
        size: volume,
        stock: randomInt(0, 30),
        price: price * priceMultiplier,
        sku: generateSKU(category, subcategory, randomInt(1000, 9999)),
      });
    });
  } else if (category === 'makeup') {
    // Colors only
    const selectedColors = COLORS.slice(0, randomInt(3, 6));

    selectedColors.forEach((color, idx) => {
      variants.push({
        color: color.name,
        colorCode: color.code,
        stock: randomInt(0, 40),
        price: price,
        sku: generateSKU(category, subcategory, randomInt(1000, 9999)),
      });
    });
  } else if (category === 'home') {
    // Colors and sometimes sizes
    const selectedColors = COLORS.slice(0, randomInt(2, 4));

    selectedColors.forEach((color, idx) => {
      variants.push({
        color: color.name,
        colorCode: color.code,
        stock: randomInt(0, 20),
        price: price * randomFloat(0.95, 1.15),
        sku: generateSKU(category, subcategory, randomInt(1000, 9999)),
      });
    });
  }

  return variants.slice(0, numVariants);
}

function generateDimensions(weight) {
  const base = Math.cbrt(weight) * 10;
  return {
    length: parseFloat((base * randomFloat(0.8, 1.2)).toFixed(1)),
    width: parseFloat((base * randomFloat(0.7, 1.1)).toFixed(1)),
    height: parseFloat((base * randomFloat(0.6, 1.0)).toFixed(1)),
  };
}

// Generate brands for a category
function generateBrandsForCategory(category, multiplier = 1) {
  const brands = [];
  const baseBrands = BRAND_DATA[category] || [];

  for (let batch = 1; batch <= multiplier; batch++) {
    baseBrands.forEach((brand, idx) => {
      const brandId = new mongoose.Types.ObjectId();
      brands.push({
        _id: brandId,
        name: batch === 1 ? brand.name : `${brand.name} ${batch}`,
        slug: generateSlug(batch === 1 ? brand.name : `${brand.name} ${batch}`),
        description: brand.description,
        logo: `https://via.placeholder.com/150?text=${encodeURIComponent(brand.name)}`,
        website: `https://www.${generateSlug(brand.name)}.com`,
        country: brand.country,
        isActive: true,
        featured: idx < 2, // First 2 brands are featured
      });
    });
  }

  return brands;
}

// Generate products for a category
function generateProductsForCategory(
  category,
  brandIds,
  productsPerBrand = 10,
) {
  const products = [];
  const config = CATEGORY_CONFIG[category];
  let productIndex = 0;

  brandIds.forEach((brandId, brandIdx) => {
    config.subcategories.forEach((subcategory) => {
      const numProducts = randomInt(
        Math.floor(productsPerBrand / 2),
        productsPerBrand,
      );

      for (let i = 0; i < numProducts; i++) {
        productIndex++;
        const price = randomFloat(config.priceRange.min, config.priceRange.max);
        const weight = randomFloat(
          config.weightRange.min,
          config.weightRange.max,
        );
        const title = generateProductTitle(category, subcategory);

        const product = {
          title: title,
          brand: brandId,
          description: generateProductDescription(category, subcategory, title),
          price: price,
          basePrice: price,
          cover: generateImageUrl(category, subcategory, productIndex),
          images: [
            generateImageUrl(category, subcategory, productIndex),
            generateImageUrl(category, subcategory, productIndex + 1000),
            generateImageUrl(category, subcategory, productIndex + 2000),
          ],
          category: category,
          subcategory: subcategory,
          variants: generateVariants(category, subcategory, price),
          material: randomChoice(MATERIALS[category]),
          weight: weight,
          dimensions: generateDimensions(weight),
          shippingInfo: {
            weight: weight,
            dimensions: generateDimensions(weight),
            requiresSpecialHandling: weight > 2.0 || category === 'home',
          },
          stock: randomInt(0, 100),
          sku: generateSKU(category, subcategory, productIndex),
          isActive: true,
          featured: randomInt(1, 10) === 1, // 10% chance of being featured
          averageRating: randomFloat(2.5, 5.0),
          reviewCount: randomInt(0, 500),
        };

        products.push(product);
      }
    });
  });

  return products;
}

// Main function to generate all data
function buildSeedData(productsPerCategory = 50) {
  const brands = [];
  const products = [];
  const brandMap = {}; // Map category to array of brand IDs

  // Generate brands for each category
  Object.keys(CATEGORY_CONFIG).forEach((category) => {
    const categoryBrands = generateBrandsForCategory(category, 1);
    brands.push(...categoryBrands);
    brandMap[category] = categoryBrands.map((b) => b._id);
  });

  // Generate products for each category
  Object.keys(CATEGORY_CONFIG).forEach((category) => {
    const brandIds = brandMap[category];
    const categoryProducts = generateProductsForCategory(
      category,
      brandIds,
      Math.ceil(productsPerCategory / brandIds.length),
    );
    products.push(...categoryProducts);
  });

  return { brands, products };
}

// Export function
module.exports = { buildSeedData, CATEGORY_CONFIG };
