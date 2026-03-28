const { InferenceClient } = require("@huggingface/inference");
require("dotenv").config({ quiet: true });

const { classifyPhishingType } = require("../utils/phishingDictionary");

const HF_API_KEY = process.env.HF_TOKEN;
const HF_MODEL = "cybersectony/phishing-email-detection-distilbert_v2.4.1";

const labelMap = {
  LABEL_0: "legitimate_email",
  LABEL_1: "phishing_email",
  LABEL_2: "legitimate_url",
  LABEL_3: "phishing_url"
};

const detectPhishingEmail = async (req, res) => {

  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Email text is required" });
  }

  try {

    const client = new InferenceClient(HF_API_KEY);

    const result = await client.textClassification({
      model: HF_MODEL,
      inputs: text,
      provider: "hf-inference",
    });

    if (!Array.isArray(result) || result.length === 0) {
      return res.status(500).json({ error: "No prediction returned from HF" });
    }

    const top = result[0];

    const mappedLabel = labelMap[top.label];

    const probability = Math.round(top.score * 100);

    if (mappedLabel !== "phishing_email") {

      return res.json({
        verdict: "Legitimate Email",
        confidence: probability
      });

    }

    const phishingType = classifyPhishingType(text);

    return res.json({
      verdict: "Phishing Email",
      confidence: probability,
      phishingType
    });

  } catch (err) {

    console.error("HF Email Model Error:", err.message || err);

    return res.status(500).json({
      error: "Failed to detect phishing email"
    });

  }

};

module.exports = { detectPhishingEmail };