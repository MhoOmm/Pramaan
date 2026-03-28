import { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { HiEye, HiEyeOff, HiRefresh } from "react-icons/hi";
import logo from "../../assets/logo.jpeg";

/*
  Make sure index.html has:
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
*/

// ─── DiceBear ────────────────────────────────
const DICEBEAR_BASE = `https://api.dicebear.com/9.x/adventurer/svg`;
const avatarUrl = (seed) =>
  `${DICEBEAR_BASE}?seed=${encodeURIComponent(seed)}&backgroundColor=f3f4f6`;
const randomSeed = () => Math.random().toString(36).slice(2, 10);
const makeSeedBatch = () => Array.from({ length: 6 }, randomSeed);

const SG = { fontFamily: "'Inter', -apple-system, sans-serif" };

// ─── Motion ───────────────────────────────────
const slideVariants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};
const slideTrans = { duration: 0.26, ease: [0.16, 1, 0.3, 1] };

// ─── OTP Input ────────────────────────────────
function OTPInput({ value, onChange }) {
  const refs = useRef([]);
  useEffect(() => { refs.current[0]?.focus(); }, []);

  const handleChange = (val, i) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...value];
    next[i] = val.slice(-1);
    onChange(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace" && !value[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = Array(6).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    onChange(next);
    refs.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <div className="flex gap-2" onPaste={handlePaste}>
      {value.map((digit, i) => (
        <motion.input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target.value, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04, duration: 0.22 }}
          style={SG}
          className={`flex-1 h-14 text-center text-xl font-semibold rounded-xl border-2 outline-none
            transition-all duration-200 caret-zinc-800
            ${digit
              ? "border-zinc-800 bg-white text-zinc-900 shadow-sm"
              : "border-zinc-200 bg-zinc-50 text-zinc-900"
            }
            focus:border-zinc-800 focus:bg-white`}
        />
      ))}
    </div>
  );
}

