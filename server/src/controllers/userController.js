const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res, next) => {
  console.log('Received registration request:', req.body);
  console.log('Received file:', req.file);
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const {
      firstName,
      lastName,
      email,
      password,
      displayName,
      location,
      bio,
      socialMedia,
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      });
    }

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      profilePhoto: req.file ? `/images/profile-photo/${req.file.filename}` : null,
      email,
      password,
      displayName,
      location,
      bio,
      socialMedia,
    });

    if (user) {
      // Generate token
      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          token
        },
        message: 'User registered successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Invalid user data'
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res, next) => {
  console.log('Received login request:', req.body);
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      // Generate token
      const token = generateToken(user._id);
      res.json({
        success: true,
        data: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          token
        },
        message: 'Login successful'
      });
    } else {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password',
        message: 'Login failed'
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user availability
// @route   PATCH /api/users/availability
// @access  Private
const updateAvailability = async (req, res, next) => {
  try {
    const { availability } = req.body;

    // Validate availability format
    if (!availability || typeof availability !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid availability format',
      });
    }

    // Update availability for the authenticated user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { availability },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user.availability,
      message: 'Availability updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res, next) => {
  console.log('getUserById called with user:', req.user);
  console.log('Received request to get user by ID:', req.params.id);
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    console.log('User found:', user);
    res.json({
      success: true,
      data: user,
      message: 'User retrieved successfully'
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID format'
      });
    }
    next(error);
  }
};

// @desc    Logout user / clear token
// @route   POST /api/users/logout
// @access  Private
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

module.exports = {
  registerUser,
  loginUser,
  updateAvailability,
  getUserById,
  logoutUser,
};
