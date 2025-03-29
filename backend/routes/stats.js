const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Progress = require('../models/Progress');
const Pose = require('../models/Pose');

// Get user dashboard stats
router.get('/dashboard', auth, async (req, res) => {
  try {
    const userId = req.userId;

    // Get total sessions
    const totalSessions = await Progress.countDocuments({ user: userId });

    // Get average accuracy across all sessions
    const accuracyResult = await Progress.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, averageAccuracy: { $avg: '$accuracy' } } }
    ]);
    const averageAccuracy = accuracyResult[0]?.averageAccuracy || 0;

    // Get recent poses (last 5)
    const recentPoses = await Progress.aggregate([
      { $match: { user: userId } },
      { $sort: { date: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'poses',
          localField: 'pose',
          foreignField: '_id',
          as: 'poseDetails'
        }
      },
      { $unwind: '$poseDetails' },
      {
        $project: {
          name: '$poseDetails.name',
          accuracy: '$accuracy',
          date: '$date'
        }
      }
    ]);

    // Get weekly progress (last 7 days)
    const weeklyProgress = await Progress.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          accuracy: { $avg: '$accuracy' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Get pose-wise accuracies
    const poseAccuracies = await Progress.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$pose',
          accuracy: { $avg: '$accuracy' }
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
      { $unwind: '$poseDetails' },
      {
        $project: {
          name: '$poseDetails.name',
          accuracy: 1
        }
      }
    ]);

    // Format weekly progress for the last 7 days
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const formattedWeeklyProgress = last7Days.map(date => {
      const progressEntry = weeklyProgress.find(entry => entry._id === date);
      return progressEntry ? Math.round(progressEntry.accuracy) : 0;
    });

    res.json({
      totalSessions,
      averageAccuracy: Math.round(averageAccuracy),
      recentPoses: recentPoses.map(pose => ({
        ...pose,
        accuracy: Math.round(pose.accuracy),
        date: pose.date.toISOString().split('T')[0]
      })),
      weeklyProgress: formattedWeeklyProgress,
      poseAccuracies: Object.fromEntries(
        poseAccuracies.map(({ name, accuracy }) => [name, Math.round(accuracy)])
      )
    });

  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ message: 'Error fetching dashboard statistics' });
  }
});

module.exports = router; 