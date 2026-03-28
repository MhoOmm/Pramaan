import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Lenis from 'lenis';
import Navbar from '../components/Navbar';
import CanvasScrollPlayer from '../components/CanvasScrollPlayer';
import Hero from '../components/Hero';
import SystemActivation from '../components/SystemActivation';
import MultipleModel from '../components/MultipleModel';
import CommunityCTA from '../components/CommunityCTA';


const Stage = ({ children, className = "", id = "" }) => (
  <section id={id} className={`relative h-screen flex flex-col justify-center px-10 max-w-7xl mx-auto w-full ${className}`}>
    {children}
  </section>
);



export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const canvasFrameProgress = useTransform(
    smoothProgress,
    [0, 0.20, 0.50, 0.80, 1],
    [0, 0.1, 0.6, 0.8, 1]
  );

  const heroOpacity = useTransform(scrollYProgress, [0, 0.15, 0.20], [1, 1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.20], [0, -50]);

  const actOpacity = useTransform(scrollYProgress, [0.20, 0.25, 0.45, 0.50], [0, 1, 1, 0]);
  const actY = useTransform(scrollYProgress, [0.20, 0.25], [50, 0]);

  const modTitleOpacity = useTransform(scrollYProgress, [0.5, 0.55, 0.75, 0.8], [0, 1, 1, 0]);



  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div ref={containerRef} className="relative bg-(--bg-color) text-(--text-primary)">
      <Navbar />

      {/* Dark background — no glow, flat */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-(--bg-color)" />

      {/* Canvas */}
      <div className="fixed inset-0 z-0">
        <CanvasScrollPlayer progress={canvasFrameProgress} />
        {/* Vignette to blend canvas edges into dark bg */}
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(circle at center, transparent 35%, #080808 90%)' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">

        {/* ── HERO (0–20%) ──────────────────────────────────── */}
        <Stage id="overview" className="items-center text-center">
          <Hero heroOpacity={heroOpacity} heroY={heroY} />
        </Stage>

        {/* ── SYSTEM ACTIVATION (20–50%) ────────────────────── */}
        <Stage id="how-it-works" className="items-start h-[150vh]">
          <div className="sticky top-0 h-screen flex items-center w-full">
            <SystemActivation actOpacity={actOpacity} actY={actY} />
          </div>
        </Stage>

        {/* ── MULTI-MODULE DETECTION (50–80%) ───────────────── */}
        <Stage id="detection" className="items-end text-right h-[150vh]">
          <MultipleModel modTitleOpacity={modTitleOpacity} scrollYProgress={scrollYProgress} />
        </Stage>

        {/* Spacer to prevent collision */}
        <div className="h-[50vh]" />

        {/* ── COMMUNITY & CTA (80–100%) ───────────────── */}
        <Stage id="community" className="items-center text-center">
          <CommunityCTA />
        </Stage>

      </div>
    </div>
  );
}