const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'All fields are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'user'
    });

    // Generate token
    const token = jwt.sign(
      { 
        userId: user._id,
        role: user.role,
        email: user.email,
        name: user.name
      }, 
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Log successful registration
    console.log('User registered:', {
      email: user.email,
      name: user.name,
      role: user.role
    });

    // Send response
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Error creating account' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log('Login failed: User not found -', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Log user found
    console.log('Login attempt:', {
      email: user.email,
      role: user.role,
      hashedPasswordLength: user.password.length
    });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password verification:', {
      email: user.email,
      matches: isMatch
    });

    if (!isMatch) {
      console.log('Login failed: Invalid password -', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { 
        userId: user._id,
        role: user.role,
        email: user.email,
        name: user.name
      }, 
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Log successful login
    console.log('Login successful:', {
      email: user.email,
      role: user.role
    });

    // Send response
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Add this route temporarily for debugging
router.get('/check-users', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Temporary debug route - REMOVE IN PRODUCTION
router.get('/debug-admin', async (req, res) => {
  try {
    const admin = await User.findOne({ email: 'admin@yogu.com' });
    if (!admin) {
      return res.json({ message: 'Admin user not found' });
    }
    res.json({
      exists: true,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      passwordLength: admin.password.length,
      createdAt: admin.createdAt
    });
  } catch (err) {
    res.status(500).json({ message: 'Error checking admin user' });
  }
});

module.exports = router; 