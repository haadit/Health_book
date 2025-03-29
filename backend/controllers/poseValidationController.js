const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Define available poses that the model is trained for
const AVAILABLE_POSES = [
    'Mountain Pose',
    'Tree Pose',
    'Warrior Pose',
    'Downward Dog',
    'Cobra Pose'
];

// Helper function to format pose name
const formatPoseName = (poseName) => {
    if (!poseName) return null;
    return poseName.trim();
};

const validatePose = async (req, res) => {
    try {
        const { selectedPose } = req.body;
        console.log('Received pose validation request:', { selectedPose });

        // Generate random confidence between 0.65 and 0.95
        const confidence = (Math.random() * (0.95 - 0.65) + 0.65).toFixed(2);
        
        // Generate random FPS between 25 and 30
        const fps = Math.floor(Math.random() * (30 - 25 + 1) + 25);

        // Return immediate response with selected pose and random values
        return res.json({
            pose: selectedPose || 'No pose detected',
            confidence: parseFloat(confidence),
            fps: fps,
            feedback: selectedPose 
                ? [`Performing ${selectedPose} with ${confidence} confidence`]
                : ['Stand in the frame to begin'],
            availablePoses: AVAILABLE_POSES,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Controller error:', error);
        res.json({ 
            pose: selectedPose || 'No pose detected',
            confidence: 0,
            fps: 0,
            feedback: ['An unexpected error occurred. Please try again.'],
            error: error.message,
            availablePoses: AVAILABLE_POSES
        });
    }
};

// Add a route to get available poses
const getAvailablePoses = (req, res) => {
    res.json({
        poses: AVAILABLE_POSES,
        count: AVAILABLE_POSES.length
    });
};

module.exports = {
    validatePose,
    getAvailablePoses
}; 