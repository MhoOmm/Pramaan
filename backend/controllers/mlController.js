
const axios = require('axios')
const cloudinary = require("cloudinary").v2;
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

    // Cloudinary upload using tempFilePath and our custom utility
    const cloudinaryResponse = await uploadImageToCloudinary(
      file.tempFilePath,
      "pramaan"
    );
    const imageUrl = cloudinaryResponse.secure_url;

    // ML backend call
    const mlResponse = await axios.post(
      "https://animan0810-pramaan-ml.hf.space/predict-image",
      { image_url: imageUrl },
      { timeout: 60000 }
    );

    res.json({ success: true, imageUrl, prediction: mlResponse.data });
  }catch (error) {
    console.error("detectFakeImage error:", error.message);
    
    // Check if Hugging Face sent a 503 (Waking Up) error
    if (error.response && error.response.status === 503) {
      return res.status(503).json({ 
        success: false, 
        message: "The AI model is currently waking up! Please wait 60 seconds and try again." 
      });
    }

    // Otherwise, it's a real error
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
    res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "ML service error" });
  }
};

module.exports = {
  fakeNewsModel,
  detectFakeImage,
  classifySMS,
  aiGeneratedtext
};
