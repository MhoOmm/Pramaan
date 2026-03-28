import { useState } from "react";
import Navbar from "../../components/Navbar";
import hello from "../../assets/hello.gif";

const FONT = "'Space Grotesk', sans-serif";

const RESULT_CONFIG = {
  fake: {
    label: "FAKE NEWS",
    color: "#ff4444",
    glow: "rgba(255,68,68,0.35)",
    border: "rgba(255,68,68,0.6)",
    icon: "⚠",
  },
  real: {
    label: "REAL NEWS",
    color: "#00e676",
    glow: "rgba(0,230,118,0.35)",
    border: "rgba(0,230,118,0.6)",
    icon: "✓",
  },
};

function ResultCard({ verdict, confidence }) {
  const cfg = verdict === "Fake News" ? RESULT_CONFIG.fake : RESULT_CONFIG.real;

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
          color: "#aaa",  // Improved contrast
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

      <div
        style={{
          marginTop: "18px",
          fontSize: "15px",
          color: "#ccc",  // Improved contrast
        }}
      >
        Confidence:{" "}
        <span style={{ color: cfg.color }}>
          {confidence}%
        </span>
      </div>
    </div>
  );
}

function ChatBot({ explanation }) {
  return (
    <div
      style={{
        background: "#050505",
        border: "1px solid #333",  // Slightly brighter border
        borderRadius: "12px",
        padding: "25px",
        maxHeight: "400px",  // Changed from fixed height to max-height
        overflowY: "auto",   // Ensures scroll works
        minHeight: "200px",  // Minimum visible height
      }}
    >
      <div
        style={{
          fontSize: "11px",
          letterSpacing: "0.2em",
          color: "#aaa",  // Fixed: brighter for visibility
          marginBottom: "15px",
        }}
      >
        PRAMAAN AI EXPLANATION
      </div>

      <div  // Wrapped in div for better control
        style={{
          color: "#eee",     // Fixed: much brighter text for dark bg
          fontSize: "15px",
          lineHeight: "1.6",
          minHeight: "120px", // Ensures space even if empty
          padding: "10px 0",
        }}
      >
        {explanation || "Ask AI to explain why this news may be fake."}
      </div>
    </div>
  );
}

export default function DetectFakeNews() {
  const [text, setText] = useState("");
  const [verdict, setVerdict] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeNews = async () => {
    if (!text.trim()) return;

    try {
      setLoading(true);
      setVerdict(null);
      setConfidence(null);
      setExplanation("");

      // 1. ML Detection FIRST (works)
      const mlRes = await fetch("http://localhost:5000/api/ml/analyze/fakenews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });

      if (!mlRes.ok) {
        throw new Error(`ML failed: ${mlRes.status}`);
      }

      const mlData = await mlRes.json();
      setVerdict(mlData.verdict || "Real News");
      setConfidence(mlData.confidence || 0);

      // 2. Explanation SECOND (non-blocking)
      try {
        const explainRes = await fetch(
          "http://localhost:5000/api/chatbot/pramaan",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: text.trim() }), // ✅ FIXED: 'text' not 'query'
          }
        );

        if (explainRes.ok) {
          const explainData = await explainRes.json();
          // Handle ALL possible response formats
          setExplanation(
            explainData.response ||
            explainData.reply?.message ||
            explainData.message ||
            explainData.reply?.label ||
            "Analysis complete."
          );
        } else {
          setExplanation("✅ ML Analysis: " + (mlData.verdict === "Fake News" ? "Fake detected!" : "Real news confirmed."));
        }
      } catch (explainErr) {
        // Explanation failed = use ML result
        console.warn("Explanation failed:", explainErr.message);
        setExplanation("✅ ML Analysis complete. " + (mlData.verdict === "Fake News" ? "Fake news detected!" : "Real news verified."));
      }

      setLoading(false);
    } catch (err) {
      console.error("ML Error:", err);
      setExplanation(`❌ ML Service Error: ${err.message}. Try restarting ML server on port 10000.`);
      setLoading(false);
    }
  };


  return (
    <>
      <Navbar />

      {/* GIF BACKGROUND */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `url(${hello})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.40,
          background: 'blur',
          zIndex: 0,
          pointerEvents: "none",
          filter: "contrast(1.2) saturate(0.8)"
        }}
      />

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
          }}
        >
          FAKE NEWS
          <br />
          <span style={{ color: "#333" }}>DETECTOR</span>
        </h1>

        <p
          style={{
            color: "#777",
            letterSpacing: "0.1em",
            fontSize: "13px",
            marginBottom: "25px",
          }}
        >
          NLP MODEL · MISINFORMATION ANALYSIS
        </p>

        <div style={{ marginBottom: "35px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <p style={{ color: "#aaa", fontSize: "14px", letterSpacing: "0.05em", margin: 0 }}>
            From the house of <strong style={{color: "#fff"}}>API_Smiths</strong>
          </p>
          <a
            href="https://no-fake-samachar.onrender.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px 24px",
              background: "rgba(255, 255, 255, 0.05)",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.2)",
              fontSize: "15px",
              letterSpacing: "0.05em",
              fontWeight: "500",
              backdropFilter: "blur(10px)",
              width: "fit-content",
              transition: "all 0.3s ease"
            }}
          >
            Explore our All-in-One True News Platform 🚀
          </a>
        </div>

        {/* TEXT INPUT */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the news article or claim here..."
          style={{
            width: "100%",
            height: "150px",
            background: "#050505",
            border: "1px solid #222",
            borderRadius: "10px",
            padding: "20px",
            color: "white",
            fontSize: "15px",
            marginBottom: "20px",
            resize: "vertical",  // Allow vertical resize only
          }}
        />

        {/* BUTTON */}
        <button
          onClick={analyzeNews}
          disabled={loading || !text.trim()}  // Disable when loading/empty
          style={{
            padding: "14px 28px",
            background: loading ? "#333" : "#111",  // Dim when loading
            border: "1px solid #555",
            color: "white",
            borderRadius: "8px",
            fontWeight: "700",
            letterSpacing: "0.1em",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "ANALYZING..." : "ANALYZE NEWS"}
        </button>

        {loading && (
          <p style={{ color: "#aaa", marginTop: "20px", fontSize: "16px" }}>
            AI analyzing news...
          </p>
        )}

        {(verdict || explanation) && (
          <div
            style={{
              marginTop: "50px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "50px",
            }}
          >
            {verdict && <ResultCard verdict={verdict} confidence={confidence} />}
            <ChatBot explanation={explanation} />
          </div>
        )}
      </div>
    </>
  );
}
