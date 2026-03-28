import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import aiGif from "../../assets/aifinal.gif"
import api from "../../../axios";

const FONT = "Arial, sans-serif";

const RESULT_CONFIG = {
  ai: {
    label: "AI GENERATED",
    color: "#ff4444",
    glow: "rgba(255,68,68,0.35)",
    border: "rgba(255,68,68,0.6)",
    icon: "⚠",
  },
  human: {
    label: "HUMAN IMAGE",
    color: "#00e676",
    glow: "rgba(0,230,118,0.35)",
    border: "rgba(0,230,118,0.6)",
    icon: "✓",
  },
};

const JOKES = [
  "AI made this image faster than I can make Maggi.",
  "If this is AI… somewhere a GPU is sweating.",
  "Humans blink. AI sometimes forgets eyelids.",
  "Deepfakes are like onions. Layers of lies.",
  "If AI drew this, Picasso would be proud.",
  "Humans: 9 months to create life. AI: 2 seconds.",
  "AI art: when math majors become painters.",
];

function JokeRotator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % JOKES.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        marginTop: "40px",
        fontFamily: FONT,
        fontSize: "22px",
        color: "#ddd",
        textAlign: "center",
        letterSpacing: "0.05em",
        fontWeight: "500",
      }}
    >
      🤖 {JOKES[index]}
    </div>
  );
}

function ResultCard({ result }) {
  const label = result?.prediction?.toLowerCase();
  let confidence = result?.confidence;

  if (confidence > 1) confidence = confidence / 100;

  const cfg =
    label === "ai" || label === "fake"
      ? RESULT_CONFIG.ai
      : RESULT_CONFIG.human;

  return (
    <div
      style={{
        background: "#050505",
        border: `1px solid ${cfg.border}`,
        borderRadius: "12px",
        padding: "40px",
        boxShadow: `0 0 60px ${cfg.glow}`,
      }}
    >
      <div
        style={{
          fontSize: "11px",
          letterSpacing: "0.25em",
          color: "#444",
          marginBottom: "14px",
        }}
      >
        DETECTION RESULT
      </div>

      <div
        style={{
          fontSize: "34px",
          color: cfg.color,
          fontWeight: "700",
        }}
      >
        {cfg.icon} {cfg.label}
      </div>

      {confidence && (
        <div
          style={{
            marginTop: "18px",
            fontSize: "15px",
            color: "#888",
          }}
        >
          Confidence:{" "}
          <span style={{ color: cfg.color }}>
            {(confidence * 100).toFixed(2)}%
          </span>
        </div>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <div
        style={{
          width: "42px",
          height: "42px",
          border: "4px solid #222",
          borderTop: "4px solid white",
          borderRadius: "50%",
          margin: "0 auto",
          animation: "spin 1s linear infinite",
        }}
      />

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div
        style={{
          marginTop: "16px",
          color: "#aaa",
          letterSpacing: "0.15em",
          fontSize: "13px",
        }}
      >
        ANALYZING IMAGE...
      </div>
    </div>
  );
}

export default function DetectFakeImage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("idle");

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const analyzeImage = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    try {
      setStatus("loading");

      const { data } = await api.post(
        "/api/ml/analyze/fakeimage",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setResult(data.prediction);
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <>
      <Navbar />

      {/* GIF Background */}
      {/* GIF Background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `url(${aiGif})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.35,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Dark Overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
          padding: "100px 80px",
          fontFamily: FONT,
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: "60px",
            marginBottom: "10px",
          }}
        >
          FAKE IMAGE
          <br />
          <span style={{ color: "#333" }}>DETECTOR</span>
        </h1>

        <p
          style={{
            color: "#777",
            letterSpacing: "0.1em",
            fontSize: "13px",
            marginBottom: "30px",
          }}
        >
          DEEPFAKE DETECTION · CNN MODEL · REAL TIME ANALYSIS
        </p>

        {/* Upload Button */}
        <label
          style={{
            display: "inline-block",
            padding: "14px 28px",
            border: "1px solid #333",
            borderRadius: "8px",
            color: "white",
            cursor: "pointer",
            marginRight: "20px",
            fontSize: "14px",
            letterSpacing: "0.1em",
          }}
        >
          UPLOAD IMAGE
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            style={{ display: "none" }}
          />
        </label>

        {/* Predict Button */}
        <button
          onClick={analyzeImage}
          style={{
            padding: "14px 28px",
            background: "#111",
            border: "1px solid #555",
            color: "white",
            borderRadius: "8px",
            fontWeight: "700",
            letterSpacing: "0.1em",
            cursor: "pointer",
          }}
        >
          PREDICT
        </button>

        <JokeRotator />

        {(preview || status !== "idle") && (
          <div
            style={{
              marginTop: "50px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "50px",
              alignItems: "center",
            }}
          >
            {/* IMAGE */}
            <div
              style={{
                background: "#050505",
                border: "1px solid #222",
                borderRadius: "12px",
                padding: "25px",
                textAlign: "center",
              }}
            >
              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  style={{
                    maxWidth: "100%",
                    borderRadius: "10px",
                  }}
                />
              )}
            </div>

            {/* RESULT */}
            <div>
              {status === "loading" && <LoadingState />}

              {status === "success" && result && (
                <ResultCard result={result} />
              )}

              {status === "error" && (
                <div style={{ color: "#ff4444" }}>
                  Failed to analyze image
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}