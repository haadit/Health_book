const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pose: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pose',
    required: true
  },
  accuracy: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  feedback: [String]
});

module.exports = mongoose.model('Progress', progressSchema); 