// ─── Field ────────────────────────────────────
function Field({ label, error, type = "text", suffix, ...props }) {
  return (
    <div>
      <label style={SG} className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          {...props}
          style={SG}
          className={`w-full border rounded-xl px-4 py-3 ${suffix ? "pr-11" : ""}
            text-sm text-zinc-900 placeholder-zinc-300 outline-none transition-all duration-200
            bg-zinc-50 focus:bg-white
            focus:border-zinc-800 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.06)]
            ${error ? "border-red-300 bg-red-50" : "border-zinc-200"}`}
        />
        {suffix}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={SG} className="text-[11px] text-red-500 mt-1 pl-1"
          >
            {error.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Spinner ──────────────────────────────────
function Spinner({ label }) {
  return (
    <span className="flex items-center justify-center gap-2">
      <span className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
      {label}
    </span>
  );
}

// ─── Primary Button ───────────────────────────
function PrimaryBtn({ children, disabled, loading, label, ...props }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      disabled={disabled || loading}
      style={SG}
      className="w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200
        bg-zinc-900 text-white hover:bg-zinc-700
        disabled:opacity-30 disabled:cursor-not-allowed"
      {...props}
    >
      {loading ? <Spinner label={label} /> : children}
    </motion.button>
  );
}

/* ═══════════════════════════════════════════════
   LEFT PANEL — dark, big logo, big fonts
═══════════════════════════════════════════════ */
const PANEL = {
  signup: { step: 0, heading: "Begin your", accent: "journey.", sub: "Join a community building truth on the internet, one verdict at a time." },
  otp: { step: 1, heading: "Verify your", accent: "identity.", sub: "One step away from joining Pranaam." },
  login: { step: null, heading: "Welcome", accent: "back.", sub: "The truth has been waiting for you." },
};

function LeftPanel({ view }) {
  const p = PANEL[view];
  const isSignup = view !== "login";

  return (
    <div
      className="hidden lg:flex flex-col justify-between w-[46%] p-10 relative overflow-hidden"
      style={{ background: "linear-gradient(150deg, #0c0c0c 0%, #111 70%, #0a0a0a 100%)" }}
    >
      {/* grid texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#C8A97E 1px, transparent 1px), linear-gradient(90deg, #C8A97E 1px, transparent 1px)`,
          backgroundSize: "52px 52px",
        }}
      />
      {/* ambient glow top-left */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(200,169,126,0.15) 0%, transparent 65%)" }} />
      {/* ambient glow bottom-right */}
      <div className="absolute -bottom-40 -right-20 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(200,169,126,0.07) 0%, transparent 65%)" }} />

      {/* ── TOP: big logo + wordmark ── */}
      <div className="relative z-10">
        {/* Logo — big, no bg, no border, just the image */}
        <img
          src={logo}
          alt="Pranaam logo"
          className="w-28 h-28 object-contain mb-5"
          style={{ filter: " brightness(0.9)" }}
        />
        <div>
          <p style={SG} className="text-white font-extrabold text-5xl tracking-tight leading-none">
            PRAMAAN
          </p>
          <p style={SG} className="text-white/60 text-lg tracking-wide leading-none mt-2">
            Explaining the Truth Behind Every Verdict.
          </p>
        </div>
      </div>

      {/* ── MIDDLE: animated heading ── */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -22 }}
            transition={{ duration: 0.35 }}
          >
            <p style={SG} className="text-[#C8A97E] text-8xl font-black leading-none mb-6 opacity-20 select-none">"</p>

            <h2 className="text-white/50 font-light leading-tight" style={{ ...SG, fontSize: "clamp(2.4rem, 3.5vw, 3.2rem)", lineHeight: 1.1 }}>
              {p.heading}
            </h2>
            <h2 className="text-white font-extrabold leading-tight" style={{ ...SG, fontSize: "clamp(2.4rem, 3.5vw, 3.2rem)", lineHeight: 1.1 }}>
              {p.accent}
            </h2>

            <p style={SG} className="text-white/60  text-md mt-6 leading-relaxed max-w-xs">
              {p.sub}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* step bar — signup flow only */}
        {isSignup && (
          <div className="flex items-center gap-2 mt-10">
            {[0, 1].map((i) => (
              <div key={i} className={`h-0.5 rounded-full transition-all duration-500 ${i <= p.step ? "flex-[2] bg-[#C8A97E]" : "flex-1 bg-white/10"
                }`} />
            ))}
            <span style={SG} className="text-[10px] text-white/20 tracking-widest whitespace-nowrap ml-2">
              {p.step + 1} / 2
            </span>
          </div>
        )}
      </div>

      {/* ── BOTTOM ── */}
      <div className="relative z-10">
        <p style={SG} className="text-white/50 text-xs tracking-[0.25em] uppercase">
          Community · Truth · Transparency
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN SHELL
═══════════════════════════════════════════════ */
export default function Auth() {
  const navigate = useNavigate();
  const [view, setView] = useState("signup");
  const [pendingUser, setPendingUser] = useState("");

  return (
    <div className="min-h-screen flex" style={{ ...SG, background: "#0a0a0a" }}>
      <LeftPanel view={view} />

      {/* Right panel — white */}
      <div className="flex-1 flex flex-col bg-white">
        {/* mobile logo bar */}
        <div className="lg:hidden flex items-center gap-2.5 px-6 pt-8 pb-4 border-b border-zinc-100">
          <img src={logo} alt="Pranaam" className="w-8 h-8 object-contain" />
          <span style={SG} className="text-zinc-900 font-bold text-sm tracking-wide">Pranaam</span>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 py-14 overflow-hidden">
          <AnimatePresence mode="wait">
            {view === "signup" && (
              <SignupView
                key="signup"
                onSuccess={(uname) => { setPendingUser(uname); setView("otp"); }}
                goLogin={() => setView("login")}
              />
            )}
            {view === "otp" && (
              <OtpView
                key="otp"
                pendingUser={pendingUser}
                onBack={() => setView("signup")}
                onSuccess={() => navigate("/community")}
              />
            )}
            {view === "login" && (
              <LoginView
                key="login"
                goSignup={() => setView("signup")}
                onSuccess={() => navigate("/community")}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SIGNUP VIEW
═══════════════════════════════════════════════ */
function SignupView({ onSuccess, goLogin }) {
  const [seeds, setSeeds] = useState(makeSeedBatch);
  const [selectedSeed, setSelectedSeed] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const refreshAvatars = useCallback(() => {
    setSeeds(makeSeedBatch());
    setSelectedSeed(null);
  }, []);

  const onSubmit = async (data) => {
    if (!selectedSeed) { toast.error("Please choose an avatar"); return; }
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/user/signup", {
        userName: data.userName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        avatar: avatarUrl(selectedSeed),
      });
      toast.success("OTP sent to your email!");
      onSuccess(data.userName);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      variants={slideVariants} initial="enter" animate="center" exit="exit"
      transition={slideTrans} className="w-full max-w-md"
    >
      <div className="mb-7">
        <h1 style={SG} className="text-[1.75rem] font-bold text-zinc-900 tracking-tight">Create your account</h1>
        <p style={SG} className="text-zinc-400 text-sm mt-1.5">
          Already a member?{" "}
          <button onClick={goLogin} className="text-zinc-900 font-semibold underline underline-offset-2 hover:no-underline transition-all">
            Sign in
          </button>
        </p>
      </div>

      {/* Avatar picker */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <label style={SG} className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
            Choose Avatar
          </label>
          <button type="button" onClick={refreshAvatars}
            style={SG}
            className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-900 transition-colors">
            <HiRefresh className="text-sm" /> Refresh
          </button>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {seeds.map((seed) => (
            <motion.button
              key={seed} type="button" whileTap={{ scale: 0.88 }}
              onClick={() => setSelectedSeed(seed)}
              className={`relative aspect-square rounded-xl border-2 overflow-hidden transition-all duration-200 ${selectedSeed === seed
                  ? "border-zinc-900 shadow-md"
                  : "border-zinc-100 hover:border-zinc-300"
                }`}
            >
              <img src={avatarUrl(seed)} alt="avatar" className="w-full h-full object-cover bg-zinc-50" />
              <AnimatePresence>
                {selectedSeed === seed && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-zinc-900/10 flex items-end justify-end p-1"
                  >
                    <span className="bg-zinc-900 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">✓</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
        {!selectedSeed && (
          <p style={SG} className="text-[11px] text-zinc-300 mt-1.5">Select an avatar to continue</p>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        <Field label="Username" placeholder="yourname" error={errors.userName}
          {...register("userName", { required: "Username is required", minLength: { value: 3, message: "Min 3 characters" } })}
        />
        <Field label="Email" type="email" placeholder="you@example.com" error={errors.email}
          {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" } })}
        />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Password" type="password" placeholder="••••••••" error={errors.password}
            {...register("password", { required: "Required", minLength: { value: 6, message: "Min 6 chars" } })}
          />
          <Field label="Confirm" type="password" placeholder="••••••••" error={errors.confirmPassword}
            {...register("confirmPassword", {
              required: "Required",
              validate: (v) => v === watch("password") || "Doesn't match",
            })}
          />
        </div>
        <div className="pt-1">
          <PrimaryBtn loading={loading} label="Creating account…">Create account →</PrimaryBtn>
        </div>
      </form>

      <p style={SG} className="text-zinc-300 text-[11px] text-center mt-5 leading-relaxed">
        By signing up you agree to Pranaam's community standards of truth,<br />transparency and ethical AI use.
      </p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   OTP VIEW
═══════════════════════════════════════════════ */
function OtpView({ pendingUser, onBack, onSuccess }) {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpResent, setOtpResent] = useState(false);

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) { setError("Please enter all 6 digits."); return; }
    setLoading(true); setError(""); setOtpResent(false);
    try {
      const res = await axios.post("http://localhost:5000/api/user/otp-verify", {
        userName: pendingUser,
        otp: Number(code),
      });
      if (res.data.user?.token) {
        localStorage.setItem("token", res.data.user.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
      toast.success("Identity verified. Welcome to Pranaam 🙏");
      onSuccess();
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid OTP. Please try again.");
      setOtp(Array(6).fill(""));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true); setError(""); setOtpResent(false);
    try {
      await axios.post("http://localhost:5000/api/user/resend-otp", { userName: pendingUser });
      setOtpResent(true);
      setOtp(Array(6).fill(""));
    } catch (err) {
      setError(err?.response?.data?.message || "Could not resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      variants={slideVariants} initial="enter" animate="center" exit="exit"
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="w-full max-w-sm"
    >
      {/* Back */}
      <button onClick={onBack} style={SG}
        className="flex items-center gap-1.5 text-[0.78rem] text-zinc-400 hover:text-zinc-900 transition-colors mb-8 cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to sign up
      </button>

      {/* Email icon */}
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-zinc-100 border border-zinc-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-zinc-700" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      </div>

      <h2 style={SG} className="text-2xl font-bold text-zinc-900 mb-1.5 tracking-tight">Check your email</h2>
      <p style={SG} className="text-sm text-zinc-400 mb-7 leading-relaxed">
        We sent a 6-digit code to the email linked to{" "}
        <span className="font-semibold text-zinc-900">@{pendingUser}</span>.
        Enter it below to verify your account.
      </p>

      <AnimatePresence>
        {error && (
          <motion.div key="err"
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={SG}
            className="mb-5 px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-sm text-red-600">
            {error}
          </motion.div>
        )}
        {otpResent && (
          <motion.div key="resent"
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={SG}
            className="mb-5 px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-zinc-700">
            A new OTP has been sent to your email!
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleOtpSubmit}>
        <label style={SG} className="block mb-3 text-[0.72rem] font-semibold tracking-widest uppercase text-zinc-400">
          Verification Code
        </label>
        <OTPInput value={otp} onChange={setOtp} />
        <div className="mt-6">
          <PrimaryBtn loading={loading} label="Verifying…" disabled={otp.join("").length < 6}>
            Verify & Continue →
          </PrimaryBtn>
        </div>
      </form>

      <p style={SG} className="mt-6 text-center text-[0.82rem] text-zinc-400">
        Didn't receive it?{" "}
        <button onClick={handleResend} disabled={loading}
          className="text-zinc-900 font-semibold hover:opacity-50 transition-opacity cursor-pointer disabled:opacity-30">
          Resend code
        </button>
      </p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   LOGIN VIEW
═══════════════════════════════════════════════ */
function LoginView({ goSignup, onSuccess }) {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/user/login", {
        userName: data.userName,
        password: data.password,
      });
      if (res.data.user?.token) {
        localStorage.setItem("token", res.data.user.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
      toast.success("Welcome back to Pranaam 🙏");
      onSuccess();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      variants={slideVariants} initial="enter" animate="center" exit="exit"
      transition={slideTrans} className="w-full max-w-md"
    >
      <div className="mb-10">
        <h1 style={SG} className="text-[1.75rem] font-bold text-zinc-900 tracking-tight">Sign in to Pranaam</h1>
        <p style={SG} className="text-zinc-400 text-sm mt-1.5">
          New here?{" "}
          <button onClick={goSignup}
            className="text-zinc-900 font-semibold underline underline-offset-2 hover:no-underline transition-all">
            Create an account
          </button>
        </p>
      </div>

      <div className="flex items-center gap-3 mb-7">
        <div className="flex-1 h-px bg-zinc-100" />
        <span style={SG} className="text-[10px] text-zinc-300 tracking-widest uppercase">Enter credentials</span>
        <div className="flex-1 h-px bg-zinc-100" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Username" placeholder="yourname" error={errors.userName}
          {...register("userName", { required: "Username is required" })}
        />
        <Field
          label="Password"
          type={showPass ? "text" : "password"}
          placeholder="••••••••"
          error={errors.password}
          suffix={
            <button type="button" onClick={() => setShowPass((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-700 transition-colors">
              {showPass ? <HiEyeOff size={16} /> : <HiEye size={16} />}
            </button>
          }
          {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })}
        />
        <div className="pt-1">
          <PrimaryBtn loading={loading} label="Signing in…">Sign in →</PrimaryBtn>
        </div>
      </form>

      <p style={SG} className="text-zinc-300 text-[11px] text-center mt-8">
        Pranaam — Explaining the Truth Behind Every Verdict.
      </p>
    </motion.div>
  );
}