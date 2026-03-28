const cloudinary = require("./utils/cloudinary");
const fs = require("fs");
const path = require("path");

async function testUpload() {
  try {
    const testFilePath = path.join(__dirname, "test.jpg");
    // Upload the existing test.jpg
    const result = await cloudinary.uploader.upload(testFilePath, {
      folder: "pramaan_test_manual",
      resource_type: "auto"
    });
    console.log("SUCCESS:", result.secure_url);
  } catch (error) {
    console.error("ERROR:", error.message || error);
  }
}

testUpload();
