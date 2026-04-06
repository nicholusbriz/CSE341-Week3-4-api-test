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
    if (firstName !== undefined) updateFields.firstName = firstName;
    if (lastName !== undefined) updateFields.lastName = lastName;
    if (email !== undefined) updateFields.email = email;
    if (phone !== undefined) updateFields.phone = phone;
    if (address !== undefined) updateFields.address = address;
    if (dateOfBirth !== undefined) updateFields.dateOfBirth = dateOfBirth;
    if (role !== undefined) updateFields.role = role;

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
