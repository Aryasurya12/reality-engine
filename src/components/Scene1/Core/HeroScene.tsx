'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGlobalState } from '@/store/useGlobalState';
import { sounds } from './AudioController';
import Lighting from "../Environment/Lighting";
import WorkshopBackground from "../Environment/WorkshopBackground";
import Workbench from "../Environment/Workbench";
import DustParticles from "../Environment/DustParticles";
import TextOverlay from "./TextOverlay";
import CustomCursor from "./CustomCursor";

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
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
            // Optional: drive audio based on progress
            const p = self.progress;
            if (p > 0.4 && p < 0.65) {
               if (Math.random() > 0.95) sounds.gearClick.play();
            }
          }
        }
      });

      // 0-20%: Title stays prominent (no animations needed here, they start at 0.2)

      // 20-40%: Title gently scales down and fades while the camera begins drifting toward the door
      tl.to(".hero-title", { opacity: 0, scale: 0.9, y: -20, duration: 0.2 }, 0.2)
        .to(".hero-subtitle", { opacity: 0, scale: 0.95, y: -10, duration: 0.2 }, 0.2)
        .to(stickyRef.current, {
          scale: 1.6,
          x: "-12vw",
          y: "8vh",
          duration: 0.2,
          ease: "power1.inOut"
        }, 0.2);

      // 40-70%: The robot becomes the visual focus and starts walking to the door
      // Mechanical arm also triggers here
      tl.to(".robot-head", { rotation: -30, duration: 0.05, ease: "power1.inOut" }, 0.4) // Wakes up, looks back
        .to(".robot-head", { rotation: 20, duration: 0.05, ease: "power1.inOut" }, 0.45) // Looks toward door
        .to(".robot-container", { x: 300, y: 10, scale: 0.8, duration: 0.25, ease: "none" }, 0.45) // Walks towards door
        .to([".robot-leg-left", ".robot-leg-right"], { y: -5, duration: 0.02, yoyo: true, repeat: 12 }, 0.45) // Walking cycle
        .to(".robot-head", { rotation: -10, duration: 0.05 }, 0.65) // Looks back at visitor when near door
        .to(".mechanical-crank", { opacity: 1, duration: 0.05 }, 0.5)
        .to(".crank-arm", { rotation: 720, duration: 0.2, ease: "power2.inOut" }, 0.5)
        .to(".crank-ring", { strokeDashoffset: 0, duration: 0.2, ease: "power2.inOut" }, 0.5)
        .to(".door-gear", { rotation: 360, duration: 0.2, ease: "power1.inOut" }, 0.5);

      // 70-100%: The door dominates the screen, opens, and the camera passes through it into Scene 1
      tl.to(".workshop-door-group", {
        scale: 1.1,
        y: "-5%",
        opacity: 0, 
        duration: 0.15,
        ease: "power1.in"
      }, 0.7)
      .to(".door-glow", {
        opacity: 1,
        filter: 'blur(30px)',
        scale: 2,
        duration: 0.15
      }, 0.7)
      .to(stickyRef.current, {
        scale: 15,
        opacity: 0,
        duration: 0.2,
        ease: "power3.in"
      }, 0.8);

    }, containerRef);

    return () => ctx.revert();
  }, [transitionToScene]);

  return (
    <div ref={containerRef} className="relative w-full h-[600vh]">
      <div ref={stickyRef} className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center cursor-none transform-gpu origin-center">
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
    </div>
  );
}
