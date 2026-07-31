'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGlobalState } from '@/store/useGlobalState';
import LaboratoryBackground from '../Environment/LaboratoryBackground';
import TheGreatEngine from '../Machine/TheGreatEngine';
import LaboratoryForeground from '../Environment/LaboratoryForeground';
import RobotExplorer from '../Robot/RobotExplorer';
import GearPuzzle from '../../Scene3/Puzzles/GearPuzzle';
import { sounds } from '../../Scene1/Core/AudioController';

gsap.registerPlugin(ScrollTrigger);

export default function MachineRoom() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  
  const bgRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);

  const { repairPhase, setRepairPhase } = useGlobalState();

  useEffect(() => {
    // Ambient sound for the room
    const playAmbient = () => {
      sounds.ambientHum.loop = true;
      sounds.ambientHum.volume = 0.3;
      sounds.ambientHum.play();
    };
    playAmbient();

    return () => {
      sounds.ambientHum.pause();
    };
  }, []);

  useEffect(() => {
    const track = scrollTrackRef.current;
    if (!track) return;

    let ctx = gsap.context(() => {
      // Pin the camera container to the viewport while scrolling the track
      ScrollTrigger.create({
        trigger: track,
        start: "top top",
        end: "bottom bottom",
        pin: cameraRef.current,
        scrub: true,
      });

      // The Master Cinematic Timeline (0 to 10 scale for easier math)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          scrub: 1, // Smooth scrub
          onLeave: () => {
             // Unlock puzzle interaction at the very end
             if (useGlobalState.getState().repairPhase === 'idle') {
               setRepairPhase('ready_to_repair');
             }
          }
        }
      });

      // 0-15% (0-1.5): The Discovery & Investigation
      // Robot explores initially, then freezes and looks back.
      tl.fromTo(".robot-container", { x: -300, y: 0, scale: 1 }, { x: 200, duration: 0.5 }, 0)
        .to(".robot-head", { rotation: -20, duration: 0.5 }, 0.5) // Look back at user
        .to(".robot-container", { x: 300, duration: 0.5 }, 1.0) // Approaches machine
        .to(".robot-arm-right", { rotation: -60, duration: 0.2 }, 1.3) // Touch panel
        .to(".robot-arm-right", { rotation: 0, duration: 0.2 }, 1.5) // Nothing happens
        .to(".robot-head", { rotation: 45, duration: 0.3 }, 1.6) // Disappointment
        .to(".robot-head", { rotation: -20, duration: 0.3 }, 1.9) // Look back at user
        .to(".robot-arm-left", { rotation: -90, yoyo: true, repeat: 1, duration: 0.4 }, 2.2); // "Come" gesture

      // 30% - 80% (3.0 - 8.0): The Follow System (Camera Dolly In)
      // Robot leads the way deep into the scene
      tl.to(".robot-container", { x: 500, scale: 0.8, y: -50, duration: 5, ease: "none" }, 3);
      // Dolly in effect
      tl.to(bgRef.current, { scale: 1.2, duration: 5, ease: "none" }, 3);
      tl.to(midRef.current, { scale: 1.4, y: 100, duration: 5, ease: "none" }, 3);
      // Foreground flies past the camera (creates extreme depth)
      tl.to(fgRef.current, { scale: 3, y: 500, x: -300, opacity: 0, duration: 5, ease: "power1.in" }, 3);
      // Robot occasionally looks back to check if following
      tl.to(".robot-head", { rotation: -30, duration: 0.5, yoyo: true, repeat: 1 }, 4.5);
      tl.to(".robot-head", { rotation: -30, duration: 0.5, yoyo: true, repeat: 1 }, 6.5);

      // 80% - 95% (8.0 - 9.5): The Failure
      tl.to(".robot-arm-right", { rotation: -120, duration: 0.3 }, 8.0) // Reach high panel
      .to(".robot-arm-right", { rotation: 0, duration: 0.3 }, 8.3)
      // Violent shake
      .to(midRef.current, { x: "+=10", y: "+=10", yoyo: true, repeat: 5, duration: 0.1 }, 8.4)
      .to(".robot-head", { rotation: 20, duration: 0.5 }, 8.8) // Looks at fallen gear
      .to(".robot-head", { rotation: -40, duration: 0.5 }, 9.2); // Looks back at user with hope

    }, scrollTrackRef);

    return () => ctx.revert();
  }, [setRepairPhase]);

  // Mouse Parallax (Still runs independently of scroll)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (repairPhase !== 'idle') return; // Disable parallax during puzzle

      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;

      gsap.to(bgRef.current, { x: x * 10, y: y * 10, duration: 1, ease: "power2.out", overwrite: "auto" });
      gsap.to(midRef.current, { x: x * -20, y: y * -20, duration: 1, ease: "power2.out", overwrite: "auto" });
      gsap.to(fgRef.current, { x: x * -60, y: y * -60, duration: 1, ease: "power2.out", overwrite: "auto" });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [repairPhase]);

  return (
    <div ref={containerRef} className="relative w-full bg-[#060403] cursor-default selection:bg-transparent">
      
      {/* Scroll Track (creates the page length needed for ScrollTrigger) */}
      <div ref={scrollTrackRef} className="h-[400vh] w-full relative">
        
        {/* Pinned Camera Viewport */}
        <div ref={cameraRef} className="h-screen w-full overflow-hidden absolute top-0 left-0">
          
          {/* Layer 1: Background */}
          <div ref={bgRef} className="absolute inset-0 w-full h-full scale-[1.05] origin-center">
            <LaboratoryBackground />
          </div>

          {/* Layer 2: Midground (The Great Engine) */}
          <div ref={midRef} className="absolute inset-0 w-full h-full scale-[1.05] origin-bottom">
            <TheGreatEngine />
          </div>

          {/* Layer 2.5: The Robot Explorer */}
          <RobotExplorer />

          {/* Layer 3: Foreground (Workbench) */}
          <div ref={fgRef} className="absolute inset-0 w-full h-full scale-[1.1] origin-bottom-left">
            <LaboratoryForeground />
          </div>
          
          {/* Layer 4: The Puzzle (Only visible at the end of the timeline) */}
          {repairPhase !== 'idle' && (
             <div className="absolute inset-0 z-50 pointer-events-auto flex items-center justify-center">
                <GearPuzzle />
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
