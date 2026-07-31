'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useWorkshopStore } from '@/store/useWorkshopStore';
import { useGlobalState } from '@/store/useGlobalState';
import MechanicalCrank from '../Interactables/MechanicalCrank';

export default function WorkshopBackground() {
  const bgRef = useRef<HTMLDivElement>(null);
  const lampRef = useRef<SVGSVGElement>(null);
  const smokeRef = useRef<HTMLDivElement>(null);
  
  // Mysterious Door Refs
  const doorGlowRef = useRef<HTMLDivElement>(null);
  const doorGearRef = useRef<SVGCircleElement>(null);
  
  const { isAwake, storyPhase } = useWorkshopStore();
  const { transitionToScene } = useGlobalState();

  useEffect(() => {
    // Subtle background parallax
    if (bgRef.current) {
      const xTo = gsap.quickTo(bgRef.current, 'x', { duration: 1.5, ease: 'power2' });
      const yTo = gsap.quickTo(bgRef.current, 'y', { duration: 1.5, ease: 'power2' });

      const handleMouseMove = (e: MouseEvent) => {
        // Less parallax for background, giving depth
        const xPos = (e.clientX / window.innerWidth - 0.5) * -20;
        const yPos = (e.clientY / window.innerHeight - 0.5) * -20;
        xTo(xPos);
        yTo(yPos);
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  useEffect(() => {
    // Swinging lamp animation
    if (lampRef.current) {
      gsap.to(lampRef.current, {
        rotation: isAwake ? 4 : 2,
        transformOrigin: "top center",
        duration: isAwake ? 3 : 5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        overwrite: "auto"
      });
    }

    // Smoke rising animation
    if (smokeRef.current) {
      const smokeParticles = smokeRef.current.children;
      Array.from(smokeParticles).forEach((p, i) => {
        gsap.to(p, {
          y: isAwake ? -200 : -100,
          opacity: 0,
          scale: isAwake ? 3 : 1.5,
          x: Math.random() * 40 - 20,
          duration: isAwake ? 3 : 6,
          repeat: -1,
          ease: "sine.inOut",
          delay: i * (isAwake ? 0.8 : 1.5),
          overwrite: "auto"
        });
        
        gsap.to(p, {
          opacity: isAwake ? 0.5 : 0.2,
          duration: isAwake ? 1.5 : 3,
          yoyo: true,
          repeat: -1,
          ease: "power1.inOut",
          delay: i * (isAwake ? 0.8 : 1.5),
          overwrite: "auto"
        });
      });
    }
  }, [isAwake]);

  // Story Phase specific animations
  useEffect(() => {
    if (storyPhase === 'curious' && doorGlowRef.current && doorGearRef.current) {
      // The mysterious machine briefly comes to life
      const tl = gsap.timeline();
      
      // Light flickers
      tl.to(doorGlowRef.current, { opacity: 0.8, duration: 0.1, yoyo: true, repeat: 3 })
        .to(doorGlowRef.current, { opacity: 0.3, duration: 2, ease: "power2.out" }, "+=0.2");

      // Single gear rotates once
      gsap.to(doorGearRef.current, { rotation: 90, transformOrigin: 'center center', duration: 1.5, ease: 'power2.inOut' });
    }
    
    if (storyPhase === 'waiting_at_door' && doorGlowRef.current) {
      // Light glows faintly beneath it steadily
      gsap.to(doorGlowRef.current, {
        opacity: 0.5,
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      });
    }
  }, [storyPhase]);

  return (
    <div ref={bgRef} className="absolute inset-[-5%] w-[110%] h-[110%] z-10 pointer-events-none flex flex-col justify-between">
      
      <div className="absolute top-[20%] right-[10%] w-64 h-96 opacity-40 group">
        <svg viewBox="0 0 200 300" className="w-full h-full drop-shadow-2xl">
          {/* Door Frame */}
          <rect x="10" y="10" width="180" height="290" fill="#050403" stroke="var(--color-workshop-brass)" strokeWidth="4" />
          {/* Giant mechanical door panels */}
          <rect x="20" y="20" width="160" height="280" fill="#0c0b0a" className="transition-colors duration-500 group-hover:fill-[#1a130f]" />
          <line x1="20" y1="100" x2="180" y2="100" stroke="var(--color-workshop-brass)" strokeWidth="2" opacity="0.3" />
          <line x1="20" y1="200" x2="180" y2="200" stroke="var(--color-workshop-brass)" strokeWidth="2" opacity="0.3" />
          <circle cx="100" cy="150" r="30" fill="none" stroke="var(--color-workshop-copper)" strokeWidth="8" opacity="0.4" className="group-hover:stroke-[#fcdba1] transition-colors duration-500" />
          
          {/* The single mysterious gear */}
          <g ref={doorGearRef as any} style={{ transformOrigin: "100px 150px" }} className="group-hover:animate-spin">
             <circle cx="100" cy="150" r="15" fill="none" stroke="var(--color-workshop-brass)" strokeWidth="4" opacity="0.5" />
             <line x1="85" y1="150" x2="115" y2="150" stroke="var(--color-workshop-brass)" strokeWidth="4" opacity="0.5" />
             <line x1="100" y1="135" x2="100" y2="165" stroke="var(--color-workshop-brass)" strokeWidth="4" opacity="0.5" />
          </g>

          {/* Heavy Handle */}
          <rect x="150" y="140" width="10" height="40" rx="3" fill="var(--color-workshop-wood)" stroke="var(--color-workshop-brass)" strokeWidth="1" className="group-hover:translate-x-1 group-hover:-rotate-12 transition-transform duration-300 transform-origin-bottom" />
        </svg>

        {/* Orange Volumetric Glow escaping from under the door */}
        <div 
          ref={doorGlowRef}
          className="absolute bottom-0 left-0 w-full h-8 bg-orange-500 opacity-20 mix-blend-screen transition-opacity duration-500"
          style={{ filter: 'blur(15px)' }}
        />
      </div>

      {/* The Mechanical Crank (Appears when robot reaches door) */}
      {storyPhase === 'waiting_at_door' && (
         <div className="pointer-events-auto absolute inset-0 z-[100]">
            <MechanicalCrank />
         </div>
      )}

      {/* Hanging Lamp (Top Center) */}
      <div className="absolute top-0 left-1/3 w-32 flex flex-col items-center">
        <div className="w-1 h-32 bg-[var(--color-workshop-wood)] opacity-80" />
        <svg ref={lampRef} viewBox="0 0 100 100" className="w-24 h-24 text-[var(--color-workshop-copper)] drop-shadow-2xl">
          <path d="M20,50 L80,50 L60,20 L40,20 Z" fill="currentColor" opacity="0.9" />
          <path d="M10,50 L90,50 L90,60 L10,60 Z" fill="currentColor" />
          <circle 
            cx="50" 
            cy="65" 
            r="15" 
            fill="#fcdba1" 
            opacity={isAwake ? 0.9 : 0.5} 
            filter={isAwake ? "blur(6px)" : "blur(3px)"} 
            className="transition-all duration-1000"
          />
        </svg>
      </div>

      {/* Background Pipes (Left side) */}
      <div className="absolute top-1/4 left-10 w-16 h-3/4 border-l-8 border-t-8 border-[var(--color-workshop-copper)] opacity-20 rounded-tl-3xl" />
      <div className="absolute top-1/3 left-20 w-8 h-2/3 border-l-8 border-[var(--color-workshop-brass)] opacity-10" />

      {/* Tiny smoke coming from a pipe exhaust */}
      <div className="absolute top-[40%] left-[80px]">
        <div className="w-16 h-4 bg-[var(--color-workshop-wood)] border-2 border-[var(--color-workshop-copper)] rounded-sm transform -rotate-12" />
        <div ref={smokeRef} className="absolute top-[-10px] left-[60px] w-10 h-10">
          <div className="absolute w-8 h-8 rounded-full bg-[var(--color-workshop-brass)] mix-blend-screen blur-md opacity-0" />
          <div className="absolute w-6 h-6 rounded-full bg-[var(--color-workshop-brass)] mix-blend-screen blur-md opacity-0" />
          <div className="absolute w-10 h-10 rounded-full bg-[var(--color-workshop-brass)] mix-blend-screen blur-md opacity-0" />
        </div>
      </div>
    </div>
  );
}
