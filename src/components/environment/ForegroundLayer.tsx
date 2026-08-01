'use client';

import { memo } from 'react';

// ForegroundLayer: Stone floor foreground + dust haze — intentionally minimal
// No workbench, no shelves — those belong inside Scene 2, not the entrance
const ForegroundLayer = memo(function ForegroundLayer() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
      <svg
        viewBox="0 0 1440 900"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Foreground floor gradient — deeper, darker at bottom */}
          <linearGradient id="fg-floor-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#080604" stopOpacity="0" />
            <stop offset="60%" stopColor="#060403" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#030201" stopOpacity="0.95" />
          </linearGradient>

          {/* Left wall corner shadow */}
          <linearGradient id="fg-left-shadow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#020101" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#020101" stopOpacity="0" />
          </linearGradient>

          {/* Right wall corner shadow */}
          <linearGradient id="fg-right-shadow" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#020101" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#020101" stopOpacity="0" />
          </linearGradient>

          {/* Dust haze at floor level */}
          <radialGradient id="floor-haze" cx="50%" cy="100%" r="70%">
            <stop offset="0%" stopColor="#fcdba1" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#fcdba1" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Foreground Floor Slab ─────────────────────────────── */}
        {/* Large worn stone floor in foreground, darker than midground */}
        <rect x="0" y="680" width="1440" height="220"
          fill="url(#fg-floor-grad)"
        />

        {/* Heavy foreground floor slabs — wider blocks, more worn */}
        <rect x="0" y="750" width="1440" height="150"
          fill="#040302" opacity="0.8"
        />

        {/* Slab grout lines — irregular for worn feel */}
        {[0, 180, 395, 575, 760, 920, 1100, 1285, 1440].map((x, i) => (
          <line key={`slab-v-${i}`}
            x1={x} y1="750" x2={x - 20} y2="900"
            stroke="#0a0806" strokeWidth="2" opacity="0.6"
          />
        ))}
        <line x1="0" y1="795" x2="1440" y2="795"
          stroke="#0a0806" strokeWidth="1.5" opacity="0.4"
        />
        <line x1="0" y1="855" x2="1440" y2="855"
          stroke="#0a0806" strokeWidth="1" opacity="0.3"
        />

        {/* Iron floor bolts / anchor points — set into the stone */}
        {[120, 350, 600, 840, 1080, 1320].map((x, i) => (
          <g key={`anchor-${i}`} transform={`translate(${x}, 775)`}>
            <circle cx="0" cy="0" r="8" fill="#0d0a07" stroke="#1e160e" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="4" fill="#151009" />
            <line x1="-4" y1="0" x2="4" y2="0" stroke="#1e160e" strokeWidth="1" />
            <line x1="0" y1="-4" x2="0" y2="4" stroke="#1e160e" strokeWidth="1" />
          </g>
        ))}

        {/* ── Corner Shadow Panels ──────────────────────────────── */}
        {/* Left corner darkness — creates depth */}
        <rect x="0" y="0" width="380" height="900"
          fill="url(#fg-left-shadow)"
        />
        {/* Right corner darkness */}
        <rect x="1060" y="0" width="380" height="900"
          fill="url(#fg-right-shadow)"
        />

        {/* ── Floor Haze (dust at ground level) ────────────────── */}
        <rect x="0" y="650" width="1440" height="250"
          fill="url(#floor-haze)"
          style={{ filter: 'blur(20px)' }}
        />

        {/* ── Bottom vignette ───────────────────────────────────── */}
        <rect x="0" y="800" width="1440" height="100"
          fill="#020101" opacity="0.6"
        />

        {/* ── Subtle foreground pipe silhouettes (wall-mounted, left) ── */}
        {/* These are just on the extreme left edge — wall detail, not machines */}
        <g opacity="0.25">
          <rect x="0" y="200" width="18" height="400" rx="4"
            fill="#1a1208"
          />
          <rect x="0" y="320" width="50" height="14" rx="3"
            fill="#1a1208"
          />
          <circle cx="50" cy="327" r="12" fill="none" stroke="#241b0e" strokeWidth="3" />
        </g>
        {/* Extreme right edge pipe detail */}
        <g opacity="0.25">
          <rect x="1422" y="280" width="18" height="350" rx="4"
            fill="#1a1208"
          />
          <rect x="1390" y="380" width="50" height="14" rx="3"
            fill="#1a1208"
          />
          <circle cx="1390" cy="387" r="12" fill="none" stroke="#241b0e" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
});

export default ForegroundLayer;
