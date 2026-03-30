const cloudinary = require("./cloudinary");

/**
 * Uploads a raw Buffer to Cloudinary using upload_stream.
 * This avoids any filesystem dependency and works on Vercel serverless.
 *
 * @param {Buffer} buffer  - Raw file buffer (file.data from express-fileupload)
 * @param {string} folder  - Cloudinary folder name
 * @param {number} [height]
 * @param {string} [quality]
 * @returns {Promise<object>} Cloudinary upload result
 */
exports.uploadImageToCloudinary = (buffer, folder, height, quality) => {
  return new Promise((resolve, reject) => {
    const options = { folder, resource_type: "auto" };
    if (height)   options.height  = height;
    if (quality)  options.quality = quality;

    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });

    stream.end(buffer);
  });
};