import React, { useEffect, useRef, useState } from 'react';
import { useMotionValueEvent } from 'framer-motion';

const CanvasScrollPlayer = ({ progress }) => {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);

  // 🔥 Load images from src using Vite
  useEffect(() => {
    const imageModules = import.meta.glob(
      '/src/assets/david-explode/*.jpg',
      { eager: true }
    );

    // Sort frames correctly
    // const imagePaths = Object.values(imageModules)
    //   .map((mod) => mod.default)
    //   .sort((a, b) => {
    //     const numA = parseInt(a.match(/(\d+)\.jpg$/)[1]);
    //     const numB = parseInt(b.match(/(\d+)\.jpg$/)[1]);
    //     return numA - numB;
    //   });
    const imagePaths = Object.keys(imageModules)
      .sort((a, b) => {
        const matchA = a.match(/(\d+)\.jpg$/);
        const matchB = b.match(/(\d+)\.jpg$/);
        const numA = matchA ? parseInt(matchA[1], 10) : 0;
        const numB = matchB ? parseInt(matchB[1], 10) : 0;
        return numA - numB;
      })
      .map((key) => imageModules[key].default);

    const imgs = [];
    let loaded = 0;

    imagePaths.forEach((src) => {
      const img = new Image();
      img.src = src;

      img.onload = () => {
        loaded++;
        if (loaded === imagePaths.length) {
          setImages(imgs);
          console.log("✅ All images loaded");
        }
      };

      img.onerror = () => {
        console.error("❌ Failed:", src);
        loaded++;
        if (loaded === imagePaths.length) {
          setImages(imgs);
        }
      };

      imgs.push(img);
    });
  }, []);

  // 🎯 Draw on scroll using MotionValue
  useMotionValueEvent(progress, "change", (latest) => {
    if (images.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const frameIndex = Math.min(
      images.length - 1,
      Math.max(0, Math.floor(latest * (images.length - 1)))
    );

    const img = images[frameIndex];
    if (!img) return;

    // Always set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Object-cover scaling
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);

    const centerX = (canvas.width - img.width * ratio) / 2;
    const centerY = (canvas.height - img.height * ratio) / 2;

    // Background
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw image
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerX,
      centerY,
      img.width * ratio,
      img.height * ratio
    );
  });

  // 📏 Resize canvas
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default CanvasScrollPlayer;