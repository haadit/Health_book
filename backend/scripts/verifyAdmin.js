const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const ADMIN_EMAIL = 'admin@yogu.com';
const ADMIN_PASSWORD = 'admin123';

async function verifyAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find admin user
    const admin = await User.findOne({ email: ADMIN_EMAIL });
    if (!admin) {
      console.log('Admin user not found!');
      return;
    }

    console.log('Admin user found:', {
      id: admin._id,
      email: admin.email,
      role: admin.role,
      hashedPassword: admin.password
    });

    // Test password manually
    const isMatch = await bcrypt.compare(ADMIN_PASSWORD, admin.password);
    console.log('\nPassword verification test:', {
      testPassword: ADMIN_PASSWORD,
      matches: isMatch
    });

    // Create a new hash and compare
    const newHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    console.log('\nNew hash test:', {
      originalHash: admin.password,
      newHash: newHash,
      compareResult: await bcrypt.compare(ADMIN_PASSWORD, newHash)
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

verifyAdmin(); 