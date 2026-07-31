'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useMachineStore } from '@/store/useMachineStore';
import CustomCursor from '../../Scene1/Core/CustomCursor';
import GrandHallBackground from '../Environment/GrandHallBackground';
import DistantMachine from '../Environment/DistantMachine';
import InventionsGallery from '../Interactables/InventionsGallery';
import RobotExplorer from '../Robot/RobotExplorer';
import { sounds, unlockAudio } from '../../Scene1/Core/AudioController';

export default function MachineRoom() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { explorationPhase } = useMachineStore();

  useEffect(() => {
    // Start ambient sounds upon entering Scene 2
    unlockAudio();
    sounds.clockTick.play();
    sounds.clockTick.loop(true);
    
    // Slow initial camera pan to reveal the massive scale of the room
    if (containerRef.current) {
       gsap.fromTo(containerRef.current, 
         { scale: 1.1, x: 200 }, 
         { scale: 1, x: 0, duration: 10, ease: 'power2.out' }
       );
    }
    
    return () => {
       sounds.clockTick.stop();
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    if (explorationPhase === 'noticing') {
       // Subtle dramatic camera push in when the red light blinks
       gsap.to(containerRef.current, { scale: 1.05, x: -50, duration: 4, ease: 'power2.inOut' });
    } else if (explorationPhase === 'leading') {
       // Camera follows the robot deeper into the hall
       gsap.to(containerRef.current, { scale: 1.1, x: -150, y: 50, duration: 10, ease: 'sine.inOut' });
    }
  }, [explorationPhase]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden flex items-center justify-center cursor-none transform-gpu origin-center bg-[#050403]">
      <CustomCursor />
      
      {/* Deepest Layer: Ambient Gradients */}
      <div className="absolute inset-0 z-0 bg-gradient-radial from-[#1a130f] via-[#0a0807] to-[#000000] opacity-90" />
      
      {/* Grand Hall Architecture & Parallax */}
      <GrandHallBackground />
      
      {/* Volumetric Light Rays from broken ceiling */}
      <div 
        className="absolute top-[-30%] left-[20%] w-[60%] h-[150%] bg-[#fcdba1] opacity-10 mix-blend-screen pointer-events-none transform rotate-45" 
        style={{ filter: 'blur(80px)' }}
      />
      <div 
        className="absolute top-[-20%] left-[50%] w-[40%] h-[150%] bg-[#b58953] opacity-5 mix-blend-screen pointer-events-none transform rotate-45" 
        style={{ filter: 'blur(100px)' }}
      />

      {/* The Distant Machine (Deep Background) */}
      <DistantMachine />

      {/* The Inventions (Mid/Foreground) */}
      <InventionsGallery />

      {/* The Robot */}
      <RobotExplorer />
    </div>
  );
}
