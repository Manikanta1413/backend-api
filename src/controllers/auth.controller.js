const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const logger = require("../utils/logger");
const { registerSchema } = require("../validations/userValidation");

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      logger.warn("Empty payload received on /register");
      return res.status(400).json({ message: "Payload is required" });
    }

    const { name, email, password, phoneNumber, address } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      logger.warn(`Register attempt for existing email: ${email}`);
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      phoneNumber,
      address,
    });

    logger.info(` New User registered: ${email}`);

    const token = generateToken(newUser);

    res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        message: "User registered successfully",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });
  } catch (error) {
    logger.error(`Register failed: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      logger.warn("Empty payload received on /register");
      return res.status(400).json({ message: "Payload is required" });
    }
    const email = req.body.email?.trim();
    const password = req.body.password?.trim();

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/logout
exports.logout = (req, res) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ message: "Logged out successfully" });
};
