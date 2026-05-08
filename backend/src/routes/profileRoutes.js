const express = require("express");
const router = express.Router();

const {
  getProfile,
  getAllProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
  deleteProjectMedia,
} = require("../controllers/profileController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// Multer field config – matches what the frontend sends
const uploadFields = upload.fields([
  { name: "profilePicture", maxCount: 1 },
  { name: "resume", maxCount: 1 },
  { name: "projectMedia", maxCount: 20 }, // up to 20 media files per request
]);

// ── PUBLIC ────────────────────────────────────────────
router.get("/", getAllProfiles);
router.get("/:slug", getProfile);

// ── PROTECTED ─────────────────────────────────────────
router.post("/", protect, uploadFields, createProfile);
router.put("/:slug", protect, uploadFields, updateProfile);
router.delete("/:slug", protect, deleteProfile);

// Delete a single media item from a project
router.delete(
  "/:slug/project/:projectId/media/:publicId",
  protect,
  deleteProjectMedia,
);

module.exports = router;
