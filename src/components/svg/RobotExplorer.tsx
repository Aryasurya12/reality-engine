'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGlobalState } from '@/store/useGlobalState';
import { useCursorStore } from '@/store/useCursorStore';

export default function RobotExplorer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { repairPhase } = useGlobalState();
  const { setCursorState } = useCursorStore();

  useEffect(() => {
    if (repairPhase === 'ready_to_repair') {
      const container = containerRef.current;
      if (!container) return;

      // 1. Initial Guidance Sequence (Rule of Three)
      const guideTl = gsap.timeline({ repeat: -1, repeatDelay: 3 });
      
      guideTl
        .to('.robot-head', { rotation: -30, duration: 0.5 }) // Look at fallen gear
        .to('.robot-head', { rotation: 20, duration: 0.5 }, "+=1") // Look at socket
        .to('.robot-head', { rotation: 0, duration: 0.3 }, "+=1") // Look at user
        .to('.robot-arm-left', { rotation: -120, yoyo: true, repeat: 3, duration: 0.2 }, "+=0.2"); // Wave to user

      // 2. Idle Timer (15 seconds)
      const idleTimer = setTimeout(() => {
        // If still not repaired, take action
        guideTl.kill(); // Stop waving
        
        const walkTl = gsap.timeline();
        walkTl
          .to(container, { x: 350, y: 150, duration: 3, ease: 'power1.inOut' }) // Walk to gear
          .to('.robot-head', { rotation: 40, duration: 0.5 }) // Look down
          .to('.robot-arm-right', { rotation: -90, duration: 0.5 }) // Point at it
          .to('.robot-head', { rotation: -30, duration: 0.5 }, "+=1") // Look back at user pleadingly
          .to('.robot-arm-left', { rotation: -130, yoyo: true, repeat: -1, duration: 0.3 }, "+=0.5"); // Frantic wave
          
      }, 15000);

      return () => {
        guideTl.kill();
        clearTimeout(idleTimer);
      };
    } else if (repairPhase === 'repaired') {
      gsap.killTweensOf('.robot-head');
      gsap.killTweensOf('.robot-arm-left');
      gsap.killTweensOf('.robot-arm-right');
      
      const successTl = gsap.timeline();
      successTl
        .to('.robot-head', { rotation: 0, duration: 0.3 })
        .to('.robot-arm-left', { rotation: -160, duration: 0.2 })
        .to('.robot-arm-right', { rotation: -160, duration: 0.2 })
        .to('.robot-container', { y: "-=20", yoyo: true, repeat: 3, duration: 0.15 }); // Jump for joy
    }
  }, [repairPhase]);

  return (
    <div ref={containerRef} className="robot-container absolute bottom-[20%] left-[20%] z-[25] pointer-events-auto">
      <motion.svg 
        viewBox="0 0 200 300" 
        className="w-32 h-48 drop-shadow-2xl cursor-none"
        whileHover={{ scale: 1.05 }}
        onMouseEnter={() => setCursorState('hover-robot')}
        onMouseLeave={() => setCursorState('default')}
      >
        {/* Antenna */}
        <line className="robot-antenna" x1="100" y1="20" x2="100" y2="50" stroke="var(--color-workshop-copper)" strokeWidth="4" />
        <circle className="robot-antenna-bulb" cx="100" cy="20" r="8" fill="#fcdba1" />
        
        {/* Head */}
        <rect className="robot-head" x="60" y="50" width="80" height="60" rx="10" fill="#150e09" stroke="var(--color-workshop-brass)" strokeWidth="4" style={{ transformOrigin: "100px 110px" }} />
        
        {/* Eyes */}
        <g className="robot-eyes">
          <path d="M 75 80 Q 85 90 95 80" fill="none" stroke="#fcdba1" strokeWidth="4" strokeLinecap="round" />
          <path d="M 105 80 Q 115 90 125 80" fill="none" stroke="#fcdba1" strokeWidth="4" strokeLinecap="round" />
        </g>

        {/* Neck */}
        <rect x="90" y="110" width="20" height="20" fill="var(--color-workshop-copper)" />
        
        {/* Body */}
        <rect className="robot-body" x="50" y="130" width="100" height="90" rx="15" fill="#d9453b" stroke="var(--color-workshop-brass)" strokeWidth="4" />
        <circle cx="100" cy="175" r="20" fill="#fcdba1" opacity="0.8" filter="blur(2px)" />
        
        {/* Arms */}
        <rect className="robot-arm-left" x="30" y="140" width="15" height="60" rx="5" fill="var(--color-workshop-copper)" stroke="var(--color-workshop-brass)" strokeWidth="2" style={{ transformOrigin: "40px 145px" }} />
        <rect className="robot-arm-right" x="155" y="140" width="15" height="60" rx="5" fill="var(--color-workshop-copper)" stroke="var(--color-workshop-brass)" strokeWidth="2" style={{ transformOrigin: "160px 145px" }} />
        
        {/* Wheels/Legs */}
        <rect className="robot-leg-left" x="70" y="220" width="15" height="30" rx="5" fill="var(--color-workshop-copper)" />
        <rect className="robot-leg-right" x="115" y="220" width="15" height="30" rx="5" fill="var(--color-workshop-copper)" />
      </motion.svg>
    </div>
  );
}
