const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  console.log('Middleware protect called');
  console.log('Received request:', req.headers);
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);
      // Get user from the token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Not authorized, token failed'
      });
    }
  }

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Not authorized, no token provided'
    });
  }
};

module.exports = { protect };