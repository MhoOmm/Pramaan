
const axios = require('axios')
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// // FAKE NEWS CONTROLLER
const fakeNewsModel = async (req, res) => {
  try {
    const { text } = req.body;

    const response = await axios.post(
      "https://animan0810-pramaan-ml.hf.space/predict-text",
      { text },
      { timeout: 60000 }
    );

    const { prediction, confidence } = response.data;

    res.json({
      verdict: prediction === 0 ? "Fake News" : "Real News",
      confidence: Math.round(confidence * 100),
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "ML service error" });
  }
};



// DETECT FAKE IMAGE
// const detectFakeImage = async (req, res) => {
//   try {
//     if (!req.files || !req.files.image) {
//       return res.status(400).json({
//         success: false,
//         message: "Image file is required"
//       });
//     }

//     const file = req.files.image;

//     // upload to cloudinary
//     const cloudinaryResponse = await uploadImageToCloudinary(
//       file.tempFilePath,
//       "pramaan"
//     );

//     const imageUrl = cloudinaryResponse.secure_url;

//     // call ML backend
//     const mlResponse = await axios.post(
//       "https://animan0810-pramaan-ml.hf.space/predict-image",
//       { data: { image_url: imageUrl } }
//     );

//     const prediction = mlResponse.data;

//     res.json({
//       success: true,
//       imageUrl,
//       prediction
//     });

//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: "Image detection failed"
//     });
//   }
// };

const detectFakeImage = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ success: false, message: "Image file is required" });
    }

    const file = req.files.image;

    // Cloudinary upload from buffer
    const streamUpload = (fileBuffer) => new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "pramaan", resource_type: "auto" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(fileBuffer);
    });

    const cloudinaryResponse = await streamUpload(file.data);
    const imageUrl = cloudinaryResponse.secure_url;

    // ML backend call
    const mlResponse = await axios.post(
      "https://animan0810-pramaan-ml.hf.space/predict-image",
      { image_url: imageUrl }
    );

    res.json({ success: true, imageUrl, prediction: mlResponse.data });
  } catch (error) {
    console.error("detectFakeImage error:", error.message || error.response?.data || error);
    res.status(500).json({ success: false, message: "Image detection failed" });
  }
};



// SMS CLASSIFICATION
const classifySMS = async (req, res) => {
  try {
    const { text } = req.body;

    const response = await axios.post(
      "https://animan0810-pramaan-ml.hf.space/predict-sms",
      { text },
      { timeout: 60000 }
    );

    const { prediction } = response.data;

    res.json({
      verdict: prediction,
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "SMS ML service error" });
  }
};


// AI GENERATED TEXT DETECTION
const aiGeneratedtext = async (req, res) => {
  try {
    const { text } = req.body;
    const response = await axios.post(
      "https://animan0810-pramaan-ml.hf.space/predict-ai-text",
      { text },
      { timeout: 60000 }
    );

    res.json({
      verdict: response.data.verdict,
      label: response.data.label,
      aiScore: response.data.ai_score,
      confidence: response.data.confidence,
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "ML service error" });
  }
};

module.exports = {
  fakeNewsModel,
  detectFakeImage,
  classifySMS,
  aiGeneratedtext
};
