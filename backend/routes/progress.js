const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Progress = require('../models/Progress');

// Get user's progress history
router.get('/', auth, async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.userId })
      .populate('pose', 'name difficulty')
      .sort('-date');
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching progress history' });
  }
});

// Get progress for specific pose
router.get('/pose/:poseId', auth, async (req, res) => {
  try {
    const progress = await Progress.find({
      user: req.userId,
      pose: req.params.poseId
    }).sort('-date');
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching pose progress' });
  }
});

// Record new progress
router.post('/', auth, async (req, res) => {
  try {
    const { pose, accuracy, feedback } = req.body;
    
    const progress = new Progress({
      user: req.userId,
      pose,
      accuracy,
      feedback
    });
    
    await progress.save();
    res.status(201).json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Error recording progress' });
  }
});

// Get progress statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await Progress.aggregate([
      { $match: { user: req.userId } },
      { 
        $group: {
          _id: '$pose',
          averageAccuracy: { $avg: '$accuracy' },
          attempts: { $sum: 1 },
          lastAttempt: { $max: '$date' }
        }
      },
      {
        $lookup: {
          from: 'poses',
          localField: '_id',
          foreignField: '_id',
          as: 'poseDetails'
        }
      },
      { $unwind: '$poseDetails' }
    ]);
    
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching progress statistics' });
  }
});

module.exports = router; 