const cloudinary = require("./cloudinary");

exports.uploadImageToCloudinary = async (filePath, folder) => {

  const options = {
    folder: folder,
    resource_type: "auto"
  };

  return await cloudinary.uploader.upload(filePath, options);
};