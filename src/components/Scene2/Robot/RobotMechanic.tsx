'use client';

import { useEffect, useRef, useState } from 'react';
import Robot from '../../Scene1/Robot/Robot';
import { setupEyeTracking } from '../../Scene1/Robot/EyeTracking';
import gsap from 'gsap';
import { useMachineStore } from '@/store/useMachineStore';
import { playWaveAnimation } from '../../Scene1/Robot/RobotAnimations';

export default function RobotMechanic() {
  const robotRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<SVGRectElement>(null);
  const chestRef = useRef<SVGRectElement>(null);
  const eyesRef = useRef<SVGGElement>(null);
  const antennaRef = useRef<SVGCircleElement>(null);
  const legLeftRef = useRef<SVGPathElement>(null);
  const legRightRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { machineState, robotReaction } = useMachineStore();

  useEffect(() => {
    // Initial entrance walk-in
    gsap.fromTo(robotRef.current, 
      { x: -500, scale: 0.8 },
      { x: -100, scale: 1, duration: 2, ease: "power2.out", delay: 1 }
    );
  }, []);

  useEffect(() => {
    // Eye Tracking Hook
    const cleanupEyeTracking = setupEyeTracking({
      eyesRef,
      headRef,
      containerRef,
      isSleeping: false
    });

    return cleanupEyeTracking;
  }, []);

  // Handle Reactions based on gear installation
  useEffect(() => {
    if (!robotRef.current) return;
    
    if (machineState === 'stage1') {
      // Claps after first gear
      gsap.to(robotRef.current, { y: -20, duration: 0.2, yoyo: true, repeat: 1, ease: 'sine.inOut' });
    } else if (machineState === 'stage2') {
      // Gets excited
      gsap.to(robotRef.current, { rotation: 15, duration: 0.2, yoyo: true, repeat: 3, ease: 'sine.inOut' });
    } else if (machineState === 'overdrive') {
      // Celebrates after third gear
      const tl = gsap.timeline();
      tl.to(robotRef.current, { y: -50, duration: 0.4, ease: 'power2.out', yoyo: true, repeat: 3 })
        .to(robotRef.current, { rotation: 360, duration: 1, ease: 'back.inOut(1.5)' }, "-=1.2");
    }
  }, [machineState, robotReaction]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-40 pointer-events-none">
      <Robot 
        ref={robotRef}
        headRef={headRef}
        chestRef={chestRef}
        eyesRef={eyesRef}
        antennaRef={antennaRef}
        legLeftRef={legLeftRef}
        legRightRef={legRightRef}
      />
    </div>
  );
}
