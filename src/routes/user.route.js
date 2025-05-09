const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload");
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateProfilePicture,
} = userController;

console.log("DEBUG: Controller functions loaded:", Object.keys(userController));
// Get all users (Admin only)
router.get("/", protect, authorize("admin"), getAllUsers);

// Get single user (Admin & self)
router.get("/:id", protect, authorize("admin", "user"), getUserById);

// Create new user (Admin only)
router.post("/", protect, authorize("admin"), createUser);

// Update user (Admin & self)
router.put("/:id", protect, authorize("admin", "user"), updateUser);

// Upload profile picture (Admin or self)
router.put(
  "/:id/profile-picture",
  protect,
  authorize("admin", "user"),
  upload.single("profilePicture"),
  updateProfilePicture
);

// Delete user (Admin only)
router.delete("/:id", protect, authorize("admin"), deleteUser);

module.exports = router;
