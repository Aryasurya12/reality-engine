'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { sounds } from '../../Scene1/Core/AudioController';
import { useGlobalState } from '@/store/useGlobalState';

// Register GSAP Plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable);
}

export default function MechanicalCrank() {
  const crankRef = useRef<SVGGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotationProgress, setRotationProgress] = useState(0);
  const { transitionToScene } = useGlobalState();
  const hasTriggeredTransition = useRef(false);

  useEffect(() => {
    if (!crankRef.current || !containerRef.current) return;

    // Entrance Animation
    gsap.fromTo(containerRef.current, 
      { opacity: 0, x: -50 }, 
      { opacity: 1, x: 0, duration: 1, ease: 'power2.out', delay: 1 }
    );

    // Draggable Rotation Logic
    Draggable.create(crankRef.current, {
      type: "rotation",
      inertia: true,
      onDrag: function () {
        // Calculate total rotation
        const currentRot = this.rotation;
        
        // Prevent rotating backwards past 0
        if (currentRot < 0) {
          gsap.set(crankRef.current, { rotation: 0 });
          return;
        }

        // Play heavy mechanical sounds occasionally
        if (Math.random() > 0.9) {
           sounds.gearClick.play();
        }

        // Map rotation to progress (Let's say 3 full spins = 1080 degrees)
        const progress = Math.min(100, (currentRot / 1080) * 100);
        setRotationProgress(progress);
        
        // Dynamic camera shake as pressure builds
        gsap.to(document.body, {
          x: Math.random() * (progress * 0.05),
          y: Math.random() * (progress * 0.05),
          duration: 0.1,
          yoyo: true,
          repeat: 1
        });

        if (progress >= 100 && !hasTriggeredTransition.current) {
          hasTriggeredTransition.current = true;
          sounds.servo.play();
          
          // Massive camera shake and unlock!
          gsap.to(document.body, { x: 10, duration: 0.1, yoyo: true, repeat: 10, ease: 'rough' });
          
          // Transition to next scene after 2 seconds
          setTimeout(() => {
            transitionToScene('scene2_machine_room');
          }, 2000);
        }
      }
    });
  }, [transitionToScene]);

  return (
    <div ref={containerRef} className="absolute top-[50%] right-[25%] w-32 h-32 z-50">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl overflow-visible">
        {/* Wall Mount */}
        <circle cx="50" cy="50" r="40" fill="#0c0a08" stroke="var(--color-workshop-brass)" strokeWidth="6" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="#1f1814" strokeWidth="4" strokeDasharray="5 5" />
        
        {/* The Rotatable Crank Handle */}
        <g ref={crankRef} style={{ transformOrigin: "50px 50px" }} className="cursor-grab active:cursor-grabbing">
          {/* Main Arm */}
          <rect x="40" y="10" width="20" height="40" rx="5" fill="#14100c" stroke="var(--color-workshop-copper)" strokeWidth="3" />
          {/* Center Bolt */}
          <circle cx="50" cy="50" r="15" fill="var(--color-workshop-brass)" />
          {/* Handle Grip */}
          <rect x="35" y="0" width="30" height="15" rx="5" fill="var(--color-workshop-wood)" stroke="var(--color-workshop-brass)" strokeWidth="2" />
        </g>

        {/* Dynamic Progress Indicator (Pressure Steam Ring) */}
        <circle 
          cx="50" cy="50" r="45" 
          fill="none" 
          stroke="var(--color-workshop-copper)" 
          strokeWidth="3" 
          strokeDasharray="283" // 2 * PI * r (approx 282.7)
          strokeDashoffset={283 - (283 * (rotationProgress / 100))}
          style={{ transition: 'stroke-dashoffset 0.1s ease' }}
          className="opacity-80"
        />
      </svg>
    </div>
  );
}
