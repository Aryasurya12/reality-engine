'use client';

import { forwardRef } from 'react';

// Using forwardRef so the parent master timeline can animate the whole container
const CinematicRobot = forwardRef<HTMLDivElement, {}>(({}, ref) => {
  return (
    <div ref={ref} className="cinematic-robot absolute bottom-[15%] left-[-20%] z-30 pointer-events-auto">
      <svg 
        viewBox="0 0 300 400" 
        className="w-40 h-56 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
      >
        <defs>
          <linearGradient id="robotMetal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d9453b" />
            <stop offset="100%" stopColor="#8b251d" />
          </linearGradient>
          <linearGradient id="robotBrass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fcdba1" />
            <stop offset="100%" stopColor="#b58953" />
          </linearGradient>
          <filter id="eyeGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Shadow on floor */}
        <ellipse cx="150" cy="380" rx="80" ry="15" fill="#030508" opacity="0.8" />

        {/* Left Arm (Behind Body) */}
        <g className="cinematic-robot-arm-left" style={{ transformOrigin: '100px 180px' }}>
          <rect x="85" y="170" width="30" height="100" rx="15" fill="url(#robotBrass)" stroke="#0a0806" strokeWidth="4" />
          <circle cx="100" cy="270" r="20" fill="#0a0806" stroke="url(#robotBrass)" strokeWidth="4" />
        </g>

        {/* Wheels/Legs */}
        <g className="cinematic-robot-legs">
          {/* Back Wheel */}
          <circle cx="110" cy="340" r="40" fill="#0a0806" stroke="url(#robotBrass)" strokeWidth="8" strokeDasharray="15 5" />
          <circle cx="110" cy="340" r="15" fill="url(#robotBrass)" />
          {/* Front Wheel */}
          <circle cx="190" cy="340" r="40" fill="#0a0806" stroke="url(#robotBrass)" strokeWidth="8" strokeDasharray="15 5" />
          <circle cx="190" cy="340" r="15" fill="url(#robotBrass)" />
          {/* Chassis connection */}
          <rect x="100" y="320" width="100" height="20" rx="10" fill="url(#robotBrass)" stroke="#0a0806" strokeWidth="4" />
        </g>

        {/* Body */}
        <g className="cinematic-robot-body" style={{ transformOrigin: '150px 250px' }}>
          {/* Main chassis */}
          <rect x="90" y="160" width="120" height="150" rx="30" fill="url(#robotMetal)" stroke="#0a0806" strokeWidth="6" />
          
          {/* Front Panel & Details */}
          <rect x="110" y="180" width="80" height="60" rx="10" fill="#0a0806" stroke="url(#robotBrass)" strokeWidth="2" />
          <circle cx="150" cy="210" r="20" fill="#0a0806" />
          
          {/* Breathing Core */}
          <circle cx="150" cy="210" r="15" fill="#60a5fa" filter="url(#eyeGlow)" className="animate-pulse" />
          
          {/* Grills */}
          <line x1="110" y1="260" x2="190" y2="260" stroke="#0a0806" strokeWidth="6" strokeLinecap="round" />
          <line x1="110" y1="280" x2="190" y2="280" stroke="#0a0806" strokeWidth="6" strokeLinecap="round" />
        </g>

        {/* Neck */}
        <rect x="135" y="130" width="30" height="40" fill="url(#robotBrass)" stroke="#0a0806" strokeWidth="4" />

        {/* Head */}
        <g className="cinematic-robot-head" style={{ transformOrigin: '150px 130px' }}>
          {/* Antenna */}
          <line className="cinematic-robot-antenna" x1="150" y1="10" x2="150" y2="60" stroke="url(#robotBrass)" strokeWidth="6" />
          <circle className="cinematic-robot-antenna-bulb animate-pulse" cx="150" cy="10" r="12" fill="#fcdba1" filter="url(#eyeGlow)" />
          
          {/* Head Box */}
          <rect x="90" y="60" width="120" height="80" rx="20" fill="#0a0806" stroke="url(#robotBrass)" strokeWidth="6" />
          <rect x="100" y="70" width="100" height="60" rx="10" fill="#150e09" />
          
          {/* Eyes (With glow) */}
          <g className="cinematic-robot-eyes">
            <path d="M 120 100 Q 135 115 150 100" fill="none" stroke="#fcdba1" strokeWidth="8" strokeLinecap="round" filter="url(#eyeGlow)" />
            <path d="M 150 100 Q 165 115 180 100" fill="none" stroke="#fcdba1" strokeWidth="8" strokeLinecap="round" filter="url(#eyeGlow)" />
          </g>
        </g>

        {/* Right Arm (In Front of Body) */}
        <g className="cinematic-robot-arm-right" style={{ transformOrigin: '200px 180px' }}>
          {/* Shoulder */}
          <circle cx="210" cy="180" r="25" fill="#0a0806" stroke="url(#robotMetal)" strokeWidth="6" />
          {/* Arm segments */}
          <rect x="195" y="180" width="30" height="110" rx="15" fill="url(#robotBrass)" stroke="#0a0806" strokeWidth="4" />
          {/* Claw / Hand */}
          <path d="M 190 280 L 190 320 Q 210 330 230 320 L 230 280 Z" fill="#0a0806" stroke="url(#robotMetal)" strokeWidth="4" />
          <circle cx="210" cy="300" r="10" fill="url(#robotBrass)" />
        </g>

      </svg>
    </div>
  );
});

export default CinematicRobot;
