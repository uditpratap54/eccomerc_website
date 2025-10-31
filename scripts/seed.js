require('dotenv').config();
const mongoose = require('mongoose');
const Shop = require('../models/Shop');
const Product = require('../models/Product');
const City = require('../models/City');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/citydirectory';

const sampleShops = [
  {
    name: 'Gupta General Store',
    city: 'Delhi',
    address: '123, Main Bazaar, Karol Bagh',
    phone: '+911234567890',
    whatsapp: '+911234567890',
    location: { type: 'Point', coordinates: [77.1900, 28.6500] },
    categories: ['kirana', 'general'],
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600'],
    openingHours: 'Mon-Sun 9:00 AM - 9:00 PM'
  },
  {
    name: 'Mumbai Kirana Mart',
    city: 'Mumbai',
    address: '456, SV Road, Bandra West',
    phone: '+912234567890',
    whatsapp: '+912234567890',
    location: { type: 'Point', coordinates: [72.8400, 19.0600] },
    categories: ['kirana', 'snacks'],
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600'],
    openingHours: 'Mon-Sun 8:00 AM - 10:00 PM'
  },
  {
    name: 'Bareilly Super Store',
    city: 'Bareilly',
    address: '789, Civil Lines, Near Railway Station',
    phone: '+915812345678',
    whatsapp: '+915812345678',
    location: { type: 'Point', coordinates: [79.4304, 28.3670] },
    categories: ['kirana', 'household', 'toiletries'],
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600'],
    openingHours: 'Mon-Sun 7:00 AM - 11:00 PM'
  },
  {
    name: 'Bengaluru Tech Store',
    city: 'Bengaluru',
    address: '321, MG Road, Brigade Road',
    phone: '+918012345678',
    whatsapp: '+918012345678',
    location: { type: 'Point', coordinates: [77.5946, 12.9716] },
    categories: ['general', 'beverages'],
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600'],
    openingHours: 'Mon-Sun 9:00 AM - 9:30 PM'
  }
];

const sampleProducts = [
  { name: 'Aashirvaad Atta 5kg', description: 'Whole wheat flour, 5kg pack', category: 'kirana', price: 220, image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300', sku: 'ATT5KG', inStock: true },
  { name: 'Parle-G Biscuit 800g', description: 'Classic Parle-G value pack', category: 'snacks', price: 75, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300', sku: 'PG800', inStock: true },
  { name: 'Tata Salt 1kg', description: 'Iodized salt, 1kg pack', category: 'kirana', price: 25, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300', sku: 'SALT1KG', inStock: true },
  { name: 'Maggi Noodles 12-pack', description: '2-minute noodles variety pack', category: 'snacks', price: 144, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300', sku: 'MAG12', inStock: true },
  { name: 'Colgate Toothpaste 200g', description: 'Total advanced health toothpaste', category: 'toiletries', price: 85, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300', sku: 'COL200', inStock: true },
  { name: 'Coca Cola 2L', description: 'Refreshing cola drink, 2 liter bottle', category: 'beverages', price: 90, image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=300', sku: 'COKE2L', inStock: true },
  { name: 'Surf Excel 1kg', description: 'Matic front load detergent powder', category: 'household', price: 180, image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300', sku: 'SURF1KG', inStock: true },
  { name: 'Amul Milk 1L', description: 'Full cream fresh milk, 1 liter', category: 'dairy', price: 60, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300', sku: 'MILK1L', inStock: true }
];

const sampleCities = [
  { name: 'Delhi' },
  { name: 'Mumbai' },
  { name: 'Bengaluru' },
  { name: 'Kolkata' },
  { name: 'Chennai' },
  { name: 'Bareilly' },
  { name: 'Pune' },
  { name: 'Hyderabad' }
];

async function seedDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Shop.deleteMany({});
    await Product.deleteMany({});
    await City.deleteMany({});

    // Seed cities
    console.log('🏙️ Seeding cities...');
    await City.insertMany(sampleCities);

    // Seed shops
    console.log('🏪 Seeding shops...');
    const createdShops = await Shop.insertMany(sampleShops);

    // Seed products (assign to shops)
    console.log('📦 Seeding products...');
    const productsWithShops = [];
    
    sampleProducts.forEach((product, index) => {
      const shopIndex = index % createdShops.length;
      productsWithShops.push({
        ...product,
        shop: createdShops[shopIndex]._id
      });
    });

    await Product.insertMany(productsWithShops);

    console.log('✅ Database seeded successfully!');
    console.log(`📊 Created: ${createdShops.length} shops, ${productsWithShops.length} products, ${sampleCities.length} cities`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };