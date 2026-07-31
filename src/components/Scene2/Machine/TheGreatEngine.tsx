'use client';

import { motion } from 'framer-motion';

export default function TheGreatEngine() {
  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-auto z-20">
      <svg viewBox="0 0 1200 1200" className="w-[60%] h-[90%] drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] origin-bottom">
        
        {/* Main Base Structure */}
        <path d="M 300 1100 L 900 1100 L 850 800 L 350 800 Z" fill="#0d0907" stroke="var(--color-workshop-brass)" strokeWidth="6" />
        <rect x="400" y="800" width="400" height="150" fill="#150e09" stroke="var(--color-workshop-copper)" strokeWidth="4" />
        
        {/* Copper Steam Pistons (Animated via CSS/GSAP later, or Framer Motion here) */}
        <g transform="translate(450, 800)">
          <rect x="0" y="-100" width="80" height="150" fill="#0d0907" stroke="var(--color-workshop-brass)" strokeWidth="4" />
          <motion.rect x="20" y="-80" width="40" height="100" fill="var(--color-workshop-copper)" 
            animate={{ y: [-10, 30, -10] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <rect x="15" y="0" width="50" height="30" fill="var(--color-workshop-brass)" />
        </g>
        
        <g transform="translate(670, 800)">
          <rect x="0" y="-100" width="80" height="150" fill="#0d0907" stroke="var(--color-workshop-brass)" strokeWidth="4" />
          <motion.rect x="20" y="-80" width="40" height="100" fill="var(--color-workshop-copper)" 
            animate={{ y: [30, -10, 30] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <rect x="15" y="0" width="50" height="30" fill="var(--color-workshop-brass)" />
        </g>

        {/* Massive Rotating Flywheel */}
        <motion.g 
          style={{ transformOrigin: "600px 500px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {/* Outer Ring */}
          <circle cx="600" cy="500" r="280" fill="none" stroke="#1f1610" strokeWidth="40" />
          <circle cx="600" cy="500" r="260" fill="none" stroke="var(--color-workshop-copper)" strokeWidth="10" />
          {/* Spokes */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
            <line key={angle} x1="600" y1="220" x2="600" y2="780" stroke="var(--color-workshop-brass)" strokeWidth="15" transform={`rotate(${angle} 600 500)`} />
          ))}
          {/* Inner Hub */}
          <circle cx="600" cy="500" r="60" fill="#0d0907" stroke="var(--color-workshop-brass)" strokeWidth="8" />
          <circle cx="600" cy="500" r="30" fill="var(--color-workshop-copper)" />
        </motion.g>

        {/* Interaction Target: Hover Flywheel */}
        <motion.circle 
          cx="600" cy="500" r="300" fill="transparent"
          whileHover={{ scale: 1.05 }}
          className="cursor-pointer"
        />

        {/* Central Glowing Core (Tesla Coil / Reactor) */}
        <motion.circle cx="600" cy="500" r="40" fill="#fcdba1" filter="blur(15px)"
           animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.2, 1] }}
           transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle cx="600" cy="500" r="20" fill="#fff" opacity="0.9" filter="blur(2px)" />

        {/* Massive Top Pipes */}
        <path d="M 500 220 Q 500 50 300 0" fill="none" stroke="var(--color-workshop-copper)" strokeWidth="50" strokeLinecap="round" />
        <path d="M 700 220 Q 700 50 900 0" fill="none" stroke="var(--color-workshop-brass)" strokeWidth="40" strokeLinecap="round" />
        <path d="M 600 220 L 600 0" fill="none" stroke="#2d1f14" strokeWidth="60" />

        {/* Small Brass Gear Cluster */}
        <motion.g 
          style={{ transformOrigin: "350px 650px" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="350" cy="650" r="80" fill="none" stroke="var(--color-workshop-brass)" strokeWidth="20" strokeDasharray="30 15" />
          <circle cx="350" cy="650" r="60" fill="none" stroke="#1f1610" strokeWidth="5" />
          <line x1="270" y1="650" x2="430" y2="650" stroke="var(--color-workshop-brass)" strokeWidth="10" />
          <line x1="350" y1="570" x2="350" y2="730" stroke="var(--color-workshop-brass)" strokeWidth="10" />
          <circle cx="350" cy="650" r="20" fill="#0d0907" stroke="var(--color-workshop-copper)" strokeWidth="4" />
        </motion.g>

        {/* Pressure Gauge Panel */}
        <motion.g transform="translate(800, 600)" whileHover={{ scale: 1.1 }} className="cursor-pointer">
          <rect x="0" y="0" width="120" height="120" rx="20" fill="#150e09" stroke="var(--color-workshop-copper)" strokeWidth="4" />
          {/* Gauge 1 */}
          <circle cx="60" cy="60" r="40" fill="#fcdba1" stroke="var(--color-workshop-brass)" strokeWidth="6" opacity="0.9" />
          <circle cx="60" cy="60" r="30" fill="none" stroke="#110d0a" strokeWidth="1" strokeDasharray="2 5" />
          <motion.line x1="60" y1="60" x2="35" y2="35" stroke="#d9453b" strokeWidth="3" strokeLinecap="round" style={{ transformOrigin: "60px 60px" }}
            animate={{ rotate: [-10, 50, 10, 80, -20] }}
            transition={{ duration: 2, repeat: Infinity, ease: "circInOut" }}
          />
          <circle cx="60" cy="60" r="6" fill="#110d0a" />
        </motion.g>

        {/* Indicator Lights Panel */}
        <g transform="translate(450, 980)">
          <rect x="0" y="0" width="300" height="80" rx="10" fill="#150e09" stroke="var(--color-workshop-brass)" strokeWidth="4" />
          {[40, 110, 180, 250].map((x, i) => (
            <motion.circle key={i} cx={x + 10} cy="40" r="15" fill={i === 2 ? "#d9453b" : "#4caf50"} 
               animate={{ opacity: [0.3, 1, 0.3] }}
               transition={{ duration: 1 + Math.random(), repeat: Infinity, ease: "easeInOut", delay: Math.random() }}
               whileHover={{ scale: 1.3, opacity: 1, filter: "blur(2px)" }}
               className="cursor-pointer"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
