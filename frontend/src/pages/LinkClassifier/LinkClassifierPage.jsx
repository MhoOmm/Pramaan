import { useState, useEffect, useRef } from "react";
import Navbar from "../../components/Navbar";
import DecryptedText from '../../components/DecryptedText';

// ─── SVG Illustration — Shield + Link ────────────────────────────────────────
const DUMMY_URLS = [
  "http://www.kupijeftino.rs",
  "https://dev-ban0.pantheonsite.io/index3.php",
  "http://s951703658.onlinehome.us/",
  "https://www.project44.com",
  "https://miraarquitectos.cl/order/waybillorder/index.php",
  "http://uudainapthe.vn/",
  "https://ipfs.io/ipns/k51qzi5uqu5dio99vplcsg56h1sai7oxk8afe102gjrjpfsfs9nktq90c8t1zg",
  "https://www.beyondthebeltway.com",
];

function LinkShieldIllustration() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex(i => (i + 1) % DUMMY_URLS.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 pt-2">
      {/* Forensic corner frame */}
      <div className="relative p-6 w-[340px]">
        {/* Corner brackets */}
        {[
          "top-0 left-0 border-t border-l",
          "top-0 right-0 border-t border-r",
          "bottom-0 left-0 border-b border-l",
          "bottom-0 right-0 border-b border-r",
        ].map((cls, i) => (
          <div key={i} className={`absolute w-4 h-4 ${cls} border-[#333]`} />
        ))}

        {/* URL label */}
        <p className="text-[9px] tracking-[0.28em] text-[#FFFFFF] mb-3 uppercase"
          style={{ fontFamily: "Arial, sans-serif" }}>
          SCANNING TARGET
        </p>

        {/* DecryptedText cycling URL */}
        <div className="text-[13px] text-[#999] leading-relaxed break-all min-h-[60px]"
          style={{ fontFamily: "Arial, sans-serif" }}>
          <DecryptedText
            key={index}
            text={DUMMY_URLS[index]}
            animateOn="view"
            speed={35}
            maxIterations={14}
            characters="ABCDEFabcdef0123456789/:.-_?=&%#@!"
            revealDirection="start"
            sequential={false}
            className="text-[#777]"
            encryptedClassName="text-[#2e2e2e]"
          />
        </div>

        {/* Pulse bar */}
        <div className="mt-4 h-[1px] w-full bg-[#111] overflow-hidden rounded-full">
          <div
            className="h-full bg-[#333] rounded-full"
            style={{
              width: "60%",
              animation: "scanBar 3s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </div>
  );
}



function ScanProgressBar() {
  const [w, setW] = useState(0);
  const steps = ["RESOLVING DOMAIN", "CHECKING REPUTATION", "ANALYZING STRUCTURE", "CROSS-REFERENCING THREAT DB"];
  const [step, setStep] = useState(0);

  useEffect(() => {
    let pct = 0;
    const interval = setInterval(() => {
      pct += 1.2;
      setW(Math.min(pct, 95));
      if (pct > 95) clearInterval(interval);
    }, 40);
    const stepInterval = setInterval(() => setStep(s => (s + 1) % steps.length), 900);
    return () => { clearInterval(interval); clearInterval(stepInterval); };
  }, []);

  return (
    <div className="bg-[#050505] border border-[#1c1c1c] rounded-xl p-8 text-center">
      {/* Pulsing ring */}
      <div className="relative w-16 h-16 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full border border-white/10 animate-ping" style={{ animationDuration: "1.4s" }} />
        <div className="absolute inset-2 rounded-full border border-white/20" />
        <svg className="absolute inset-0 w-full h-full" style={{ animation: "spin 1.2s linear infinite" }} viewBox="0 0 64 64">
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <circle cx="32" cy="32" r="28" fill="none" stroke="#1a1a1a" strokeWidth="2" />
          <circle cx="32" cy="32" r="28" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="22 88" strokeLinecap="round" />
        </svg>
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-white/60" />
        </div>
      </div>

      <p className="font-arial text-[11px] text-white tracking-[0.25em] mb-2">{steps[step]}</p>
      <p className="font-arial text-[10px] text-[#333] tracking-[0.15em] mb-6">PLEASE WAIT</p>

      {/* Progress bar */}
      <div className="w-full h-[2px] bg-[#111] rounded-full overflow-hidden">
        <div
          className="h-full bg-white rounded-full transition-all"
          style={{ width: `${w}%`, transition: "width 0.04s linear" }}
        />
      </div>
      <p className="font-arial text-[9px] text-[#2a2a2a] tracking-widest mt-2">{Math.round(w)}%</p>
    </div>
  );
}

// ─── Result Card ─────────────────────────────────────────────────────────────

function ResultCard({ result, url }) {
  const [visible, setVisible] = useState(false);

  // Normalise backend response
  // Expected: { verdict: "suspicious" | "not suspicious" | "safe" | ... }
  const raw = (result?.verdict || result?.prediction || result?.label || "").toLowerCase().trim();
  const isSuspicious = raw.includes("phishing");

  const cfg = isSuspicious
    ? {
      label: "SUSPICIOUS",
      sublabel: "Potential threat detected",
      color: "#ff4444",
      glow: "rgba(255,68,68,0.25)",
      border: "rgba(255,68,68,0.55)",
      bg: "rgba(255,68,68,0.06)",
      icon: "⚠",
      statusText: "THREAT DETECTED — DO NOT VISIT",
    }
    : {
      label: "SAFE",
      sublabel: "No threats identified",
      color: "#00e5a0",
      glow: "rgba(0,229,160,0.25)",
      border: "rgba(0,229,160,0.55)",
      bg: "rgba(0,229,160,0.06)",
      icon: "✓",
      statusText: "LINK APPEARS LEGITIMATE",
    };

  useEffect(() => { const t = setTimeout(() => setVisible(true), 60); return () => clearTimeout(t); }, []);

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: "opacity 0.55s ease, transform 0.55s ease",
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        boxShadow: `0 0 48px ${cfg.glow}, 0 0 100px ${cfg.glow.replace("0.25", "0.08")}`,
      }}
    >
      {/* Top accent bar */}
      <div className="h-[3px] w-full" style={{ background: cfg.color, boxShadow: `0 0 12px ${cfg.color}` }} />

      <div className="p-8">
        {/* Header row */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[10px] tracking-[0.3em] mb-3" style={{ color: "#444", fontFamily: "Arial, sans-serif" }}>SCAN COMPLETE</p>
            <div className="flex items-center gap-4">
              {/* Icon badge */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ border: `1px solid ${cfg.border}`, color: cfg.color, background: cfg.bg }}
              >
                {cfg.icon}
              </div>
              <div>
                <h2 className="font-bold leading-none mb-1" style={{ fontSize: "clamp(26px,3.5vw,38px)", color: cfg.color, fontFamily: "Arial, sans-serif" }}>
                  {cfg.label}
                </h2>
                <p className="text-sm" style={{ color: "#555", fontFamily: "Arial, sans-serif" }}>{cfg.sublabel}</p>
              </div>
            </div>
          </div>

          {/* Live dot */}
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: cfg.color, boxShadow: `0 0 6px ${cfg.color}` }} />
            <span className="text-[9px] tracking-widest" style={{ color: "#333", fontFamily: "Arial, sans-serif" }}>LIVE</span>
          </div>
        </div>

        {/* Analysed URL chip */}
        {url && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-black/40 border border-white/5 flex items-center gap-3 overflow-hidden">
            <span className="text-[10px] tracking-widest flex-shrink-0" style={{ color: "#444", fontFamily: "Arial, sans-serif" }}>URL</span>
            <span className="text-xs truncate" style={{ color: "#666", fontFamily: "Arial, sans-serif" }}>{url}</span>
          </div>
        )}

        {result?.confidence != null && (
          <div className="mb-4">
            <div className="flex justify-between text-[10px] tracking-[0.2em] mb-2" style={{ color: "#444", fontFamily: "Arial, sans-serif" }}>
              <span>CONFIDENCE</span>
              <span style={{ color: cfg.color }}>{result.confidence}%</span>
            </div>
            <div className="h-[2px] bg-[#111] rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${result.confidence}%`, background: cfg.color, boxShadow: `0 0 8px ${cfg.color}` }} />
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="h-px my-5 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        {/* Status footer */}
        <div className="flex items-center justify-between">
          <p className="text-[10px] tracking-[0.18em]" style={{ color: cfg.color, fontFamily: "Arial, sans-serif" }}>{cfg.statusText}</p>
          <div className="w-2 h-2 rounded-full" style={{ background: cfg.color, boxShadow: `0 0 8px ${cfg.color}` }} />
        </div>
      </div>
    </div>
  );
}

