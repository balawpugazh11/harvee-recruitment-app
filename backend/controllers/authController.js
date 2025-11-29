const User = require('../models/User');
const mongoose = require('mongoose');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');

// Better error logging
const logError = (error, context) => {
  console.error(`\n❌ Error in ${context}:`);
  console.error('Message:', error.message);
  console.error('Stack:', error.stack);
  if (error.name) console.error('Error Name:', error.name);
  if (error.code) console.error('Error Code:', error.code);
};

// Helper to check MongoDB connection
const checkMongoConnection = (res) => {
  const readyState = mongoose.connection.readyState;
  console.log('MongoDB connection state:', readyState, {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  }[readyState]);
  
  if (readyState !== 1) {
    console.error('MongoDB not connected. ReadyState:', readyState);
    return res.status(503).json({
      success: false,
      message: 'Database connection unavailable. Please ensure MongoDB is running.',
      connectionState: readyState
    });
  }
  return null;
};

// Register new user
exports.register = async (req, res) => {
  try {
    const mongoError = checkMongoConnection(res);
    if (mongoError) return mongoError;
    const { name, email, phone, password, address, state, city, country, pincode } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or phone already exists'
      });
    }

    // Handle profile image upload
    let profile_image = null;
    if (req.file) {
      profile_image = `/uploads/profiles/${req.file.filename}`;
    }

    // Create new user
    const user = new User({
      name,
      email,
      phone,
      password,
      profile_image,
      address,
      state,
      city,
      country,
      pincode
    });

    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

    // Remove sensitive data
    const userObj = user.toJSON();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userObj,
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });
  } catch (error) {
    logError(error, 'register');
    
    // Check if response was already sent
    if (res.headersSent) {
      return;
    }
    
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
      ...(process.env.NODE_ENV === 'development' && { 
        stack: error.stack,
        name: error.name,
        code: error.code
      })
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const mongoError = checkMongoConnection(res);
    if (mongoError) return mongoError;
    const { emailOrPhone, password } = req.body;

    // Find user by email or phone
    const user = await User.findOne({
      $or: [
        { email: emailOrPhone.toLowerCase() },
        { phone: emailOrPhone }
      ]
    }).select('+password'); // Include password field

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email/phone or password'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email/phone or password'
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token (for refresh token rotation)
    user.refreshToken = refreshToken;
    await user.save();

    // Remove sensitive data
    const userObj = user.toJSON();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userObj,
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });
  } catch (error) {
    logError(error, 'login');
    
    // Check if response was already sent
    if (res.headersSent) {
      return;
    }
    
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
      ...(process.env.NODE_ENV === 'development' && { 
        stack: error.stack,
        name: error.name,
        code: error.code
      })
    });
  }
};

// Refresh access token
exports.refreshToken = async (req, res) => {
  try {
    const mongoError = checkMongoConnection(res);
    if (mongoError) return mongoError;
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    // Find user and verify refresh token matches
    const user = await User.findById(decoded.userId).select('+refreshToken');
    
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new tokens (refresh token rotation)
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Update refresh token in database
    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        tokens: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Token refresh failed',
      error: error.message
    });
  }
};

