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

  // Don't allow updating email to existing one
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

  // Validate address object if provided
  if (userData.address) {
    if (!userData.address.street || !userData.address.city || !userData.address.state || !userData.address.zipCode) {
      return res.status(400).json({
        success: false,
        error: 'Address must include street, city, state, and zipCode'
      });
    }
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

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Public
exports.updateUser = async (req, res) => {
  try {
    const userData = req.body;

    // Don't allow updating email to existing one
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

    // Validate address object if provided
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

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Public
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
