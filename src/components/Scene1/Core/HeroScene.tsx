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
  const { storyPhase } = useWorkshopStore();

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Simulate camera dolly when guiding begins
    if (storyPhase === 'guiding') {
      gsap.to(containerRef.current, {
        scale: 1.05,
        x: -50,
        y: 10,
        duration: 8,
        ease: "sine.inOut"
      });
    } else if (storyPhase === 'waiting_at_door') {
      gsap.to(containerRef.current, {
        scale: 1.1,
        x: -100,
        duration: 6,
        ease: "power2.inOut"
      });
    }
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
