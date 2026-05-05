const Profile = require("../models/Profile");

// GET ALL
exports.getAllProfiles = async (req, res) => {
  try {
    // Optional: Add pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const profiles = await Profile.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by newest first

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

// GET SINGLE
exports.getProfile = async (req, res) => {
  try {
    const { slug } = req.params;

    const profile = await Profile.findOne({ profileSlug: slug });

    if (!profile) {
      return res.status(404).json({
        message: "Hey you are on the wrong link...",
      });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE
exports.createProfile = async (req, res) => {
  try {
    const existing = await Profile.findOne({
      profileSlug: req.body.profileSlug,
    });

    if (existing) {
      return res.status(400).json({
        message: "Profile already exists",
      });
    }

    const profile = new Profile(req.body);
    await profile.save();

    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateProfile = async (req, res) => {
  try {
    const { slug } = req.params;

    const updated = await Profile.findOneAndUpdate(
      { profileSlug: slug },
      req.body,
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
exports.deleteProfile = async (req, res) => {
  try {
    const { slug } = req.params;

    const deleted = await Profile.findOneAndDelete({
      profileSlug: slug,
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    res.json({
      message: `${slug} profile deleted successfully`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
