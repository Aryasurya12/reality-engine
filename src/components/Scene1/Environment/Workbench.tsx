'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import RobotController from "../Robot/RobotController";
import Blueprint from "./Blueprint";
import WorkshopObjects from "./WorkshopObjects";

export default function Workbench() {
  const benchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Midground parallax (Moves more than background, less than dust)
    if (benchRef.current) {
      const xTo = gsap.quickTo(benchRef.current, 'x', { duration: 1, ease: 'power2' });
      const yTo = gsap.quickTo(benchRef.current, 'y', { duration: 1, ease: 'power2' });

      const handleMouseMove = (e: MouseEvent) => {
        const xPos = (e.clientX / window.innerWidth - 0.5) * -40;
        const yPos = (e.clientY / window.innerHeight - 0.5) * -40;
        xTo(xPos);
        yTo(yPos);
      };
      window.addEventListener('mousemove', handleMouseMove);

      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <div ref={benchRef} className="absolute inset-0 z-30 pointer-events-none">
      <WorkshopObjects />

      {/* The Workbench Desk */}
      <div className="absolute bottom-[-10%] left-[-5%] w-[110%] h-[40%] bg-[var(--color-workshop-wood)] rounded-t-[100px] shadow-[0_-20px_50px_rgba(0,0,0,0.8)] border-t-8 border-[var(--color-workshop-brass)]">
        {/* Desk texture/lighting */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#b58953] to-transparent opacity-10 rounded-t-[100px]" />
        
        {/* Subjects sitting on the desk */}
        <div className="relative w-full h-full pointer-events-none">
          <Blueprint />
          <RobotController />
        </div>
      </div>
    </div>
  );
}
