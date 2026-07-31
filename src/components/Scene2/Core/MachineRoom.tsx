'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useMachineStore } from '@/store/useMachineStore';
import CustomCursor from '../../Scene1/Core/CustomCursor';
import CoreMachine from '../Environment/CoreMachine';
import DraggableGear from '../Interactables/DraggableGear';
import RobotMechanic from '../Robot/RobotMechanic';

export default function MachineRoom() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { machineState, gearsInstalled } = useMachineStore();

  useEffect(() => {
    // Camera Dolly based on gear progress
    if (!containerRef.current) return;

    if (machineState === 'stage1') {
      gsap.to(containerRef.current, { scale: 1.05, duration: 4, ease: 'power2.inOut' });
    } else if (machineState === 'stage2') {
      gsap.to(containerRef.current, { scale: 1.1, y: 20, duration: 4, ease: 'power2.inOut' });
    } else if (machineState === 'overdrive') {
      gsap.to(containerRef.current, { scale: 1.2, duration: 6, ease: 'power2.inOut' });
      // Massive shake
      gsap.to(containerRef.current, { x: 5, duration: 0.1, yoyo: true, repeat: 10, ease: 'rough' });
    }
  }, [machineState, gearsInstalled]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden flex items-center justify-center cursor-none transform-gpu origin-center bg-[#0a0807]">
      <CustomCursor />
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 bg-gradient-radial from-[#1a130f] via-[#050403] to-[#000000] opacity-80" />
      
      {/* Volumetric Light Rays */}
      <div 
        className="absolute top-[-20%] left-[10%] w-[80%] h-[150%] bg-[#fcdba1] opacity-5 mix-blend-screen pointer-events-none transform rotate-45 transition-opacity duration-1000" 
        style={{ filter: 'blur(100px)', opacity: gearsInstalled * 0.1 + 0.05 }}
      />

      {/* The Centerpiece */}
      <CoreMachine />

      {/* The Draggable Gears */}
      <DraggableGear id="gear-1" startX={10} startY={80} targetX={50} targetY={30} size={80} type="primary" />
      <DraggableGear id="gear-2" startX={80} startY={70} targetX={40} targetY={45} size={100} type="secondary" />
      <DraggableGear id="gear-3" startX={20} startY={60} targetX={60} targetY={55} size={60} type="small" />

      {/* The Robot */}
      <RobotMechanic />
    </div>
  );
}
