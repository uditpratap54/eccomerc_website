const express = require('express');
const router = express.Router();
const Shop = require('../models/Shop');
const City = require('../models/City');

router.get('/', async (req, res) => {
  try {
    const shopCities = await Shop.distinct('city');
    const manualCities = await City.find().distinct('name');
    let cities = [...new Set([...(shopCities || []), ...(manualCities || [])])];
    if (!cities || cities.length === 0) {
      cities = ['Delhi', 'Mumbai', 'Bengaluru', 'Kolkata', 'Chennai', 'Bareilly'];
    }
    cities = cities.filter(Boolean).sort();
    res.render('index', { cities });
  } catch (err) {
    console.error('Index cities error:', err.message);
    const cities = ['Delhi', 'Mumbai', 'Bengaluru', 'Kolkata', 'Chennai', 'Bareilly'];
    res.render('index', { cities });
  }
});

module.exports = router;