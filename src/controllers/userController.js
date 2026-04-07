const User = require("../models/User");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({
      success: false,
      error: "Failed to get users",
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve user",
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address, dateOfBirth, role } = req.body;

    if (!firstName || !lastName || !email || !phone || !address || !dateOfBirth || !role) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields"
      });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      address,
      dateOfBirth,
      role,
    });

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, address, dateOfBirth, role } = req.body;

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const updateFields = {};

    if (firstName !== undefined) {
      if (!firstName || firstName.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'First name cannot be empty'
        });
      }
      updateFields.firstName = firstName;
    }

    if (lastName !== undefined) {
      if (!lastName || lastName.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Last name cannot be empty'
        });
      }
      updateFields.lastName = lastName;
    }

    if (email !== undefined) {
      if (!email || email.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Email cannot be empty'
        });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid email format'
        });
      }
      updateFields.email = email;
    }

    if (phone !== undefined) {
      if (!phone || phone.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Phone cannot be empty'
        });
      }
      updateFields.phone = phone;
    }

    if (address !== undefined) {
      if (!address || address.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Address cannot be empty'
        });
      }
      updateFields.address = address;
    }

    if (dateOfBirth !== undefined) {
      if (!dateOfBirth) {
        return res.status(400).json({
          success: false,
          error: 'Date of birth cannot be empty'
        });
      }
      const dob = new Date(dateOfBirth);
      if (isNaN(dob.getTime())) {
        return res.status(400).json({
          success: false,
          error: 'Invalid date of birth format'
        });
      }
      updateFields.dateOfBirth = dateOfBirth;
    }

    if (role !== undefined) {
      if (!role || role.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Role cannot be empty'
        });
      }
      updateFields.role = role;
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one field must be provided for update'
      });
    }

    const result = await User.updateOne(
      { _id: id },
      { $set: updateFields }
    );

    res.status(200).json({
      success: true,
      data: {
        id: id,
        ...updateFields
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};
