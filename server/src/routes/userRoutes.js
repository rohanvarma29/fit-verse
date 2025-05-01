const express = require('express');
const { check } = require('express-validator');
const { registerUser, loginUser, updateAvailability, getUserById, logoutUser, updateUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Register User
router.post(
  '/register',
  upload.single('profilePhoto'),
  [
    check('firstName', 'First name is required').notEmpty(),
    check('lastName', 'Last name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 8 characters long').isLength({ min: 8 })
  ],
  registerUser
);

// Login User
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  loginUser
);

// Update Availability
router.patch('/availability', protect, updateAvailability);

// Get User by ID
router.get('/:id', protect, getUserById);

// Logout User
router.post('/logout', logoutUser);

// Update User
router.post('/update', protect, upload.single('profilePhoto'), updateUser);

module.exports = router;

