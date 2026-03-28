import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import api from "../../axios";

const FONT = "Arial, sans-serif";
// const FONT = "Space+Grotesk";

// ─── Utility ────────────────────────────────────────────────────────────────

const CATEGORY_CONFIG = {
  spam: {
    label: "SPAM",
    color: "#ff4444",
    glow: "rgba(255,68,68,0.35)",
    border: "rgba(255,68,68,0.6)",
    icon: "⚠",
    desc: "Unsolicited commercial or fraudulent message",
  },
  ham: {
    label: "LEGITIMATE",
    color: "#00e5a0",
    glow: "rgba(0,229,160,0.35)",
    border: "rgba(0,229,160,0.6)",
    icon: "✓",
    desc: "Genuine, non-spam message",
  },
  urgent: {
    label: "URGENT",
    color: "#ffaa00",
    glow: "rgba(255,170,0,0.35)",
    border: "rgba(255,170,0,0.6)",
    icon: "!",
    desc: "Time-sensitive message requiring immediate attention",
  },
  promotional: {
    label: "PROMOTIONAL",
    color: "#aa88ff",
    glow: "rgba(170,136,255,0.35)",
    border: "rgba(170,136,255,0.6)",
    icon: "◈",
    desc: "Marketing or promotional content",
  },
  normal: {
    label: "NORMAL",
    color: "#00e5a0",
    glow: "rgba(0,229,160,0.35)",
    border: "rgba(0,229,160,0.6)",
    icon: "◉",
    desc: "Standard conversational message",
  },
  default: {
    label: "CLASSIFIED",
    color: "#aaaaaa",
    glow: "rgba(170,170,170,0.25)",
    border: "rgba(170,170,170,0.5)",
    icon: "◈",
    desc: "Message has been classified",
  },
};

function getCategoryConfig(raw) {
  if (!raw) return CATEGORY_CONFIG.default;
  const key = raw.toLowerCase().trim();
  return CATEGORY_CONFIG[key] || {
    ...CATEGORY_CONFIG.default,
    label: raw.toUpperCase(),
    desc: "Message has been classified",
  };
}

// ─── Scanline Overlay ────────────────────────────────────────────────────────

function ScanlineOverlay() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 100,
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)",
        backgroundSize: "100% 4px",
      }}
    />
  );
}

// ─── Corner Brackets ────────────────────────────────────────────────────────

function CornerBrackets({ color = "#333", size = 18, thickness = 2 }) {
  const s = `${size}px`;
  const t = `${thickness}px`;
  const corners = [
    { top: 0, left: 0, borderTop: `${t} solid ${color}`, borderLeft: `${t} solid ${color}` },
    { top: 0, right: 0, borderTop: `${t} solid ${color}`, borderRight: `${t} solid ${color}` },
    { bottom: 0, left: 0, borderBottom: `${t} solid ${color}`, borderLeft: `${t} solid ${color}` },
    { bottom: 0, right: 0, borderBottom: `${t} solid ${color}`, borderRight: `${t} solid ${color}` },
  ];
  return (
    <>
      {corners.map((style, i) => (
        <div key={i} style={{ position: "absolute", width: s, height: s, ...style }} />
      ))}
    </>
  );
}

// ─── Banner ──────────────────────────────────────────────────────────────────

