'use client';

import { useEffect, useRef, memo } from 'react';
import gsap from 'gsap';

// MidgroundLayer: The vault door, hanging industrial lamps, pendulum clock
// This is the Hero's centrepiece — NOT the machine room (that's Scene 2)
const MidgroundLayer = memo(function MidgroundLayer() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pendulumRef = useRef<SVGGElement>(null);
  const lamp1ChainRef = useRef<SVGGElement>(null);
  const lamp2ChainRef = useRef<SVGGElement>(null);
  const lamp3ChainRef = useRef<SVGGElement>(null);
  const doorRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Pendulum Clock Swing ──────────────────────────────────────
      // Precise metronomic motion — mechanical precision
      if (pendulumRef.current) {
        gsap.to(pendulumRef.current, {
          rotation: 14,
          transformOrigin: '50% 0%',
          duration: 1.4,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      }

      // ── Lamp Sway — Each lamp at different phase ──────────────────
      // Uses stagger so they don't all swing in sync (natural feel)
      if (lamp1ChainRef.current) {
        gsap.to(lamp1ChainRef.current, {
          rotation: 2.5,
          transformOrigin: '50% 0%',
          duration: 5.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 0,
        });
      }
      if (lamp2ChainRef.current) {
        gsap.to(lamp2ChainRef.current, {
          rotation: -2,
          transformOrigin: '50% 0%',
          duration: 6.2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 1.5,
        });
      }
      if (lamp3ChainRef.current) {
        gsap.to(lamp3ChainRef.current, {
          rotation: 1.8,
          transformOrigin: '50% 0%',
          duration: 4.8,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 0.8,
        });
      }

      // ── Lamp Light Flicker (very subtle, natural) ─────────────────
      gsap.to('.midground-lamp-glow', {
        opacity: 'random(0.55, 0.85)',
        duration: 'random(0.08, 0.25)',
        repeat: -1,
        repeatRefresh: true,
        ease: 'none',
      });

      // Slightly different flicker for the "light cone" beneath lamps
      gsap.to('.midground-lamp-cone', {
        opacity: 'random(0.08, 0.18)',
        duration: 'random(0.12, 0.35)',
        repeat: -1,
        repeatRefresh: true,
        ease: 'none',
      });

      // ── Clock hands ───────────────────────────────────────────────
      // Minute hand slow rotation
      gsap.to('.clock-minute-hand', {
        rotation: 360,
        transformOrigin: '50% 100%',
        duration: 120,
        ease: 'none',
        repeat: -1,
      });
      // Hour hand very slow
      gsap.to('.clock-hour-hand', {
        rotation: 360,
        transformOrigin: '50% 100%',
        duration: 1440,
        ease: 'none',
        repeat: -1,
      });

      // ── Door breathing glow (very subtle, organic) ────────────────
      gsap.to('.door-crack-glow', {
        opacity: 'random(0.06, 0.18)',
        duration: 'random(0.8, 2.5)',
        repeat: -1,
        repeatRefresh: true,
        ease: 'sine.inOut',
      });

    }, svgRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <svg
        ref={svgRef}
        viewBox="0 0 1440 900"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        suppressHydrationWarning
      >
        <defs>
          {/* Lamp warm glow */}
          <radialGradient id="lamp-glow-grad" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fcdba1" stopOpacity="1" />
            <stop offset="30%" stopColor="#e8a84a" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#c8891a" stopOpacity="0" />
          </radialGradient>

          {/* Lamp cone light beneath */}
          <linearGradient id="lamp-cone-grad" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#fcdba1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#fcdba1" stopOpacity="0" />
          </linearGradient>

          {/* Door metal gradient */}
          <linearGradient id="door-metal" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#1a1208" />
            <stop offset="20%"  stopColor="#2d2018" />
            <stop offset="50%"  stopColor="#1e160e" />
            <stop offset="80%"  stopColor="#2a1c10" />
            <stop offset="100%" stopColor="#150f07" />
          </linearGradient>

          {/* Door vertical banding */}
          <linearGradient id="door-banding" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#241a0e" />
            <stop offset="40%"  stopColor="#1a1208" />
            <stop offset="60%"  stopColor="#201609" />
            <stop offset="100%" stopColor="#160f07" />
          </linearGradient>

          {/* Door warm crack glow (light leaking from inside) */}
          <radialGradient id="door-crack-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fcdba1" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fcdba1" stopOpacity="0" />
          </radialGradient>

          {/* Clock face */}
          <radialGradient id="clock-face" cx="50%" cy="40%" r="70%">
            <stop offset="0%"   stopColor="#2a2010" />
            <stop offset="100%" stopColor="#150f07" />
          </radialGradient>
        </defs>

        {/* ══════════════════════════════════════════════════════════ */}
        {/*   HANGING INDUSTRIAL LAMPS                                 */}
        {/* ══════════════════════════════════════════════════════════ */}

        {/* ── Lamp 1 (Left) ─────────────────────────────────────── */}
        <g ref={lamp1ChainRef} className="gpu-layer">
          {/* Chain links */}
          {[0, 18, 36, 54, 72, 90, 108, 126, 144].map((y, i) => (
            <ellipse key={i} cx="280" cy={y + 8} rx="5" ry="9"
              fill="none" stroke="#2a1f14" strokeWidth="2.5"
              transform={`rotate(${i % 2 === 0 ? 0 : 90} 280 ${y + 8})`}
            />
          ))}
          {/* Lamp shade — industrial cone */}
          <g transform="translate(280, 160)">
            {/* Glow bubble above shade */}
            <ellipse cx="0" cy="-20" rx="40" ry="25"
              fill="#fcdba1" opacity="0.06" style={{ filter: 'blur(12px)' }}
              className="midground-lamp-glow"
            />
            {/* Shade outer */}
            <path d="M -50 0 L -15 -55 L 15 -55 L 50 0 Z"
              fill="#1e160e" stroke="#2a1f14" strokeWidth="2"
            />
            {/* Shade inner rim highlight */}
            <path d="M -48 0 L 48 0"
              fill="none" stroke="#3d2e1c" strokeWidth="3"
            />
            {/* Shade vertical ribs */}
            {[-30, -15, 0, 15, 30].map((x, i) => (
              <line key={i} x1={x * 0.3} y1="-55" x2={x} y2="0"
                stroke="#251b0e" strokeWidth="1" opacity="0.6" />
            ))}
            {/* Bulb glow */}
            <circle cx="0" cy="-10" r="8"
              fill="#fcdba1" opacity="0.7"
              style={{ filter: 'blur(3px)' }}
              className="midground-lamp-glow"
            />
            <circle cx="0" cy="-10" r="3" fill="#fff" opacity="0.9" />
            {/* Light cone below */}
            <polygon points="-50,0 50,0 120,300 -120,300"
              fill="url(#lamp-cone-grad)"
              className="midground-lamp-cone"
              style={{ filter: 'blur(8px)' }}
            />
          </g>
        </g>

        {/* ── Lamp 2 (Centre — largest) ─────────────────────────── */}
        <g ref={lamp2ChainRef} className="gpu-layer">
          {[0, 18, 36, 54, 72, 90, 108, 126, 144, 162, 180].map((y, i) => (
            <ellipse key={i} cx="720" cy={y + 8} rx="5" ry="9"
              fill="none" stroke="#2a1f14" strokeWidth="2.5"
              transform={`rotate(${i % 2 === 0 ? 0 : 90} 720 ${y + 8})`}
            />
          ))}
          <g transform="translate(720, 195)">
            <ellipse cx="0" cy="-25" rx="55" ry="30"
              fill="#fcdba1" opacity="0.07" style={{ filter: 'blur(15px)' }}
              className="midground-lamp-glow"
            />
            {/* Larger shade */}
            <path d="M -70 0 L -20 -70 L 20 -70 L 70 0 Z"
              fill="#1e160e" stroke="#2a1f14" strokeWidth="2.5"
            />
            <path d="M -68 0 L 68 0" fill="none" stroke="#3d2e1c" strokeWidth="4" />
            {[-45, -25, 0, 25, 45].map((x, i) => (
              <line key={i} x1={x * 0.28} y1="-70" x2={x} y2="0"
                stroke="#251b0e" strokeWidth="1" opacity="0.6" />
            ))}
            <circle cx="0" cy="-12" r="10"
              fill="#fcdba1" opacity="0.75"
              style={{ filter: 'blur(4px)' }}
              className="midground-lamp-glow"
            />
            <circle cx="0" cy="-12" r="4" fill="#fff" opacity="0.9" />
            <polygon points="-70,0 70,0 160,380 -160,380"
              fill="url(#lamp-cone-grad)"
              className="midground-lamp-cone"
              style={{ filter: 'blur(10px)' }}
            />
          </g>
        </g>

        {/* ── Lamp 3 (Right) ────────────────────────────────────── */}
        <g ref={lamp3ChainRef} className="gpu-layer">
          {[0, 18, 36, 54, 72, 90, 108].map((y, i) => (
            <ellipse key={i} cx="1160" cy={y + 8} rx="5" ry="9"
              fill="none" stroke="#2a1f14" strokeWidth="2.5"
              transform={`rotate(${i % 2 === 0 ? 0 : 90} 1160 ${y + 8})`}
            />
          ))}
          <g transform="translate(1160, 115)">
            <ellipse cx="0" cy="-18" rx="35" ry="22"
              fill="#fcdba1" opacity="0.05" style={{ filter: 'blur(10px)' }}
              className="midground-lamp-glow"
            />
            <path d="M -45 0 L -12 -48 L 12 -48 L 45 0 Z"
              fill="#1e160e" stroke="#2a1f14" strokeWidth="2"
            />
            <path d="M -43 0 L 43 0" fill="none" stroke="#3d2e1c" strokeWidth="3" />
            {[-25, -12, 0, 12, 25].map((x, i) => (
              <line key={i} x1={x * 0.28} y1="-48" x2={x} y2="0"
                stroke="#251b0e" strokeWidth="1" opacity="0.5" />
            ))}
            <circle cx="0" cy="-8" r="7"
              fill="#fcdba1" opacity="0.65"
              style={{ filter: 'blur(3px)' }}
              className="midground-lamp-glow"
            />
            <circle cx="0" cy="-8" r="3" fill="#fff" opacity="0.85" />
            <polygon points="-45,0 45,0 100,260 -100,260"
              fill="url(#lamp-cone-grad)"
              className="midground-lamp-cone"
              style={{ filter: 'blur(7px)' }}
            />
          </g>
        </g>

        {/* ══════════════════════════════════════════════════════════ */}
        {/*   PENDULUM CLOCK (Left Wall)                              */}
        {/* ══════════════════════════════════════════════════════════ */}

        <g transform="translate(80, 180)">
          {/* Clock case — tall grandfather clock body */}
          <rect x="20" y="0" width="110" height="30" rx="4"
            fill="#1c1409" stroke="#2a1f14" strokeWidth="2" />
          {/* Clock neck */}
          <rect x="35" y="30" width="80" height="50" rx="2"
            fill="#181208" stroke="#241b0e" strokeWidth="1.5" />
          {/* Clock face housing */}
          <rect x="25" y="80" width="100" height="120" rx="3"
            fill="#1c1409" stroke="#2a1f14" strokeWidth="2" />
          {/* Clock face */}
          <circle cx="75" cy="140" r="45"
            fill="url(#clock-face)" stroke="#3d2e1c" strokeWidth="3" />
          <circle cx="75" cy="140" r="42"
            fill="none" stroke="#2a1f14" strokeWidth="1" />
          {/* Hour markers */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const r1 = i % 3 === 0 ? 34 : 37;
            const r2 = 40;
            return (
              <line key={i}
                x1={+(75 + Math.cos(angle) * r1).toFixed(2)} y1={+(140 + Math.sin(angle) * r1).toFixed(2)}
                x2={+(75 + Math.cos(angle) * r2).toFixed(2)} y2={+(140 + Math.sin(angle) * r2).toFixed(2)}
                stroke="#6b4e28" strokeWidth={i % 3 === 0 ? 2.5 : 1.5}
              />
            );
          })}
          {/* Hour hand */}
          <line className="clock-hour-hand"
            x1="75" y1="140" x2="75" y2="115"
            stroke="#b58953" strokeWidth="3" strokeLinecap="round"
            style={{ transformOrigin: '75px 140px' }}
          />
          {/* Minute hand */}
          <line className="clock-minute-hand"
            x1="75" y1="140" x2="75" y2="105"
            stroke="#c45b36" strokeWidth="2" strokeLinecap="round"
            style={{ transformOrigin: '75px 140px' }}
          />
          {/* Centre pip */}
          <circle cx="75" cy="140" r="4" fill="#b58953" />
          <circle cx="75" cy="140" r="2" fill="#fcdba1" opacity="0.8" />

          {/* Clock lower body — pendulum chamber */}
          <rect x="30" y="200" width="90" height="200" rx="2"
            fill="#161009" stroke="#241b0e" strokeWidth="1.5" />
          {/* Glass panel */}
          <rect x="38" y="210" width="74" height="180" rx="1"
            fill="#0a0806" stroke="#2a1f14" strokeWidth="1" opacity="0.8" />

          {/* Pendulum assembly */}
          <g ref={pendulumRef} style={{ transformOrigin: '75px 205px' }}>
            {/* Rod */}
            <line x1="75" y1="205" x2="75" y2="360"
              stroke="#3d2e1c" strokeWidth="2.5" />
            {/* Pendulum bob — ornate disc */}
            <circle cx="75" cy="360" r="22"
              fill="#1e160e" stroke="#b58953" strokeWidth="2.5" />
            <circle cx="75" cy="360" r="16"
              fill="none" stroke="#8a6535" strokeWidth="1" />
            <circle cx="75" cy="360" r="6"
              fill="#b58953" opacity="0.7" />
            <circle cx="75" cy="360" r="3"
              fill="#fcdba1" opacity="0.5" style={{ filter: 'blur(1px)' }} />
          </g>

          {/* Clock base */}
          <rect x="15" y="398" width="120" height="12" rx="4"
            fill="#1c1409" stroke="#2a1f14" strokeWidth="1.5" />
        </g>

        {/* ══════════════════════════════════════════════════════════ */}
        {/*   THE VAULT DOOR                                          */}
        {/* ══════════════════════════════════════════════════════════ */}

        <g ref={doorRef}>
          {/* Door darkness (the void inside the arch) */}
          <path
            d="M 480 900 L 480 370 Q 480 185 720 185 Q 960 185 960 370 L 960 900 Z"
            fill="#030201"
          />

          {/* ── The Door itself — two panels ─────────────────────── */}

          {/* Left panel */}
          <rect x="480" y="300" width="236" height="600"
            fill="url(#door-metal)" rx="0"
          />
          {/* Left panel vertical planks */}
          {[505, 540, 575, 610, 645, 680].map((x, i) => (
            <line key={i} x1={x} y1="300" x2={x} y2="900"
              stroke="#251b0e" strokeWidth="1.5" opacity="0.5" />
          ))}
          {/* Left panel horizontal banding */}
          {[380, 460, 550, 640, 730, 820].map((y, i) => (
            <line key={i} x1="480" y1={y} x2="716" y2={y}
              stroke="#201608" strokeWidth="1" opacity="0.4" />
          ))}

          {/* Right panel */}
          <rect x="724" y="300" width="236" height="600"
            fill="url(#door-metal)" rx="0"
          />
          {[749, 784, 819, 854, 889, 924].map((x, i) => (
            <line key={i} x1={x} y1="300" x2={x} y2="900"
              stroke="#251b0e" strokeWidth="1.5" opacity="0.5" />
          ))}
          {[380, 460, 550, 640, 730, 820].map((y, i) => (
            <line key={i} x1="724" y1={y} x2="960" y2={y}
              stroke="#201608" strokeWidth="1" opacity="0.4" />
          ))}

          {/* ── Door Arch Top ─────────────────────────────────────── */}
          <path
            d="M 480 370 Q 480 185 720 185 Q 960 185 960 370 L 960 300 Q 960 155 720 155 Q 480 155 480 300 Z"
            fill="url(#door-banding)"
          />
          {/* Arch radial planks */}
          {[-3, -2, -1, 0, 1, 2, 3].map((i) => {
            const a = i * 25 * (Math.PI / 180);
            const r1 = 80; const r2 = 210;
            return (
              <line key={i}
                x1={+(720 + Math.sin(a) * r1).toFixed(2)} y1={+(185 - Math.cos(a) * r1 + 100).toFixed(2)}
                x2={+(720 + Math.sin(a) * r2).toFixed(2)} y2={+(185 - Math.cos(a) * r2 + 100).toFixed(2)}
                stroke="#201608" strokeWidth="1" opacity="0.4"
              />
            );
          })}

          {/* ── Large Iron Bolts / Rivets ─────────────────────────── */}
          {/* Left panel corner bolts */}
          {[[490, 315], [700, 315], [490, 880], [700, 880],
            [490, 590], [700, 590]].map(([x, y], i) => (
            <g key={`bolt-l-${i}`}>
              <circle cx={x} cy={y} r="9" fill="#150f07" stroke="#2a1f14" strokeWidth="2" />
              <circle cx={x} cy={y} r="5" fill="#1e160e" />
              <line x1={x - 5} y1={y} x2={x + 5} y2={y} stroke="#2a1f14" strokeWidth="1.5" />
              <line x1={x} y1={y - 5} x2={x} y2={y + 5} stroke="#2a1f14" strokeWidth="1.5" />
            </g>
          ))}
          {/* Right panel corner bolts */}
          {[[740, 315], [950, 315], [740, 880], [950, 880],
            [740, 590], [950, 590]].map(([x, y], i) => (
            <g key={`bolt-r-${i}`}>
              <circle cx={x} cy={y} r="9" fill="#150f07" stroke="#2a1f14" strokeWidth="2" />
              <circle cx={x} cy={y} r="5" fill="#1e160e" />
              <line x1={x - 5} y1={y} x2={x + 5} y2={y} stroke="#2a1f14" strokeWidth="1.5" />
              <line x1={x} y1={y - 5} x2={x} y2={y + 5} stroke="#2a1f14" strokeWidth="1.5" />
            </g>
          ))}

          {/* ── Locking Mechanism — Central Wheel ────────────────── */}
          {/* Central lock wheel */}
          <g transform="translate(720, 560)">
            {/* Outer ring */}
            <circle cx="0" cy="0" r="50" fill="#140e07" stroke="#3d2e1c" strokeWidth="4" />
            <circle cx="0" cy="0" r="44" fill="none" stroke="#241b0e" strokeWidth="2" />
            {/* Spokes */}
            {[0, 45, 90, 135].map((a, i) => (
              <line key={i}
                x1={+(Math.cos(a * Math.PI / 180) * -40).toFixed(2)} y1={+(Math.sin(a * Math.PI / 180) * -40).toFixed(2)}
                x2={+(Math.cos(a * Math.PI / 180) * 40).toFixed(2)}  y2={+(Math.sin(a * Math.PI / 180) * 40).toFixed(2)}
                stroke="#3d2e1c" strokeWidth="5" strokeLinecap="round"
              />
            ))}
            {/* Inner hub */}
            <circle cx="0" cy="0" r="14" fill="#1e160e" stroke="#2a1f14" strokeWidth="3" />
            <circle cx="0" cy="0" r="7" fill="#b58953" opacity="0.4" />
            {/* Keyhole slot */}
            <ellipse cx="0" cy="5" rx="5" ry="8" fill="#060403" />
            <circle cx="0" cy="-3" r="5" fill="#060403" />
          </g>

          {/* ── Horizontal Lock Bars ──────────────────────────────── */}
          {/* These are the bars that "slide" to lock the door */}
          {[400, 530, 670, 800].map((y, i) => (
            <g key={`bar-${i}`}>
              {/* Left bar */}
              <rect x="485" y={y - 6} width="232" height="12" rx="3"
                fill="#1a1208" stroke="#2a1f14" strokeWidth="1.5"
                className="door-lock-bar"
              />
              {/* Right bar */}
              <rect x="723" y={y - 6} width="232" height="12" rx="3"
                fill="#1a1208" stroke="#2a1f14" strokeWidth="1.5"
                className="door-lock-bar"
              />
              {/* Centre join — hidden behind lock wheel (only for top/bottom bars) */}
              {i !== 1 && i !== 2 && (
                <rect x="706" y={y - 8} width="28" height="16" rx="2"
                  fill="#130d07" stroke="#1e160e" strokeWidth="1"
                />
              )}
            </g>
          ))}

          {/* ── Door Centre Seam (crack with light leaking through) ─ */}
          <line x1="720" y1="185" x2="720" y2="900"
            stroke="#fcdba1" strokeWidth="1.5"
            opacity="0" // Will be animated via GSAP on scroll
            className="door-centre-crack"
          />
          {/* Light leak glow on the seam */}
          <rect x="716" y="200" width="8" height="700"
            fill="url(#door-crack-grad)"
            opacity="0.08"
            style={{ filter: 'blur(3px)' }}
            className="door-crack-glow"
          />

          {/* ── Door bottom threshold ─────────────────────────────── */}
          <rect x="480" y="895" width="480" height="10"
            fill="#100c08" stroke="#1e160e" strokeWidth="2"
          />
          {/* Threshold plates */}
          {[490, 560, 630, 700, 770, 840, 910].map((x, i) => (
            <rect key={i} x={x} y="893" width="60" height="7" rx="1"
              fill="#1a1208" stroke="#241b0e" strokeWidth="1" opacity="0.7"
            />
          ))}
        </g>

        {/* ── Small ornamental gear on door frame (detail) ──────── */}
        <g transform="translate(458, 530)" opacity="0.5">
          <circle cx="0" cy="0" r="18" fill="none" stroke="#2a1f14" strokeWidth="4" />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = i * 45 * (Math.PI / 180);
            return (
              <rect key={i}
                x={-3} y={-22}
                width="6" height="8" rx="1"
                fill="#2a1f14"
                transform={`rotate(${i * 45} 0 0)`}
              />
            );
          })}
          <circle cx="0" cy="0" r="7" fill="#1e160e" stroke="#3d2e1c" strokeWidth="2" />
        </g>
        <g transform="translate(982, 530)" opacity="0.5">
          <circle cx="0" cy="0" r="18" fill="none" stroke="#2a1f14" strokeWidth="4" />
          {Array.from({ length: 8 }).map((_, i) => (
            <rect key={i} x={-3} y={-22} width="6" height="8" rx="1"
              fill="#2a1f14" transform={`rotate(${i * 45} 0 0)`}
            />
          ))}
          <circle cx="0" cy="0" r="7" fill="#1e160e" stroke="#3d2e1c" strokeWidth="2" />
        </g>

      </svg>
    </div>
  );
});

export default MidgroundLayer;
