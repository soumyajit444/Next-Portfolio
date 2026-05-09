const Profile = require("../models/Profile");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../config/cloudinary");

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/** Upload a single file buffer and return { url, publicId } */
async function uploadFile(buffer, options) {
  const result = await uploadToCloudinary(buffer, options);
  return { url: result.secure_url, publicId: result.public_id };
}

// ─────────────────────────────────────────────
// GET ALL
// ─────────────────────────────────────────────
exports.getAllProfiles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const profiles = await Profile.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Profile.countDocuments();

    res.json({
      profiles,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalItems: total,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────
// GET SINGLE
// ─────────────────────────────────────────────
exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ profileSlug: req.params.slug });
    if (!profile) {
      return res
        .status(404)
        .json({ message: "Hey you are on the wrong link..." });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────
exports.createProfile = async (req, res) => {
  try {
    const existing = await Profile.findOne({
      profileSlug: req.body.profileSlug,
    });
    if (existing) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    const profileData = { ...req.body };

    // ── Profile picture ──────────────────────
    if (req.files?.profilePicture?.[0]) {
      profileData.ProfilePicture = await uploadFile(
        req.files.profilePicture[0].buffer,
        { folder: "portfolio/profile-pictures", resource_type: "image" },
      );
    }

    // ── Resume ───────────────────────────────
    if (req.files?.resume?.[0]) {
      const file = req.files.resume[0];
      const uploaded = await uploadFile(file.buffer, {
        folder: "portfolio/resumes",
        resource_type: "raw", // PDF/DOC are "raw" in Cloudinary
      });
      profileData.Resume = {
        ...uploaded,
        fileName: file.originalname,
      };
    }

    // ── Project media ─────────────────────────
    // Frontend sends: projectMedia[] files + projectMediaMeta[] JSON strings
    // e.g. [{ projectIndex: 0, resourceType: "image" }, ...]
    if (req.files?.projectMedia?.length) {
      const metas = JSON.parse(req.body.projectMediaMeta || "[]");

      // Ensure Projects array exists in profileData
      if (!Array.isArray(profileData.Projects)) profileData.Projects = [];

      for (let i = 0; i < req.files.projectMedia.length; i++) {
        const file = req.files.projectMedia[i];
        const meta = metas[i] || {};
        const projectIndex = meta.projectIndex ?? 0;
        const resourceType = meta.resourceType === "video" ? "video" : "image";

        const uploaded = await uploadFile(file.buffer, {
          folder: "portfolio/project-media",
          resource_type: resourceType,
        });

        if (!profileData.Projects[projectIndex]) {
          profileData.Projects[projectIndex] = {};
        }
        if (!Array.isArray(profileData.Projects[projectIndex].Media)) {
          profileData.Projects[projectIndex].Media = [];
        }
        profileData.Projects[projectIndex].Media.push({
          url: uploaded.url,
          publicId: uploaded.publicId,
          resourceType,
        });
      }
    }

    const profile = new Profile(profileData);
    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const { slug } = req.params;
    const existing = await Profile.findOne({ profileSlug: slug });
    if (!existing) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const updateData = { ...req.body };

    // ── Parse JSON-string fields sent by the frontend ────────────────────────
    // The frontend sends complex fields as JSON strings to avoid multer
    // deep-parse issues with nested arrays.
    const jsonFields = [
      "JobRoles",
      "IndustryTools",
      "Hobbies",
      "Skills",
      "Education",
      "WorkExperience",
      "Projects",
      "Address",
      "ContactInfo",
    ];
    for (const field of jsonFields) {
      if (typeof updateData[field] === "string") {
        try {
          updateData[field] = JSON.parse(updateData[field]);
        } catch {}
      }
    }

    // ── Profile picture ──────────────────────────────────────────────────────
    if (req.files?.profilePicture?.[0]) {
      // Delete old picture from Cloudinary
      if (existing.ProfilePicture?.publicId) {
        await deleteFromCloudinary(existing.ProfilePicture.publicId, "image");
      }
      updateData.ProfilePicture = await uploadFile(
        req.files.profilePicture[0].buffer,
        { folder: "portfolio/profile-pictures", resource_type: "image" },
      );
    }

    // ── Resume ───────────────────────────────────────────────────────────────
    if (req.files?.resume?.[0]) {
      if (existing.Resume?.publicId) {
        await deleteFromCloudinary(existing.Resume.publicId, "raw");
      }
      const file = req.files.resume[0];
      const uploaded = await uploadFile(file.buffer, {
        folder: "portfolio/resumes",
        resource_type: "raw",
      });
      updateData.Resume = { ...uploaded, fileName: file.originalname };
    }

    // ── Project media ─────────────────────────────────────────────────────────
    if (req.files?.projectMedia?.length) {
      const metas = JSON.parse(req.body.projectMediaMeta || "[]");

      // Start from the already-parsed Projects array (parsed above)
      const projects = Array.isArray(updateData.Projects)
        ? updateData.Projects
        : existing.Projects.map((p) => p.toObject());

      for (let i = 0; i < req.files.projectMedia.length; i++) {
        const file = req.files.projectMedia[i];
        const meta = metas[i] || {};
        const projectIndex = meta.projectIndex ?? 0;
        const resourceType = meta.resourceType === "video" ? "video" : "image";

        const uploaded = await uploadFile(file.buffer, {
          folder: "portfolio/project-media",
          resource_type: resourceType,
        });

        if (!projects[projectIndex]) projects[projectIndex] = {};
        if (!Array.isArray(projects[projectIndex].Media)) {
          projects[projectIndex].Media = [];
        }
        projects[projectIndex].Media.push({
          url: uploaded.url,
          publicId: uploaded.publicId,
          resourceType,
        });
      }

      updateData.Projects = projects;
    }

    const updated = await Profile.findOneAndUpdate(
      { profileSlug: slug },
      updateData,
      { new: true },
    );

    res.json(updated);
  } catch (err) {
    console.error("updateProfile error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────
exports.deleteProfile = async (req, res) => {
  try {
    const { slug } = req.params;
    const profile = await Profile.findOne({ profileSlug: slug });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Clean up Cloudinary assets before removing the document
    if (profile.ProfilePicture?.publicId) {
      await deleteFromCloudinary(profile.ProfilePicture.publicId, "image");
    }
    if (profile.Resume?.publicId) {
      await deleteFromCloudinary(profile.Resume.publicId, "raw");
    }
    for (const project of profile.Projects || []) {
      for (const media of project.Media || []) {
        await deleteFromCloudinary(media.publicId, media.resourceType);
      }
    }

    await Profile.findOneAndDelete({ profileSlug: slug });

    res.json({ message: `${slug} profile deleted successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────
// DELETE SINGLE PROJECT MEDIA  (bonus utility)
// DELETE /api/profile/:slug/project/:projectId/media/:publicId
// ─────────────────────────────────────────────
exports.deleteProjectMedia = async (req, res) => {
  try {
    const { slug, projectId, publicId } = req.params;

    const profile = await Profile.findOne({ profileSlug: slug });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const project = profile.Projects.id(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const mediaItem = project.Media.find((m) => m.publicId === publicId);
    if (!mediaItem) return res.status(404).json({ message: "Media not found" });

    await deleteFromCloudinary(mediaItem.publicId, mediaItem.resourceType);

    project.Media = project.Media.filter((m) => m.publicId !== publicId);
    await profile.save();

    res.json({ message: "Media deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
