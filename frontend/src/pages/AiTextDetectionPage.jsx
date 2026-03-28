import React, { useState, useRef } from "react";
import api from "../../axios";
import FutuBg from "../assets/futu.png";
import HumanImage from "../assets/humandetected.png";
import AiGif from "../assets/ai_detected.gif";

export default function AiTextDetectionPage() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const textareaRef = useRef(null);

  const handleSubmit = async () => {
    const words = text.trim().split(/\s+/).filter(Boolean);
    if (words.length < 10) return;
    setStatus("loading");
    setResult(null);
    try {
      const response = await api.post("/api/ml/analyze/ai-gen-hum-text", { text });
      setResult(response.data);
      setStatus("success");
    } catch (err) {
      console.error("API error:", err);
      setStatus("error");
    }
  };

  const reset = () => {
    setText("");
    setResult(null);
    setStatus("idle");
    setTimeout(() => textareaRef.current?.focus(), 200);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;

  const aiScore = result?.aiScore ?? result?.ai_score ?? 0;
  const conf = result?.confidence ?? 0;
  const label = result?.label ?? "";
  const verdict = result?.verdict ?? "";
  const isAI = label.toLowerCase() === "ai";
  const aiPct = (aiScore * 100).toFixed(1);
  const humanPct = ((1 - aiScore) * 100).toFixed(1);
  const confPct = (conf * 100).toFixed(1);
  const hasResult = status === "success" && result;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.86); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-32px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(32px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse {
          0%,100% { opacity:1; } 50% { opacity:0.3; }
        }
        @keyframes barGrow {
          from { width: 0%; }
        }

        .ai-page {
          min-height: 100vh; width: 100vw;
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          color: #fff; overflow-x: hidden; position: relative;
        }
        .bg-img {
          position: fixed; inset: 0;
          background-size: cover; background-position: center top;
          background-repeat: no-repeat;
          filter: brightness(0.28) saturate(0.55);
          z-index: 0; transform: scale(1.06);
        }
        .bg-overlay {
          position: fixed; inset: 0;
          background: linear-gradient(180deg, rgba(8,8,8,0.35) 0%, rgba(8,8,8,0.62) 45%, rgba(8,8,8,0.94) 100%);
          z-index: 1;
        }
        .scanlines {
          position: fixed; inset: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px);
          z-index: 2; pointer-events: none;
        }
        .page-wrap {
          position: relative; z-index: 3;
          min-height: 100vh; display: flex; flex-direction: column;
          align-items: center; padding: 60px 24px 80px;
        }

        /* Header */
        .header {
          text-align: center; margin-bottom: 44px; width: 100%;
          animation: fadeUp 0.8s cubic-bezier(.4,0,.2,1) both;
        }
        .badge {
          display: inline-block; font-size: 10px; letter-spacing: 0.22em;
          color: rgba(255,255,255,0.28); padding: 5px 14px;
          border: 1px solid rgba(255,255,255,0.08); border-radius: 9999px;
          margin-bottom: 20px;
        }
        .title {
          font-size: clamp(2.8rem, 7vw, 4.8rem); font-weight: 700;
          letter-spacing: -0.055em; line-height: 0.88;
          color: #fff; margin-bottom: 16px;
        }
        .subtitle {
          font-size: 0.97rem; color: rgba(255,255,255,0.38);
          line-height: 1.55; letter-spacing: -0.01em;
        }
        .subtitle span { color: rgba(255,255,255,0.18); }

        /* ── Main body ── */
        .main-body {
          width: 100%; max-width: 1100px;
          display: flex; gap: 32px; align-items: flex-start;
        }

        /* LEFT — image (only when result) */
        .img-col {
          flex: 0 0 340px;
          animation: slideInLeft 0.6s cubic-bezier(.4,0,.2,1) both;
          position: sticky; top: 60px;
        }
        .reaction-img {
          width: 100%; border-radius: 16px;
          object-fit: cover;
          animation: popIn 0.55s cubic-bezier(.34,1.56,.64,1) both;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .img-caption {
          margin-top: 12px; text-align: center;
          font-size: 11px; letter-spacing: 0.1em;
          color: rgba(255,255,255,0.2);
        }

        /* RIGHT — input + result */
        .right-col {
          flex: 1; min-width: 0;
          animation: fadeUp 0.7s 0.1s cubic-bezier(.4,0,.2,1) both;
        }
        /* When result is shown, right col slides in from right */
        .right-col.with-result {
          animation: slideInRight 0.5s cubic-bezier(.4,0,.2,1) both;
        }

        /* Input card */
        .input-card {
          background: rgba(255,255,255,0.045);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 16px; overflow: hidden;
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          transition: border-color 0.2s; margin-bottom: 10px;
        }
        .input-card:focus-within { border-color: rgba(255,255,255,0.2); }
        textarea {
          width: 100%; min-height: 180px;
          background: transparent; color: #fff;
          padding: 22px; border: none; resize: vertical;
          font-size: 0.97rem; font-family: inherit;
          outline: none; line-height: 1.65; letter-spacing: -0.01em;
        }
        textarea::placeholder { color: rgba(255,255,255,0.2); }
        .input-footer {
          padding: 10px 20px; border-top: 1px solid rgba(255,255,255,0.05);
          display: flex; justify-content: space-between; align-items: center;
        }
        .word-count { font-size: 11px; letter-spacing: 0.1em; }
        .clear-btn {
          background: none; border: none; color: rgba(255,255,255,0.2);
          font-size: 11px; letter-spacing: 0.1em; cursor: pointer;
          font-family: inherit; padding: 0; transition: color 0.2s;
        }
        .clear-btn:hover { color: rgba(255,255,255,0.55); }

        /* Analyze button */
        .analyze-btn {
          width: 100%; padding: 16px; border: none; border-radius: 9999px;
          font-weight: 600; font-size: 0.82rem; letter-spacing: 0.15em;
          font-family: inherit; cursor: pointer; transition: all 0.2s ease;
        }
        .analyze-btn.ready { background: #fff; color: #080808; }
        .analyze-btn.ready:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(255,255,255,0.18);
        }
        .analyze-btn.ready:active { transform: translateY(0); }
        .analyze-btn.disabled {
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.18); cursor: not-allowed;
        }

        .loading-hint {
          text-align: center; font-size: 11px;
          color: rgba(255,255,255,0.2); letter-spacing: 0.12em;
          margin-top: 12px; animation: pulse 1.5s ease infinite;
        }

        /* Error */
        .error-box {
          margin-top: 12px; padding: 20px;
          background: rgba(255,60,60,0.05);
          border: 1px solid rgba(255,60,60,0.14);
          border-radius: 12px; text-align: center; backdrop-filter: blur(16px);
        }
        .error-label {
          font-size: 11px; color: rgba(255,120,120,0.75);
          letter-spacing: 0.1em; margin-bottom: 12px;
        }
        .retry-btn {
          padding: 8px 22px; background: rgba(255,255,255,0.07);
          color: #fff; border: 1px solid rgba(255,255,255,0.10);
          border-radius: 9999px; font-size: 11px; letter-spacing: 0.1em;
          cursor: pointer; font-family: inherit; transition: all 0.2s;
        }
        .retry-btn:hover { background: rgba(255,255,255,0.12); }

        /* Divider */
        .divider {
          height: 1px; background: rgba(255,255,255,0.07); margin: 28px 0;
        }

        /* Result text block */
        .result-label {
          font-size: 10px; letter-spacing: 0.2em;
          color: rgba(255,255,255,0.28); margin-bottom: 14px;
        }
        .verdict-title {
          font-size: clamp(1.8rem, 3.5vw, 2.6rem); font-weight: 700;
          letter-spacing: -0.05em; line-height: 1; color: #fff; margin-bottom: 6px;
        }
        .verdict-sub {
          font-size: 0.9rem; color: rgba(255,255,255,0.35);
          letter-spacing: -0.01em; line-height: 1.4; margin-bottom: 24px;
        }
        .verdict-sub .funny { color: rgba(255,255,255,0.18); }

        /* Score card */
        .score-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 14px; padding: 20px;
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          margin-bottom: 10px;
        }
        .bar-labels {
          display: flex; justify-content: space-between;
          font-size: 11px; color: rgba(255,255,255,0.28);
          letter-spacing: 0.1em; margin-bottom: 8px;
        }
        .bar-track {
          height: 5px; background: rgba(255,255,255,0.07);
          border-radius: 5px; overflow: hidden; margin-bottom: 18px;
        }
        .bar-fill {
          height: 100%; border-radius: 5px;
          animation: barGrow 1s cubic-bezier(.4,0,.2,1) both;
        }
        .pills { display: flex; gap: 7px; flex-wrap: wrap; }
        .pill {
          padding: 6px 12px; background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08); border-radius: 9999px;
          font-size: 11px; letter-spacing: 0.09em;
          color: rgba(255,255,255,0.42); cursor: default; transition: background 0.2s;
        }
        .pill:hover { background: rgba(255,255,255,0.10); }
        .pill strong { color: #fff; font-weight: 600; }

        .reset-btn {
          width: 100%; padding: 13px; background: transparent;
          color: rgba(255,255,255,0.28);
          border: 1px solid rgba(255,255,255,0.08); border-radius: 9999px;
          font-size: 11px; letter-spacing: 0.14em; cursor: pointer;
          font-family: inherit; transition: all 0.2s ease;
        }
        .reset-btn:hover { color: #fff; border-color: rgba(255,255,255,0.25); }

        .footer {
          margin-top: 48px; font-size: 10px;
          color: rgba(255,255,255,0.12); letter-spacing: 0.14em;
          text-align: center; width: 100%;
        }

        /* Mobile */
        @media (max-width: 720px) {
          .main-body { flex-direction: column; max-width: 540px; }
          .img-col { flex: none; width: 100%; position: static; }
          .img-col, .right-col { animation-name: fadeUp; }
        }
      `}</style>

      <div className="ai-page">
        <div className="bg-img" style={{ backgroundImage: `url(${FutuBg})` }} />
        <div className="bg-overlay" />
        <div className="scanlines" />

        <div className="page-wrap">

          {/* Header */}
          <div className="header">
            <div className="badge">NLP MODULE · REAL-TIME INFERENCE</div>
            <h1 className="title">AI TEXT<br />DETECTOR</h1>
            <p className="subtitle">
              Not sure if that essay was written by a human?<br />
              <span>We'll tell you. Probably.</span>
            </p>
          </div>

          <div className="main-body">

            {/* ── LEFT: Image/GIF (only when result) ── */}
            {hasResult && (
              <div className="img-col">
                <img
                  className="reaction-img"
                  src={isAI ? AiGif : HumanImage}
                  alt={isAI ? "AI detected" : "Human detected"}
                  style={{
                    boxShadow: isAI
                      ? "0 0 60px rgba(255,70,70,0.30)"
                      : "0 0 60px rgba(0,229,160,0.22)",
                  }}
                />
                <div className="img-caption">
                  {isAI ? "CAUGHT RED-HANDED 🤖" : "SEEMS LEGIT 🧑"}
                </div>
              </div>
            )}

            {/* ── RIGHT: Input + Result text ── */}
            <div className={`right-col ${hasResult ? "with-result" : ""}`}>

              {/* Input card */}
              <div className="input-card">
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your text here... minimum 10 words or we simply cannot help you."
                />
                <div className="input-footer">
                  <span
                    className="word-count"
                    style={{
                      color: wordCount > 0 && wordCount < 10
                        ? "rgba(255,180,60,0.7)"
                        : "rgba(255,255,255,0.2)",
                    }}
                  >
                    {wordCount === 0
                      ? "0 WORDS"
                      : wordCount < 10
                        ? `${wordCount} WORDS · NEED ${10 - wordCount} MORE`
                        : `${wordCount} WORDS ✓`}
                  </span>
                  {text && (
                    <button
                      className="clear-btn"
                      onClick={() => { setText(""); setResult(null); setStatus("idle"); }}
                    >
                      CLEAR
                    </button>
                  )}
                </div>
              </div>

              <button
                className={`analyze-btn ${wordCount >= 10 && status !== "loading" ? "ready" : "disabled"}`}
                onClick={handleSubmit}
                disabled={wordCount < 10 || status === "loading"}
              >
                {status === "loading" ? "ANALYZING..." : "ANALYZE TEXT →"}
              </button>

              {status === "loading" && (
                <p className="loading-hint">CONSULTING THE ROBOT ORACLE...</p>
              )}

              {status === "error" && (
                <div className="error-box">
                  <div className="error-label">SOMETHING BROKE · NOT OUR FAULT PROBABLY</div>
                  <button className="retry-btn" onClick={handleSubmit}>TRY AGAIN</button>
                </div>
              )}

              {/* Result text block */}
              {hasResult && (
                <>
                  <div className="divider" />

                  <div className="result-label">ANALYSIS RESULT</div>

                  <div className="verdict-title">
                    {isAI ? "AI GENERATED" : "HUMAN WRITTEN"}
                  </div>
                  <div className="verdict-sub">
                    {verdict} · {confPct}% confidence<br />
                    <span className="funny">
                      {isAI ? "Your robot overlords are watching 🤖" : "A real human did this. Allegedly. 🧑"}
                    </span>
                  </div>

                  <div className="score-card">
                    <div className="bar-labels">
                      <span>AI {aiPct}%</span>
                      <span>HUMAN {humanPct}%</span>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${aiPct}%`,
                          background: isAI
                            ? "linear-gradient(90deg,#ff6b6b,#ff3333)"
                            : "linear-gradient(90deg,#51cf66,#00e5a0)",
                        }}
                      />
                    </div>
                    <div className="pills">
                      {[
                        { label: "AI SCORE", value: `${aiPct}%` },
                        { label: "HUMAN SCORE", value: `${humanPct}%` },
                        { label: "CONFIDENCE", value: `${confPct}%` },
                      ].map(({ label: l, value }) => (
                        <div key={l} className="pill">
                          {l} · <strong>{value}</strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="reset-btn" onClick={reset}>
                    ANALYZE ANOTHER TEXT
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="footer">PRAMAAN · AI TEXT DETECTOR · DeBERTa-v3 + RoBERTa</div>
        </div>
      </div>
    </>
  );
}