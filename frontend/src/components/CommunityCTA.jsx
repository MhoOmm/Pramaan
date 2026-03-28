import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

const CommunityCTA = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-4xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-10 md:p-16"
    >

      <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
        Join Our Community
      </h2>

      <p className="text-xl md:text-2xl text-white/80 mb-6 leading-relaxed">
        The platform also functions as a <span className="text-[27px] text-white font-extrabold">social media-style community</span>, where users can post suspected fake news or manipulated media, and other users can <span className="text-[27px] text-white font-extrabold">review, upvote, or downvote</span> its authenticity.
      </p>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-12 text-left inline-block">
        <h3 className="text-2xl font-bold text-white mb-3 flex items-center justify-center gap-3">
          <svg className="w-8 h-8 text-yellow-400 drop-shadow-md" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="7" fill="#FACC15" stroke="none" />
            <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" fill="none" stroke="#FACC15" strokeWidth="2" />
            <circle cx="12" cy="8" r="4" fill="#CA8A04" stroke="none" />
          </svg>
          KARMA POINTS
        </h3>
        <p className="text-lg text-white/60 text-center">
          A karma-based reputation system rewards users who consistently identify misinformation accurately. Build your credibility by verifying the truth.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        <a href="/login">
          <Button className="w-48 text-center">Login</Button>
        </a>
        <a href="/signup">
          <Button className="w-48 text-center">Sign Up</Button>
        </a>
      </div>

    </motion.div>
  );
};

export default CommunityCTA;
