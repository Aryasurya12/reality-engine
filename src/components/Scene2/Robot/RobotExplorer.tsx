'use client';

import { motion } from 'framer-motion';

export default function RobotExplorer() {
  return (
    <div className="robot-container absolute bottom-[20%] left-[20%] z-[25] pointer-events-auto">
      <motion.svg 
        viewBox="0 0 200 300" 
        className="w-32 h-48 drop-shadow-2xl cursor-pointer"
        whileHover={{ scale: 1.05 }}
      >
        {/* Antenna */}
        <line className="robot-antenna" x1="100" y1="20" x2="100" y2="50" stroke="var(--color-workshop-copper)" strokeWidth="4" />
        <circle className="robot-antenna-bulb" cx="100" cy="20" r="8" fill="#fcdba1" />
        
        {/* Head */}
        <rect className="robot-head" x="60" y="50" width="80" height="60" rx="10" fill="#150e09" stroke="var(--color-workshop-brass)" strokeWidth="4" style={{ transformOrigin: "100px 110px" }} />
        
        {/* Eyes */}
        <g className="robot-eyes">
          <path d="M 75 80 Q 85 90 95 80" fill="none" stroke="#fcdba1" strokeWidth="4" strokeLinecap="round" />
          <path d="M 105 80 Q 115 90 125 80" fill="none" stroke="#fcdba1" strokeWidth="4" strokeLinecap="round" />
        </g>

        {/* Neck */}
        <rect x="90" y="110" width="20" height="20" fill="var(--color-workshop-copper)" />
        
        {/* Body */}
        <rect className="robot-body" x="50" y="130" width="100" height="90" rx="15" fill="#d9453b" stroke="var(--color-workshop-brass)" strokeWidth="4" />
        <circle cx="100" cy="175" r="20" fill="#fcdba1" opacity="0.8" filter="blur(2px)" />
        
        {/* Arms */}
        <rect className="robot-arm-left" x="30" y="140" width="15" height="60" rx="5" fill="var(--color-workshop-copper)" stroke="var(--color-workshop-brass)" strokeWidth="2" style={{ transformOrigin: "40px 145px" }} />
        <rect className="robot-arm-right" x="155" y="140" width="15" height="60" rx="5" fill="var(--color-workshop-copper)" stroke="var(--color-workshop-brass)" strokeWidth="2" style={{ transformOrigin: "160px 145px" }} />
        
        {/* Wheels/Legs */}
        <rect className="robot-leg-left" x="70" y="220" width="15" height="30" rx="5" fill="var(--color-workshop-copper)" />
        <rect className="robot-leg-right" x="115" y="220" width="15" height="30" rx="5" fill="var(--color-workshop-copper)" />
      </motion.svg>
    </div>
  );
}
