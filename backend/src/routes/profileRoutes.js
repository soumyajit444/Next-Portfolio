const express = require("express");
const router = express.Router();

const {
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/profileController");

const protect = require("../middleware/authMiddleware");

// PUBLIC
router.get("/:slug", getProfile);

// PROTECTED
router.post("/", protect, createProfile);
router.put("/:slug", protect, updateProfile);
router.delete("/:slug", protect, deleteProfile);

module.exports = router;
