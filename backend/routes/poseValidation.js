const express = require('express');
const router = express.Router();
const { validatePose, getAvailablePoses } = require('../controllers/poseValidationController');

// Route for pose validation
router.post('/validate', validatePose);

// Route to get available poses
router.get('/available-poses', getAvailablePoses);

module.exports = router; 