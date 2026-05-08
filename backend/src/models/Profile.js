const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  Name: String,
  Rating: Number,
});

const educationSchema = new mongoose.Schema({
  PassOutYear: Number,
  Degree: String,
  Institution: String,
});

// ── NEW: each project can have multiple media (image or video) and multiple links
const projectMediaSchema = new mongoose.Schema({
  url: { type: String, required: true }, // Cloudinary secure_url
  publicId: { type: String, required: true }, // Cloudinary public_id  (needed for deletion)
  resourceType: {
    type: String,
    enum: ["image", "video"],
    default: "image",
  },
});

const projectSchema = new mongoose.Schema({
  Name: String,
  Description: String,

  // OLD single Link kept as-is so existing data never breaks
  Link: String,

  // NEW: multiple links  e.g. ["https://github.com/...", "https://live-demo.com"]
  Links: [String],

  // NEW: Cloudinary-backed media (images / videos)
  Media: [projectMediaSchema],
});

const experienceSchema = new mongoose.Schema({
  CompanyName: String,
  Role: String,
  StartDate: String,
  EndDate: String,
  Description: String,
  WorkLocation: String,
  KeySkills: [String],
});

const profileSchema = new mongoose.Schema(
  {
    profileSlug: {
      type: String,
      required: true,
      unique: true,
    },

    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },

    // Existing array – used for typewriter effect on the frontend
    JobRoles: [String],

    Bio: String,
    Skills: [skillSchema],
    IndustryTools: [String],
    YearsOfExperience: Number,

    Education: [educationSchema],
    Hobbies: [String],

    WorkExperience: [experienceSchema],

    Address: {
      Street: String,
      State: String,
      Pin: String,
      Country: String,
    },

    ContactInfo: {
      PhoneNo: String,
      Email: String,
      LinkedIn: String,
    },

    Projects: [projectSchema],

    // ── NEW: Profile picture (single Cloudinary image)
    ProfilePicture: {
      url: String, // Cloudinary secure_url
      publicId: String, // Cloudinary public_id
    },

    // ── NEW: Resume (single Cloudinary file – PDF or DOC)
    Resume: {
      url: String, // Cloudinary secure_url
      publicId: String, // Cloudinary public_id
      fileName: String, // original file name shown to visitors
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Profile", profileSchema);
