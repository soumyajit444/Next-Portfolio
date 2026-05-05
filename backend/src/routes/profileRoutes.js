const express = require("express");
const router = express.Router();

const {
  getProfile,
  getAllProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/profileController");

const protect = require("../middleware/authMiddleware");

// PUBLIC

// Get all Profile
router.get("/", getAllProfiles);

// Get Single Profile
router.get("/:slug", getProfile);

// PROTECTED
router.post("/", protect, createProfile);
router.put("/:slug", protect, updateProfile);
router.delete("/:slug", protect, deleteProfile);

module.exports = router;
