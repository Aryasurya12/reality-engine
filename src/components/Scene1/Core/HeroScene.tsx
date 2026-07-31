'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGlobalState } from '@/store/useGlobalState';
import { sounds } from './AudioController';
import Lighting from "../Environment/Lighting";
import DustParticles from "../Environment/DustParticles";
import TextOverlay from "./TextOverlay";
import CustomCursor from "./CustomCursor";

import BackgroundLayer from "../Environment/BackgroundLayer";
import MidgroundLayer from "../Environment/MidgroundLayer";
import ForegroundLayer from "../Environment/ForegroundLayer";
import Robot from "../Robot/Robot";

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  
  // Layer refs for parallax
  const bgRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);
  
  // Robot refs
  const robotContainerRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<SVGRectElement>(null);
  const chestRef = useRef<SVGRectElement>(null);
  const eyesRef = useRef<SVGGElement>(null);
  const antennaRef = useRef<SVGCircleElement>(null);
  const legLeftRef = useRef<SVGPathElement>(null);
  const legRightRef = useRef<SVGPathElement>(null);

  const { transitionToScene } = useGlobalState();

  useEffect(() => {
    if (!containerRef.current || !stickyRef.current) return;

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onLeave: () => {
             // Seamlessly switch state when timeline finishes
             transitionToScene('scene2_machine_room');
          },
          onUpdate: (self) => {
            const p = self.progress;
            if (p > 0.3 && p < 0.8) {
               if (Math.random() > 0.96) sounds.gearClick.play();
            }
          }
        }
      });

      // 0-20%: Initial exploration, title stays prominent.

      // 20-40%: Title fades, Z-axis parallax begins
      tl.to(".hero-title", { opacity: 0, scale: 0.9, y: -20, duration: 0.2 }, 0.2)
        .to(".hero-subtitle", { opacity: 0, scale: 0.95, y: -10, duration: 0.2 }, 0.2);

      // Z-axis parallax (Pushing IN)
      // Foreground moves away fast (scales up and fades out)
      tl.to(fgRef.current, { scale: 2.5, opacity: 0, x: "-20vw", y: "10vh", duration: 0.4, ease: "power2.in" }, 0.2);
      
      // Midground scales up gradually to dominate the screen
      tl.to(midRef.current, { scale: 1.8, y: "15vh", duration: 0.6, ease: "power1.inOut" }, 0.2);
      
      // Background slightly scales up for deep parallax
      tl.to(bgRef.current, { scale: 1.2, duration: 0.8, ease: "none" }, 0.2);

      // 40-70%: Robot logic
      // Robot starts in the foreground/midground threshold and walks toward the machine
      tl.to(headRef.current, { rotation: 20, duration: 0.05, ease: "power1.inOut" }, 0.4) // Look at machine
        .to(robotContainerRef.current, { 
          x: "20vw", 
          y: "-10vh", 
          scale: 0.6, // Scales down as it walks deeper into the room
          duration: 0.25, 
          ease: "none" 
        }, 0.45)
        .to([legLeftRef.current, legRightRef.current], { y: -5, duration: 0.02, yoyo: true, repeat: 12 }, 0.45) // Walking cycle
        .to(headRef.current, { rotation: -10, duration: 0.05 }, 0.65); // Look back at visitor

      // 70-100%: Machine engulfs the screen (transitioning to Scene 2)
      tl.to(midRef.current, {
        scale: 15,
        opacity: 0, // Machine fades out as we pass "through" it
        duration: 0.3,
        ease: "power3.in"
      }, 0.7)
      .to(bgRef.current, {
        scale: 2,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
      }, 0.7);

    }, containerRef);

    return () => ctx.revert();
  }, [transitionToScene]);

  return (
    <div ref={containerRef} className="relative w-full h-[600vh]">
      <div ref={stickyRef} className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center cursor-none bg-[#050403]">
        <CustomCursor />
        
        {/* Layer 1: Deep Background (Walls, Windows) */}
        <div ref={bgRef} className="absolute inset-0 w-full h-full transform-gpu origin-center">
          <BackgroundLayer />
        </div>

        {/* Global Environmental Effects */}
        <Lighting />
        <DustParticles />

        {/* Layer 2: Midground (Giant Machine) */}
        <div ref={midRef} className="absolute inset-0 w-full h-full transform-gpu origin-center">
          <MidgroundLayer />
        </div>

        {/* Layer 2.5: Robot (Navigates between FG and MG) */}
        <div ref={robotContainerRef} className="absolute inset-0 z-[25] pointer-events-none transform-gpu origin-bottom">
          <Robot 
            headRef={headRef}
            chestRef={chestRef}
            eyesRef={eyesRef}
            antennaRef={antennaRef}
            legLeftRef={legLeftRef}
            legRightRef={legRightRef}
          />
        </div>

        {/* Layer 3: Foreground (Workbench, Blueprints, Shelves) */}
        <div ref={fgRef} className="absolute inset-0 w-full h-full transform-gpu origin-center">
          <ForegroundLayer />
        </div>

        {/* UI Layer */}
        <TextOverlay />
      </div>
    </div>
  );
}
