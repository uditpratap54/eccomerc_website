const express = require('express');
const router = express.Router();
const Shop = require('../models/Shop');
const Product = require('../models/Product');

router.get('/:id', async (req, res) => {
  try {
    const shop = await Shop.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!shop) return res.status(404).send('Shop not found');
    const products = await Product.find({ shop: shop._id });
    res.render('shopShow', { shop, products });
  } catch (err) {
    console.error('Shop page error:', err.message);
    res.status(500).send('Error loading shop');
  }
});

module.exports = router;