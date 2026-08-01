'use client';

import { forwardRef } from 'react';

export type InventionType = 'bird' | 'orrery' | 'lantern' | 'propeller' | 'empty';

interface InventionCaseProps {
  id: string;
  inventionType: InventionType;
  xOffset: number; // Horizontal placement in the hallway
  isFinalTeaser?: boolean;
}

const InventionCase = forwardRef<SVGGElement, InventionCaseProps>(({ id, inventionType, xOffset, isFinalTeaser }, ref) => {
  return (
    <g ref={ref} id={id} className="invention-case-container" transform={`translate(${xOffset}, 0)`}>
      
      {/* ── Case Pedestal ── */}
      <g className="case-pedestal" transform="translate(450, 750)">
        <path d="M 0 0 L 300 0 L 320 200 L -20 200 Z" fill="url(#engineMetal)" stroke="#060403" strokeWidth="6" />
        <rect x="20" y="20" width="260" height="20" fill="url(#engineBrass)" />
        {/* Nameplate */}
        <rect x="100" y="80" width="100" height="40" rx="4" fill="#0d0907" stroke="url(#engineBrass)" strokeWidth="4" />
        {/* The ignited light under the nameplate */}
        <circle className="case-pedestal-light opacity-0" cx="150" cy="100" r="15" fill="#fcdba1" filter="url(#glowFilter)" />
      </g>

      {/* ── The Invention (Inside the Glass) ── */}
      <g className="case-invention opacity-0" transform="translate(600, 550)">
        {inventionType === 'bird' && (
          <g className="invention-bird">
            <ellipse cx="0" cy="0" rx="30" ry="20" fill="url(#engineBrass)" />
            {/* Wings that will flap via CSS or GSAP class toggle */}
            <path className="bird-wing-left" d="M -10 0 Q -40 -40 -60 -10 Z" fill="url(#engineCopper)" stroke="#060403" strokeWidth="2" style={{ transformOrigin: '-10px 0px' }} />
            <path className="bird-wing-right" d="M 10 0 Q 40 -40 60 -10 Z" fill="url(#engineCopper)" stroke="#060403" strokeWidth="2" style={{ transformOrigin: '10px 0px' }} />
            <circle cx="20" cy="-5" r="3" fill="#fcdba1" />
          </g>
        )}
        
        {inventionType === 'orrery' && (
          <g className="invention-orrery">
            <circle cx="0" cy="0" r="15" fill="url(#engineCore)" filter="url(#glowFilter)" />
            <ellipse className="orrery-ring-1" cx="0" cy="0" rx="50" ry="15" fill="none" stroke="url(#engineBrass)" strokeWidth="4" style={{ transformOrigin: '0 0' }} />
            <ellipse className="orrery-ring-2" cx="0" cy="0" rx="70" ry="20" fill="none" stroke="url(#engineCopper)" strokeWidth="4" style={{ transformOrigin: '0 0' }} />
            <ellipse className="orrery-ring-3" cx="0" cy="0" rx="90" ry="25" fill="none" stroke="url(#engineMetal)" strokeWidth="4" style={{ transformOrigin: '0 0' }} />
            <circle className="orrery-planet" cx="50" cy="0" r="8" fill="#1a1410" />
            <circle className="orrery-planet" cx="-70" cy="0" r="12" fill="url(#engineBrass)" />
          </g>
        )}

        {inventionType === 'lantern' && (
          <g className="invention-lantern">
            <rect x="-30" y="-40" width="60" height="80" rx="10" fill="url(#engineMetal)" stroke="url(#engineBrass)" strokeWidth="6" />
            <path d="M -40 -40 L 40 -40 L 0 -80 Z" fill="url(#engineCopper)" />
            <circle className="lantern-core" cx="0" cy="0" r="20" fill="#fcdba1" filter="url(#glowFilter)" />
            <line x1="-30" y1="0" x2="30" y2="0" stroke="#060403" strokeWidth="4" />
          </g>
        )}

        {inventionType === 'propeller' && (
          <g className="invention-propeller">
            <rect x="-10" y="-30" width="20" height="80" rx="10" fill="url(#engineBrass)" />
            <g className="propeller-blades" style={{ transformOrigin: '0px -20px' }}>
              <ellipse cx="0" cy="-20" rx="60" ry="10" fill="url(#engineCopper)" stroke="#060403" strokeWidth="2" />
              <circle cx="0" cy="-20" r="8" fill="url(#engineMetal)" />
            </g>
            <circle cx="0" cy="40" r="12" fill="url(#engineCore)" filter="url(#glowFilter)" />
          </g>
        )}
        
        {/* The Final Teaser (The Great Engine Silhouette) */}
        {inventionType === 'empty' && isFinalTeaser && (
          <g className="invention-teaser opacity-0">
             <path d="M -100 150 L 100 150 L 150 -50 L -150 -50 Z" fill="none" stroke="#fcdba1" strokeWidth="15" opacity="0.3" filter="url(#glowFilter)" />
             <circle cx="0" cy="-50" r="80" fill="none" stroke="#e8c07a" strokeWidth="10" opacity="0.6" filter="url(#glowFilter)" />
             <circle cx="0" cy="-50" r="30" fill="#ffffff" filter="url(#glowFilter)" />
          </g>
        )}
      </g>

      {/* ── Glass Case ── */}
      <g className="case-glass" transform="translate(450, 350)">
        {/* Back rim */}
        <rect x="20" y="20" width="260" height="380" fill="#030508" opacity="0.4" />
        
        {/* Front glass pane */}
        <rect x="0" y="0" width="300" height="400" fill="#a4c2f4" opacity="0.05" />
        
        {/* The Glow Sweep (masked/clipped to glass theoretically, here we just use an opacity sweep over a gradient) */}
        <defs>
          <linearGradient id="glassSweepGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect className="case-glow-sweep opacity-0" x="0" y="0" width="300" height="400" fill="url(#glassSweepGrad)" style={{ mixBlendMode: 'overlay' }} />

        {/* Framing / Rims */}
        <rect x="0" y="0" width="300" height="400" fill="none" stroke="url(#engineBrass)" strokeWidth="8" />
        
        {/* Rim Lighting (Ignites when camera reaches it) */}
        <rect className="case-rim-light opacity-0" x="-5" y="-5" width="310" height="410" fill="none" stroke="#fcdba1" strokeWidth="10" filter="url(#glowFilter)" />
      </g>

    </g>
  );
});

InventionCase.displayName = 'InventionCase';

export default InventionCase;
