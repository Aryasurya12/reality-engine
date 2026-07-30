'use client';

import { forwardRef, RefObject, useEffect } from 'react';
import gsap from 'gsap';

interface RobotProps {
  headRef: RefObject<SVGRectElement | null>;
  chestRef: RefObject<SVGRectElement | null>;
  eyesRef: RefObject<SVGGElement | null>;
  antennaRef: RefObject<SVGCircleElement | null>;
  legLeftRef: RefObject<SVGPathElement | null>;
  legRightRef: RefObject<SVGPathElement | null>;
}

const Robot = forwardRef<HTMLDivElement, RobotProps>(({ headRef, chestRef, eyesRef, antennaRef, legLeftRef, legRightRef }, ref) => {
  
  useEffect(() => {
    // Breathing animation (chest expansion) - Runs continuously
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
  }, []);

  return (
    <div ref={ref} className="absolute bottom-[20%] right-[20%] w-32 h-40 z-40 transform -rotate-12 transform-origin-bottom">
      <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-2xl overflow-visible">
        
        {/* Legs / Wheels */}
        <g stroke="var(--color-workshop-brass)" strokeWidth="6" fill="transparent" strokeLinecap="round">
          <path ref={legLeftRef} d="M 35 110 L 35 125" style={{ transformOrigin: "35px 110px" }} />
          <path ref={legRightRef} d="M 65 110 L 65 125" style={{ transformOrigin: "65px 110px" }} />
          {/* Feet */}
          <line x1="30" y1="125" x2="40" y2="125" strokeWidth="4" />
          <line x1="60" y1="125" x2="70" y2="125" strokeWidth="4" />
        </g>

        {/* Body Container to allow head to rotate independently */}
        <g>
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
        </g>

        {/* Head Container - Can rotate freely based on mouse position */}
        <g ref={headRef as any} style={{ transformOrigin: "50px 60px" }}>
          {/* Antenna */}
          <line x1="50" y1="20" x2="50" y2="5" stroke="var(--color-workshop-copper)" strokeWidth="2" />
          <circle ref={antennaRef} cx="50" cy="5" r="4" fill="#fcdba1" opacity="0.3" filter="blur(1px)" />

          {/* Head Box */}
          <rect x="25" y="20" width="50" height="40" rx="10" fill="var(--color-workshop-brass)" />
          <rect x="30" y="25" width="40" height="20" rx="5" fill="#1a1a1a" />
          
          {/* Eyes Container - Moves based on tracking */}
          <g ref={eyesRef}>
            <path d="M 35 35 Q 40 40 45 35" stroke="#fcdba1" strokeWidth="2" fill="transparent" strokeLinecap="round" />
            <path d="M 55 35 Q 60 40 65 35" stroke="#fcdba1" strokeWidth="2" fill="transparent" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    </div>
  );
});

Robot.displayName = 'Robot';
export default Robot;
