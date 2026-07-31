'use client';

import { useState } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { useGlobalState } from '@/store/useGlobalState';

export default function GearPuzzle() {
  const [isRepaired, setIsRepaired] = useState(false);
  const { setRepairPhase } = useGlobalState();
  const dragControls = useDragControls();

  const handleDragEnd = (event: any, info: any) => {
    // Simple hit detection for the drop zone
    // If the gear is dragged near the socket (center of screen approximately)
    if (info.point.x > window.innerWidth / 2 - 100 && info.point.x < window.innerWidth / 2 + 100 &&
        info.point.y > window.innerHeight / 2 - 100 && info.point.y < window.innerHeight / 2 + 100) {
      
      setIsRepaired(true);
      setRepairPhase('repaired');
      
      // Play a satisfying click sound (optional)
      // sounds.successClick.play();
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
      
      {/* The Empty Socket (Drop Zone) */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border-4 border-dashed transition-colors duration-500 ${isRepaired ? 'border-transparent' : 'border-[#fcdba1] opacity-50 shadow-[0_0_20px_#fcdba1]'}`} />

      {/* The Fallen Gear (Draggable) */}
      <motion.div
        className="absolute bottom-20 left-[40%] w-32 h-32 cursor-grab active:cursor-grabbing pointer-events-auto"
        drag={!isRepaired}
        dragControls={dragControls}
        dragSnapToOrigin={!isRepaired}
        onDragEnd={handleDragEnd}
        animate={isRepaired ? { 
          x: window.innerWidth / 2 - (window.innerWidth * 0.4) - 64, // Math to snap to center
          y: -(window.innerHeight / 2 - 80), 
          scale: 1.25,
          rotate: 360,
          transition: { type: "spring", stiffness: 100, rotate: { duration: 10, repeat: Infinity, ease: "linear" } }
        } : {}}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
          <circle cx="50" cy="50" r="40" fill="#150e09" stroke="var(--color-workshop-brass)" strokeWidth="10" strokeDasharray="15 10" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="var(--color-workshop-copper)" strokeWidth="8" />
          <line x1="50" y1="10" x2="50" y2="90" stroke="var(--color-workshop-brass)" strokeWidth="6" />
          <line x1="10" y1="50" x2="90" y2="50" stroke="var(--color-workshop-brass)" strokeWidth="6" />
          <circle cx="50" cy="50" r="10" fill="#0d0907" stroke="var(--color-workshop-copper)" strokeWidth="3" />
        </svg>
      </motion.div>

    </div>
  );
}
