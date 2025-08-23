const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
} = require("../controllers/profilecontroller");
const { protect } = require("../middlewares/authmiddleware");

// Get logged-in user profile
router.get("/", protect, getProfile);

// Update profile
router.put("/", protect, updateProfile);

module.exports = router;
