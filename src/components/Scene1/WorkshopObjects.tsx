'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function WorkshopObjects() {
  const gear1Ref = useRef<SVGGElement>(null);
  const gear2Ref = useRef<SVGGElement>(null);
  const pendulumRef = useRef<SVGGElement>(null);

  useEffect(() => {
    // Interlocking gears rotation
    if (gear1Ref.current && gear2Ref.current) {
      gsap.to(gear1Ref.current, {
        rotation: 360,
        transformOrigin: "center center",
        duration: 20,
        repeat: -1,
        ease: "none"
      });
      
      gsap.to(gear2Ref.current, {
        rotation: -360,
        transformOrigin: "center center",
        duration: 15, // Faster since it's smaller
        repeat: -1,
        ease: "none"
      });
    }

    // Pendulum swing
    if (pendulumRef.current) {
      gsap.fromTo(pendulumRef.current, 
        { rotation: -15 },
        {
          rotation: 15,
          transformOrigin: "top center",
          duration: 2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1
        }
      );
    }
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      
      {/* Wall Clock & Pendulum (Top Left) */}
      <div className="absolute top-[15%] left-[10%] w-32 h-64">
        <svg viewBox="0 0 100 200" className="w-full h-full text-[var(--color-workshop-brass)] drop-shadow-xl">
          {/* Clock Face */}
          <circle cx="50" cy="40" r="30" fill="var(--color-workshop-wood)" stroke="currentColor" strokeWidth="4" />
          <circle cx="50" cy="40" r="25" fill="none" stroke="var(--color-workshop-copper)" strokeWidth="1" strokeDasharray="2 4" />
          <line x1="50" y1="40" x2="65" y2="25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="50" y1="40" x2="45" y2="55" stroke="var(--color-workshop-copper)" strokeWidth="3" strokeLinecap="round" />
          
          {/* Pendulum */}
          <g ref={pendulumRef}>
            <line x1="50" y1="70" x2="50" y2="160" stroke="currentColor" strokeWidth="3" />
            <circle cx="50" cy="160" r="15" fill="var(--color-workshop-copper)" stroke="currentColor" strokeWidth="2" />
            <circle cx="50" cy="160" r="5" fill="#fcdba1" opacity="0.6" filter="blur(1px)" />
          </g>
        </svg>
      </div>

      {/* Exposed Gears (Mid Right) */}
      <div className="absolute top-[40%] right-[15%] w-48 h-48 opacity-40 mix-blend-screen">
        <svg viewBox="0 0 200 200" className="w-full h-full text-[var(--color-workshop-copper)] drop-shadow-2xl">
          <g ref={gear1Ref}>
            <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="8" />
            <circle cx="100" cy="100" r="20" fill="none" stroke="var(--color-workshop-brass)" strokeWidth="4" />
            {/* Gear teeth */}
            {[...Array(8)].map((_, i) => (
              <rect key={i} x="95" y="50" width="10" height="20" fill="currentColor" transform={`rotate(${i * 45} 100 100)`} />
            ))}
          </g>

          <g ref={gear2Ref} transform="translate(60, -50)">
            <circle cx="100" cy="100" r="25" fill="none" stroke="var(--color-workshop-brass)" strokeWidth="6" />
            {/* Gear teeth */}
            {[...Array(6)].map((_, i) => (
              <rect key={i} x="96" y="65" width="8" height="15" fill="var(--color-workshop-brass)" transform={`rotate(${i * 60} 100 100)`} />
            ))}
          </g>
        </svg>
      </div>
      
    </div>
  );
}
