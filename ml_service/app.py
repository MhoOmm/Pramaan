from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import requests
from io import BytesIO
import pickle
import os
import re

app = Flask(__name__)

############################################
# FAKE NEWS DETECTION
############################################

with open("FakeNews/text_model_.pkl", "rb") as f:
    text_model = pickle.load(f)

with open("FakeNews/vectorizer_.pkl", "rb") as f:
    vectorizer = pickle.load(f)


@app.route("/predict-text", methods=["POST"])
def predictFakeNews():

    data = request.get_json()
    text = data.get("text")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    transformed = vectorizer.transform([text])
    prediction = text_model.predict(transformed)[0]
    probability = text_model.predict_proba(transformed)[0]

    return jsonify({
        "prediction": int(prediction),
        "confidence": float(max(probability))
    })


############################################
# DEEPFAKE IMAGE DETECTION
############################################

# Load CNN model
image_model = tf.keras.models.load_model("DeepFake/deepfake_detector.keras")

IMG_SIZE = 224


def preprocess_image(image):

    image = image.resize((IMG_SIZE, IMG_SIZE))
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)

    return image


@app.route("/predict-image", methods=["POST"])
def predictFakeImage():

    data = request.get_json()
    image_url = data.get("image_url")

    if not image_url:
        return jsonify({"error": "No image URL provided"}), 400

    try:

        # download image from cloudinary
        response = requests.get(image_url)
        image = Image.open(BytesIO(response.content)).convert("RGB")

        img = preprocess_image(image)

        prediction = image_model.predict(img)[0][0]

        if prediction > 0.5:
            label = "REAL"
            confidence = float(prediction)
        else:
            label = "FAKE"
            confidence = float(1 - prediction)

        return jsonify({
            "prediction": label,
            "confidence": round(confidence * 100, 2)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

############################################
# AI TEXT DETECTION
############################################

HF_SPACE_URL = "https://animan0810-pramaan-ai-detector-api.hf.space/detect"


@app.route("/predict-ai-text", methods=["POST"])
def predictAIText():
    data = request.get_json()
    text = (data.get("text") or "").strip()

    if not text:
        return jsonify({"error": "No text provided"}), 400

    if len(text.split()) < 10:
        return jsonify({"error": "Text too short (min 10 words)"}), 400

    try:
        res = requests.post(
            HF_SPACE_URL,
            json={"text": text},
            timeout=60
        )
        result = res.json()

        return jsonify({
            "prediction": 1 if result["label"] == "AI" else 0,
            "label":      result["label"],
            "verdict":    result["verdict"],
            "ai_score":   result["ai_score"],
            "confidence": result["confidence"]
        })

    except requests.exceptions.Timeout:
        return jsonify({"error": "Model is waking up, try again in 30 seconds"}), 503
    except Exception as e:
        return jsonify({"error": str(e)}), 500



############################################
# SMS CLASSIFICATION
############################################

with open("sms-classifier/rf_model.pkl", "rb") as f:
    sms_model = pickle.load(f)

with open("sms-classifier/vectorizer.pkl", "rb") as f:
    sms_vectorizer = pickle.load(f)

def preprocess_sms(text):
    text = text.lower()
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"\d+", "", text)
    text = re.sub(r"[^\w\s]", "", text)
    return text

@app.route("/predict-sms", methods=["POST"])
def predictSMS():

    data = request.get_json()
    text = data.get("text")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    try:
        clean_text = preprocess_sms(text)
        vec = sms_vectorizer.transform([clean_text])

        prediction = sms_model.predict(vec)[0]
        
        return jsonify({
            "prediction": str(prediction)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


############################################
# RUN SERVER
############################################

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)