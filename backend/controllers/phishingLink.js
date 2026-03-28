const { InferenceClient } = require("@huggingface/inference");
require("dotenv").config({ quiet: true });

const HF_API_KEY = process.env.HF_TOKEN;
const HF_MODEL = "cybersectony/phishing-email-detection-distilbert_v2.4.1";

const labelMap = {
  LABEL_0: "legitimate_email",
  LABEL_1: "phishing_email",
  LABEL_2: "legitimate_url",
  LABEL_3: "phishing_url"
};

const detectPhishingLink = async (req, res) => {

  const { url } = req.body;

  if (!url || !url.trim()) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {

    const client = new InferenceClient(HF_API_KEY);

    const result = await client.textClassification({
      model: HF_MODEL,
      inputs: url,
      provider: "hf-inference",
    });

    if (!Array.isArray(result) || result.length === 0) {
      return res.status(500).json({ error: "No prediction returned from HF" });
    }

    const top = result[0];

    const mappedLabel = labelMap[top.label];

    const probability = Math.round(top.score * 100);

    const verdict =
      mappedLabel === "phishing_url"
        ? "Phishing Link"
        : "Safe Link";

    return res.json({
      verdict,
      confidence: probability,
      url
    });

  } catch (err) {

    console.error("HF Link Model Error:", err.message || err);

    return res.status(500).json({
      error: "Failed to detect phishing link"
    });

  }

};

module.exports = { detectPhishingLink };