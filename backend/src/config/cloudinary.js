const cloudinary = require("cloudinary").v2;

// Reads from .env  – never hard-code credentials in source files
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a single file buffer to Cloudinary.
 *
 * @param {Buffer} fileBuffer  - File data from multer (memoryStorage)
 * @param {object} options     - Cloudinary upload options (folder, resource_type, …)
 * @returns {Promise<object>}  - Cloudinary upload result
 */
const uploadToCloudinary = (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete a file from Cloudinary by its public_id.
 *
 * @param {string} publicId
 * @param {string} resourceType  - "image" | "video" | "raw"  (default "image")
 */
const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};

module.exports = { cloudinary, uploadToCloudinary, deleteFromCloudinary };
