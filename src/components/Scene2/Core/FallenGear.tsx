'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useDragControls, useAnimation } from 'framer-motion';
import { useGlobalState } from '@/store/useGlobalState';
import { useCursorStore } from '@/store/useCursorStore';
import { sounds, safePlay } from '../../Scene1/Core/AudioController';
import gsap from 'gsap';

export default function FallenGear() {
  const [isRepaired, setIsRepaired] = useState(false);
  const { repairPhase, setRepairPhase } = useGlobalState();
  const { setCursorState } = useCursorStore();
  const controls = useAnimation();
  const gearRef = useRef<HTMLDivElement>(null);
  
  // Only show this interaction if we are ready for it
  const isVisible = repairPhase === 'ready_to_repair' || repairPhase === 'repaired';

  useEffect(() => {
    if (repairPhase === 'ready_to_repair') {
      // Hide the dummy gear from TheGreatEngine now that the interactive one is mounted
      gsap.set('.falling-gear-dummy', { opacity: 0 });
      gsap.to('.empty-socket-glow', { opacity: 1, duration: 1 });

      // Pulse animation for the gear when it's waiting to be picked up
      gsap.to('.fallen-gear-glow', {
        opacity: 0.8,
        scale: 1.1,
        duration: 1.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
      });
    }
  }, [repairPhase]);

  const handleDragStart = () => {
    setCursorState('dragging');
    safePlay(sounds.metalScrape);
  };

  const handleDrag = (event: any, info: any) => {
    // Magnetic attraction effect if close to socket
    const socketX = window.innerWidth / 2;
    const socketY = window.innerHeight / 2 + 50; // Roughly the center of the engine socket
    
    // We get the current center of the gear based on pointer roughly
    const dx = info.point.x - socketX;
    const dy = info.point.y - socketY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < 200) {
      setCursorState('hover-drag');
    } else {
      setCursorState('dragging');
    }
  };

  const { transitionToScene } = useGlobalState();

  const handleDragEnd = (event: any, info: any) => {
    setCursorState('default');
    
    const socketX = window.innerWidth / 2;
    const socketY = window.innerHeight / 2 + 50;
    
    const dx = info.point.x - socketX;
    const dy = info.point.y - socketY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < 200) {
      // Snap!
      setIsRepaired(true);
      setRepairPhase('repaired');
      setCursorState('placed');
      safePlay(sounds.snapClick);
      setTimeout(() => safePlay(sounds.happyBeep), 500);
      
      gsap.killTweensOf('.fallen-gear-glow');
      gsap.set('.empty-socket-glow', { opacity: 0 });
      
      // MACHINE STARTUP SEQUENCE
      const tl = gsap.timeline();
      
      tl.to('.cinematic-status-light', { opacity: 0.9, filter: "blur(4px)", duration: 0.5 })
        .to('.cinematic-engine-core', { opacity: 1, scale: 1.1, duration: 2, ease: "power2.inOut" }, 0)
        .to('.cinematic-gauge-needle', { rotation: 140, duration: 2, ease: "elastic.out(1, 0.3)" }, 0)
        .to('.cinematic-engine-flywheel', { rotation: "+=720", duration: 4, ease: "power1.in" }, 0)
        // Transition to scene 3 after power up
        .to('.cinematic-engine-core', { 
           scale: 10, 
           opacity: 1, 
           duration: 1, 
           ease: "power4.in",
           onComplete: () => {
             transitionToScene('scene3_observatory');
           }
        }, 3);
        
    } else {
      // Thud sound when dropping on floor
      safePlay(sounds.heavyImpact);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-40">
      
      {/* The Empty Socket (Drop Zone) */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border-4 border-dashed transition-all duration-700 
          ${isRepaired ? 'border-transparent scale-110 opacity-0' : 'border-[#e8a84a] opacity-60 shadow-[0_0_30px_#e8a84a] animate-door-glow'}
        `} 
      />

      {/* The Fallen Gear (Draggable) */}
      <motion.div
        ref={gearRef}
        className="absolute bottom-10 left-[40%] w-32 h-32 cursor-none pointer-events-auto origin-center"
        drag={!isRepaired}
        dragSnapToOrigin={!isRepaired}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        onMouseEnter={() => !isRepaired && setCursorState('hover-drag')}
        onMouseLeave={() => !isRepaired && setCursorState('default')}
        animate={isRepaired ? { 
          x: window.innerWidth / 2 - (window.innerWidth * 0.4) - 64, // Needs adjustment based on actual initial pos
          y: -(window.innerHeight / 2 - 80), 
          scale: 1.25,
          rotate: 360,
          transition: { type: "spring", stiffness: 120, damping: 15 }
        } : {}}
      >
        {/* Warm glow aura */}
        <div className="fallen-gear-glow absolute inset-0 rounded-full bg-[#fcdba1] blur-2xl opacity-0" />
        
        <svg viewBox="0 0 100 100" className="fallen-gear-svg w-full h-full drop-shadow-2xl relative z-10">
          <circle cx="50" cy="50" r="40" fill="#150e09" stroke="#b58953" strokeWidth="10" strokeDasharray="15 10" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="#c8891a" strokeWidth="8" />
          <line x1="50" y1="10" x2="50" y2="90" stroke="#b58953" strokeWidth="6" />
          <line x1="10" y1="50" x2="90" y2="50" stroke="#b58953" strokeWidth="6" />
          <circle cx="50" cy="50" r="10" fill="#0d0907" stroke="#c8891a" strokeWidth="3" />
        </svg>
      </motion.div>

    </div>
  );
}
