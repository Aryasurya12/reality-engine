'use client';

import { forwardRef } from 'react';

// Ref is used by master timeline in CinematicMachineRoom
const TheGreatEngine = forwardRef<HTMLDivElement, {}>(({}, ref) => {
  return (
    <div ref={ref} className="cinematic-engine absolute inset-0 w-full h-full flex items-center justify-center pointer-events-auto z-20">
      
      {/* 60% scale instead of 45%, heavily reliant on CSS drop shadows for cinematic depth */}
      <svg viewBox="0 0 1200 1200" className="w-[60%] h-[90%] drop-shadow-[0_40px_80px_rgba(0,0,0,0.9)] origin-bottom">
        <defs>
          <linearGradient id="engineCore" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e8c07a" />
            <stop offset="50%" stopColor="#fcdba1" />
            <stop offset="100%" stopColor="#e8c07a" />
          </linearGradient>
          <linearGradient id="engineMetal" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a1410" />
            <stop offset="50%" stopColor="#0d0907" />
            <stop offset="100%" stopColor="#060403" />
          </linearGradient>
          <linearGradient id="engineCopper" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c45b36" />
            <stop offset="100%" stopColor="#7a2a12" />
          </linearGradient>
          <linearGradient id="engineBrass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b58953" />
            <stop offset="100%" stopColor="#634421" />
          </linearGradient>
          
          <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="30" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* --- Background Machinery --- */}
        <path d="M 400 1100 L 800 1100 L 900 800 L 300 800 Z" fill="url(#engineMetal)" stroke="url(#engineBrass)" strokeWidth="8" />
        
        <rect x="450" y="700" width="300" height="150" rx="20" fill="url(#engineMetal)" stroke="#060403" strokeWidth="15" />
        
        {/* Massive Pipes from above */}
        <path d="M 500 220 Q 500 50 300 0" fill="none" stroke="url(#engineCopper)" strokeWidth="60" strokeLinecap="round" />
        <path d="M 700 220 Q 700 50 900 0" fill="none" stroke="url(#engineBrass)" strokeWidth="50" strokeLinecap="round" />
        <path d="M 600 220 L 600 0" fill="none" stroke="#0a0806" strokeWidth="80" />

        {/* --- The Pistons --- */}
        {/* We use a class to target this specific piston with GSAP */}
        <g className="cinematic-engine-piston" transform="translate(380, 550)">
          <rect x="0" y="-100" width="100" height="200" fill="#0a0806" stroke="url(#engineBrass)" strokeWidth="8" />
          <rect className="piston-shaft" x="30" y="-80" width="40" height="140" fill="url(#engineCopper)" />
          <rect x="15" y="-100" width="70" height="30" fill="url(#engineBrass)" />
        </g>

        <g transform="translate(720, 550)">
          <rect x="0" y="-100" width="100" height="200" fill="#0a0806" stroke="url(#engineBrass)" strokeWidth="8" />
          <rect x="30" y="-80" width="40" height="140" fill="url(#engineCopper)" />
          <rect x="15" y="-100" width="70" height="30" fill="url(#engineBrass)" />
        </g>

        {/* --- The Giant Flywheel --- */}
        <g className="cinematic-engine-flywheel" style={{ transformOrigin: "600px 500px" }}>
          {/* Outer casing shadow */}
          <circle cx="600" cy="500" r="300" fill="#030508" opacity="0.6" />
          <circle cx="600" cy="500" r="320" fill="none" stroke="#060403" strokeWidth="40" />
          <circle cx="600" cy="500" r="280" fill="none" stroke="url(#engineCopper)" strokeWidth="20" />
          
          {/* Complex Spokes */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
            <g key={angle} transform={`rotate(${angle} 600 500)`}>
              <line x1="600" y1="200" x2="600" y2="800" stroke="url(#engineBrass)" strokeWidth="25" />
              <line x1="600" y1="200" x2="600" y2="800" stroke="#030508" strokeWidth="10" />
            </g>
          ))}
          
          {/* Hub */}
          <circle cx="600" cy="500" r="80" fill="url(#engineMetal)" stroke="url(#engineBrass)" strokeWidth="15" />
          <circle cx="600" cy="500" r="40" fill="url(#engineCopper)" />
        </g>

        {/* --- Central Reactor Core --- */}
        <g className="cinematic-engine-core">
          {/* Extreme glow */}
          <circle cx="600" cy="500" r="60" fill="url(#engineCore)" filter="url(#coreGlow)" opacity="0.9" />
          <circle cx="600" cy="500" r="30" fill="#ffffff" filter="blur(5px)" opacity="0.8" />
        </g>

        {/* --- Foregound Control Panel (Where robot interacts) --- */}
        <g className="cinematic-engine-panel" transform="translate(850, 850)">
          <rect x="0" y="0" width="180" height="200" rx="10" fill="url(#engineMetal)" stroke="url(#engineBrass)" strokeWidth="6" />
          {/* Gauges */}
          <circle cx="90" cy="80" r="50" fill="#150e09" stroke="url(#engineBrass)" strokeWidth="8" />
          <line className="cinematic-gauge-needle" x1="90" y1="80" x2="50" y2="50" stroke="#d9453b" strokeWidth="6" strokeLinecap="round" style={{ transformOrigin: '90px 80px' }} />
          <circle cx="90" cy="80" r="10" fill="url(#engineCopper)" />
          
          {/* Status Lights */}
          <circle className="cinematic-status-light" cx="60" cy="160" r="15" fill="#4caf50" opacity="0.2" filter="blur(2px)" />
          <circle className="cinematic-status-light" cx="60" cy="160" r="10" fill="#4caf50" opacity="0.2" />
          <circle cx="120" cy="160" r="15" fill="#d9453b" opacity="0.2" />
        </g>

        {/* --- The Missing Gear Socket --- */}
        <g transform="translate(600, 750)">
          <circle className="empty-socket-glow" cx="0" cy="0" r="50" fill="#060403" stroke="#e8a84a" strokeWidth="4" strokeDasharray="10 5" opacity="0" />
        </g>

        {/* --- The Falling Gear Dummy (Starts attached, falls during timeline) --- */}
        <g className="falling-gear-dummy" transform="translate(600, 750)">
          <circle cx="0" cy="0" r="40" fill="#150e09" stroke="#b58953" strokeWidth="10" strokeDasharray="15 10" />
          <circle cx="0" cy="0" r="20" fill="none" stroke="#c8891a" strokeWidth="8" />
          <line x1="0" y1="-40" x2="0" y2="40" stroke="#b58953" strokeWidth="6" />
          <line x1="-40" y1="0" x2="40" y2="0" stroke="#b58953" strokeWidth="6" />
          <circle cx="0" cy="0" r="10" fill="#0d0907" stroke="#c8891a" strokeWidth="3" />
        </g>

      </svg>
    </div>
  );
});

export default TheGreatEngine;
