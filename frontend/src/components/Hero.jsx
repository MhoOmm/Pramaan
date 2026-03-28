import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const words = ["DEEPFAKES . . . ", "PHISHING . . . ", "NEWS . . . . . .", "FRAUD . . . . . .", "SCAMS . . . . . ."];

function RotatingText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-flex items-baseline">
      <span>Detect&nbsp;</span>

      <span className="relative inline-flex overflow-hidden">
        <span className="invisible pointer-events-none">misinformation</span>
        <AnimatePresence>
          <motion.span
            key={index}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute left-0 top-0 w-full text-left font-bold text-white"
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}

export default function Hero({ heroOpacity, heroY }) {
  return (
    <motion.div style={{ opacity: heroOpacity, y: heroY }} className="mt-20">
      
      <h1 className="text-8xl md:text-9xl font-bold mb-6 tracking-tighter text-white pb-2">
        PRAMAAN
      </h1>

      <p className="text-3xl md:text-4xl text-white font-semibold mb-4 tracking-tight">
        Explaining the Truth Behind Every Verdict.
      </p>

      <p className="text-6xl md:text-5xl text-white font-semibold max-w-2xl mx-auto">
        <RotatingText />
      </p>

    </motion.div>
  );
}