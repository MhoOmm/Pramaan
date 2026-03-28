import { useState, useEffect, useRef } from "react";
import Navbar from "../../components/Navbar";

// ─── Scanline overlay ─────────────────────────────────────────────────────────

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

// ─── Animated Envelope SVG ────────────────────────────────────────────────────

function EnvelopeSVG() {
  return (
    <svg
      width="120"
      height="88"
      viewBox="0 0 120 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>{`
        @keyframes flapOpen {
          0%,40%  { d: path("M4 4 L60 46 L116 4"); }
          60%,100%{ d: path("M4 4 L60 8  L116 4"); }
        }
        @keyframes envFloat {
          0%,100% { transform: translateY(0px);  }
          50%     { transform: translateY(-5px); }
        }
        @keyframes warnPulse {
          0%,100% { opacity: 0.15; r: 56; }
          50%     { opacity: 0.30; r: 62; }
        }
        .env-float { animation: envFloat 3.2s ease-in-out infinite; }
      `}</style>

      {/* Glow behind */}
      <circle cx="60" cy="44" r="56" fill="rgba(255,255,255,0.04)" style={{ animation: "warnPulse 2.8s ease-in-out infinite" }}/>

      {/* Envelope body */}
      <g className="env-float">
        <rect x="4" y="20" width="112" height="64" rx="6" fill="#0e0e0e" stroke="#2e2e2e" strokeWidth="1.5"/>

        {/* Bottom fold lines */}
        <line x1="4"  y1="84" x2="42" y2="52" stroke="#1e1e1e" strokeWidth="1"/>
        <line x1="116" y1="84" x2="78" y2="52" stroke="#1e1e1e" strokeWidth="1"/>

        {/* Flap — animated open */}
        <polyline
          points="4,20 60,56 116,20"
          fill="#111"
          stroke="#333"
          strokeWidth="1.5"
          strokeLinejoin="round"
          style={{ animation: "flapOpen 3.2s ease-in-out infinite" }}
        />

        {/* Warning badge */}
        <circle cx="86" cy="18" r="12" fill="#0e0e0e" stroke="#2a2a2a" strokeWidth="1"/>
        <text x="86" y="23" textAnchor="middle" fontSize="12" fill="#555">!</text>

        {/* Letter peeking out */}
        <rect x="28" y="34" width="64" height="36" rx="3" fill="#080808" stroke="#1a1a1a" strokeWidth="1"/>
        <rect x="34" y="42" width="40" height="2" rx="1" fill="#222"/>
        <rect x="34" y="48" width="52" height="2" rx="1" fill="#1a1a1a"/>
        <rect x="34" y="54" width="32" height="2" rx="1" fill="#1a1a1a"/>
      </g>
    </svg>
  );
}

// ─── Scrolling Phishing Email Preview ────────────────────────────────────────

const PHISHING_EMAILS = [
  {
    from: "security@paypa1-alerts.com",
    subject: "⚠ Your account has been limited",
    lines: [
      "Dear Valued Customer,",
      "We have detected unusual activity on your account.",
      "Your access has been temporarily suspended.",
      "Click below to verify your identity immediately:",
      "[ Verify Account Now → http://paypa1-secure.ru ]",
      "Failure to act within 24 hours will result in",
      "permanent account closure. — PayPal Security Team",
    ],
  },
  {
    from: "hr-noreply@company-hr-portal.net",
    subject: "Action Required: Update your salary info",
    lines: [
      "Hi Employee,",
      "Payroll is processing Q4 bonuses this week.",
      "We need you to confirm your bank details",
      "to ensure timely deposit of your payment.",
      "[ Update Bank Info → http://bit.ly/3xPay99 ]",
      "This link expires in 12 hours.",
      "— HR Department",
    ],
  },
  {
    from: "no-reply@apple-id-verify.info",
    subject: "Your Apple ID was used to sign in",
    lines: [
      "Apple ID Account Notice",
      "Your Apple ID was used to sign in to iCloud",
      "on a Windows device in an unknown location.",
      "If this wasn't you, your account may be compromised.",
      "[ Secure My Account → http://apple-id-verify.info ]",
      "Do not share this link with anyone.",
      "— Apple Support",
    ],
  },
];


function PhishingEmailPreview() {
  const [emailIdx, setEmailIdx] = useState(0);
  const [lineIdx, setLineIdx]   = useState(0);
  const [fade, setFade]         = useState(true);

  // Cycle through emails every ~7s
  useEffect(() => {
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setEmailIdx(i => (i + 1) % PHISHING_EMAILS.length);
        setLineIdx(0);
        setFade(true);
      }, 400);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  // Reveal lines one by one
  useEffect(() => {
    setLineIdx(0);
    const email = PHISHING_EMAILS[emailIdx];
    let cur = 0;
    const id = setInterval(() => {
      cur += 1;
      setLineIdx(cur);
      if (cur >= email.lines.length) clearInterval(id);
    }, 420);
    return () => clearInterval(id);
  }, [emailIdx]);

  const email = PHISHING_EMAILS[emailIdx];

  return (
    <div
      style={{
        opacity: fade ? 1 : 0,
        transition: "opacity 0.4s ease",
        background: "#050505",
        border: "1px solid #1a1a1a",
        borderRadius: "10px",
        overflow: "hidden",
        width: "100%",
      }}
    >
      {/* Email client chrome bar */}
      <div style={{ background: "#0a0a0a", borderBottom: "1px solid #141414", padding: "8px 14px", display: "flex", alignItems: "center", gap: "6px" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2a2a2a" }}/>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#222" }}/>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1a1a1a" }}/>
        <span style={{ marginLeft: 8, fontFamily: "Arial, sans-serif", fontSize: 9, color: "#2a2a2a", letterSpacing: "0.15em" }}>INTERCEPTED MAIL</span>
        {/* Blinking red dot */}
        <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#ff4444", boxShadow: "0 0 6px #ff4444", animation: "blink 1.2s ease-in-out infinite" }}/>
      </div>

      <div style={{ padding: "14px 16px" }}>
        {/* From */}
        <div style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "baseline" }}>
          <span style={{ fontFamily: "Arial, sans-serif", fontSize: 9, color: "#333", letterSpacing: "0.15em", flexShrink: 0 }}>FROM</span>
          <span style={{ fontFamily: "Arial, sans-serif", fontSize: 10, color: "#ff4444", letterSpacing: "0.03em", opacity: 0.8 }}>{email.from}</span>
        </div>
        {/* Subject */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "baseline" }}>
          <span style={{ fontFamily: "Arial, sans-serif", fontSize: 9, color: "#333", letterSpacing: "0.15em", flexShrink: 0 }}>SUBJ</span>
          <span style={{ fontFamily: "Arial, sans-serif", fontSize: 10, color: "#666" }}>{email.subject}</span>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#111", marginBottom: 12 }}/>

        {/* Body lines — reveal one by one */}
        <div style={{ minHeight: 96 }}>
          {email.lines.slice(0, lineIdx).map((line, i) => (
            <p
              key={i}
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: 10,
                color: line.startsWith("[") ? "#555" : "#2e2e2e",
                margin: "0 0 5px",
                letterSpacing: "0.02em",
                lineHeight: 1.5,
                animation: "fadeUp 0.3s ease forwards",
              }}
            >
              {line}
            </p>
          ))}
        </div>

        {/* REDACTED bar */}
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          <div style={{ height: 6, borderRadius: 3, background: "#111", flex: 2 }}/>
          <div style={{ height: 6, borderRadius: 3, background: "#0d0d0d", flex: 3 }}/>
          <div style={{ height: 6, borderRadius: 3, background: "#111", flex: 1 }}/>
        </div>

        {/* Footer label */}
        <p style={{ fontFamily: "Arial, sans-serif", fontSize: 8, color: "#1e1e1e", letterSpacing: "0.2em", marginTop: 10, textAlign: "right" }}>
          SAMPLE · NOT REAL · FOR DEMO ONLY
        </p>
      </div>
    </div>
  );
}

// ─── Right panel — envelope + preview ────────────────────────────────────────

function HeroRightPanel() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 120); }, []);

  return (
    <div
      style={{
        flexShrink: 0,
        width: 300,
        paddingTop: 112,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(14px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      {/* Envelope centred above preview */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <EnvelopeSVG />
      </div>

      {/* Scrolling email preview */}
      <PhishingEmailPreview />
    </div>
  );
}

// ─── Loading state ────────────────────────────────────────────────────────────

function AnalyzingState() {
  const [dots, setDots] = useState(0);
  const steps = ["PARSING HEADERS", "EXTRACTING FEATURES", "RUNNING MODEL", "EVALUATING INTENT"];
  const [step, setStep] = useState(0);

  useEffect(() => {
    const d = setInterval(() => setDots(x => (x + 1) % 4), 300);
    const s = setInterval(() => setStep(x => (x + 1) % steps.length), 750);
    return () => { clearInterval(d); clearInterval(s); };
  }, []);

  return (
    <div className="bg-[#050505] border border-[#1c1c1c] rounded-xl p-8 text-center">
      <div className="relative w-12 h-12 mx-auto mb-5">
        <div className="absolute inset-0 rounded-full border border-white/10 animate-ping" style={{ animationDuration: "1.4s" }}/>
        <svg className="absolute inset-0 w-full h-full" style={{ animation: "spin 1.2s linear infinite" }} viewBox="0 0 48 48">
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <circle cx="24" cy="24" r="20" fill="none" stroke="#1a1a1a" strokeWidth="2"/>
          <circle cx="24" cy="24" r="20" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="22 88" strokeLinecap="round"/>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-white/50"/>
        </div>
      </div>
      <p className="text-[11px] tracking-[0.25em] text-white mb-1" style={{ fontFamily: "Arial, sans-serif" }}>
        {steps[step]}{"·".repeat(dots)}
      </p>
      <p className="text-[10px] tracking-[0.15em] text-[#333]" style={{ fontFamily: "Arial, sans-serif" }}>PLEASE WAIT</p>
    </div>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────

function ErrorState({ message, onRetry }) {
  return (
    <div className="bg-[#050505] border border-red-900/40 rounded-xl p-7 flex items-center justify-between gap-4">
      <div>
        <p className="text-[10px] tracking-[0.25em] text-red-500 mb-1" style={{ fontFamily: "Arial, sans-serif" }}>ERROR / ANALYSIS FAILED</p>
        <p className="text-xs text-[#555]" style={{ fontFamily: "Arial, sans-serif" }}>{message || "Unable to reach the classification endpoint."}</p>
      </div>
      <button
        onClick={onRetry}
        className="flex-shrink-0 border border-[#333] rounded-md text-[#777] text-[10px] tracking-widest px-4 py-2 hover:border-[#555] transition-colors bg-transparent cursor-pointer"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        RETRY
      </button>
    </div>
  );
}

// ─── Result card ──────────────────────────────────────────────────────────────

function ResultCard({ result }) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const raw = (result?.verdict || result?.prediction || result?.label || "").toLowerCase();
  const isPhishing = raw === "phishing email";

  const cfg = isPhishing
    ? {
        label: "PHISHING",
        color: "#ff4444",
        glow: "rgba(255,68,68,0.22)",
        border: "rgba(255,68,68,0.55)",
        bg: "rgba(255,68,68,0.05)",
        icon: "⚠",
        status: "THREAT DETECTED — DO NOT INTERACT",
        desc: "This email exhibits characteristics consistent with a phishing attempt. It may be designed to steal credentials, install malware, or deceive the recipient into taking harmful action.",
      }
    : {
        label: "LEGITIMATE",
        color: "#00e5a0",
        glow: "rgba(0,229,160,0.22)",
        border: "rgba(0,229,160,0.55)",
        bg: "rgba(0,229,160,0.05)",
        icon: "✓",
        status: "NO THREATS IDENTIFIED",
        desc: "This email does not appear to contain phishing indicators. It is consistent with legitimate communication and poses no detected threat based on the current model evaluation.",
      };

  const confidence = result?.confidence ?? null;

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 60);
    const t2 = setTimeout(() => {
      if (confidence == null) return;
      let cur = 0;
      const target = typeof confidence === "number" && confidence <= 1
        ? Math.round(confidence * 100)
        : Math.round(confidence);
      const step = setInterval(() => {
        cur += Math.ceil((target - cur) / 8) || 1;
        if (cur >= target) { cur = target; clearInterval(step); }
        setProgress(cur);
      }, 20);
      return () => clearInterval(step);
    }, 350);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [result]);

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: "opacity 0.55s ease, transform 0.55s ease",
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        boxShadow: `0 0 48px ${cfg.glow}, 0 0 100px ${cfg.glow.replace("0.22", "0.07")}`,
      }}
    >
      <div className="h-[3px] w-full" style={{ background: cfg.color, boxShadow: `0 0 10px ${cfg.color}` }}/>

      <div className="p-8">
        <p className="text-[10px] tracking-[0.3em] text-[#444] mb-5" style={{ fontFamily: "Arial, sans-serif" }}>
          CLASSIFICATION RESULT
        </p>

        <div className="flex items-center gap-5 mb-6">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ border: `1px solid ${cfg.border}`, color: cfg.color, background: cfg.bg }}
          >
            {cfg.icon}
          </div>
          <div>
            <h3 className="font-bold leading-none mb-2" style={{ fontSize: "clamp(24px, 3vw, 34px)", color: cfg.color, fontFamily: "Arial, sans-serif" }}>
              {cfg.label}
            </h3>
            <p className="text-xs text-[#555] leading-relaxed" style={{ fontFamily: "Arial, sans-serif" }}>{cfg.desc}</p>
          </div>
        </div>

        {confidence != null && (
          <div className="mb-5">
            <div className="flex justify-between text-[10px] tracking-[0.2em] text-[#444] mb-2" style={{ fontFamily: "Arial, sans-serif" }}>
              <span>CONFIDENCE SCORE</span>
              <span style={{ color: cfg.color }}>{progress}%</span>
            </div>
            <div className="h-[2px] bg-[#111] rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${progress}%`, background: cfg.color, boxShadow: `0 0 8px ${cfg.color}`, transition: "width 0.05s linear" }}/>
            </div>
          </div>
        )}

        <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent my-5"/>

        <div className="flex items-center justify-between">
          <p className="text-[10px] tracking-[0.18em]" style={{ color: cfg.color, fontFamily: "Arial, sans-serif" }}>{cfg.status}</p>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: cfg.color, boxShadow: `0 0 8px ${cfg.color}` }}/>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function EmailClassifierPage() {
  const [emailText, setEmailText] = useState("");
  const [status, setStatus]       = useState("idle");
  const [result, setResult]       = useState(null);
  const [errorMsg, setErrorMsg]   = useState("");
  const textareaRef               = useRef(null);

  const handleSubmit = async () => {
    if (!emailText.trim()) return;
    setStatus("loading"); setResult(null); setErrorMsg("");
    try {
      const res = await fetch("http://localhost:5000/api/hf/detect-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: emailText.trim() }),
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
    setEmailText(""); setStatus("idle"); setResult(null); setErrorMsg("");
    textareaRef.current?.focus();
  };

  const canSubmit = emailText.trim().length > 0 && status !== "loading";

  return (
    <>
      <Navbar />
      <ScanlineOverlay />

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #000; }
        ::selection { background: rgba(255,255,255,0.15); }
        textarea:focus { outline: none; }
        textarea::placeholder { color: #555; }
        textarea::-webkit-scrollbar { width: 4px; }
        textarea::-webkit-scrollbar-track { background: transparent; }
        textarea::-webkit-scrollbar-thumb { background: #1e1e1e; border-radius: 2px; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%,100% { opacity: 1; }
          50%     { opacity: 0.2; }
        }
        .fu  { animation: fadeUp 0.6s ease forwards; opacity: 0; }
        .fu1 { animation-delay: 0.05s; }
        .fu2 { animation-delay: 0.18s; }
        .fu3 { animation-delay: 0.30s; }
        .grid-bg {
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size: 48px 48px;
        }
      `}</style>

      <div className="min-h-screen bg-black" style={{ fontFamily: "Arial, sans-serif" }}>
        {/* Background image */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundImage: `url('/EmailBackground/EmailPageBackground.png')`,
            // backgroundImage: `url('')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.18,
            zIndex: 0,
            pointerEvents: "none",
          }}
        />


        <div style={{ position: "relative", zIndex: 1 }}>

          {/* ── HERO ─────────────────────────────────────────────────────────── */}
          <div className="grid-bg w-full px-12 pt-5 pb-0">

          {/* Heading + paragraph — full width, left aligned */}
          <div className="fu fu1 pt-28 pb-10">
            <p className="text-[11px] tracking-[0.22em] text-[#555] uppercase mb-4" style={{ fontFamily: "Arial, sans-serif" }}>
              ML SYSTEM / MODEL-2
            </p>
            <h1
              className="font-bold text-left mb-6"
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: "clamp(32px, 5vw, 66px)",
                letterSpacing: "-0.02em",
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              <span className="text-white">EMAIL </span>
              <span style={{ color: "#666" }}>PHISHING </span>
              <span style={{ color: "#333" }}>DETECTOR</span>
            </h1>
            <p
              className="text-sm leading-relaxed text-left"
              style={{ fontFamily: "Arial, sans-serif", color: "#777", letterSpacing: "0.02em", maxWidth: "600px" }}
            >
              Paste any suspicious email content below and our NLP model will analyse
              linguistic patterns, header anomalies, and deceptive intent signals to
              determine whether it is a phishing attempt or a legitimate communication — in real time.
            </p>
          </div>

          {/* ── FLOATING PANELS ───────────────────────────────────────────── */}
          <div className="fu fu2 pb-14">

            {/* Floating keyword tags */}
            <div className="flex flex-wrap gap-3 mb-6">
              {[
                { label: "CLICK HERE",         color: "#ff4444", bg: "rgba(255,68,68,0.08)",   border: "rgba(255,68,68,0.25)"  },
                { label: "VERIFY NOW",         color: "#ffaa00", bg: "rgba(255,170,0,0.08)",  border: "rgba(255,170,0,0.25)"  },
                { label: "LEGITIMATE SENDER",  color: "#00e5a0", bg: "rgba(0,229,160,0.08)", border: "rgba(0,229,160,0.25)" },
                { label: "LIMITED TIME",       color: "#ff4444", bg: "rgba(255,68,68,0.08)",   border: "rgba(255,68,68,0.25)"  },
                { label: "VERIFIED DOMAIN",    color: "#00e5a0", bg: "rgba(0,229,160,0.08)", border: "rgba(0,229,160,0.25)" },
                { label: "FREE GIFT",          color: "#ff4444", bg: "rgba(255,68,68,0.08)",   border: "rgba(255,68,68,0.25)"  },
                { label: "CONFIRM IDENTITY",   color: "#ffaa00", bg: "rgba(255,170,0,0.08)",  border: "rgba(255,170,0,0.25)"  },
                { label: "NO LINKS",           color: "#00e5a0", bg: "rgba(0,229,160,0.08)", border: "rgba(0,229,160,0.25)" },
                { label: "WIN A PRIZE",        color: "#ff4444", bg: "rgba(255,68,68,0.08)",   border: "rgba(255,68,68,0.25)"  },
              ].map(({ label, color, bg, border }) => (
                <span
                  key={label}
                  className="text-[10px] tracking-[0.15em] px-3 py-1.5 rounded-full"
                  style={{ fontFamily: "Arial, sans-serif", color, background: bg, border: `1px solid ${border}` }}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* 3 floating mini email panels */}
            <div className="grid grid-cols-3 gap-4">

              {/* Panel 1 — Phishing example */}
              {/* <div className="rounded-xl overflow-hidden" style={{ background: "#050505", border: "1px solid #1a1a1a" }}>
                <div className="h-[2px]" style={{ background: "#ff4444", boxShadow: "0 0 8px #ff4444" }}/>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] tracking-[0.2em] text-[#333]" style={{ fontFamily: "Arial, sans-serif" }}>EXAMPLE · PHISHING</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ fontFamily: "Arial, sans-serif", color: "#ff4444", background: "rgba(255,68,68,0.1)", border: "1px solid rgba(255,68,68,0.3)" }}>⚠ THREAT</span>
                  </div>
                  <p className="text-[10px] text-[#444] mb-1" style={{ fontFamily: "Arial, sans-serif" }}>
                    <span className="text-[#2e2e2e]">FROM: </span>security@paypa1-alert.ru
                  </p>
                  <p className="text-[10px] text-[#333] mb-3" style={{ fontFamily: "Arial, sans-serif" }}>
                    <span className="text-[#2e2e2e]">SUBJ: </span>Your account has been limited
                  </p>
                  <div className="space-y-1.5">
                    <div className="h-1.5 rounded-full bg-[#111]" style={{ width: "90%" }}/>
                    <div className="h-1.5 rounded-full bg-[#0e0e0e]" style={{ width: "75%" }}/>
                    <div className="h-1.5 rounded-full" style={{ width: "60%", background: "rgba(255,68,68,0.12)", border: "1px solid rgba(255,68,68,0.2)" }}/>
                  </div>
                </div>
              </div> */}

              {/* Panel 2 — Legitimate example */}
              {/* <div className="rounded-xl overflow-hidden" style={{ background: "#050505", border: "1px solid #1a1a1a" }}>
                <div className="h-[2px]" style={{ background: "#00e5a0", boxShadow: "0 0 8px #00e5a0" }}/>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] tracking-[0.2em] text-[#333]" style={{ fontFamily: "Arial, sans-serif" }}>EXAMPLE · SAFE</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ fontFamily: "Arial, sans-serif", color: "#00e5a0", background: "rgba(0,229,160,0.1)", border: "1px solid rgba(0,229,160,0.3)" }}>✓ SAFE</span>
                  </div>
                  <p className="text-[10px] text-[#444] mb-1" style={{ fontFamily: "Arial, sans-serif" }}>
                    <span className="text-[#2e2e2e]">FROM: </span>noreply@github.com
                  </p>
                  <p className="text-[10px] text-[#333] mb-3" style={{ fontFamily: "Arial, sans-serif" }}>
                    <span className="text-[#2e2e2e]">SUBJ: </span>[GitHub] Please verify your email
                  </p>
                  <div className="space-y-1.5">
                    <div className="h-1.5 rounded-full bg-[#111]" style={{ width: "85%" }}/>
                    <div className="h-1.5 rounded-full bg-[#0e0e0e]" style={{ width: "70%" }}/>
                    <div className="h-1.5 rounded-full" style={{ width: "50%", background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.15)" }}/>
                  </div>
                </div>
              </div> */}

              {/* Panel 3 — Model signal bars */}
              {/* <div className="rounded-xl overflow-hidden" style={{ background: "#050505", border: "1px solid #1a1a1a" }}>
                <div className="h-[2px] bg-[#1e1e1e]"/>
                <div className="p-4">
                  <p className="text-[9px] tracking-[0.2em] text-[#333] mb-4" style={{ fontFamily: "Arial, sans-serif" }}>MODEL SIGNALS</p>
                  <div className="space-y-3">
                    {[
                      { label: "Suspicious sender domain", pct: 88, color: "#ff4444" },
                      { label: "Urgency language detected", pct: 74, color: "#ffaa00" },
                      { label: "Deceptive link pattern",    pct: 91, color: "#ff4444" },
                      { label: "Legitimate structure",       pct: 22, color: "#333"    },
                    ].map(({ label, pct, color }) => (
                      <div key={label}>
                        <div className="flex justify-between mb-1">
                          <span className="text-[9px] text-[#2e2e2e]" style={{ fontFamily: "Arial, sans-serif" }}>{label}</span>
                          <span className="text-[9px]" style={{ fontFamily: "Arial, sans-serif", color }}>{pct}%</span>
                        </div>
                        <div className="h-[2px] bg-[#0d0d0d] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div> */}

            </div>
          </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#1e1e1e] to-transparent"/>

          {/* ── INPUT + OUTPUT ────────────────────────────────────────────────── */}
          <div className="px-12 py-12">
          <div className="max-w-2xl mx-auto">

            <div className="fu fu2">
              <p className="text-[14px] tracking-[0.25em] text-[#FFFFFF] mb-3 uppercase">Email Content</p>

              <div className="relative bg-[#050505] border border-[#666] rounded-xl overflow-hidden mb-4 focus-within:border-[#3a3a3a] transition-colors duration-300">
                {[
                  { top: 0, left: 0, borderTop: "1px solid #2a2a2a", borderLeft: "1px solid #2a2a2a" },
                  { top: 0, right: 0, borderTop: "1px solid #2a2a2a", borderRight: "1px solid #2a2a2a" },
                  { bottom: 0, left: 0, borderBottom: "1px solid #2a2a2a", borderLeft: "1px solid #2a2a2a" },
                  { bottom: 0, right: 0, borderBottom: "1px solid #2a2a2a", borderRight: "1px solid #2a2a2a" },
                ].map((style, i) => (
                  <div key={i} style={{ position: "absolute", width: 14, height: 14, ...style }}/>
                ))}

                <div className="flex justify-between items-center px-6 pt-4 pb-0">
                  <span className="text-[10px] tracking-[0.25em] text-[#999]">INPUT / EMAIL BODY</span>
                  <span className="text-[10px] tracking-[0.1em] transition-colors" style={{ color: emailText.length > 0 ? "#999" : "#777" }}>
                    {emailText.length} CHARS
                  </span>
                </div>

                <textarea
                  ref={textareaRef}
                  value={emailText}
                  onChange={e => setEmailText(e.target.value)}
                  placeholder="Paste your email content here..."
                  rows={8}
                  className="block w-full bg-transparent border-none text-[#e0e0e0] text-sm leading-relaxed px-6 py-4"
                  style={{ fontFamily: "Arial, sans-serif", resize: "vertical", minHeight: "200px" }}
                  onKeyDown={e => { if (e.key === "Enter" && e.metaKey) handleSubmit(); }}
                />

                <div className="flex justify-between items-center px-6 py-3 border-t border-[#111]">
                  <span className="text-[9px] tracking-[0.15em] text-[#888]">⌘ + CLICK THE BUTTON TO SUBMIT</span>
                  {emailText.length > 0 && (
                    <button
                      onClick={handleReset}
                      className="text-[9px] tracking-[0.2em] text-[#888] hover:text-[#FFFFFF] transition-colors bg-transparent border-none cursor-pointer"
                      style={{ fontFamily: "Arial, sans-serif" }}
                    >
                      CLEAR
                    </button>
                  )}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="w-full py-5 rounded-xl font-bold tracking-[0.3em] text-[13px] transition-all duration-300"
                style={{
                  background: canSubmit ? "#ffffff" : "#0d0d0d",
                  border: `1px solid ${canSubmit ? "transparent" : "#1a1a1a"}`,
                  color: canSubmit ? "#000" : "#2a2a2a",
                  cursor: canSubmit ? "pointer" : "not-allowed",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {status === "loading" ? "ANALYSING..." : "ANALYSE EMAIL"}
              </button>
            </div>

            {status !== "idle" && (
              <div className="fu fu3 mt-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-[#111]"/>
                  <span className="text-[9px] tracking-[0.3em] text-[#222]" style={{ fontFamily: "Arial, sans-serif" }}>OUTPUT</span>
                  <div className="flex-1 h-px bg-[#111]"/>
                </div>
                {status === "loading" && <AnalyzingState />}
                {status === "error"   && <ErrorState message={errorMsg} onRetry={handleSubmit} />}
                {status === "success" && result && <ResultCard result={result} />}
              </div>
            )}

            <p className="mt-16 text-center text-[10px] tracking-[0.25em] text-[#999]" style={{ fontFamily: "Arial, sans-serif" }}>
              EMAIL PHISHING DETECTOR · NLP MODULE · REAL-TIME INFERENCE
            </p>
          </div>
          </div>

        </div>

      </div>
    </>
  );
}