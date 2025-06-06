const express = require('express');
const { check } = require('express-validator');
const {
  createProgram,
  getProgramById,
  updateProgram,
  deleteProgram,
  getProgramsByExpertId,
} = require('../controllers/programController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Create Program
router.post(
  '/',
  protect,
  [
    check('programName', 'Program name is required').notEmpty(),
    check('programDescription', 'Program description is required').notEmpty(),
    check('programDuration', 'Program duration is required').notEmpty(),
    check('programPrice', 'Program price is required').notEmpty(),
  ],
  createProgram
);

// Get Programs by Expert ID
router.get('/expert/:id', getProgramsByExpertId);

// Get Program by ID
router.get('/:id', getProgramById);

// Update Program
router.put('/:id', protect, updateProgram);

// Delete Program
router.delete('/:id', protect, deleteProgram);

module.exports = router;
