'use client';

import { motion } from 'framer-motion';

export default function LaboratoryBackground() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      {/* Deep Dark Void Background */}
      <div className="absolute inset-0 bg-[#060403]" />

      {/* Massive Cathedral-style Window */}
      <svg viewBox="0 0 1000 800" className="absolute top-[-10%] w-[120%] h-[120%] left-[-10%] opacity-30">
        <path d="M 200 800 L 200 300 Q 500 0 800 300 L 800 800 Z" fill="none" stroke="var(--color-workshop-brass)" strokeWidth="6" />
        <path d="M 500 150 L 500 800" stroke="var(--color-workshop-brass)" strokeWidth="4" />
        <path d="M 200 450 Q 500 250 800 450" fill="none" stroke="var(--color-workshop-brass)" strokeWidth="4" />
        
        {/* Volumetric Sunlight Rays */}
        <path d="M 350 250 L -100 900 L 600 900 Z" fill="#fcdba1" opacity="0.08" style={{ filter: 'blur(50px)' }} />
        <path d="M 650 250 L 200 900 L 900 900 Z" fill="#fcdba1" opacity="0.06" style={{ filter: 'blur(40px)' }} />
      </svg>

      {/* Background Shelves (Left side) */}
      <div className="absolute top-[30%] left-[5%] w-[15%] h-[50%] bg-[#0f0a07] border-r-4 border-b-4 border-[#1a120c] shadow-2xl flex flex-col justify-around px-4">
        <div className="w-full h-3 bg-[#1a120c] shadow-lg relative">
          <div className="absolute bottom-3 left-2 w-6 h-10 bg-[var(--color-workshop-copper)] opacity-60 rounded-sm" />
          <div className="absolute bottom-3 left-10 w-8 h-12 bg-[#2d1f14] opacity-80" />
        </div>
        <div className="w-full h-3 bg-[#1a120c] shadow-lg relative">
          <svg viewBox="0 0 50 50" className="absolute bottom-3 left-4 w-12 h-12 opacity-50">
             <circle cx="25" cy="25" r="20" fill="none" stroke="var(--color-workshop-brass)" strokeWidth="4" strokeDasharray="5 5" />
          </svg>
        </div>
        <div className="w-full h-3 bg-[#1a120c] shadow-lg relative" />
      </div>

      {/* Massive Ceiling Gears (Right side) */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] opacity-20">
        <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-slow">
          <circle cx="100" cy="100" r="90" fill="none" stroke="var(--color-workshop-copper)" strokeWidth="15" strokeDasharray="20 10" />
          <circle cx="100" cy="100" r="80" fill="none" stroke="#1f1610" strokeWidth="5" />
          {[0, 60, 120].map(angle => (
            <line key={angle} x1="100" y1="20" x2="100" y2="180" stroke="#1f1610" strokeWidth="8" transform={`rotate(${angle} 100 100)`} />
          ))}
          <circle cx="100" cy="100" r="20" fill="var(--color-workshop-brass)" />
        </svg>
      </div>

      {/* Dark Pipes fading into bottom */}
      <div className="absolute bottom-[-10%] right-[10%] w-24 h-[40%] bg-gradient-to-t from-transparent to-[#110d0a] border-l-4 border-r-4 border-[#1a120c] opacity-50" />
      <div className="absolute bottom-[-10%] right-[20%] w-16 h-[30%] bg-gradient-to-t from-transparent to-[#110d0a] border-l-4 border-r-4 border-[#1a120c] opacity-40" />

      {/* Ambient floating dust particles (simple CSS circles) */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#fcdba1] rounded-full opacity-30"
          initial={{
            x: `${(i * 13) % 100}vw`,
            y: `${(i * 27) % 100}vh`,
            opacity: (i % 5) * 0.1
          }}
          animate={{
            y: [null, `${((i * 17) % 100)}vh`],
            x: [null, `${((i * 31) % 100)}vw`],
            opacity: [0.1, 0.5, 0.1]
          }}
          transition={{
            duration: 10 + (i % 20),
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}
