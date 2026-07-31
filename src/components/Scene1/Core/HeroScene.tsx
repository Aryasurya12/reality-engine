'use client';

import Lighting from "../Environment/Lighting";
import WorkshopBackground from "../Environment/WorkshopBackground";
import Workbench from "../Environment/Workbench";
import DustParticles from "../Environment/DustParticles";
import TextOverlay from "./TextOverlay";
import CustomCursor from "./CustomCursor";
import { useWorkshopStore } from '@/store/useWorkshopStore';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);
  const { storyPhase, setStoryPhase } = useWorkshopStore();

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Simulate camera dolly based on scroll progress once guiding begins
    const handleWheel = (e: WheelEvent) => {
      if (storyPhase === 'guiding' || storyPhase === 'waiting_at_door') {
        // Increment progress very quickly, regardless of scroll direction
        const scrollAmount = Math.max(1, Math.abs(e.deltaY) * 0.5);
        const newProgress = Math.min(100, scrollProgressRef.current + scrollAmount);
        
        scrollProgressRef.current = newProgress;
        useWorkshopStore.getState().setScrollProgress(newProgress);
        
        if (newProgress >= 100 && storyPhase !== 'waiting_at_door') {
          setStoryPhase('waiting_at_door');
        }

        // Map progress to camera properties
        const scale = 1 + (scrollProgressRef.current * 0.002); // 1 to 1.2
        const xOffset = scrollProgressRef.current * -1.5; // 0 to -150
        const yOffset = scrollProgressRef.current * 0.2; // 0 to 20
        
        gsap.to(containerRef.current, {
          scale,
          x: xOffset,
          y: yOffset,
          duration: 0.5,
          ease: "power2.out"
        });
      }
    };

    window.addEventListener('wheel', handleWheel);

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [storyPhase]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden flex items-center justify-center cursor-none transform-gpu origin-center">
      <CustomCursor />

      {/* Deepest Layer: Background & Lighting */}
      <Lighting />
      <WorkshopBackground />
      
      {/* Mid Layer: Floating Dust */}
      <DustParticles />

      {/* Foreground Layer: Workbench, Robot, Blueprint */}
      <Workbench />

      {/* UI Layer */}
      <TextOverlay />
    </div>
  );
}
