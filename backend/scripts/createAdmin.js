const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const ADMIN_EMAIL = 'admin@yogu.com';
const ADMIN_PASSWORD = 'admin123';

async function createAdminUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete existing admin
    await User.deleteOne({ email: ADMIN_EMAIL });
    console.log('Deleted existing admin');

    // Create hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    // Create admin user directly in the database
    const admin = await User.create({
      name: 'Admin User',
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin'
    });

    console.log('\nCreated admin user:', {
      id: admin._id,
      email: admin.email,
      role: admin.role,
      hashedPassword: admin.password
    });

    // Verify immediately after creation
    const verifyAdmin = await User.findOne({ email: ADMIN_EMAIL });
    const isMatch = await bcrypt.compare(ADMIN_PASSWORD, verifyAdmin.password);

    console.log('\nImmediate verification:', {
      found: !!verifyAdmin,
      passwordMatches: isMatch
    });

    if (!isMatch) {
      throw new Error('Password verification failed immediately after creation!');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createAdminUser(); 