const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('shop', 'name address phone city location');

    if (!product) return res.status(404).send('Product not found');

    res.render('productShow', { product });
  } catch (err) {
    console.error('Product page error:', err.message);
    res.status(500).send('Error loading product');
  }
});

module.exports = router;