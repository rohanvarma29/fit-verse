const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { deleteFromCloudinary, getPublicIdFromUrl } = require('../middleware/cloudinaryMiddleware');

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
      profilePhoto: req.file ? req.file.path : null, // Cloudinary returns the URL in req.file.path
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

// @desc    Update user meet link
// @route   PATCH /api/users/availability
// @access  Private
const updateAvailability = async (req, res, next) => {
  try {
    const { meetLink } = req.body;
    console.log(meetLink)

    // Validate meetLink format
    if (!meetLink || typeof meetLink !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid meet link format',
      });
    }

    // Update meetLink for the authenticated user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { meetLink },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }
    console.log("user after upadated meetLink"+user)
    res.status(200).json({
      success: true,
      data: user.meetLink,
      message: 'Meet link updated successfully',
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

// @desc    Update user profile
// @route   PATCH /api/users/update
// @access  Private
const updateUser = async (req, res, next) => {
  console.log('updateUser called with user:', req.user);
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);
  
  try {
    const user = await User.findById(req.user._id);
    console.log('Found user:', user ? 'Yes' : 'No');

    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;
      user.displayName = req.body.displayName || user.displayName;
      user.location = req.body.location || user.location;
      user.bio = req.body.bio || user.bio;
      user.socialMedia = req.body.socialMedia || user.socialMedia;

      if (req.file) {
        // If user already has a profile photo, delete the old one from Cloudinary
        if (user.profilePhoto) {
          try {
            const publicId = getPublicIdFromUrl(user.profilePhoto);
            if (publicId) {
              await deleteFromCloudinary(publicId);
              console.log('Deleted old profile photo from Cloudinary');
            }
          } catch (error) {
            console.error('Error deleting old profile photo:', error);
            // Continue with the update even if deletion fails
          }
        }
        
        // Update with new Cloudinary URL
        user.profilePhoto = req.file.path;
        console.log('Updated profile photo:', user.profilePhoto);
      }

      const updatedUser = await user.save();
      console.log('User updated successfully');

      res.json({
        success: true,
        data: {
          _id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          displayName: updatedUser.displayName,
          profilePhoto: updatedUser.profilePhoto,
          location: updatedUser.location,
          bio: updatedUser.bio,
          socialMedia: updatedUser.socialMedia,
        },
        message: 'Profile updated successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
  } catch (error) {
    console.error('Error in updateUser:', error);
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getAllUsers = async (req, res, next) => {
  console.log('getAllUsers called');
  try {
    const users = await User.find({}).select('-password');
    
    res.json({
      success: true,
      data: users,
      message: 'Users retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateAvailability,
  getUserById,
  logoutUser,
  updateUser,
  getAllUsers,
};
