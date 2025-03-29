const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Progress = require('../models/Progress');
const Pose = require('../models/Pose');

const usersData = [
  {
    name: 'Admin User',
    email: 'admin@yogu.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'Sarah Smith',
    email: 'sarah@example.com',
    password: 'password123',
    role: 'user'
  }
];

async function createRandomProgress(userId, poses) {
  const progressEntries = [];
  
  for (const pose of poses) {
    // Create 1-5 random progress entries for each pose
    const entries = Math.floor(Math.random() * 5) + 1;
    
    for (let i = 0; i < entries; i++) {
      const daysAgo = Math.floor(Math.random() * 30); // Random day within last 30 days
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      progressEntries.push({
        user: userId,
        pose: pose._id,
        accuracy: Math.floor(Math.random() * 40) + 60, // Random accuracy between 60-100
        date: date,
        feedback: [
          'Keep your back straight',
          'Align your shoulders',
          'Breathe deeply'
        ]
      });
    }
  }
  
  return Progress.insertMany(progressEntries);
}

async function initializeUsers() {
  try {
    // Clear existing users and progress
    await User.deleteMany({});
    await Progress.deleteMany({});
    console.log('Cleared existing users and progress');

    // Create users with hashed passwords
    const createdUsers = [];
    for (const userData of usersData) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      console.log(`Creating user: ${userData.email} with role: ${userData.role}`); // Debug log
      
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });
      console.log(`Created user: ${user.email} with ID: ${user._id}`); // Debug log
      createdUsers.push(user);
    }
    console.log(`Created ${createdUsers.length} users`);

    // Get all poses for progress generation
    const poses = await Pose.find();

    // Create random progress for non-admin users
    for (const user of createdUsers) {
      if (user.role !== 'admin') {
        await createRandomProgress(user._id, poses);
      }
    }
    console.log('Created random progress entries for users');

    // Create indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await Progress.collection.createIndex({ user: 1, pose: 1, date: -1 });
    console.log('Created indexes for users and progress');

  } catch (error) {
    console.error('Error initializing users:', error);
    throw error;
  }
}

module.exports = { initializeUsers }; 