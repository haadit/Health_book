const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Pose = require('../models/Pose');

// Get all poses
router.get('/', async (req, res) => {
  try {
    const poses = await Pose.find();
    res.json(poses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching poses' });
  }
});

// Get single pose
router.get('/:id', async (req, res) => {
  try {
    const pose = await Pose.findById(req.params.id);
    if (!pose) {
      return res.status(404).json({ message: 'Pose not found' });
    }
    res.json(pose);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching pose' });
  }
});

// Create new pose (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, difficulty, benefits, instructions, imageUrl, keyPoints } = req.body;
    
    const pose = new Pose({
      name,
      description,
      difficulty,
      benefits,
      instructions,
      imageUrl,
      keyPoints
    });
    
    await pose.save();
    res.status(201).json(pose);
  } catch (err) {
    res.status(500).json({ message: 'Error creating pose' });
  }
});

// Update pose (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const pose = await Pose.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!pose) {
      return res.status(404).json({ message: 'Pose not found' });
    }
    
    res.json(pose);
  } catch (err) {
    res.status(500).json({ message: 'Error updating pose' });
  }
});

// Delete pose (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const pose = await Pose.findByIdAndDelete(req.params.id);
    if (!pose) {
      return res.status(404).json({ message: 'Pose not found' });
    }
    res.json({ message: 'Pose deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting pose' });
  }
});

module.exports = router; 