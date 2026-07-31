'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CinematicBackground() {
  const dustRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate dust motes
    if (dustRef.current) {
      const dustContainer = dustRef.current;
      dustContainer.innerHTML = '';
      for (let i = 0; i < 50; i++) {
        const mote = document.createElement('div');
        mote.className = 'absolute bg-white rounded-full opacity-0';
        mote.style.width = Math.random() * 4 + 1 + 'px';
        mote.style.height = mote.style.width;
        mote.style.left = Math.random() * 100 + '%';
        mote.style.top = Math.random() * 100 + '%';
        dustContainer.appendChild(mote);

        gsap.to(mote, {
          y: `-=${Math.random() * 200 + 100}`,
          x: `+=${(Math.random() - 0.5) * 100}`,
          opacity: Math.random() * 0.4 + 0.1,
          duration: Math.random() * 10 + 10,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: Math.random() * -20,
        });
      }
    }
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full bg-[#030508] overflow-hidden pointer-events-none">
      {/* Cool blue moonlight gradient backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#1e3a5f]/40 via-[#0a1118]/80 to-[#030508] z-0" />

      {/* Massive Background Gears (Silhouettes) */}
      <div className="absolute inset-0 z-10 opacity-30">
        <motion.svg 
          viewBox="0 0 1000 1000" 
          className="absolute -right-[20%] -top-[20%] w-[120%] h-[120%] origin-center opacity-40 mix-blend-overlay"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
        >
          <circle cx="500" cy="500" r="450" fill="none" stroke="#0a1118" strokeWidth="100" strokeDasharray="150 50" />
          <circle cx="500" cy="500" r="400" fill="none" stroke="#0a1118" strokeWidth="20" />
          <line x1="500" y1="50" x2="500" y2="950" stroke="#0a1118" strokeWidth="60" />
          <line x1="50" y1="500" x2="950" y2="500" stroke="#0a1118" strokeWidth="60" />
        </motion.svg>

        <motion.svg 
          viewBox="0 0 1000 1000" 
          className="absolute -left-[30%] top-[30%] w-[100%] h-[100%] origin-center opacity-50 mix-blend-overlay"
          animate={{ rotate: -360 }}
          transition={{ duration: 180, repeat: Infinity, ease: 'linear' }}
        >
          <circle cx="500" cy="500" r="350" fill="none" stroke="#060b10" strokeWidth="80" strokeDasharray="100 80" />
          <circle cx="500" cy="500" r="300" fill="none" stroke="#060b10" strokeWidth="15" />
          <line x1="150" y1="150" x2="850" y2="850" stroke="#060b10" strokeWidth="40" />
          <line x1="850" y1="150" x2="150" y2="850" stroke="#060b10" strokeWidth="40" />
        </motion.svg>
      </div>

      {/* Huge Pipes (Silhouettes) */}
      <div className="absolute inset-0 z-20">
        <svg viewBox="0 0 1920 1080" className="w-full h-full opacity-60">
          <path d="M -100 200 Q 400 100 800 500 T 2000 800" fill="none" stroke="#05080c" strokeWidth="150" strokeLinecap="round" />
          <path d="M 2000 300 Q 1500 400 1200 100 T -100 -200" fill="none" stroke="#030507" strokeWidth="250" strokeLinecap="round" />
          <path d="M 500 -100 L 500 1200" fill="none" stroke="#020305" strokeWidth="120" />
          <path d="M 1500 -100 L 1500 1200" fill="none" stroke="#020305" strokeWidth="180" />
        </svg>
      </div>

      {/* Tall Gothic Windows (Light Source) */}
      <div className="absolute right-[5%] top-[10%] w-[20%] h-[60%] z-10 flex gap-8 opacity-70">
        <div className="w-1/3 h-full rounded-t-full bg-[#1e3a5f] blur-md mix-blend-screen opacity-40 shadow-[0_0_100px_#60a5fa]" />
        <div className="w-1/3 h-full rounded-t-full bg-[#1e3a5f] blur-md mix-blend-screen opacity-50 shadow-[0_0_150px_#60a5fa]" />
        <div className="w-1/3 h-full rounded-t-full bg-[#1e3a5f] blur-md mix-blend-screen opacity-30 shadow-[0_0_100px_#60a5fa]" />
      </div>

      {/* Volumetric Light Rays */}
      <div className="absolute right-0 top-0 w-full h-full z-25 overflow-hidden">
        <div className="absolute right-[10%] top-[10%] w-[150%] h-[100%] origin-top-right -rotate-[35deg] bg-gradient-to-l from-[#60a5fa]/10 via-[#3b82f6]/5 to-transparent blur-3xl mix-blend-screen pointer-events-none" />
        <div className="absolute right-[15%] top-[15%] w-[100%] h-[80%] origin-top-right -rotate-[30deg] bg-gradient-to-l from-[#93c5fd]/15 via-[#60a5fa]/10 to-transparent blur-2xl mix-blend-screen pointer-events-none" />
      </div>

      {/* Moving Atmosphere Shadows */}
      <motion.div 
        className="absolute inset-0 z-30 bg-[url('/textures/noise.png')] opacity-20 mix-blend-overlay"
        animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />

      {/* Dust Particles (Illuminated by moon) */}
      <div ref={dustRef} className="absolute inset-0 z-40 mix-blend-screen pointer-events-none" />
    </div>
  );
}
