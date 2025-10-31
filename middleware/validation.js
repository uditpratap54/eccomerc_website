const validator = require('validator');

// Validation middleware for shop creation/update
const validateShop = (req, res, next) => {
  const { name, city, address, phone, whatsapp } = req.body;
  const errors = [];

  // Name validation
  if (!name || name.trim().length < 2) {
    errors.push('Shop name must be at least 2 characters long');
  }
  if (name && name.length > 100) {
    errors.push('Shop name cannot exceed 100 characters');
  }

  // City validation
  if (!city || city.trim().length < 2) {
    errors.push('City name is required and must be at least 2 characters');
  }

  // Address validation
  if (!address || address.trim().length < 10) {
    errors.push('Address must be at least 10 characters long');
  }
  if (address && address.length > 200) {
    errors.push('Address cannot exceed 200 characters');
  }

  // Phone validation
  if (!phone) {
    errors.push('Phone number is required');
  } else if (!validator.isMobilePhone(phone, 'en-IN')) {
    errors.push('Please provide a valid Indian phone number');
  }

  // WhatsApp validation (optional)
  if (whatsapp && !validator.isMobilePhone(whatsapp, 'en-IN')) {
    errors.push('Please provide a valid WhatsApp number');
  }

  // Email validation (if provided)
  if (req.body.email && !validator.isEmail(req.body.email)) {
    errors.push('Please provide a valid email address');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  next();
};

// Validation middleware for product creation/update
const validateProduct = (req, res, next) => {
  const { name, description, category, price } = req.body;
  const errors = [];

  // Name validation
  if (!name || name.trim().length < 2) {
    errors.push('Product name must be at least 2 characters long');
  }
  if (name && name.length > 100) {
    errors.push('Product name cannot exceed 100 characters');
  }

  // Description validation
  if (description && description.length > 500) {
    errors.push('Description cannot exceed 500 characters');
  }

  // Category validation
  const validCategories = ['kirana', 'snacks', 'beverages', 'toiletries', 'household', 'dairy', 'general'];
  if (!category || !validCategories.includes(category)) {
    errors.push(`Category must be one of: ${validCategories.join(', ')}`);
  }

  // Price validation
  if (!price || isNaN(price) || price < 0) {
    errors.push('Price must be a valid positive number');
  }
  if (price && price > 100000) {
    errors.push('Price cannot exceed ₹1,00,000');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  next();
};

// Search query validation
const validateSearch = (req, res, next) => {
  const { query, city, category } = req.query;
  const errors = [];

  // Query validation (if provided)
  if (query && query.length > 100) {
    errors.push('Search query cannot exceed 100 characters');
  }

  // City validation (if provided)
  if (city && city.length > 50) {
    errors.push('City name cannot exceed 50 characters');
  }

  // Category validation (if provided)
  const validCategories = ['kirana', 'snacks', 'beverages', 'toiletries', 'household', 'dairy', 'general'];
  if (category && !validCategories.includes(category)) {
    errors.push(`Category must be one of: ${validCategories.join(', ')}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid search parameters',
      errors: errors
    });
  }

  next();
};

// Sanitize input data
const sanitizeInput = (req, res, next) => {
  // Ensure req.body is an object to avoid undefined access on GET requests
  if (!req.body || typeof req.body !== 'object') {
    req.body = {};
  }

  // Sanitize string fields in body
  const stringFields = ['name', 'city', 'address', 'phone', 'whatsapp', 'email', 'description', 'category'];

  stringFields.forEach((field) => {
    if (typeof req.body?.[field] === 'string') {
      req.body[field] = validator.escape(req.body[field].trim());
    }
  });

  // Sanitize query parameters
  if (typeof req.query?.query === 'string') {
    req.query.query = validator.escape(req.query.query.trim());
  }
  if (typeof req.query?.city === 'string') {
    req.query.city = validator.escape(req.query.city.trim());
  }
  if (typeof req.query?.category === 'string') {
    req.query.category = validator.escape(req.query.category.trim());
  }

  next();
};

module.exports = {
  validateShop,
  validateProduct,
  validateSearch,
  sanitizeInput
};