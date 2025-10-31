# City Directory - Full Stack Application

A comprehensive city directory application for finding local shops and products across Indian cities. Built with Node.js, Express, MongoDB, and EJS templating.

## 🚀 Features

- **City-wise Shop Directory**: Browse shops by city with interactive maps
- **Product Search**: Find products across different categories
- **Responsive Design**: Mobile and desktop optimized interface
- **Interactive Maps**: Google Maps integration for shop locations
- **Real-time Search**: Dynamic filtering and search capabilities
- **Production Ready**: Security, validation, and error handling

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: EJS templating, Vanilla JavaScript
- **Styling**: CSS3 with responsive design
- **Security**: Helmet, CORS, Rate limiting
- **Session Management**: MongoDB session store

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd city-directory-fullstack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/citydirectory
   SESSION_SECRET=your_secure_session_secret
   PORT=3000
   NODE_ENV=development
   ```

4. **Seed the database**
   ```bash
   npm run seed
   ```

5. **Start the application**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 🌐 Deployment

### Heroku Deployment

1. **Create Heroku app**
   ```bash
   heroku create your-app-name
   ```

2. **Set environment variables**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_atlas_uri
   heroku config:set SESSION_SECRET=your_session_secret
   heroku config:set NODE_ENV=production
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Set environment variables** in Vercel dashboard

### Railway Deployment

1. **Connect GitHub repository** to Railway
2. **Set environment variables** in Railway dashboard
3. **Deploy automatically** on git push

## 📊 Database Schema

### Shop Model
- Name, city, address, contact details
- Location coordinates for maps
- Categories and images
- Opening hours

### Product Model
- Name, description, category, price
- Associated shop reference
- Stock status and SKU

### City Model
- City names for dropdown population

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API request throttling
- **Input Validation**: Data sanitization
- **Session Security**: Secure cookie configuration
- **Error Handling**: Comprehensive error management

## 🎯 API Endpoints

- `GET /` - Homepage with city directory
- `GET /search` - Search shops and products
- `GET /shops/:id` - Shop details
- `GET /products/:id` - Product details
- `GET /cities` - Available cities list

## 🧪 Development

```bash
# Install dev dependencies
npm install

# Run in development mode
npm run dev

# Seed database with sample data
npm run seed

# Build for production
npm run build
```

## 📱 Features Overview

### Homepage
- India map integration
- Quick search functionality
- City-wise navigation
- Featured shops display

### Search Page
- Dynamic city map updates
- Category filtering
- Real-time search results
- Responsive grid layout

### Shop Details
- Contact information
- Location on map
- Product listings
- WhatsApp integration

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Maps API for location services
- MongoDB Atlas for cloud database
- Unsplash for sample images
- Express.js community for excellent documentation

## 📞 Support

For support, email support@citydirectory.com or create an issue in the repository.

---

**Made with ❤️ for local businesses across India**