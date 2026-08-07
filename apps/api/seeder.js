const { Product } = require('./models/Product');
const { Brand } = require('./models/Brand');
const { Coupon } = require('./models/Coupon');
const { buildSeedData } = require('./data');
const { connectToDB } = require('./config/db');
require('dotenv').config();

const coupons = [
  {
    code: 'SUMMER20',
    discountType: 'percentage',
    discountValue: 20,
    expirationDate: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    usageLimit: 100,
    usedCount: 0,
    minimumOrderAmount: 10,
    isActive: true,
    description: 'Summer sale - 20% off all products',
  },
  {
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    expirationDate: new Date(
      Date.now() + 90 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    usageLimit: null,
    usedCount: 0,
    minimumOrderAmount: 0,
    isActive: true,
    description: 'Welcome discount for new customers',
  },
  {
    code: 'FIXED5',
    discountType: 'fixed',
    discountValue: 5,
    expirationDate: new Date(
      Date.now() + 60 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    usageLimit: 50,
    usedCount: 0,
    minimumOrderAmount: 15,
    isActive: true,
    description: '$5 off orders over $15',
  },
  {
    code: 'BIGSALE30',
    discountType: 'percentage',
    discountValue: 30,
    expirationDate: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    usageLimit: 20,
    usedCount: 0,
    minimumOrderAmount: 50,
    isActive: true,
    description: 'Big sale - 30% off orders over $50',
  },
  {
    code: 'EXPIRED20',
    discountType: 'percentage',
    discountValue: 20,
    expirationDate: new Date(
      Date.now() - 10 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    usageLimit: 100,
    usedCount: 0,
    minimumOrderAmount: 10,
    isActive: true,
    description: 'Expired coupon for testing',
  },
  {
    code: 'LIMITED5',
    discountType: 'fixed',
    discountValue: 10,
    expirationDate: new Date(
      Date.now() + 180 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    usageLimit: 5,
    usedCount: 3,
    minimumOrderAmount: 20,
    isActive: true,
    description: 'Limited use coupon - only 2 uses left',
  },
];

// Import Products, Brands & Coupons
const importData = async () => {
  try {
    await connectToDB();

    // Get products per category from command line argument or default to 50
    const productsPerCategory = parseInt(process.argv[3]) || 50;

    console.log('🗑️  Clearing existing data...');
    await Brand.deleteMany({});
    await Product.deleteMany({});
    await Coupon.deleteMany({});

    console.log('📦 Generating new data...');
    const { brands, products } = buildSeedData(productsPerCategory);

    console.log(`🏢 Inserting ${brands.length} brands...`);
    await Brand.insertMany(brands);

    console.log(`🛍️  Inserting ${products.length} products...`);
    await Product.insertMany(products);

    console.log(`🎫 Inserting ${coupons.length} coupons...`);
    await Coupon.insertMany(coupons);

    console.log('✅ Data imported successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Brands: ${brands.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Coupons: ${coupons.length}`);
    console.log(`   - Products per category: ~${productsPerCategory}`);

    process.exit();
  } catch (error) {
    console.log('❌ Error:', error);
    process.exit(1);
  }
};

// Remove Products, Brands & Coupons
const removeData = async () => {
  try {
    await connectToDB();
    console.log('🗑️  Removing data...');
    await Product.deleteMany({});
    await Brand.deleteMany({});
    await Coupon.deleteMany({});
    console.log('✅ Data removed successfully!');
    process.exit();
  } catch (error) {
    console.log('❌ Error:', error);
    process.exit(1);
  }
};

// Display usage information
const showUsage = () => {
  console.log('📖 Seeder Usage:');
  console.log('');
  console.log('  Import data:');
  console.log('    node seeder.js -import [productsPerCategory]');
  console.log('    Example: node seeder.js -import 50');
  console.log('    Default: 50 products per category');
  console.log('');
  console.log('  Remove data:');
  console.log('    node seeder.js -remove');
  console.log('');
  console.log('  Show this help:');
  console.log('    node seeder.js -help');
  console.log('');
  process.exit();
};

if (process.argv[2] === '-import') {
  importData();
} else if (process.argv[2] === '-remove') {
  removeData();
} else if (process.argv[2] === '-help' || !process.argv[2]) {
  showUsage();
}
