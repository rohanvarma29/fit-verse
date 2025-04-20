const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true, trim: true },
  answer: { type: String, required: true, trim: true },
});

const programSchema = new mongoose.Schema({
  expert: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  programDescription: {
    type: String,
    required: [true, 'Program description is required'],
    trim: true,
  },
  programDuration: {
    type: String,
    required: [true, 'Program duration is required'],
    trim: true,
  },
  programPrice: {
    type: String,
    required: [true, 'Program price is required'],
    trim: true,
  },
  programHighlights: {
    type: String,
    trim: true,
  },
  faqs: [faqSchema],
}, {
  timestamps: true,
});

const Program = mongoose.model('Program', programSchema);

module.exports = Program;
