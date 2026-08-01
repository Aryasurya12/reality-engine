'use client';

import { forwardRef, memo } from 'react';

const GreatEngine = memo(forwardRef<SVGGElement, {}>((_, ref) => {
  return (
    <g ref={ref} className="great-engine" transform="translate(500, 300)">
      <defs>
        {/* Gradients to match the established theme */}
        <linearGradient id="ge-metal" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a1410" />
          <stop offset="50%" stopColor="#0d0907" />
          <stop offset="100%" stopColor="#060403" />
        </linearGradient>
        <linearGradient id="ge-copper" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c45b36" />
          <stop offset="100%" stopColor="#7a2a12" />
        </linearGradient>
        <linearGradient id="ge-brass" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b58953" />
          <stop offset="100%" stopColor="#634421" />
        </linearGradient>
        
        {/* Core Glow */}
        <radialGradient id="ge-core-glow-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="20%" stopColor="#fcdba1" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#e8a84a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#c8891a" stopOpacity="0" />
        </radialGradient>
        
        <filter id="ge-glow-filter" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="25" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* ── Base & Main Housing ── */}
      <g className="engine-base">
        {/* Pedestal */}
        <rect x="-400" y="300" width="800" height="200" rx="10" fill="url(#ge-metal)" stroke="#000" strokeWidth="6" />
        <rect x="-380" y="320" width="760" height="160" rx="5" fill="#060403" stroke="url(#ge-brass)" strokeWidth="4" />
        
        {/* Central Dome/Housing */}
        <path d="M -300 300 Q 0 -100 300 300 Z" fill="url(#ge-metal)" stroke="#060403" strokeWidth="8" />
        <path d="M -280 300 Q 0 -60 280 300 Z" fill="none" stroke="url(#ge-brass)" strokeWidth="12" />
      </g>

      {/* ── Giant Flywheel (Background) ── */}
      <g className="engine-flywheel" style={{ transformOrigin: '0px 150px' }}>
        <circle cx="0" cy="150" r="220" fill="none" stroke="url(#ge-copper)" strokeWidth="30" />
        <circle cx="0" cy="150" r="180" fill="none" stroke="#0d0907" strokeWidth="15" />
        
        {/* Spokes */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <line 
            key={i}
            x1="0" y1="150" 
            x2={Math.cos(angle * Math.PI / 180) * 220} 
            y2={150 + Math.sin(angle * Math.PI / 180) * 220} 
            stroke="url(#ge-brass)" 
            strokeWidth="12" 
          />
        ))}
        {/* Flywheel center cap */}
        <circle cx="0" cy="150" r="40" fill="url(#ge-metal)" stroke="#060403" strokeWidth="6" />
        <circle cx="0" cy="150" r="20" fill="url(#ge-copper)" />
      </g>

      {/* ── Steam Pipes & Pistons ── */}
      <g className="engine-pipes">
        {/* Left Pipe */}
        <path d="M -300 300 L -300 50 Q -300 0 -250 0 L -100 0" fill="none" stroke="url(#ge-copper)" strokeWidth="25" strokeLinecap="round" strokeLinejoin="round" />
        {/* Right Pipe */}
        <path d="M 300 300 L 300 50 Q 300 0 250 0 L 100 0" fill="none" stroke="url(#ge-copper)" strokeWidth="25" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Left Piston */}
        <rect x="-160" y="-30" width="60" height="120" rx="10" fill="url(#ge-metal)" stroke="url(#ge-brass)" strokeWidth="6" />
        <rect className="engine-piston-left" x="-140" y="-10" width="20" height="100" fill="#2a1f14" />
        
        {/* Right Piston */}
        <rect x="100" y="-30" width="60" height="120" rx="10" fill="url(#ge-metal)" stroke="url(#ge-brass)" strokeWidth="6" />
        <rect className="engine-piston-right" x="120" y="-10" width="20" height="100" fill="#2a1f14" />
      </g>

      {/* ── Inner Core (Powers Up) ── */}
      <g className="engine-core">
        {/* Core cage */}
        <circle cx="0" cy="150" r="100" fill="#000" stroke="url(#ge-metal)" strokeWidth="10" />
        
        {/* Glowing Energy Heart (starts opacity 0) */}
        <circle className="engine-core-glow opacity-0" cx="0" cy="150" r="120" fill="url(#ge-core-glow-grad)" filter="url(#ge-glow-filter)" style={{ mixBlendMode: 'screen' }} />
        <circle className="engine-core-glow opacity-0" cx="0" cy="150" r="60" fill="#ffffff" filter="url(#ge-glow-filter)" />
        
        {/* Cage Bars over the core */}
        <line x1="-100" y1="150" x2="100" y2="150" stroke="#060403" strokeWidth="8" />
        <line x1="0" y1="50" x2="0" y2="250" stroke="#060403" strokeWidth="8" />
        <circle cx="0" cy="150" r="30" fill="url(#ge-metal)" stroke="url(#ge-brass)" strokeWidth="4" />
      </g>

      {/* ── Ignition Rings / Accents ── */}
      <g className="engine-rings">
        <ellipse className="engine-ring-1 opacity-0" cx="0" cy="150" rx="260" ry="80" fill="none" stroke="#fcdba1" strokeWidth="4" filter="url(#ge-glow-filter)" />
        <ellipse className="engine-ring-2 opacity-0" cx="0" cy="150" rx="80" ry="260" fill="none" stroke="#e8a84a" strokeWidth="4" filter="url(#ge-glow-filter)" />
      </g>

      {/* ── Indicator Lights ── */}
      <g className="engine-lights">
        {[-200, -100, 0, 100, 200].map((x, i) => (
          <g key={i} transform={`translate(${x}, 400)`}>
            <circle cx="0" cy="0" r="12" fill="#000" stroke="url(#ge-brass)" strokeWidth="2" />
            <circle className={`engine-light-node opacity-0`} cx="0" cy="0" r="10" fill="#fcdba1" filter="url(#ge-glow-filter)" />
          </g>
        ))}
      </g>
      
      {/* ── Outline Highlight (Powers up first) ── */}
      <path className="engine-shell-light opacity-0" d="M -300 300 Q 0 -100 300 300" fill="none" stroke="#fcdba1" strokeWidth="10" filter="url(#ge-glow-filter)" />
    </g>
  );
}));

GreatEngine.displayName = 'GreatEngine';

export default GreatEngine;
