// Load .env only in development (never in production on Render)
// Don't load dotenv on Render even if NODE_ENV accidentally set to development
if (process.env.NODE_ENV === 'development' && !process.env.RENDER_EXTERNAL_URL) {
  require('dotenv').config();
}
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;
const IS_RENDER = !!process.env.RENDER_EXTERNAL_URL;
const NODE_ENV = process.env.NODE_ENV || (IS_RENDER ? 'production' : 'development');
const IS_PROD = NODE_ENV === 'production' || IS_RENDER;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      frameSrc: ["'self'", "https://www.google.com"]
    }
  }
}));

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS ? 
  process.env.ALLOWED_ORIGINS.split(',') : 
  ['http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', limiter);

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
// Session configuration with MongoDB store
// Enforce MongoDB URI for session store; no localhost fallback in production
if (IS_PROD && !process.env.MONGODB_URI) {
  throw new Error('SESSION_STORE requires MONGODB_URI in production. Set it in Render Environment Variables.');
}

app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGODB_URI,
    touchAfter: 24 * 3600 // lazy session update
  }),
  cookie: { 
    secure: NODE_ENV === 'production', // HTTPS only in production
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    sameSite: 'strict'
  }
}));

// expose user to views
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.flash = req.session.flash || null;
  if (req.session.flash) delete req.session.flash;
  next();
});

// Models
const Shop = require('./models/Shop');
const Product = require('./models/Product');

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { sanitizeInput } = require('./middleware/validation');

// Apply input sanitization globally
app.use(sanitizeInput);

// Routes
const shopRoutes = require('./routes/shops');
const productRoutes = require('./routes/products');

app.use('/', require('./routes/index'));
app.use('/search', require('./routes/search'));
app.use('/shops', shopRoutes);
app.use('/products', productRoutes);
app.use('/', require('./routes/auth'));
app.use('/cities', require('./routes/cities'));

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// MongoDB connection
// Using mongoUrl computed above; no localhost fallback in production

// MongoDB connection with error handling
const connectDB = async () => {
  try {
    if (IS_PROD && !mongoUrl) {
      throw new Error('MONGODB_URI is not set in production. Configure it in Render Environment Variables.');
    }
    if (!IS_PROD && !mongoUrl) {
      console.warn('MONGODB_URI not set. Using local mongodb://127.0.0.1:27017/citydirectory');
      mongoUrl = 'mongodb://127.0.0.1:27017/citydirectory';
    }
    const conn = await mongoose.connect(mongoUrl);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    if (IS_PROD) {
      process.exit(1);
    }
  }
};

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});

async function initializeApp() {
  try {
    if (!process.env.MONGODB_URI && !IS_PROD) {
      console.warn('MONGODB_URI not set. Using local mongodb://127.0.0.1:27017/citydirectory');
    }
    if (IS_PROD && !process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI missing in production. Set it in Render before starting.');
    }
    await connectDB();
    console.log('✅ Application initialized successfully');
  } catch (err) {
    console.error('❌ Application initialization error:', err.message);
    if (NODE_ENV === 'production') {
      process.exit(1);
    }
  }
}

initializeApp().then(() => {
  // Start server
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${NODE_ENV}`);
  });

  // Handle server errors
  server.on('error', (error) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    switch (error.code) {
      case 'EACCES':
        console.error(`Port ${PORT} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`Port ${PORT} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  });
}).catch((error) => {
  console.error('❌ Failed to start server:', error.message);
  process.exit(1);
});