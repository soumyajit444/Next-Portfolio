const multer = require("multer");

// Store files in memory so we can stream them to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const { fieldname, mimetype } = file;

  if (fieldname === "profilePicture") {
    // Only images
    if (mimetype.startsWith("image/")) return cb(null, true);
    return cb(new Error("Profile picture must be an image file"), false);
  }

  if (fieldname === "resume") {
    // PDF or Word documents
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowed.includes(mimetype)) return cb(null, true);
    return cb(new Error("Resume must be a PDF or Word document"), false);
  }

  if (fieldname === "projectMedia") {
    // Images or videos
    if (mimetype.startsWith("image/") || mimetype.startsWith("video/"))
      return cb(null, true);
    return cb(new Error("Project media must be an image or video file"), false);
  }

  // Unknown field – reject
  return cb(new Error(`Unexpected field: ${fieldname}`), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB max per file
  },
});

module.exports = upload;
