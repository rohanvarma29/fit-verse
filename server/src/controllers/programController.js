const Program = require('../models/programModel');
const { validationResult } = require('express-validator');

// @desc    Create a new program
// @route   POST /api/programs
// @access  Private
const createProgram = async (req, res, next) => {
  try {
    const { programDescription, programDuration, programPrice, programHighlights, faqs } = req.body;

    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg,
      });
    }

    // Create a new program
    const program = await Program.create({
      expert: req.user._id,
      programDescription,
      programDuration,
      programPrice,
      programHighlights,
      faqs,
    });

    res.status(201).json({
      success: true,
      data: program,
      message: 'Program created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a program by ID
// @route   GET /api/programs/:id
// @access  Public
const getProgramById = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id).populate('expert', 'firstName lastName email');

    if (!program) {
      return res.status(404).json({
        success: false,
        error: 'Program not found',
      });
    }

    res.status(200).json({
      success: true,
      data: program,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a program
// @route   PUT /api/programs/:id
// @access  Private
const updateProgram = async (req, res, next) => {
  try {
    const { programDescription, programDuration, programPrice, programHighlights, faqs } = req.body;

    const program = await Program.findById(req.params.id);

    if (!program) {
      return res.status(404).json({
        success: false,
        error: 'Program not found',
      });
    }

    // Ensure the logged-in user is the program's expert
    if (program.expert.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this program',
      });
    }

    // Update fields
    program.programDescription = programDescription || program.programDescription;
    program.programDuration = programDuration || program.programDuration;
    program.programPrice = programPrice || program.programPrice;
    program.programHighlights = programHighlights || program.programHighlights;
    program.faqs = faqs || program.faqs;

    const updatedProgram = await program.save();

    res.status(200).json({
      success: true,
      data: updatedProgram,
      message: 'Program updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a program
// @route   DELETE /api/programs/:id
// @access  Private
const deleteProgram = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id);

    if (!program) {
      return res.status(404).json({
        success: false,
        error: 'Program not found',
      });
    }

    // Ensure the logged-in user is the program's expert
    if (program.expert.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this program',
      });
    }

    await program.remove();

    res.status(200).json({
      success: true,
      message: 'Program deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProgram,
  getProgramById,
  updateProgram,
  deleteProgram,
};