// ─── Error State ─────────────────────────────────────────────────────────────

function ErrorState({ message, onRetry }) {
  return (
    <div className="bg-[#050505] border border-red-900/40 rounded-xl p-8 flex items-center justify-between gap-4">
      <div>
        <p className="text-[10px] tracking-[0.25em] text-red-500 mb-1" style={{ fontFamily: "Arial, sans-serif" }}>ERROR / SCAN FAILED</p>
        <p className="text-xs text-[#555]" style={{ fontFamily: "Arial, sans-serif" }}>{message || "Unable to reach scan endpoint"}</p>
      </div>
      <button
        onClick={onRetry}
        className="flex-shrink-0 bg-transparent border border-[#333] rounded-md text-[#777] text-[10px] tracking-widest px-4 py-2 cursor-pointer hover:border-[#555] transition-colors"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        RETRY
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LinkClassifierPage() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef(null);

  const handleSubmit = async () => {
    if (!url.trim()) return;
    setStatus("loading"); setResult(null); setErrorMsg("");
    try {
      const res = await fetch("http://localhost:5000/api/hf/detect-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      setResult(await res.json());
      setStatus("success");
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  };

  const handleReset = () => {
    setUrl(""); setStatus("idle"); setResult(null); setErrorMsg("");
    inputRef.current?.focus();
  };

  const canSubmit = url.trim().length > 0 && status !== "loading";

  // Derive threat level for illustration
  const threatLevel =
    status === "success" && result
      ? (result?.verdict || result?.prediction || "").toLowerCase().includes("suspicious")
        ? "suspicious" : "safe"
      : null;

  return (
    <>
      <Navbar />

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #000; }
        ::selection { background: rgba(255,255,255,0.15); }
        input:focus { outline: none; }
        input::placeholder { color: #555; }
        @keyframes scanBar {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(220%); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up   { animation: fadeUp 0.6s ease forwards; }
        .fade-up-1 { animation-delay: 0.05s; opacity: 0; }
        .fade-up-2 { animation-delay: 0.18s; opacity: 0; }
        .fade-up-3 { animation-delay: 0.3s;  opacity: 0; }

        /* Scanlines */
        .scanlines::after {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 100;
          background-image: repeating-linear-gradient(
            0deg, transparent, transparent 2px,
            rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px
          );
        }

        /* Grid bg */
        .grid-bg {
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size: 48px 48px;
        }
      `}</style>

      <div className="scanlines min-h-screen bg-black" style={{ fontFamily: "Arial, sans-serif" }}>

        {/* ── HERO SECTION ──────────────────────────────────────────────── */}
        <div className="grid-bg w-full px-12 pt-5 pb-0">
          <div className="flex items-center justify-between max-w-none">

            {/* Left — heading */}
            <div className="fade-up fade-up-1 pt-28">
              <p className="text-[11px] tracking-[0.22em] text-[#555] uppercase mb-3">
                ML SYSTEM / MODEL-06
              </p>
              <h1 className="font-bold leading-none mb-4 text-white" style={{ fontSize: "clamp(42px, 6vw, 78px)", letterSpacing: "-0.02em" }}>
                LINK
                <br />
                <span style={{ color: "#2a2a2a" }}>SCANNER</span>
              </h1>
              {/* Tag row */}
              <div className="flex items-center gap-3 mt-4">
                {["REAL-TIME", "THREAT INTEL", "URL ANALYSIS"].map(tag => (
                  <span
                    key={tag}
                    className="text-[10px] tracking-[0.18em] px-3 py-1 rounded-full border border-[#333] text-[#777]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — shield illustration */}
            <div className="fade-up fade-up-1 flex-shrink-0 pt-24">
              <LinkShieldIllustration />
            </div>

          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#1e1e1e] to-transparent" />

        {/* ── MAIN CONTENT ──────────────────────────────────────────────── */}
        <div className="px-12 py-12">
          <div className="max-w-2xl mx-auto">

            {/* URL Input card */}
            <div className="fade-up fade-up-2">
              <p className="text-[10px] tracking-[0.25em] text-[#666] mb-3 uppercase">Target URL</p>

              {/* Input wrapper */}
              <div className="relative flex items-center bg-[#050505] border border-[#222] rounded-xl overflow-hidden mb-4 group focus-within:border-[#444] transition-colors duration-300">

                {/* Link icon prefix */}
                <div className="flex-shrink-0 pl-5 pr-3 text-[#333] group-focus-within:text-[#555] transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                  </svg>
                </div>

                <input
                  ref={inputRef}
                  type="url"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://example.com/path?ref=..."
                  className="flex-1 bg-transparent border-none text-[#e0e0e0] text-sm py-5 pr-4"
                  style={{ fontFamily: "Arial, sans-serif", letterSpacing: "0.01em" }}
                  onKeyDown={e => { if (e.key === "Enter") handleSubmit(); }}
                />

                {/* Clear button */}
                {url.length > 0 && (
                  <button
                    onClick={handleReset}
                    className="flex-shrink-0 pr-5 text-[#333] hover:text-[#666] transition-colors text-xs tracking-widest"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Helper text row */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-[9px] tracking-[0.18em] text-[#777]">PRESS ENTER OR CLICK SCAN</p>
                <p className="text-[9px] tracking-[0.18em] text-[#777]">{url.length} CHARS</p>
              </div>

              {/* Scan button */}
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="w-full py-5 rounded-xl font-bold tracking-[0.3em] text-[13px] transition-all duration-300 relative overflow-hidden"
                style={{
                  background: canSubmit ? "#ffffff" : "#0d0d0d",
                  border: `1px solid ${canSubmit ? "transparent" : "#1a1a1a"}`,
                  color: canSubmit ? "#000" : "#2a2a2a",
                  cursor: canSubmit ? "pointer" : "not-allowed",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {status === "loading" ? "SCANNING..." : "SCAN LINK"}
              </button>
            </div>

            {/* ── OUTPUT SECTION ─────────────────────────────────────────── */}
            {status !== "idle" && (
              <div className="fade-up fade-up-3 mt-10">

                {/* Divider with label */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-[#111]" />
                  <span className="text-[9px] tracking-[0.3em] text-[#666]" style={{ fontFamily: "Arial, sans-serif" }}>SCAN RESULT</span>
                  <div className="flex-1 h-px bg-[#111]" />
                </div>

                {status === "loading" && <ScanProgressBar />}
                {status === "error" && <ErrorState message={errorMsg} onRetry={handleSubmit} />}
                {status === "success" && result && <ResultCard result={result} url={url} />}
              </div>
            )}

            {/* Footer */}
            <p className="mt-16 text-center text-[10px] tracking-[0.25em] text-[#888]" style={{ fontFamily: "Arial, sans-serif" }}>
              LINK SCANNER · THREAT INTELLIGENCE · REAL-TIME INFERENCE
            </p>

          </div>
        </div>
      </div>
    </>
  );
}