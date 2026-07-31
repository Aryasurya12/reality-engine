'use client';

import { memo } from 'react';

// BackgroundLayer: The stone entrance hall — walls, arch, skylights, workshop sigil
// Contains NO machines — those are revealed only in Scene 2
const BackgroundLayer = memo(function BackgroundLayer() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">

      {/* ── Base Stone Wall ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 120% 80% at 50% 0%, #1a1208 0%, #0e0b07 40%, #060403 100%)
          `,
        }}
      />

      {/* Stone texture overlay — subtle noise pattern using SVG filter */}
      <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="stone-texture">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="multiply" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#stone-texture)" opacity="0.4" />
      </svg>

      {/* ── Main SVG Scene ─────────────────────────────────────────── */}
      <svg
        viewBox="0 0 1440 900"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        suppressHydrationWarning
      >
        <defs>
          {/* Warm sunlight gradient — enters from above through skylights */}
          <radialGradient id="skylight-beam-left" cx="30%" cy="0%" r="60%">
            <stop offset="0%" stopColor="#fcdba1" stopOpacity="0.25" />
            <stop offset="60%" stopColor="#c8891a" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#fcdba1" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="skylight-beam-right" cx="70%" cy="0%" r="60%">
            <stop offset="0%" stopColor="#fcdba1" stopOpacity="0.2" />
            <stop offset="60%" stopColor="#c8891a" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#fcdba1" stopOpacity="0" />
          </radialGradient>

          {/* Arch shadow gradient */}
          <linearGradient id="arch-depth" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0a0703" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#060403" stopOpacity="0.3" />
          </linearGradient>

          {/* Stone wall gradient — horizontal banding */}
          <linearGradient id="wall-banding" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#1a1410" stopOpacity="1" />
            <stop offset="25%"  stopColor="#130f0a" stopOpacity="1" />
            <stop offset="50%"  stopColor="#1a1410" stopOpacity="1" />
            <stop offset="75%"  stopColor="#0f0c09" stopOpacity="1" />
            <stop offset="100%" stopColor="#0a0806" stopOpacity="1" />
          </linearGradient>

          {/* Door frame glow */}
          <radialGradient id="door-frame-glow" cx="50%" cy="60%" r="35%">
            <stop offset="0%" stopColor="#fcdba1" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#fcdba1" stopOpacity="0" />
          </radialGradient>

          {/* Sigil glow */}
          <radialGradient id="sigil-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#b58953" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#b58953" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Floor ─────────────────────────────────────────────────── */}
        {/* Stone floor — large worn slabs */}
        <rect x="0" y="700" width="1440" height="200" fill="#080604" />
        {/* Floor slab lines */}
        {[0, 240, 480, 720, 960, 1200].map((x) => (
          <line key={x} x1={x + 120} y1="700" x2={x} y2="900"
            stroke="#121008" strokeWidth="2" opacity="0.7" />
        ))}
        {/* Horizontal grout lines */}
        <line x1="0" y1="750" x2="1440" y2="750" stroke="#0f0d0a" strokeWidth="1.5" opacity="0.5" />
        <line x1="0" y1="820" x2="1440" y2="820" stroke="#0f0d0a" strokeWidth="1" opacity="0.3" />

        {/* Floor reflection from door light */}
        <ellipse cx="720" cy="760" rx="180" ry="30"
          fill="#fcdba1" opacity="0.04" style={{ filter: 'blur(12px)' }} />

        {/* ── Stone Wall Left ───────────────────────────────────────── */}
        <rect x="0" y="0" width="400" height="900" fill="url(#wall-banding)" opacity="0.95" />
        {/* Stone block lines — left wall */}
        {[80, 160, 240, 320, 400, 480, 560, 640, 720].map((y, i) => (
          <line key={`lh-${i}`} x1="0" y1={y} x2="400" y2={y}
            stroke="#0e0b08" strokeWidth="1.5" opacity="0.6" />
        ))}
        {[100, 200, 300].map((x, i) => (
          <line key={`lv-${i}`} x1={x} y1="0" x2={x} y2="900"
            stroke="#0e0b08" strokeWidth="1" opacity="0.4" />
        ))}

        {/* ── Stone Wall Right ──────────────────────────────────────── */}
        <rect x="1040" y="0" width="400" height="900" fill="url(#wall-banding)" opacity="0.95" />
        {[80, 160, 240, 320, 400, 480, 560, 640, 720].map((y, i) => (
          <line key={`rh-${i}`} x1="1040" y1={y} x2="1440" y2={y}
            stroke="#0e0b08" strokeWidth="1.5" opacity="0.6" />
        ))}
        {[1140, 1240, 1340].map((x, i) => (
          <line key={`rv-${i}`} x1={x} y1="0" x2={x} y2="900"
            stroke="#0e0b08" strokeWidth="1" opacity="0.4" />
        ))}

        {/* ── Ceiling ───────────────────────────────────────────────── */}
        <rect x="0" y="0" width="1440" height="120" fill="#080604" opacity="0.9" />
        {/* Ceiling beams */}
        {[200, 500, 720, 940, 1240].map((x, i) => (
          <rect key={`beam-${i}`} x={x - 20} y="0" width="40" height="120"
            fill="#0d0a07" stroke="#181310" strokeWidth="1" opacity="0.8" />
        ))}
        {/* Cross-beam */}
        <rect x="0" y="95" width="1440" height="25" fill="#0c0a07" opacity="0.7" />

        {/* ── Skylight Wells (Left & Right) ─────────────────────────── */}
        {/* Left skylight — angled sunbeam pouring down */}
        <polygon
          points="180,0  320,0  280,180  120,180"
          fill="url(#skylight-beam-left)"
          style={{ filter: 'blur(2px)' }}
        />
        {/* Skylight shaft walls */}
        <line x1="180" y1="0" x2="120" y2="180" stroke="#1c1610" strokeWidth="3" opacity="0.8" />
        <line x1="320" y1="0" x2="280" y2="180" stroke="#1c1610" strokeWidth="3" opacity="0.8" />

        {/* Right skylight */}
        <polygon
          points="1120,0  1260,0  1320,180  1160,180"
          fill="url(#skylight-beam-right)"
          style={{ filter: 'blur(2px)' }}
        />
        <line x1="1120" y1="0" x2="1160" y2="180" stroke="#1c1610" strokeWidth="3" opacity="0.8" />
        <line x1="1260" y1="0" x2="1320" y2="180" stroke="#1c1610" strokeWidth="3" opacity="0.8" />

        {/* ── Sunbeam Shafts (Volumetric) ───────────────────────────── */}
        {/* Left beam */}
        <polygon
          points="185,0  315,0  260,700  140,700"
          fill="#fcdba1" opacity="0.025"
          style={{ filter: 'blur(18px)' }}
        />
        {/* Right beam */}
        <polygon
          points="1130,0  1255,0  1300,700  1175,700"
          fill="#fcdba1" opacity="0.02"
          style={{ filter: 'blur(18px)' }}
        />

        {/* ── Grand Arch Door Frame ─────────────────────────────────── */}
        {/* The outer stone arch frame */}
        <path
          d="M 420 900 L 420 360 Q 420 120 720 120 Q 1020 120 1020 360 L 1020 900"
          fill="none"
          stroke="#2a1f14"
          strokeWidth="60"
          strokeLinecap="butt"
        />
        {/* Arch face — slightly lighter stone */}
        <path
          d="M 420 900 L 420 360 Q 420 120 720 120 Q 1020 120 1020 360 L 1020 900"
          fill="none"
          stroke="#1e1610"
          strokeWidth="48"
          strokeLinecap="butt"
        />
        {/* Arch inner edge highlight */}
        <path
          d="M 444 900 L 444 368 Q 444 148 720 148 Q 996 148 996 368 L 996 900"
          fill="none"
          stroke="#2d2218"
          strokeWidth="3"
          strokeLinecap="butt"
          opacity="0.7"
        />

        {/* Arch keystone (top center decorative stone) */}
        <ellipse cx="720" cy="120" rx="50" ry="30"
          fill="#1c1610" stroke="#2a1f14" strokeWidth="3" />
        <ellipse cx="720" cy="120" rx="30" ry="18"
          fill="#151109" stroke="#241b11" strokeWidth="2" />
        {/* Keystone detail — engraved circle */}
        <circle cx="720" cy="120" r="12" fill="none" stroke="#b58953" strokeWidth="1" opacity="0.4" />

        {/* Arch voussoir stones (wedge blocks along arch) */}
        {[-3, -2, -1, 0, 1, 2, 3].map((i) => {
          const angle = (i * 22) * (Math.PI / 180);
          const cx = +( 720 + Math.sin(angle) * 260).toFixed(2);
          const cy = +( 240 - Math.cos(angle) * 140).toFixed(2);
          return (
            <ellipse key={`voussoir-${i}`}
              cx={cx} cy={cy} rx="8" ry="16"
              fill="none" stroke="#211810" strokeWidth="2" opacity="0.5"
              transform={`rotate(${i * 22} ${cx} ${cy})`}
            />
          );
        })}

        {/* ── Workshop Sigil (Engraved Above Door) ─────────────────── */}
        <g transform="translate(620, 200)" opacity="0.35">
          {/* Sigil glow bg */}
          <circle cx="100" cy="80" r="80" fill="url(#sigil-glow)" />
          {/* Outer ring */}
          <circle cx="100" cy="80" r="55" fill="none" stroke="#b58953" strokeWidth="1.5" strokeDasharray="3 4" />
          {/* Inner ring */}
          <circle cx="100" cy="80" r="38" fill="none" stroke="#8a6535" strokeWidth="1" />
          {/* Gear teeth decoration */}
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * 30) * (Math.PI / 180);
            const r1 = 48; const r2 = 56;
            const x1 = +( 100 + Math.cos(a) * r1).toFixed(2);
            const y1 = +( 80 + Math.sin(a) * r1).toFixed(2);
            const x2 = +( 100 + Math.cos(a) * r2).toFixed(2);
            const y2 = +( 80 + Math.sin(a) * r2).toFixed(2);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#b58953" strokeWidth="3" strokeLinecap="round" />;
          })}
          {/* Centre atom/compass */}
          <circle cx="100" cy="80" r="20" fill="none" stroke="#8a6535" strokeWidth="1.5" />
          <line x1="100" y1="60" x2="100" y2="100" stroke="#b58953" strokeWidth="1" opacity="0.8" />
          <line x1="80" y1="80" x2="120" y2="80" stroke="#b58953" strokeWidth="1" opacity="0.8" />
          <line x1="86" y1="66" x2="114" y2="94" stroke="#8a6535" strokeWidth="0.8" opacity="0.5" />
          <line x1="114" y1="66" x2="86" y2="94" stroke="#8a6535" strokeWidth="0.8" opacity="0.5" />
          <circle cx="100" cy="80" r="5" fill="#b58953" opacity="0.6" />
        </g>

        {/* ── Warm Glow from Behind Door ────────────────────────────── */}
        <rect x="444" y="368" width="552" height="532"
          fill="url(#door-frame-glow)"
          style={{ filter: 'blur(4px)' }}
          className="animate-door-glow"
        />

        {/* ── Wall Sconce Brackets (Left & Right of Arch) ───────────── */}
        {/* Left sconce bracket */}
        <g transform="translate(340, 320)">
          <rect x="0" y="0" width="60" height="8" rx="2" fill="#1e1610" stroke="#2a1f14" strokeWidth="1" />
          <rect x="20" y="-30" width="8" height="32" rx="2" fill="#1e1610" stroke="#2a1f14" strokeWidth="1" />
        </g>
        {/* Right sconce bracket */}
        <g transform="translate(1040, 320)">
          <rect x="0" y="0" width="60" height="8" rx="2" fill="#1e1610" stroke="#2a1f14" strokeWidth="1" />
          <rect x="32" y="-30" width="8" height="32" rx="2" fill="#1e1610" stroke="#2a1f14" strokeWidth="1" />
        </g>

        {/* ── Corner darkness (vignette corners) ─────────────────────── */}
        <radialGradient id="corner-vignette" cx="0%" cy="0%" r="60%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <rect x="0" y="0" width="600" height="600"
          fill="url(#corner-vignette)" opacity="0.8" />
        <radialGradient id="corner-vignette-br" cx="100%" cy="100%" r="60%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <rect x="840" y="300" width="600" height="600"
          fill="url(#corner-vignette-br)" opacity="0.7" />
      </svg>
    </div>
  );
});

export default BackgroundLayer;
