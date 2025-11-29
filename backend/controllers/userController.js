const User = require('../models/User');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Helper to check MongoDB connection
const checkMongoConnection = (res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database connection unavailable. Please ensure MongoDB is running.'
    });
  }
  return null;
};

// Get all users with pagination, sorting, search, and filters
exports.getAllUsers = async (req, res) => {
  try {
    const mongoError = checkMongoConnection(res);
    if (mongoError) return mongoError;
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search = '',
      state = '',
      city = ''
    } = req.query;

    // Build query
    const query = {};

    // Search filter (name, email, state, city)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }

    // State filter
    if (state) {
      query.state = { $regex: state, $options: 'i' };
    }

    // City filter
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    // Sort options
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get users and total count
    const [users, total] = await Promise.all([
      User.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const mongoError = checkMongoConnection(res);
    if (mongoError) return mongoError;
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const mongoError = checkMongoConnection(res);
    if (mongoError) return mongoError;
    const { id } = req.params;
    const updateData = req.body;

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Handle profile image upload
    if (req.file) {
      // Delete old image if exists
      if (user.profile_image) {
        const oldImagePath = path.join(__dirname, '..', user.profile_image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.profile_image = `/uploads/profiles/${req.file.filename}`;
    }

    // Don't allow role update unless admin is updating
    if (updateData.role && req.user.role !== 'admin') {
      delete updateData.role;
    }

    // Don't allow password update through this endpoint
    delete updateData.password;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user: updatedUser }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const mongoError = checkMongoConnection(res);
    if (mongoError) return mongoError;
    const { id } = req.params;

    // Prevent self-deletion for admin
    if (id === req.user._id.toString() && req.user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own admin account'
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete profile image if exists
    if (user.profile_image) {
      const imagePath = path.join(__dirname, '..', user.profile_image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

