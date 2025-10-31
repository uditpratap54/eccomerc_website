const express = require('express');
const router = express.Router();
const City = require('../models/City');

function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  req.session.flash = { type: 'error', message: 'Please login to add a city' };
  res.redirect('/login');
}

router.get('/new', requireAuth, (req, res) => {
  res.render('cities/new', {});
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      req.session.flash = { type: 'error', message: 'City name is required' };
      return res.redirect('/cities/new');
    }
    const exists = await City.findOne({ name: name.trim() });
    if (exists) {
      req.session.flash = { type: 'error', message: 'City already exists' };
      return res.redirect('/cities/new');
    }
    await City.create({ name: name.trim() });
    req.session.flash = { type: 'success', message: 'City added successfully' };
    res.redirect('/');
  } catch (err) {
    console.error('Add city error:', err.message);
    req.session.flash = { type: 'error', message: 'Failed to add city' };
    res.redirect('/cities/new');
  }
});

module.exports = router;