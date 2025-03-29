const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const TEST_USER = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  role: 'user'
};

async function createTestUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete existing test user
    await User.deleteOne({ email: TEST_USER.email });
    console.log('Deleted existing test user');

    // Create hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(TEST_USER.password, salt);

    // Create test user
    const user = await User.create({
      name: TEST_USER.name,
      email: TEST_USER.email,
      password: hashedPassword,
      role: TEST_USER.role
    });

    console.log('\nCreated test user:', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });

    // Verify password
    const isMatch = await bcrypt.compare(TEST_USER.password, user.password);
    console.log('\nPassword verification:', {
      matches: isMatch
    });

    if (!isMatch) {
      throw new Error('Password verification failed!');
    }

    console.log('\nTest user credentials:');
    console.log('Email:', TEST_USER.email);
    console.log('Password:', TEST_USER.password);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createTestUser(); 