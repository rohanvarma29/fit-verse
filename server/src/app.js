const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const userRoutes = require('./routes/userRoutes');
const programRoutes = require('./routes/programRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:8080',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests, please try again later.'
  }
});

// Apply rate limiting to auth routes
app.use('/api/users', limiter);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/programs', programRoutes);

// Basic route for API testing
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    data: null
  });
});

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;