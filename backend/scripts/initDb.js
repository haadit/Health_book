const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { initializePoses } = require('./initPoses');
const { initializeUsers } = require('./initUsers');

dotenv.config();

async function initializeDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Initialize poses and users
    await initializePoses();
    await initializeUsers();

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

initializeDatabase(); 