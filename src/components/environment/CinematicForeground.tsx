'use client';

import { motion } from 'framer-motion';

export default function CinematicForeground() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-50">
      
      {/* Heavy Depth of Field Blur */}
      <div className="absolute inset-0 filter blur-[8px]">
        
        {/* Left Side: Hanging Chains */}
        <motion.div 
          className="absolute -left-[5%] top-[-10%] w-[10%] h-[120%] origin-top opacity-80"
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg viewBox="0 0 100 1000" className="w-full h-full drop-shadow-2xl">
            {Array.from({ length: 10 }).map((_, i) => (
              <g key={i} transform={`translate(0, ${i * 100})`}>
                <rect x="35" y="0" width="30" height="70" rx="15" fill="none" stroke="#0a0806" strokeWidth="10" />
                <rect x="40" y="50" width="20" height="70" rx="10" fill="none" stroke="#150e09" strokeWidth="15" />
              </g>
            ))}
          </svg>
        </motion.div>

        {/* Right Side: Hanging Heavy Tools */}
        <motion.div 
          className="absolute -right-[2%] top-[-5%] w-[15%] h-[80%] origin-top opacity-90"
          animate={{ rotate: [1, -1, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <svg viewBox="0 0 200 800" className="w-full h-full drop-shadow-2xl">
            {/* Hook */}
            <path d="M 100 0 Q 150 50 100 100 Q 50 150 100 200" fill="none" stroke="#0a0806" strokeWidth="20" strokeLinecap="round" />
            {/* Hanging Wrench Shape */}
            <rect x="80" y="200" width="40" height="300" rx="10" fill="#150e09" />
            <path d="M 50 500 Q 100 450 150 500 L 150 550 Q 100 500 50 550 Z" fill="#0a0806" />
            
            {/* Pulley Cable */}
            <line x1="50" y1="0" x2="50" y2="800" stroke="#060403" strokeWidth="8" />
          </svg>
        </motion.div>

        {/* Bottom: Edge of Blueprint Table */}
        <div className="absolute -bottom-[10%] -left-[10%] w-[120%] h-[30%] origin-bottom-left -rotate-2">
          <svg viewBox="0 0 1000 300" className="w-full h-full drop-shadow-[0_-20px_50px_rgba(0,0,0,1)]">
            <rect x="0" y="100" width="1000" height="200" fill="#1a120e" />
            <path d="M 0 100 L 1000 100 L 950 150 L 50 150 Z" fill="#2c1a0e" />
            {/* Blueprint paper corner */}
            <path d="M 100 120 L 400 110 L 350 160 L 50 170 Z" fill="#4a5f78" opacity="0.8" />
            <line x1="120" y1="130" x2="300" y2="125" stroke="#93c5fd" strokeWidth="2" opacity="0.5" />
            <line x1="130" y1="140" x2="320" y2="135" stroke="#93c5fd" strokeWidth="2" opacity="0.5" />
          </svg>
        </div>

      </div>

      {/* Steam (In focus, rising between foreground and midground) */}
      <div className="absolute bottom-0 w-full h-[50%] flex justify-between px-[10%] opacity-40 mix-blend-screen pointer-events-none">
        <motion.div 
          className="w-[30%] h-full bg-gradient-to-t from-[#e8c07a]/20 to-transparent blur-3xl rounded-full"
          animate={{ y: [0, -100, 0], scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="w-[40%] h-full bg-gradient-to-t from-[#60a5fa]/20 to-transparent blur-3xl rounded-full"
          animate={{ y: [0, -150, 0], scale: [1, 1.2, 1], opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

    </div>
  );
}
