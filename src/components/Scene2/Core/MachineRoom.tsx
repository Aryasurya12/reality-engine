'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CinematicBackground from '../Environment/CinematicBackground';
import CinematicForeground from '../Environment/CinematicForeground';
import TheGreatEngine from '../Machine/TheGreatEngine';
import CinematicRobot from '../Robot/CinematicRobot';
import FallenGear from './FallenGear';
import { sounds, safePlay } from '../../Scene1/Core/AudioController';
import { useGlobalState } from '@/store/useGlobalState';

gsap.registerPlugin(ScrollTrigger);

export default function MachineRoom() {
  const { setRepairPhase } = useGlobalState();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  
  // Layers
  const cameraRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);
  const robotRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Play ambient audio when entering the room
    const ambientId = setInterval(() => {
      // Simulate random steam hits and metal expansions occasionally
      if (Math.random() > 0.8) safePlay(sounds.steamHiss);
      if (Math.random() > 0.9) safePlay(sounds.metalExpansion);
    }, 5000);
    
    return () => clearInterval(ambientId);
  }, []);

  useEffect(() => {
    const track = scrollTrackRef.current;
    if (!track) return;

    let ctx = gsap.context(() => {
      // Pin the camera
      ScrollTrigger.create({
        trigger: track,
        start: "top top",
        end: "bottom bottom",
        pin: cameraRef.current,
        scrub: 1,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onLeave: () => {
            // Unlock puzzle interaction at the very end
            if (useGlobalState.getState().repairPhase === 'idle') {
              setRepairPhase('ready_to_repair');
            }
          }
        }
      });

      // INITIAL STATE SETUP (Before scrolling)
      gsap.set(bgRef.current, { scale: 1.1 });
      gsap.set(midRef.current, { scale: 1.0 });
      gsap.set(fgRef.current, { scale: 1.5, y: 300, x: -300, opacity: 0 }); // Offscreen initially
      
      // Robot starts way offscreen left
      gsap.set(robotRef.current, { x: -500, scale: 0.8 });

      // 0% - 20%: The Entrance (Camera pushes in, Foreground flies past)
      tl.to(bgRef.current, { scale: 1.2, duration: 2, ease: "power1.inOut" }, 0)
        .to(midRef.current, { scale: 1.05, duration: 2, ease: "power1.inOut" }, 0)
        .to(fgRef.current, { scale: 1.1, y: 0, x: 0, opacity: 1, duration: 2, ease: "power2.out" }, 0)
        // Robot walks in with weight (bobbing)
        .to(robotRef.current, { x: -100, duration: 2, ease: "power1.inOut" }, 0)
        .to(robotRef.current, { y: -20, yoyo: true, repeat: 5, duration: 0.33, ease: "sine.inOut" }, 0); // Walk cycle bob

      // 20% - 40%: The Approach (Camera slowly dollies right following the robot)
      tl.to(bgRef.current, { x: -50, duration: 2, ease: "none" }, 2)
        .to(midRef.current, { x: -100, duration: 2, ease: "none" }, 2)
        .to(fgRef.current, { x: -200, duration: 2, ease: "none" }, 2)
        // Robot keeps walking
        .to(robotRef.current, { x: 300, duration: 2, ease: "power1.inOut" }, 2)
        .to(robotRef.current, { y: -20, yoyo: true, repeat: 5, duration: 0.33, ease: "sine.inOut" }, 2)
        // Look up at the machine in awe
        .to(".cinematic-robot-head", { rotation: -15, duration: 0.5 }, 3.5);

      // 40% - 60%: The Touch
      tl.to(".cinematic-robot-arm-right", { rotation: -80, duration: 0.5, ease: "back.out(1.5)" }, 4.0) // Reach out
        // The machine hums to life!
        .to(".cinematic-status-light", { opacity: 0.9, filter: "blur(5px)", duration: 0.2 }, 4.5)
        .to(".cinematic-gauge-needle", { rotation: 120, duration: 1, ease: "elastic.out(1, 0.3)" }, 4.5)
        // Piston fires once
        .to(".piston-shaft", { y: 60, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.in" }, 4.8)
        // Flywheel spins 10 degrees with immense weight (anticipation -> overshoot)
        .to(".cinematic-engine-flywheel", { rotation: -2, duration: 0.3, ease: "power1.in" }, 4.5) // Anticipate backward
        .to(".cinematic-engine-flywheel", { rotation: 15, duration: 0.8, ease: "back.out(1.2)" }, 4.8); // Slam forward

      // 60% - 80%: The Failure
      // Heavy, violent shake across all layers (camera shake)
      tl.to(bgRef.current, { x: "+=10", y: "+=5", yoyo: true, repeat: 5, duration: 0.05 }, 5.5)
        .to(midRef.current, { x: "-=15", y: "+=15", yoyo: true, repeat: 5, duration: 0.05 }, 5.5)
        .to(fgRef.current, { x: "+=20", y: "-=10", yoyo: true, repeat: 5, duration: 0.05 }, 5.5)
        // Robot recoils
        .to(robotRef.current, { x: "-=50", duration: 0.2, ease: "power2.out" }, 5.5)
        .to(".cinematic-robot-arm-right", { rotation: 0, duration: 0.2 }, 5.5)
        .to(".cinematic-robot-head", { rotation: 20, duration: 0.2 }, 5.5) // Flinch
        // Power dies (Lights dim, needles drop)
        .to(".cinematic-status-light", { opacity: 0.1, filter: "blur(0px)", duration: 0.1 }, 5.8)
        .to(".cinematic-gauge-needle", { rotation: 0, duration: 0.5, ease: "bounce.out" }, 5.8)
        .to(".cinematic-engine-core", { opacity: 0.2, duration: 0.5 }, 5.8)
        // GEAR FALLS OFF MACHINE
        .to(".falling-gear-dummy", { y: "+=600", rotation: -120, duration: 0.6, ease: "bounce.out" }, 5.6);

      // 80% - 100%: The Plea
      // Camera slowly settles
      tl.to(bgRef.current, { scale: 1.15, duration: 2, ease: "power2.out" }, 8.0)
        .to(midRef.current, { scale: 1.02, duration: 2, ease: "power2.out" }, 8.0)
        .to(fgRef.current, { scale: 1.05, duration: 2, ease: "power2.out" }, 8.0)
        // Robot slowly lowers head in defeat
        .to(".cinematic-robot-head", { rotation: 30, duration: 1, ease: "power1.inOut" }, 8.0)
        // Pause...
        // Slowly turns head to look directly at the user (camera)
        .to(".cinematic-robot-head", { rotation: -20, duration: 0.8, ease: "power2.inOut" }, 9.2);

    }, scrollTrackRef);

    return () => ctx.revert();
  }, []);

  // Handheld Camera Breathing Effect (Mouse Parallax + Drift)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Subtle breathing drift (like a human holding the camera)
    gsap.to(cameraRef.current, {
      scale: 1.01,
      rotation: 0.2,
      y: 5,
      x: 3,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;

      // Parallax depths
      gsap.to(bgRef.current, { x: x * 20, y: y * 20, duration: 2, ease: "power2.out", overwrite: "auto" });
      gsap.to(midRef.current, { x: x * -10, y: y * -10, duration: 2, ease: "power2.out", overwrite: "auto" });
      gsap.to(fgRef.current, { x: x * -40, y: y * -40, duration: 2, ease: "power2.out", overwrite: "auto" });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full bg-[#030508] cursor-none selection:bg-transparent overflow-hidden">
      
      {/* Scroll Track: 500vh to give the animation plenty of room to breathe */}
      <div ref={scrollTrackRef} className="h-[500vh] w-full relative">
        
        {/* Pinned Cinematic Viewport */}
        <div ref={cameraRef} className="h-screen w-full overflow-hidden absolute top-0 left-0">
          
          {/* BACKGROUND LAYER */}
          <div ref={bgRef} className="absolute inset-0 w-full h-full origin-center layer-base">
            <CinematicBackground />
          </div>

          {/* MIDGROUND LAYER (The Great Engine) */}
          <div ref={midRef} className="absolute inset-0 w-full h-full origin-bottom layer-base z-20 flex items-center justify-center">
            <TheGreatEngine ref={engineRef} />
            
            {/* The Robot */}
            <CinematicRobot ref={robotRef} />

            {/* The Fallen Gear Interaction */}
            <FallenGear />
          </div>

          {/* FOREGROUND LAYER (Extreme Depth & Blur) */}
          <div ref={fgRef} className="absolute inset-0 w-full h-full origin-bottom-left layer-base z-50">
            <CinematicForeground />
          </div>

        </div>
      </div>
    </div>
  );
}
