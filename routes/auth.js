const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Helpers
function requireGuest(req, res, next) {
  if (req.session && req.session.user) return res.redirect('/');
  next();
}
function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  res.redirect('/login?error=Please+login');
}

// Register
router.get('/register', requireGuest, (req, res) => {
  res.render('auth/register', { error: req.query.error || '', values: {} });
});

router.post('/register', requireGuest, async (req, res) => {
  try {
    const { name, email, password, confirm } = req.body;
    if (!name || !email || !password || !confirm) {
      req.session.flash = { type: 'error', message: 'All fields are required' };
      return res.redirect('/register');
    }
    if (password !== confirm) {
      req.session.flash = { type: 'error', message: 'Passwords do not match' };
      return res.redirect('/register');
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      req.session.flash = { type: 'error', message: 'Email already registered' };
      return res.redirect('/register');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: email.toLowerCase(), passwordHash });
    req.session.user = { id: user._id, name: user.name, email: user.email };
    req.session.flash = { type: 'success', message: 'Registered and logged in' };
    res.redirect('/');
  } catch (err) {
    console.error('Register error:', err.message);
    req.session.flash = { type: 'error', message: 'Registration failed' };
    res.redirect('/register');
  }
});

// Login
router.get('/login', requireGuest, (req, res) => {
  res.render('auth/login', { error: req.query.error || '', values: {} });
});

router.post('/login', requireGuest, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      req.session.flash = { type: 'error', message: 'Email and password required' };
      return res.redirect('/login');
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      req.session.flash = { type: 'error', message: 'Invalid credentials' };
      return res.redirect('/login');
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      req.session.flash = { type: 'error', message: 'Invalid credentials' };
      return res.redirect('/login');
    }
    req.session.user = { id: user._id, name: user.name, email: user.email };
    req.session.flash = { type: 'success', message: 'Logged in successfully' };
    res.redirect('/');
  } catch (err) {
    console.error('Login error:', err.message);
    req.session.flash = { type: 'error', message: 'Login failed' };
    res.redirect('/login');
  }
});

// Logout
router.get('/logout', requireAuth, (req, res) => {
  req.session.destroy(() => {
    // recreate minimal session to show flash on next request
    // express-session recreates automatically on new request
    res.redirect('/');
  });
});

// Account page (protected)
router.get('/account', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id).lean();
    res.render('auth/account', { user });
  } catch (err) {
    console.error('Account error:', err.message);
    res.redirect('/');
  }
});

module.exports = router;