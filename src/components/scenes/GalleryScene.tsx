'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CinematicBackground from '../environment/CinematicBackground';
import CinematicForeground from '../environment/CinematicForeground';
import Robot from '../svg/Robot';
import InventionCase from '../environment/InventionCase';
import { sounds, safePlay } from './AudioController';
import { useGlobalState } from '@/store/useGlobalState';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function GalleryScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax Layers
  const cameraRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);
  
  const robotRef = useRef<HTMLDivElement>(null);
  const { transitionToScene } = useGlobalState();

  useEffect(() => {
    // Play ambient audio
    const ambientId = setInterval(() => {
      if (Math.random() > 0.8) safePlay(sounds.steamHiss);
    }, 5000);
    return () => clearInterval(ambientId);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    
    let ctx = gsap.context(() => {
      // INITIAL SETUP
      gsap.set(bgRef.current, { opacity: 0.1 });
      gsap.set(robotRef.current, { x: '20vw', scale: 0.7, y: 100 });
      gsap.set('.case-glass', { opacity: 0.8 }); // initial dim glass

      // We have 4 cases + 1 final teaser case. Total width needs to be wide.
      // Midground holds the cases. Let's space them 1200px apart.
      
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1, // Smooth scrub
        }
      });
      
      // We will scroll horizontally by pushing the layers to the left.
      // Background moves slow (e.g., -20%), Midground moves normal (-100%), Foreground moves fast (-150%)
      const totalScrollDistance = 5000; // Pixels to move the midground to see all cases
      
      masterTl.to(bgRef.current, { x: -totalScrollDistance * 0.3, ease: 'none', duration: 1 }, 0);
      masterTl.to(midRef.current, { x: -totalScrollDistance, ease: 'none', duration: 1 }, 0);
      masterTl.to(fgRef.current, { x: -totalScrollDistance * 1.5, ease: 'none', duration: 1 }, 0);
      
      // Robot walk cycle that plays while scrolling
      // We map the walk cycle to the scroll progression using a repeating tween
      // With repeat: 40, we want 41 total iterations to span exactly 1 second.
      const walkDuration = 1 / 41;
      masterTl.to('.robot-head', { y: 2, rotation: 1, yoyo: true, repeat: 40, ease: "sine.inOut", duration: walkDuration }, 0);
      masterTl.to('.robot-chest', { y: -2, yoyo: true, repeat: 40, ease: "sine.inOut", duration: walkDuration }, 0);
      
      // Add labels for pacing and ignition
      const casePositions = [
        { id: 1, pos: 0.1, type: 'bird' },
        { id: 2, pos: 0.3, type: 'orrery' },
        { id: 3, pos: 0.5, type: 'lantern' },
        { id: 4, pos: 0.7, type: 'propeller' },
      ];

      // Ignite sequence for each case
      casePositions.forEach((c) => {
        const label = `case${c.id}`;
        masterTl.addLabel(label, c.pos);
        
        // As we reach the case, camera drifts in slightly
        masterTl.to(cameraRef.current, { scale: 1.05, duration: 0.05, yoyo: true, repeat: 1, ease: 'sine.inOut' }, label);
        
        // Robot looks toward the case
        masterTl.to('.robot-head', { rotation: -10, duration: 0.05, yoyo: true, repeat: 1, ease: 'sine.inOut' }, label);
        
        // Case Ignition
        // 1. Rim light fades in
        masterTl.to(`#case-${c.id} .case-rim-light`, { opacity: 1, duration: 0.02 }, label);
        masterTl.to(`#case-${c.id} .case-pedestal-light`, { opacity: 1, duration: 0.02 }, label);
        
        // 2. Glass glow sweep across
        masterTl.fromTo(`#case-${c.id} .case-glow-sweep`, 
          { opacity: 1, x: -300 }, 
          { x: 300, opacity: 0, duration: 0.05, ease: 'power1.inOut' }, 
          label
        );
        
        // 3. Invention becomes visible and animates
        masterTl.to(`#case-${c.id} .case-invention`, { opacity: 1, duration: 0.02 }, label);
        
        // Specific idle loops powered by scroll (we make them loop a bit during this scroll window)
        if (c.type === 'bird') {
          masterTl.to(`#case-${c.id} .bird-wing-left`, { rotation: 20, yoyo: true, repeat: 5, duration: 0.02 }, label);
          masterTl.to(`#case-${c.id} .bird-wing-right`, { rotation: -20, yoyo: true, repeat: 5, duration: 0.02 }, label);
        } else if (c.type === 'orrery') {
          masterTl.to(`#case-${c.id} .orrery-ring-1`, { rotation: 360, duration: 0.1, ease: 'none' }, label);
          masterTl.to(`#case-${c.id} .orrery-ring-2`, { rotation: -360, duration: 0.1, ease: 'none' }, label);
          masterTl.to(`#case-${c.id} .orrery-ring-3`, { rotation: 180, duration: 0.1, ease: 'none' }, label);
        } else if (c.type === 'lantern') {
          masterTl.to(`#case-${c.id} .lantern-core`, { scale: 1.5, opacity: 0.5, yoyo: true, repeat: 5, duration: 0.02 }, label);
        } else if (c.type === 'propeller') {
          masterTl.to(`#case-${c.id} .propeller-blades`, { scaleX: -1, yoyo: true, repeat: 10, duration: 0.01, ease: 'none' }, label);
        }
      });

      // -- Climax: The Final Case and Light Wave --
      masterTl.addLabel('climax', 0.9);
      
      // Stop moving forward to witness the event
      masterTl.to(cameraRef.current, { scale: 1.1, duration: 0.05, ease: 'power2.out' }, 'climax');
      
      // Synchronized Light Wave (sweep back through previous cases)
      masterTl.to('.case-rim-light, .case-pedestal-light', { opacity: 0, duration: 0.02, stagger: { amount: 0.05, from: "end" } }, 'climax');
      masterTl.to('.case-rim-light, .case-pedestal-light', { opacity: 1, duration: 0.02, stagger: { amount: 0.05, from: "end" } }, 'climax+=0.02');
      
      // Final Case Ignites HUGE
      masterTl.to('#case-final .case-rim-light', { opacity: 1, strokeWidth: 20, duration: 0.02 }, 'climax+=0.04');
      masterTl.to('#case-final .invention-teaser', { opacity: 1, duration: 0.05, ease: 'power2.out' }, 'climax+=0.04');
      
      // Huge glow on the whole background
      masterTl.to(bgRef.current, { opacity: 0.8, duration: 0.05 }, 'climax+=0.04');
      
      // Handoff to Scene 3
      masterTl.call(() => {
        // We trigger this when they scroll to the absolute bottom
        // Wait, if it's scrubbed, it might trigger if they scrub back. 
        // ScrollTrigger onLeave is better for handoffs.
      }, [], 1.0);
      
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onLeave: () => transitionToScene('scene3_ending'),
      });

    });

    return () => ctx.revert();
  }, [transitionToScene]);

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
    // 600vh gives plenty of scroll room for the hallway sequence
    <div ref={containerRef} className="relative w-full h-[600vh] bg-[#020101] cursor-none selection:bg-transparent">
        
      {/* Pinned Cinematic Viewport */}
      <div ref={cameraRef} className="h-screen w-full overflow-hidden sticky top-0 left-0">
        
        {/* BACKGROUND LAYER (Wide) */}
        <div ref={bgRef} className="absolute inset-0 w-[300vw] h-full flex">
          <CinematicBackground />
          <CinematicBackground />
          <CinematicBackground />
        </div>

        {/* MIDGROUND LAYER (The Display Cases) */}
        <div ref={midRef} className="absolute inset-0 w-[5000px] h-full z-20">
          <svg viewBox="0 0 5000 1200" className="w-full h-full drop-shadow-[0_40px_80px_rgba(0,0,0,0.9)] origin-bottom">
            <defs>
              <linearGradient id="engineCore" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e8c07a" />
                <stop offset="50%" stopColor="#fcdba1" />
                <stop offset="100%" stopColor="#e8c07a" />
              </linearGradient>
              <linearGradient id="engineMetal" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1a1410" />
                <stop offset="50%" stopColor="#0d0907" />
                <stop offset="100%" stopColor="#060403" />
              </linearGradient>
              <linearGradient id="engineCopper" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c45b36" />
                <stop offset="100%" stopColor="#7a2a12" />
              </linearGradient>
              <linearGradient id="engineBrass" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#b58953" />
                <stop offset="100%" stopColor="#634421" />
              </linearGradient>
              <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="20" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Cases distributed along the hallway */}
            <InventionCase id="case-1" inventionType="bird" xOffset={800} />
            <InventionCase id="case-2" inventionType="orrery" xOffset={1800} />
            <InventionCase id="case-3" inventionType="lantern" xOffset={2800} />
            <InventionCase id="case-4" inventionType="propeller" xOffset={3800} />
            
            {/* The Final Teaser Case */}
            <InventionCase id="case-final" inventionType="empty" xOffset={4800} isFinalTeaser={true} />
          </svg>
        </div>

        {/* ROBOT LAYER (Moves with camera, but seems to walk due to background scrolling) */}
        <div ref={robotRef} className="absolute inset-0 z-[35] pointer-events-none origin-bottom w-screen h-screen">
          <Robot />
        </div>

        {/* FOREGROUND LAYER (Wide) */}
        <div ref={fgRef} className="absolute inset-0 w-[400vw] h-full flex z-50 pointer-events-none">
          <CinematicForeground />
          <CinematicForeground />
          <CinematicForeground />
          <CinematicForeground />
        </div>

      </div>
    </div>
  );
}
