const User = require('../models/User');

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ isActive: true });
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching users'
    });
  }
};

// Get single user
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    if (!user.isActive) {
      return res.status(404).json({
        success: false,
        error: 'User is not active'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error while fetching user'
    });
  }
};

// Create new user
exports.createUser = async (req, res) => {
  try {
    const userData = req.body;
    
    // Check required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'dateOfBirth'];
    const missingFields = requiredFields.filter(field => !userData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    // Validate address
    if (!userData.address.street || !userData.address.city || !userData.address.state || !userData.address.zipCode) {
      return res.status(400).json({
        success: false,
        error: 'Address must include street, city, state, and zipCode'
      });
    }
    
    // Check for existing email
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }
    
    const user = await User.create(userData);
    
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error creating user:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: `Validation error: ${errors.join(', ')}`
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Duplicate field value entered'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error while creating user'
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const userData = req.body;
    
    // Check if email already exists
    if (userData.email) {
      const existingUser = await User.findOne({ 
        email: userData.email, 
        _id: { $ne: req.params.id } 
      });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Email already exists'
        });
      }
    }
    
    // Validate address if provided
    if (userData.address) {
      if (!userData.address.street || !userData.address.city || !userData.address.state || !userData.address.zipCode) {
        return res.status(400).json({
          success: false,
          error: 'Address must include street, city, state, and zipCode'
        });
      }
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      userData,
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    if (!user.isActive) {
      return res.status(404).json({
        success: false,
        error: 'User is not active'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID format'
      });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: `Validation error: ${errors.join(', ')}`
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Duplicate field value entered'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error while updating user'
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Soft delete - mark as inactive
    user.isActive = false;
    await user.save();
    
    res.status(200).json({
      success: true,
      data: { message: 'User deleted successfully' }
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error while deleting user'
    });
  }
};
