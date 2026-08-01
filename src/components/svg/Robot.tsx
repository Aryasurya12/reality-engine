'use client';

import { RefObject, useEffect, memo, forwardRef, useRef } from 'react';
import gsap from 'gsap';

interface RobotProps {
  headRef?: RefObject<SVGGElement | null>;
  chestRef?: RefObject<SVGGElement | null>;
  eyesRef?: RefObject<SVGGElement | null>;
  antennaRef?: RefObject<SVGCircleElement | null>;
  legLeftRef?: RefObject<SVGGElement | null>;
  legRightRef?: RefObject<SVGGElement | null>;
  armLeftRef?: RefObject<SVGGElement | null>;
  armRightRef?: RefObject<SVGGElement | null>;
}

const Robot = memo(forwardRef<HTMLDivElement, RobotProps>(function Robot({
  headRef: externalHeadRef, chestRef: externalChestRef, eyesRef: externalEyesRef, antennaRef: externalAntennaRef,
  legLeftRef: externalLegLeftRef, legRightRef: externalLegRightRef, armLeftRef: externalArmLeftRef, armRightRef: externalArmRightRef,
}, ref) {

  const internalHeadRef = useRef<SVGGElement>(null);
  const internalChestRef = useRef<SVGGElement>(null);
  const internalEyesRef = useRef<SVGGElement>(null);
  const internalAntennaRef = useRef<SVGCircleElement>(null);
  const internalLegLeftRef = useRef<SVGGElement>(null);
  const internalLegRightRef = useRef<SVGGElement>(null);
  const internalArmLeftRef = useRef<SVGGElement>(null);
  const internalArmRightRef = useRef<SVGGElement>(null);

  const headRef = externalHeadRef || internalHeadRef;
  const chestRef = externalChestRef || internalChestRef;
  const eyesRef = externalEyesRef || internalEyesRef;
  const antennaRef = externalAntennaRef || internalAntennaRef;
  const legLeftRef = externalLegLeftRef || internalLegLeftRef;
  const legRightRef = externalLegRightRef || internalLegRightRef;
  const armLeftRef = externalArmLeftRef || internalArmLeftRef;
  const armRightRef = externalArmRightRef || internalArmRightRef;

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Sleeping Breathing — slow, deep inhale-exhale ─────────────
      if (chestRef.current) {
        gsap.to(chestRef.current, {
          scaleY: 1.06,
          scaleX: 1.03,
          transformOrigin: 'bottom center',
          duration: 3.2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      }

      // ── Head drooping while sleeping ──────────────────────────────
      if (headRef.current) {
        gsap.to(headRef.current, {
          rotation: 12, // Drooped forward
          y: 4,
          transformOrigin: '50px 65px',
          duration: 3.8,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 0.6,
        });
      }

      // ── Antenna pulse — slow, dim while sleeping ──────────────────
      if (antennaRef.current) {
        gsap.to(antennaRef.current, {
          opacity: 0.8,
          attr: { r: 5 },
          duration: 2.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 1.0,
        });
      }

      // ── Body subtle side sway while sleeping ──────────────────────
      gsap.to('.robot-body-group', {
        rotation: 1.5,
        transformOrigin: 'bottom center',
        duration: 5.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      // ── Eyes (lids closed while sleeping) — subtle flicker ────────
      if (eyesRef.current) {
        gsap.set(eyesRef.current, { scaleY: 0.15, transformOrigin: '50% 50%' });
        // Very subtle twitch as if REM dreaming
        gsap.to(eyesRef.current, {
          x: 'random(-1, 1)',
          duration: 'random(0.15, 0.4)',
          repeat: -1,
          repeatRefresh: true,
          ease: 'none',
          repeatDelay: 3,
        });
      }

    });

    return () => ctx.revert();
  }, [headRef, chestRef, eyesRef, antennaRef]);

  return (
    // Robot slumped against the door frame, bottom-right of entrance
    <div ref={ref} className="robot-container absolute z-40 transform-gpu"
      style={{
        bottom: '8%',
        right: '22%',
        width: '110px',
        height: '150px',
      }}
    >
      <svg
        viewBox="0 0 100 140"
        className="w-full h-full overflow-visible"
        style={{ filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.8))' }}
      >
        <defs>
          {/* Copper body gradient */}
          <linearGradient id="robot-body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c45b36" />
            <stop offset="50%" stopColor="#a34a2c" />
            <stop offset="100%" stopColor="#7a3620" />
          </linearGradient>

          {/* Brass head gradient */}
          <linearGradient id="robot-head-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4a44c" />
            <stop offset="50%" stopColor="#b58953" />
            <stop offset="100%" stopColor="#8a6535" />
          </linearGradient>

          {/* Inner glow for chest core */}
          <radialGradient id="robot-core-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fcdba1" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#e8a84a" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Shadow on floor ──────────────────────────────────────── */}
        <ellipse cx="50" cy="138" rx="38" ry="6"
          fill="#000" opacity="0.5" style={{ filter: 'blur(4px)' }} />

        {/* ── Entire robot body group (for sway) ───────────────────── */}
        <g className="robot-body-group">

          {/* ── Legs — folded/sitting pose ──────────────────────────── */}
          {/* Left leg — bent outward */}
          <g ref={legLeftRef as any} className="robot-leg-left"
            style={{ transformOrigin: '35px 108px' }}
          >
            {/* Upper leg */}
            <path d="M 35 108 L 20 128"
              stroke="#b58953" strokeWidth="7" strokeLinecap="round" fill="none"
            />
            {/* Lower leg — bent at knee */}
            <path d="M 20 128 L 12 118"
              stroke="#8a6535" strokeWidth="6" strokeLinecap="round" fill="none"
            />
            {/* Foot */}
            <ellipse cx="10" cy="116" rx="10" ry="5"
              fill="#8a6535" stroke="#6b4e28" strokeWidth="1.5"
            />
          </g>

          {/* Right leg — folded differently (more natural asymmetry) */}
          <g ref={legRightRef as any} className="robot-leg-right"
            style={{ transformOrigin: '65px 108px' }}
          >
            <path d="M 65 108 L 80 125"
              stroke="#b58953" strokeWidth="7" strokeLinecap="round" fill="none"
            />
            <path d="M 80 125 L 90 115"
              stroke="#8a6535" strokeWidth="6" strokeLinecap="round" fill="none"
            />
            <ellipse cx="92" cy="113" rx="10" ry="5"
              fill="#8a6535" stroke="#6b4e28" strokeWidth="1.5"
            />
          </g>

          {/* ── Body (Chest) ─────────────────────────────────────────── */}
          <g ref={chestRef as any} className="robot-chest" style={{ transformOrigin: '50px 90px' }}>
            {/* Main chest body */}
            <rect x="22" y="68" width="56" height="42" rx="10"
              fill="url(#robot-body-grad)"
              stroke="#7a3620" strokeWidth="1.5"
            />
            {/* Chest panel detail */}
            <rect x="30" y="75" width="40" height="28" rx="6"
              fill="#8a3520" stroke="#6b2c18" strokeWidth="1"
            />

            {/* Inner glowing core / heart */}
            <circle cx="50" cy="89" r="10"
              fill="url(#robot-core-grad)" opacity="0.7"
              style={{ filter: 'blur(2px)' }}
            />
            <circle cx="50" cy="89" r="5"
              fill="#fcdba1" opacity="0.5"
              style={{ filter: 'blur(1px)' }}
            />

            {/* Small indicator lights on chest */}
            <circle cx="36" cy="79" r="2.5" fill="#1a1208" stroke="#3d2e1c" strokeWidth="1" />
            <circle cx="44" cy="79" r="2.5" fill="#1a1208" stroke="#3d2e1c" strokeWidth="1" />
            {/* Sleeping — indicator barely lit */}
            <circle cx="36" cy="79" r="1.5" fill="#c45b36" opacity="0.2" />
            <circle cx="44" cy="79" r="1.5" fill="#b58953" opacity="0.15" />
          </g>

          {/* ── Arms ─────────────────────────────────────────────────── */}
          {/* Left arm — resting on left knee */}
          <g ref={armLeftRef as any} className="robot-arm-left"
            style={{ transformOrigin: '22px 75px' }}
          >
            <path d="M 22 75 Q 8 90 14 115"
              stroke="#b58953" strokeWidth="7" strokeLinecap="round" fill="none"
            />
            {/* Hand */}
            <circle cx="14" cy="117" r="7"
              fill="#8a6535" stroke="#6b4e28" strokeWidth="1.5"
            />
            <line x1="10" y1="114" x2="8" y2="122"
              stroke="#6b4e28" strokeWidth="2" strokeLinecap="round"
            />
            <line x1="14" y1="113" x2="12" y2="122"
              stroke="#6b4e28" strokeWidth="2" strokeLinecap="round"
            />
            <line x1="18" y1="114" x2="18" y2="121"
              stroke="#6b4e28" strokeWidth="2" strokeLinecap="round"
            />
          </g>

          {/* Right arm — dangling to the side */}
          <g ref={armRightRef as any} className="robot-arm-right"
            style={{ transformOrigin: '78px 75px' }}
          >
            <path d="M 78 75 Q 92 88 88 110"
              stroke="#b58953" strokeWidth="7" strokeLinecap="round" fill="none"
            />
            <circle cx="88" cy="112" r="7"
              fill="#8a6535" stroke="#6b4e28" strokeWidth="1.5"
            />
            <line x1="84" y1="109" x2="82" y2="117"
              stroke="#6b4e28" strokeWidth="2" strokeLinecap="round"
            />
            <line x1="88" y1="108" x2="86" y2="117"
              stroke="#6b4e28" strokeWidth="2" strokeLinecap="round"
            />
            <line x1="92" y1="109" x2="92" y2="116"
              stroke="#6b4e28" strokeWidth="2" strokeLinecap="round"
            />
          </g>

          {/* ── Neck ─────────────────────────────────────────────────── */}
          <rect x="42" y="58" width="16" height="12" rx="4"
            fill="#2c1a0e" stroke="#3d2e1c" strokeWidth="1"
          />
          {/* Neck joint ring */}
          <rect x="40" y="62" width="20" height="6" rx="3"
            fill="#1e160e" stroke="#2a1f14" strokeWidth="1"
          />

          {/* ── Head Container ────────────────────────────────────────── */}
          <g ref={headRef as any} className="robot-head"
            style={{ transformOrigin: '50px 65px' }}
          >
            {/* Antenna */}
            <line x1="50" y1="22" x2="50" y2="8"
              stroke="#c45b36" strokeWidth="2"
            />
            {/* Antenna tip glow */}
            <circle ref={antennaRef as any} cx="50" cy="6" r="4"
              fill="#fcdba1" opacity="0.2"
              style={{ filter: 'blur(1.5px)' }}
            />
            <circle cx="50" cy="6" r="2.5" fill="#fcdba1" opacity="0.5" />

            {/* Head box */}
            <rect x="22" y="22" width="56" height="42" rx="12"
              fill="url(#robot-head-grad)"
              stroke="#8a6535" strokeWidth="1.5"
            />
            {/* Head panel (visor recess) */}
            <rect x="28" y="28" width="44" height="22" rx="8"
              fill="#0a0806"
              stroke="#2a1f14" strokeWidth="1"
            />

            {/* ── Eyes (sleeping — narrow slits) ───────────────────── */}
            <g ref={eyesRef as any} style={{ transformOrigin: '50px 39px' }}>
              {/* Left eye — narrow slit when sleeping */}
              <rect x="31" y="37" width="14" height="4" rx="2"
                fill="#fcdba1" opacity="0.3"
              />
              {/* Right eye */}
              <rect x="55" y="37" width="14" height="4" rx="2"
                fill="#fcdba1" opacity="0.3"
              />
              {/* Eye glow beneath lids */}
              <ellipse cx="38" cy="39" rx="7" ry="3"
                fill="#fcdba1" opacity="0.1"
                style={{ filter: 'blur(2px)' }}
              />
              <ellipse cx="62" cy="39" rx="7" ry="3"
                fill="#fcdba1" opacity="0.1"
                style={{ filter: 'blur(2px)' }}
              />
            </g>

            {/* Cheek panel detail */}
            <rect x="28" y="52" width="10" height="8" rx="2"
              fill="#8a6535" opacity="0.6" stroke="#6b4e28" strokeWidth="0.5"
            />
            <rect x="62" y="52" width="10" height="8" rx="2"
              fill="#8a6535" opacity="0.6" stroke="#6b4e28" strokeWidth="0.5"
            />

            {/* Mouth — neutral line, slightly curved down (sleeping) */}
            <path d="M 38 57 Q 50 56 62 57"
              fill="none" stroke="#6b4e28" strokeWidth="2" strokeLinecap="round"
            />

            {/* Head bolt details */}
            <circle cx="26" cy="26" r="3" fill="#8a6535" stroke="#6b4e28" strokeWidth="1" />
            <circle cx="74" cy="26" r="3" fill="#8a6535" stroke="#6b4e28" strokeWidth="1" />
          </g>

        </g>{/* end robot-body-group */}
      </svg>
    </div>
  );
}));

Robot.displayName = 'Robot';
export default Robot;
