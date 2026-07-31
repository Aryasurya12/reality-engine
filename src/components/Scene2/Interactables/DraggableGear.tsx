'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useMachineStore } from '@/store/useMachineStore';
import { sounds } from '../../Scene1/Core/AudioController';

interface DraggableGearProps {
  id: string;
  startX: number; // VW percentage
  startY: number; // VH percentage
  targetX: number; // VW percentage
  targetY: number; // VH percentage
  size: number;
  type: 'primary' | 'secondary' | 'small';
}

export default function DraggableGear({ id, startX, startY, targetX, targetY, size, type }: DraggableGearProps) {
  const gearRef = useRef<HTMLDivElement>(null);
  const [isSnapped, setIsSnapped] = useState(false);
  const { installGear } = useMachineStore();
  
  // Custom Drag Logic using GSAP quickTo
  useEffect(() => {
    if (!gearRef.current || isSnapped) return;
    const gear = gearRef.current;
    
    let isDragging = false;
    let startMouseX = 0;
    let startMouseY = 0;
    
    // Initial absolute positioning in pixels based on vw/vh
    let currentX = (startX / 100) * window.innerWidth;
    let currentY = (startY / 100) * window.innerHeight;
    
    const targetXPx = (targetX / 100) * window.innerWidth;
    const targetYPx = (targetY / 100) * window.innerHeight;

    gsap.set(gear, { x: currentX, y: currentY });

    const xTo = gsap.quickTo(gear, "x", { duration: 0.1, ease: "power3" });
    const yTo = gsap.quickTo(gear, "y", { duration: 0.1, ease: "power3" });
    const rotateTo = gsap.quickTo(gear, "rotation", { duration: 0.1, ease: "none" });

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      startMouseX = e.clientX - currentX;
      startMouseY = e.clientY - currentY;
      gear.setPointerCapture(e.pointerId);
      
      gsap.to(gear, { scale: 1.1, duration: 0.2, ease: "back.out(2)" });
      sounds.servo.play(); // Mocking metal scrape
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      currentX = e.clientX - startMouseX;
      currentY = e.clientY - startMouseY;
      
      xTo(currentX);
      yTo(currentY);
      rotateTo(currentX * 0.5); // Spin while dragging
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      gear.releasePointerCapture(e.pointerId);

      // Check distance to target (magnetic snap)
      const dist = Math.sqrt(Math.pow(currentX - targetXPx, 2) + Math.pow(currentY - targetYPx, 2));
      
      if (dist < 100) {
        // Snap!
        setIsSnapped(true);
        gsap.to(gear, { 
          x: targetXPx, 
          y: targetYPx, 
          scale: 1, 
          rotation: 0, 
          duration: 0.4, 
          ease: "elastic.out(1, 0.5)",
          onComplete: () => {
            sounds.gearClick.play();
            installGear();
            // Start constant rotation since it's installed
            gsap.to(gear, { rotation: 360, duration: 4, repeat: -1, ease: "none" });
          }
        });
      } else {
        // Drop
        gsap.to(gear, { scale: 1, duration: 0.2, ease: "bounce.out" });
      }
    };

    gear.addEventListener('pointerdown', handlePointerDown);
    gear.addEventListener('pointermove', handlePointerMove);
    gear.addEventListener('pointerup', handlePointerUp);

    return () => {
      gear.removeEventListener('pointerdown', handlePointerDown);
      gear.removeEventListener('pointermove', handlePointerMove);
      gear.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isSnapped, startX, startY, targetX, targetY, installGear]);

  // Color mapping
  const colors = {
    primary: "var(--color-workshop-brass)",
    secondary: "var(--color-workshop-copper)",
    small: "#211c18"
  };

  return (
    <div 
      ref={gearRef} 
      className="absolute top-0 left-0 z-50 touch-none transform-gpu origin-center cursor-none"
      style={{ width: size, height: size, marginLeft: -size/2, marginTop: -size/2 }}
    >
      {/* SVG Gear Design */}
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
        {/* Teeth */}
        <circle cx="50" cy="50" r="45" fill="none" stroke={colors[type]} strokeWidth="10" strokeDasharray="15 10" />
        {/* Inner Ring */}
        <circle cx="50" cy="50" r="35" fill="none" stroke={colors[type]} strokeWidth="6" />
        {/* Spokes */}
        <line x1="15" y1="50" x2="85" y2="50" stroke={colors[type]} strokeWidth="8" />
        <line x1="50" y1="15" x2="50" y2="85" stroke={colors[type]} strokeWidth="8" />
        <line x1="25" y1="25" x2="75" y2="75" stroke={colors[type]} strokeWidth="8" />
        <line x1="25" y1="75" x2="75" y2="25" stroke={colors[type]} strokeWidth="8" />
        {/* Center Hub */}
        <circle cx="50" cy="50" r="15" fill="#14100c" stroke={colors[type]} strokeWidth="4" />
        <circle cx="50" cy="50" r="5" fill={colors[type]} />
      </svg>
    </div>
  );
}
