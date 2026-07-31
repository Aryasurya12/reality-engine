'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useMachineStore } from '@/store/useMachineStore';

export default function CoreMachine() {
  const { machineState, gearsInstalled } = useMachineStore();
  
  const flywheelRef = useRef<SVGGElement>(null);
  const beltLeftRef = useRef<SVGPathElement>(null);
  const beltRightRef = useRef<SVGPathElement>(null);
  const gaugeNeedleRef = useRef<SVGLineElement>(null);
  const pistonRef = useRef<SVGRectElement>(null);
  const armRef = useRef<SVGGElement>(null);
  const leverRef = useRef<SVGLineElement>(null);
  const elevatorRef = useRef<SVGGElement>(null);

  useEffect(() => {
    // Progressive Activation Logic
    
    if (gearsInstalled >= 1 && gaugeNeedleRef.current) {
      // Stage 1: Gauge wakes up
      gsap.to(gaugeNeedleRef.current, { rotation: 45, transformOrigin: 'bottom center', duration: 2, ease: "bounce.out" });
    }

    if (gearsInstalled >= 2) {
      // Stage 2: Belts and Piston move slowly
      if (beltLeftRef.current) gsap.to(beltLeftRef.current, { strokeDashoffset: -100, duration: 4, repeat: -1, ease: 'none' });
      if (beltRightRef.current) gsap.to(beltRightRef.current, { strokeDashoffset: 100, duration: 4, repeat: -1, ease: 'none' });
      if (pistonRef.current) gsap.to(pistonRef.current, { y: -20, duration: 1, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    }

    if (gearsInstalled >= 3 && flywheelRef.current) {
      // Stage 3: Flywheel spins rapidly
      gsap.to(flywheelRef.current, { rotation: 360, transformOrigin: 'center center', duration: 2, repeat: -1, ease: 'none' });
      
      // Speed up belts and piston
      if (beltLeftRef.current) gsap.to(beltLeftRef.current, { duration: 1 });
      if (beltRightRef.current) gsap.to(beltRightRef.current, { duration: 1 });
      if (pistonRef.current) gsap.to(pistonRef.current, { duration: 0.3 });
    }

    if (machineState === 'overdrive' && armRef.current && leverRef.current && elevatorRef.current) {
      // The Grand Finale Timeline
      const tl = gsap.timeline({ delay: 2 }); // Wait a moment after 3rd gear
      
      // Arm rotates down
      tl.to(armRef.current, { rotation: -60, transformOrigin: 'top center', duration: 4, ease: 'power2.inOut' })
        // Lever gets pulled
        .to(leverRef.current, { rotation: -45, transformOrigin: 'bottom center', duration: 1, ease: 'bounce.out' }, "-=1")
        // Elevator slowly rises in the background
        .to(elevatorRef.current, { y: -300, duration: 15, ease: 'sine.inOut' }, "+=1");
    }

  }, [gearsInstalled, machineState]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
      <svg viewBox="0 0 1000 1000" className="w-full h-full drop-shadow-2xl opacity-80" preserveAspectRatio="xMidYMid slice">
        
        {/* Background Elevator Shaft */}
        <rect x="800" y="200" width="100" height="800" fill="#080706" />
        <g ref={elevatorRef}>
           <rect x="810" y="800" width="80" height="100" fill="#14100c" stroke="var(--color-workshop-copper)" strokeWidth="2" />
           <circle cx="850" cy="850" r="20" fill="none" stroke="#fcdba1" strokeWidth="4" opacity="0.3" filter="blur(4px)" />
        </g>

        {/* Central Core Structure */}
        <path d="M 400 200 L 600 200 L 700 800 L 300 800 Z" fill="#0c0a08" stroke="var(--color-workshop-brass)" strokeWidth="8" />
        <circle cx="500" cy="500" r="250" fill="#050403" stroke="var(--color-workshop-copper)" strokeWidth="10" />
        
        {/* Giant Flywheel */}
        <g ref={flywheelRef} style={{ transformOrigin: "500px 500px" }}>
          <circle cx="500" cy="500" r="200" fill="none" stroke="#1c1611" strokeWidth="20" />
          <line x1="300" y1="500" x2="700" y2="500" stroke="#1c1611" strokeWidth="20" />
          <line x1="500" y1="300" x2="500" y2="700" stroke="#1c1611" strokeWidth="20" />
        </g>

        {/* Piston System */}
        <rect x="460" y="700" width="80" height="150" fill="#1a1410" stroke="var(--color-workshop-brass)" strokeWidth="4" />
        <rect ref={pistonRef} x="480" y="700" width="40" height="100" fill="var(--color-workshop-copper)" />

        {/* Belts */}
        <path ref={beltLeftRef} d="M 300 400 L 200 700" stroke="#211c18" strokeWidth="15" strokeDasharray="20 10" fill="none" />
        <path ref={beltRightRef} d="M 700 400 L 800 700" stroke="#211c18" strokeWidth="15" strokeDasharray="20 10" fill="none" />

        {/* Pressure Gauge */}
        <g transform="translate(600, 300)">
          <circle cx="0" cy="0" r="40" fill="#0c0a08" stroke="var(--color-workshop-brass)" strokeWidth="4" />
          <line ref={gaugeNeedleRef} x1="0" y1="0" x2="-20" y2="-20" stroke="var(--color-workshop-copper)" strokeWidth="4" strokeLinecap="round" />
          <circle cx="0" cy="0" r="5" fill="#fcdba1" />
        </g>

        {/* Hidden Giant Mechanical Arm & Lever */}
        <g ref={armRef} style={{ transformOrigin: "500px -100px" }}>
           <rect x="480" y="-100" width="40" height="400" fill="#14100c" stroke="var(--color-workshop-brass)" strokeWidth="4" />
        </g>
        <g transform="translate(450, -50)">
           <rect x="-10" y="0" width="20" height="100" fill="#14100c" />
           <line ref={leverRef} x1="0" y1="100" x2="0" y2="-50" stroke="var(--color-workshop-copper)" strokeWidth="10" strokeLinecap="round" />
        </g>

        {/* Sockets for Gears (Visual hints only, Draggables handle logic) */}
        {/* Gear 1 Target */}
        <circle cx="500" cy="300" r="40" fill="none" stroke="#2e241c" strokeWidth="6" strokeDasharray="10 5" />
        {/* Gear 2 Target */}
        <circle cx="400" cy="450" r="50" fill="none" stroke="#2e241c" strokeWidth="6" strokeDasharray="10 5" />
        {/* Gear 3 Target */}
        <circle cx="600" cy="550" r="30" fill="none" stroke="#2e241c" strokeWidth="6" strokeDasharray="10 5" />
      </svg>
    </div>
  );
}
