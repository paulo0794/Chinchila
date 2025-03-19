const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/categories', categoriesRoutes);
app.use('/api/products', productsRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Product CRUD API',
    endpoints: {
      categories: '/api/categories',
      products: '/api/products'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
