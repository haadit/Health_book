const Pose = require('../models/Pose');

const posesData = [
  // Standing Poses
  {
    name: 'Warrior I (Virabhadrasana I)',
    description: 'A standing pose that strengthens your legs, opens your hips and chest, and improves balance and stability.',
    difficulty: 'intermediate',
    benefits: [
      'Strengthens legs and core',
      'Opens hips and chest',
      'Improves balance',
      'Builds concentration'
    ],
    instructions: [
      'Start in Mountain Pose',
      'Step one foot back about 4 feet',
      'Turn back foot out 45 degrees',
      'Bend front knee over ankle',
      'Raise arms overhead',
      'Look up and hold'
    ],
    imageUrl: '/images/poses/warrior1.png',
    keyPoints: [
      { x: 0.5, y: 0.7, part: 'front_knee' },
      { x: 0.5, y: 0.9, part: 'back_foot' },
      { x: 0.5, y: 0.3, part: 'shoulders' },
      { x: 0.5, y: 0.1, part: 'hands' }
    ],
    category: 'Standing Poses'
  },
  // ... (previous poses remain)

  // Adding more poses from the frontend
  {
    name: 'Warrior II (Virabhadrasana II)',
    description: 'A powerful standing pose that strengthens the legs while opening the hips and shoulders.',
    difficulty: 'intermediate',
    benefits: [
      'Builds leg strength',
      'Increases hip flexibility',
      'Improves stamina',
      'Enhances focus'
    ],
    instructions: [
      'Start with feet wide apart',
      'Turn right foot out 90 degrees',
      'Bend right knee over ankle',
      'Extend arms parallel to ground',
      'Gaze over front hand'
    ],
    imageUrl: '/images/poses/warrior2.png',
    keyPoints: [
      { x: 0.3, y: 0.5, part: 'front_knee' },
      { x: 0.7, y: 0.5, part: 'back_leg' },
      { x: 0.5, y: 0.3, part: 'shoulders' },
      { x: 0.2, y: 0.3, part: 'left_arm' },
      { x: 0.8, y: 0.3, part: 'right_arm' }
    ],
    category: 'Standing Poses'
  },
  // Add all poses from PoseLibrary.jsx...
];

async function initializePoses() {
  try {
    // Clear existing poses
    await Pose.deleteMany({});
    console.log('Cleared existing poses');

    // Insert new poses
    const insertedPoses = await Pose.insertMany(posesData);
    console.log(`Inserted ${insertedPoses.length} poses`);

    // Create indexes
    await Pose.collection.createIndex({ name: 1 }, { unique: true });
    await Pose.collection.createIndex({ difficulty: 1 });
    await Pose.collection.createIndex({ category: 1 });
    console.log('Created indexes for poses');

  } catch (error) {
    console.error('Error initializing poses:', error);
    throw error;
  }
}

module.exports = { initializePoses }; 