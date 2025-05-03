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

// Serve static files from the public directory
app.use('/images', express.static('public/images'));
console.log('Serving static files from public/images at /images');

// CORS configuration
app.use(cors({
  origin: (process.env.CORS_ORIGIN || 'http://localhost:8080'), // Allow all origins or specify your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000), // Default: 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || 100), // Default: limit each IP to 100 requests per windowMs
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