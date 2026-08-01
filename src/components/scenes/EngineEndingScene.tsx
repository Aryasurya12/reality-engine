'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CinematicBackground from '../environment/CinematicBackground';
import CinematicForeground from '../environment/CinematicForeground';
import Robot from '../svg/Robot';
import GreatEngine from '../svg/GreatEngine';
import DustParticles from '../environment/DustParticles';
import { useGlobalState } from '@/store/useGlobalState';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function EngineEndingScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const robotRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<SVGGElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { setShowEnding } = useGlobalState();

  useEffect(() => {
    if (!containerRef.current) return;
    
    let ctx = gsap.context(() => {
      // INITIAL SETUP
      gsap.set(robotRef.current, { x: '-20vw', scale: 0.8, y: 120, opacity: 0 }); // Walks in from left
      gsap.set(engineRef.current, { opacity: 0.3, scale: 0.9, y: 50 }); // Dormant
      gsap.set(overlayRef.current, { opacity: 1 }); // Start with the silhouette overlay solid

      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1, // Smooth scrub
        }
      });
      
      // Total duration of the timeline will be set to exactly 1.0 seconds
      // so percentages map cleanly to scroll height.
      
      // --- Phase 1: The Bridge (0.0 to 0.2) ---
      // Camera pushes through the black overlay of the final case
      masterTl.to(overlayRef.current, { opacity: 0, duration: 0.2, ease: 'power2.inOut' }, 0);
      masterTl.to(engineRef.current, { opacity: 1, scale: 1, y: 0, duration: 0.2, ease: 'power2.out' }, 0);
      
      // --- Phase 2: Arrival (0.1 to 0.3) ---
      // Robot walks into the frame
      masterTl.to(robotRef.current, { opacity: 1, x: '20vw', duration: 0.2, ease: 'power1.out' }, 0.1);
      
      // Robot walk cycle while entering
      const enterWalkDuration = 0.2;
      const enterIter = 8;
      masterTl.to('.robot-head', { y: 2, rotation: 1, yoyo: true, repeat: enterIter*2 - 1, ease: 'sine.inOut', duration: enterWalkDuration/(enterIter*2) }, 0.1);
      masterTl.to('.robot-chest', { y: -2, yoyo: true, repeat: enterIter*2 - 1, ease: 'sine.inOut', duration: enterWalkDuration/(enterIter*2) }, 0.1);
      
      // Robot looks up at the engine when stopped
      masterTl.to('.robot-head', { rotation: -15, y: -2, duration: 0.1, ease: 'sine.inOut' }, 0.3);
      
      // --- Phase 3: The Power Up (0.3 to 0.7) ---
      masterTl.addLabel('powerupStart', 0.3);
      
      // 1. Shell highlight arcs ignite
      masterTl.to('.engine-shell-light', { opacity: 1, duration: 0.1, ease: 'power2.in' }, 'powerupStart');
      
      // 2. Core begins to glow and pulse
      masterTl.to('.engine-core-glow', { opacity: 1, duration: 0.2, ease: 'power1.inOut' }, 'powerupStart+=0.1');
      masterTl.to('.engine-core-glow', { scale: 1.1, yoyo: true, repeat: 5, transformOrigin: 'center center', duration: 0.05, ease: 'sine.inOut' }, 'powerupStart+=0.1');
      
      // 3. Indicator lights ignite in stagger
      masterTl.to('.engine-light-node', { opacity: 1, duration: 0.05, stagger: 0.02 }, 'powerupStart+=0.15');
      
      // 4. Ignition Rings
      masterTl.to('.engine-ring-1', { opacity: 1, rotation: 90, transformOrigin: 'center center', duration: 0.3, ease: 'power2.out' }, 'powerupStart+=0.1');
      masterTl.to('.engine-ring-2', { opacity: 1, rotation: -90, transformOrigin: 'center center', duration: 0.3, ease: 'power2.out' }, 'powerupStart+=0.1');
      
      // 5. Pistons start pumping
      masterTl.to('.engine-piston-left', { y: 80, yoyo: true, repeat: 19, duration: 0.02, ease: 'sine.inOut' }, 'powerupStart');
      masterTl.to('.engine-piston-right', { y: 80, yoyo: true, repeat: 19, duration: 0.02, ease: 'sine.inOut', delay: 0.01 }, 'powerupStart');

      // 6. Flywheel spins up! Accelerates using ease: 'power2.in'
      masterTl.to('.engine-flywheel', { rotation: 360 * 3, duration: 0.4, ease: 'power2.in' }, 'powerupStart');

      // --- Phase 4: The Climax & Pull Back (0.7 to 0.9) ---
      masterTl.addLabel('climax', 0.7);
      
      // Flywheel sustains max speed
      masterTl.to('.engine-flywheel', { rotation: '+=720', duration: 0.2, ease: 'none' }, 'climax');
      
      // Entire room lights up (ambient background glow)
      masterTl.to('.cinematic-bg-glow', { opacity: 0.8, fill: '#e8c07a', duration: 0.2 }, 'climax');
      
      // Camera pulls back
      masterTl.to(cameraRef.current, { scale: 0.9, duration: 0.2, ease: 'power1.inOut' }, 'climax');
      
      // Robot waves
      masterTl.to('.robot-head', { rotation: 5, duration: 0.1 }, 'climax');
      // Assuming robot has an arm we can target. 
      // If we don't have an explicit arm rigged in Robot.tsx, we can bounce the robot itself.
      masterTl.to(robotRef.current, { y: '-=20', yoyo: true, repeat: 3, duration: 0.05, ease: 'power1.out' }, 'climax+=0.05');

      // --- Phase 5: The End (0.9 to 1.0) ---
      masterTl.addLabel('ending', 0.9);
      
      // Keep flywheel spinning to the very end of scroll
      masterTl.to('.engine-flywheel', { rotation: '+=360', duration: 0.1, ease: 'none' }, 'ending');

      // Trigger the ending UI state at the very end
      masterTl.call(() => {
        setShowEnding(true);
      }, [], 0.95);
      
      // Also handle scrolling back up to hide the ending
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          if (self.progress < 0.95) {
            setShowEnding(false);
          }
        }
      });
      
      // Ensure the timeline plays out exactly to 1.0
      masterTl.to({}, { duration: 0.1 }, 'ending'); 
    });

    return () => {
      ctx.revert();
      setShowEnding(false); // Cleanup state
    };
  }, [setShowEnding]);

  // Handheld Camera Breathing Effect
  useEffect(() => {
    gsap.to(cameraRef.current, {
      scale: "+=0.01",
      rotation: 0.1,
      y: 3,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, []);

  return (
    // 1000vh for a long cinematic scrub
    <div ref={containerRef} className="relative w-full h-[1000vh] bg-[#020101] cursor-none selection:bg-transparent">
        
      {/* Pinned Cinematic Viewport */}
      <div ref={cameraRef} className="h-screen w-full overflow-hidden sticky top-0 left-0">
        
        {/* Background */}
        <div className="absolute inset-0 w-full h-full">
          <CinematicBackground />
          <svg className="cinematic-bg-glow absolute inset-0 w-full h-full opacity-0 pointer-events-none">
             <rect width="100%" height="100%" fill="#c8891a" style={{ mixBlendMode: 'overlay' }} />
          </svg>
        </div>

        {/* Ambient Particles (Steam / Dust) */}
        <div className="absolute inset-0 z-10 opacity-60">
           <DustParticles />
        </div>

        {/* The Great Engine */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <svg viewBox="0 0 1000 800" className="w-full h-full drop-shadow-[0_40px_100px_rgba(232,168,74,0.15)] origin-center scale-150 transform translate-y-20">
            <GreatEngine ref={engineRef} />
          </svg>
        </div>

        {/* The Robot */}
        <div ref={robotRef} className="absolute inset-0 z-30 pointer-events-none w-screen h-screen">
          <Robot />
        </div>

        {/* Foreground */}
        <div className="absolute inset-0 w-full h-full z-40 pointer-events-none">
          <CinematicForeground />
        </div>

        {/* Silhouette Overlay (The Bridge from Scene 2) */}
        <div ref={overlayRef} className="absolute inset-0 z-50 bg-[#020101] pointer-events-none" />

      </div>
    </div>
  );
}