function SMSBanner() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "52px",
        width: "100%",
      }}
    >
      {/* LEFT — text anchored to page left edge */}
      <div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: "11px",
            letterSpacing: "0.2em",
            color: "#555",
            marginBottom: "14px",
            marginTop: "120px",
            textTransform: "uppercase",
          }}
        >
          ML SYSTEM / MODEL-03
        </div>
        <h1
          style={{
            fontFamily: FONT,
            fontSize: "clamp(40px, 6vw, 76px)",
            fontWeight: "700",
            color: "#ffffff",
            letterSpacing: "-0.02em",
            lineHeight: 1.0,
            margin: "0 0 18px",
          }}
        >
          SMS
          <br />
          <span style={{ color: "#2e2e2e" }}>CLASSIFIER</span>
        </h1>
        <p
          style={{
            fontFamily: FONT,
            fontSize: "12px",
            color: "#666",
            margin: 0,
            letterSpacing: "0.08em",
          }}
        >
          REAL-TIME   ·   NLP   ·   THREAT DETECTION
        </p>
      </div>

      {/* RIGHT — phone anchored to page right edge */}
      <div
        style={{
          flexShrink: 0,
          marginTop: "120px",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <svg
          width="210"
          height="230"
          viewBox="0 0 180 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <style>{`
            @keyframes bubbleIn1 { 0%,60% { opacity:0; transform: translateY(6px); } 80%,100% { opacity:1; transform: translateY(0); } }
            @keyframes bubbleIn2 { 0%,70% { opacity:0; transform: translateY(6px); } 90%,100% { opacity:1; transform: translateY(0); } }
            @keyframes bubbleIn3 { 0%,80% { opacity:0; transform: translateY(6px); } 100% { opacity:1; transform: translateY(0); } }
            @keyframes blink    { 0%,100% { opacity:1; } 50% { opacity:0.2; } }
            .b1 { animation: bubbleIn1 2.4s ease forwards infinite; }
            .b2 { animation: bubbleIn2 2.4s ease forwards infinite; animation-delay: 0.3s; }
            .b3 { animation: bubbleIn3 2.4s ease forwards infinite; animation-delay: 0.6s; }
            .dot  { animation: blink 1.2s ease-in-out infinite; }
            .dot2 { animation: blink 1.2s ease-in-out infinite; animation-delay: 0.2s; }
            .dot3 { animation: blink 1.2s ease-in-out infinite; animation-delay: 0.4s; }
          `}</style>

          <rect x="44" y="10" width="82" height="150" rx="14" fill="#0e0e0e" stroke="#2a2a2a" strokeWidth="1.5" />
          <rect x="52" y="24" width="66" height="110" rx="6" fill="#080808" />
          <rect x="76" y="168" width="18" height="3" rx="1.5" fill="#222" />
          <rect x="78" y="14" width="14" height="4" rx="2" fill="#1a1a1a" />

          <g className="b1">
            <rect x="56" y="32" width="42" height="22" rx="8" fill="#1a1a1a" stroke="#2c2c2c" strokeWidth="1" />
            <rect x="63" y="39" width="28" height="3" rx="1.5" fill="#333" />
            <rect x="63" y="45" width="18" height="3" rx="1.5" fill="#282828" />
          </g>
          <g className="b2">
            <rect x="70" y="62" width="42" height="22" rx="8" fill="#1f1f1f" stroke="#303030" strokeWidth="1" />
            <rect x="77" y="69" width="28" height="3" rx="1.5" fill="#3a3a3a" />
            <rect x="77" y="75" width="20" height="3" rx="1.5" fill="#2e2e2e" />
          </g>
          <g className="b3">
            <rect x="56" y="92" width="50" height="22" rx="8" fill="#1a1a1a" stroke="#2c2c2c" strokeWidth="1" />
            <rect x="63" y="99" width="36" height="3" rx="1.5" fill="#333" />
            <rect x="63" y="105" width="22" height="3" rx="1.5" fill="#282828" />
          </g>

          <rect x="56" y="122" width="32" height="16" rx="8" fill="#141414" stroke="#222" strokeWidth="1" />
          <circle className="dot" cx="66" cy="130" r="2" fill="#3a3a3a" />
          <circle className="dot2" cx="73" cy="130" r="2" fill="#3a3a3a" />
          <circle className="dot3" cx="80" cy="130" r="2" fill="#3a3a3a" />

          <rect x="100" y="16" width="3" height="5" rx="1" fill="#2a2a2a" />
          <rect x="105" y="14" width="3" height="7" rx="1" fill="#2a2a2a" />
          <rect x="110" y="12" width="3" height="9" rx="1" fill="#333" />
        </svg>
      </div>
    </div>
  );
}

// ─── Result Card ─────────────────────────────────────────────────────────────

function ResultCard({ result }) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const category = result?.verdict || result?.category || result?.prediction || result?.label;
  const confidence = result?.confidence ?? result?.score ?? null;
  const cfg = getCategoryConfig(category);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 50);
    const t2 = setTimeout(() => {
      const target = confidence != null ? Math.round(confidence * 100) : null;
      if (target !== null) {
        let cur = 0;
        const step = setInterval(() => {
          cur += Math.ceil((target - cur) / 8) || 1;
          if (cur >= target) { cur = target; clearInterval(step); }
          setProgress(cur);
        }, 20);
        return () => clearInterval(step);
      }
    }, 300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [result]);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        position: "relative",
        background: "#050505",
        border: `1px solid ${cfg.border}`,
        borderRadius: "12px",
        padding: "36px 40px",
        boxShadow: `0 0 40px ${cfg.glow}, 0 0 80px ${cfg.glow.replace("0.35", "0.1")}`,
        overflow: "hidden",
      }}
    >
      <CornerBrackets color={cfg.color} size={20} thickness={1.5} />
      <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "180px", height: "180px", background: cfg.glow, borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: FONT, fontSize: "10px", letterSpacing: "0.3em", color: "#444", marginBottom: "20px" }}>
          CLASSIFICATION RESULT
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "12px", border: `1px solid ${cfg.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", color: cfg.color, background: cfg.glow.replace("0.35", "0.1"), flexShrink: 0 }}>
            {cfg.icon}
          </div>
          <div>
            <div style={{ fontFamily: FONT, fontSize: "clamp(22px, 3vw, 32px)", fontWeight: "700", color: cfg.color, lineHeight: 1 }}>
              {cfg.label}
            </div>
            <div style={{ fontFamily: FONT, fontSize: "12px", color: "#555", marginTop: "6px" }}>
              {cfg.desc}
            </div>
          </div>
        </div>

        {confidence != null && (
          <div style={{ marginTop: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT, fontSize: "10px", color: "#444", letterSpacing: "0.2em", marginBottom: "8px" }}>
              <span>CONFIDENCE SCORE</span>
              <span style={{ color: cfg.color }}>{progress}%</span>
            </div>
            <div style={{ height: "3px", background: "#111", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: cfg.color, borderRadius: "2px", boxShadow: `0 0 8px ${cfg.color}`, transition: "width 0.05s linear" }} />
            </div>
          </div>
        )}

        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, #222, transparent)", margin: "24px 0" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: FONT, fontSize: "10px", color: "#333", letterSpacing: "0.15em" }}>STATUS: ANALYSIS COMPLETE</div>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: cfg.color, boxShadow: `0 0 8px ${cfg.color}` }} />
        </div>
      </div>
    </div>
  );
}

// ─── Loading State ───────────────────────────────────────────────────────────

function AnalyzingState() {
  const [dots, setDots] = useState(0);
  const steps = ["TOKENIZING INPUT", "VECTORIZING", "RUNNING MODEL", "CLASSIFYING"];
  const [step, setStep] = useState(0);

  useEffect(() => {
    const d = setInterval(() => setDots((x) => (x + 1) % 4), 300);
    const s = setInterval(() => setStep((x) => (x + 1) % steps.length), 700);
    return () => { clearInterval(d); clearInterval(s); };
  }, []);

  return (
    <div style={{ background: "#050505", border: "1px solid #1c1c1c", borderRadius: "12px", padding: "36px 40px", textAlign: "center" }}>
      <div style={{ position: "relative", width: "48px", height: "48px", margin: "0 auto 24px" }}>
        <svg width="48" height="48" viewBox="0 0 48 48" style={{ animation: "spin 1s linear infinite" }}>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <circle cx="24" cy="24" r="20" fill="none" stroke="#1a1a1a" strokeWidth="2" />
          <circle cx="24" cy="24" r="20" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="30 100" strokeLinecap="round" />
        </svg>
      </div>
      <div style={{ fontFamily: FONT, fontSize: "11px", color: "#ffffff", letterSpacing: "0.25em", marginBottom: "8px" }}>
        {steps[step]}{"·".repeat(dots)}
      </div>
      <div style={{ fontFamily: FONT, fontSize: "10px", color: "#333", letterSpacing: "0.15em" }}>PLEASE WAIT</div>
    </div>
  );
}

// ─── Error State ─────────────────────────────────────────────────────────────

function ErrorState({ message, onRetry }) {
  return (
    <div style={{ background: "#050505", border: "1px solid rgba(255,68,68,0.4)", borderRadius: "12px", padding: "32px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
      <div>
        <div style={{ fontFamily: FONT, fontSize: "10px", color: "#ff4444", letterSpacing: "0.25em", marginBottom: "6px" }}>ERROR / REQUEST FAILED</div>
        <div style={{ fontFamily: FONT, fontSize: "12px", color: "#555" }}>{message || "Unable to reach classification endpoint"}</div>
      </div>
      <button onClick={onRetry} style={{ flexShrink: 0, background: "transparent", border: "1px solid #333", borderRadius: "6px", color: "#777", fontFamily: FONT, fontSize: "10px", letterSpacing: "0.2em", padding: "10px 16px", cursor: "pointer" }}>
        RETRY
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SMSClassifierPage() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef(null);

  const handleChange = (e) => { setMessage(e.target.value); setCharCount(e.target.value.length); };

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setStatus("loading"); setResult(null); setErrorMsg("");
    try {
      const { data } = await api.post("http://localhost:5000/api/ml/analyze/sms", { text: message.trim() });
      setResult(data);
      setStatus("success");
    } catch (err) {
      const status = err?.response?.status;
      setErrorMsg(status ? `Server returned ${status}` : err.message);
      setStatus("error");
    }
  };

  const handleReset = () => {
    setMessage(""); setCharCount(0); setStatus("idle"); setResult(null); setErrorMsg("");
    textareaRef.current?.focus();
  };

  const canSubmit = message.trim().length > 0 && status !== "loading";

  return (
    <>
      <Navbar />

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #000; }
        ::selection { background: rgba(255,255,255,0.15); }
        textarea:focus { outline: none; }
        textarea::placeholder { color: #888; }
        textarea::-webkit-scrollbar { width: 4px; }
        textarea::-webkit-scrollbar-track { background: transparent; }
        textarea::-webkit-scrollbar-thumb { background: #1e1e1e; border-radius: 2px; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up   { animation: fadeUp 0.6s ease forwards; }
        .fade-up-1 { animation-delay: 0.05s; opacity: 0; }
        .fade-up-2 { animation-delay: 0.15s; opacity: 0; }
        .fade-up-3 { animation-delay: 0.25s; opacity: 0; }
      `}</style>

      {/* 20px top clears the navbar; 48px horizontal gives full-width breathing room */}
      <div style={{ minHeight: "100vh", background: "#000", padding: "20px 48px 80px" }}>

        {/* Banner spans full width */}
        <div className="fade-up fade-up-1">
          <SMSBanner />
        </div>

        {/* Input + Output centered at 720px */}
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>

          <div className="fade-up fade-up-2">
            <div style={{ position: "relative", background: "#050505", border: "1px solid #777", borderRadius: "12px", overflow: "hidden", marginBottom: "16px" }}>
              <CornerBrackets color="#999" size={8} thickness={1} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px 0" }}>
                <span style={{ fontFamily: FONT, fontSize: "10px", color: "#666", letterSpacing: "0.25em" }}>INPUT / MESSAGE</span>
                <span style={{ fontFamily: FONT, fontSize: "10px", color: charCount > 0 ? "#888" : "#555", letterSpacing: "0.1em", transition: "color 0.2s" }}>{charCount} CHARS</span>
              </div>

              <textarea
                ref={textareaRef}
                value={message}
                onChange={handleChange}
                placeholder="Enter your SMS here..."
                rows={6}
                style={{ display: "block", width: "100%", background: "transparent", border: "none", padding: "16px 24px 20px", color: "#e0e0e0", fontFamily: FONT, fontSize: "14px", lineHeight: "1.75", resize: "vertical", minHeight: "160px" }}
                onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) handleSubmit(); }}
              />

              {/* <div style={{ padding: "12px 24px", borderTop: "1px solid #111", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: FONT, fontSize: "9px", color: "#666", letterSpacing: "0.15em" }}>⌘ + ENTER TO SUBMIT</span>
                {message.length > 0 && (
                  <button onClick={handleReset} style={{ background: "transparent", border: "none", cursor: "pointer", fontFamily: FONT, fontSize: "9px", color: "#777", letterSpacing: "0.2em", padding: "4px 0" }}>CLEAR</button>
                )}
              </div> */}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              style={{ width: "100%", padding: "18px", background: canSubmit ? "#ffffff" : "#0d0d0d", border: `1px solid ${canSubmit ? "transparent" : "#1a1a1a"}`, borderRadius: "10px", color: canSubmit ? "#000" : "#2a2a2a", fontFamily: FONT, fontSize: "13px", fontWeight: "700", letterSpacing: "0.3em", cursor: canSubmit ? "pointer" : "not-allowed", transition: "all 0.25s ease" }}
            >
              {status === "loading" ? "ANALYZING..." : "ANALYZE MESSAGE"}
            </button>
          </div>

          {status !== "idle" && (
            <div className="fade-up fade-up-3" style={{ marginTop: "32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                <div style={{ flex: 1, height: "1px", background: "#111" }} />
                <span style={{ fontFamily: FONT, fontSize: "9px", color: "#2a2a2a", letterSpacing: "0.3em" }}>OUTPUT</span>
                <div style={{ flex: 1, height: "1px", background: "#111" }} />
              </div>
              {status === "loading" && <AnalyzingState />}
              {status === "error" && <ErrorState message={errorMsg} onRetry={handleSubmit} />}
              {status === "success" && result && <ResultCard result={result} />}
            </div>
          )}

          <div style={{ marginTop: "60px", textAlign: "center", fontFamily: FONT, fontSize: "9px", color: "#999", letterSpacing: "0.25em" }}>
            SMS CLASSIFIER · NLP MODULE · REAL-TIME INFERENCE
          </div>
        </div>
      </div>
    </>
  );
}