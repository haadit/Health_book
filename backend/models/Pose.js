const mongoose = require('mongoose');

const poseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  benefits: [String],
  instructions: [String],
  imageUrl: String,
  keyPoints: [{
    x: Number,
    y: Number,
    part: String
  }]
});

module.exports = mongoose.model('Pose', poseSchema); 