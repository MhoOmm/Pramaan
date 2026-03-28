const express = require('express')
const router = express.Router();

const { fakeNewsModel, detectFakeImage, classifySMS, aiGeneratedtext } = require("../controllers/mlController");

// Pramaan: ml routers
router.post("/analyze/fakenews", fakeNewsModel);
router.post("/analyze/ai-gen-hum-text", aiGeneratedtext);
router.post("/analyze/fakeimage", detectFakeImage);
router.post("/analyze/sms", classifySMS);



module.exports = router;