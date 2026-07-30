'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Robot() {
  const robotRef = useRef<HTMLDivElement>(null);
  const chestRef = useRef<SVGRectElement>(null);
  const eyesRef = useRef<SVGGElement>(null);
  const antennaRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    // Breathing animation (chest expansion)
    if (chestRef.current) {
      gsap.to(chestRef.current, {
        scaleY: 1.05,
        scaleX: 1.02,
        transformOrigin: "bottom center",
        duration: 2.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });
    }

    // Gentle robot bobbing
    if (robotRef.current) {
      gsap.to(robotRef.current, {
        y: 2,
        rotation: 1,
        duration: 2.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });
    }

    // Antenna glow pulsing
    if (antennaRef.current) {
      gsap.to(antennaRef.current, {
        opacity: 0.4,
        duration: 1.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });
    }

    // Eyes occasionally flicker slightly even when sleeping
    if (eyesRef.current) {
      gsap.to(eyesRef.current, {
        opacity: 0.1,
        duration: 0.1,
        repeat: -1,
        repeatDelay: 5,
        yoyo: true,
        ease: "steps(1)"
      });
    }
  }, []);

  return (
    <div ref={robotRef} className="absolute bottom-[20%] right-[20%] w-32 h-40 z-40 transform -rotate-12">
      <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-2xl">
        {/* Antenna */}
        <line x1="50" y1="20" x2="50" y2="5" stroke="var(--color-workshop-copper)" strokeWidth="2" />
        <circle ref={antennaRef} cx="50" cy="5" r="4" fill="#fcdba1" opacity="0.8" filter="blur(1px)" />

        {/* Head */}
        <rect x="25" y="20" width="50" height="40" rx="10" fill="var(--color-workshop-brass)" />
        <rect x="30" y="25" width="40" height="20" rx="5" fill="#1a1a1a" />
        
        {/* Sleeping Eyes (Closed) */}
        <g ref={eyesRef} opacity="0.3">
          <path d="M 35 35 Q 40 40 45 35" stroke="#fcdba1" strokeWidth="2" fill="transparent" strokeLinecap="round" />
          <path d="M 55 35 Q 60 40 65 35" stroke="#fcdba1" strokeWidth="2" fill="transparent" strokeLinecap="round" />
        </g>

        {/* Neck */}
        <rect x="40" y="60" width="20" height="10" fill="var(--color-workshop-wood)" />

        {/* Body (Chest) */}
        <rect ref={chestRef} x="20" y="70" width="60" height="45" rx="8" fill="var(--color-workshop-copper)" />
        
        {/* Inner Heart/Core glowing slightly */}
        <circle cx="50" cy="90" r="8" fill="var(--color-workshop-brass)" />
        <circle cx="50" cy="90" r="4" fill="#fcdba1" opacity="0.5" filter="blur(2px)" />

        {/* Arms tucked in */}
        <path d="M 20 75 Q 10 90 25 105" stroke="var(--color-workshop-brass)" strokeWidth="6" fill="transparent" strokeLinecap="round" />
        <path d="M 80 75 Q 90 90 75 105" stroke="var(--color-workshop-brass)" strokeWidth="6" fill="transparent" strokeLinecap="round" />
      </svg>
    </div>
  );
}
