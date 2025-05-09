const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { registerSchema } = require("../validations/userValidation");
const logger = require("../utils/logger");

/* GET /api/users
Get all users with pagination, filtering, sorting
Admin only */
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit = Math.max(1, parseInt(req.query.limit)) || 10;

    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;

    const role = req.query.role;
    const search = req.query.search;

    const query = {};
    if (role) query.role = role;
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      success: true,
      page,
      totalPages,
      totalUsers,
      users,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error in fetching users" });
  }
};

// GET /api/users/:id
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user.role !== "admin" && req.user._id.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/users
exports.createUser = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      logger.warn("Empty payload received on /register");
      return res.status(400).json({ message: "Payload is required" });
    }
    const { name, email, password, phoneNumber, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
    });

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/users/:id
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user.role !== "admin" && req.user._id.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const updateData = { ...req.body };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user.role !== "admin" && req.user._id.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this user" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfilePicture = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user.role !== "admin" && req.user._id.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this profile picture" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No file uploaded or invalid file type" });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: imagePath },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Profile picture updated", data: updatedUser });
  } catch (err) {
    console.error("Error in updateProfilePicture:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
