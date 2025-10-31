const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Shop = require('../models/Shop');

router.get('/', async (req, res) => {
  try {
    const q = req.query.q || '';
    const city = req.query.city || '';
    const category = req.query.category || '';
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const sort = req.query.sort || '';

    const shopFilter = city ? { city } : {};
    const shops = await Shop.find(shopFilter).select('_id');
    const shopIds = shops.map(s => s._id);

    const query = shopIds.length ? { shop: { $in: shopIds } } : {};
    if (q) query.$text = { $search: q };
    if (category) query.category = category;
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }

    const sortMap = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      name_asc: { name: 1 },
      newest: { createdAt: -1 }
    };

    let productQuery = Product.find(query);
    if (q && !sort) {
      productQuery = productQuery.select({ score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } });
    } else if (sort && sortMap[sort]) {
      productQuery = productQuery.sort(sortMap[sort]);
    }

    const [products, totalCount] = await Promise.all([
      productQuery
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('shop', 'name address phone city')
        .exec(),
      Product.countDocuments(query)
    ]);
    const totalPages = Math.ceil(totalCount / limit) || 1;

    res.render('searchResults', { products, q, city, category, page, totalPages, minPrice, maxPrice, sort });
  } catch (err) {
    console.error('Search error:', err.message);
    res.status(500).send('Search failed');
  }
});

module.exports = router;