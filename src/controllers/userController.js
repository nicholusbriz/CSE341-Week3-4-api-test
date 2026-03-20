const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');

// Get all users
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ isActive: true });
  
  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// Get single user
exports.getUser = asyncHandler(async (req, res) => {
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
});

// Create new user
exports.createUser = asyncHandler(async (req, res) => {
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
});

// Update user
exports.updateUser = asyncHandler(async (req, res) => {
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
});

// Delete user
exports.deleteUser = asyncHandler(async (req, res) => {
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
});
