'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useMachineStore } from '@/store/useMachineStore';
import { sounds } from '../../Scene1/Core/AudioController';

export default function DistantMachine() {
  const { explorationPhase, setExplorationPhase } = useMachineStore();
  const machineRef = useRef<SVGGElement>(null);
  const redLightRef = useRef<SVGCircleElement>(null);
  const sparksRef = useRef<HTMLDivElement>(null);
  const storyTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Story Trigger: 25 seconds of exploration
    if (explorationPhase === 'exploring') {
      storyTimerRef.current = setTimeout(() => {
        setExplorationPhase('noticing');
        sounds.redAlert.play();
        
        // Red light starts blinking
        if (redLightRef.current) {
          gsap.to(redLightRef.current, {
            opacity: 1,
            duration: 0.1,
            yoyo: true,
            repeat: -1,
            repeatDelay: 1,
            ease: "steps(1)"
          });
        }
      }, 25000);
    }

    return () => {
      if (storyTimerRef.current) clearTimeout(storyTimerRef.current);
    };
  }, [explorationPhase, setExplorationPhase]);

  useEffect(() => {
    // Ambient silhouette animation
    if (machineRef.current) {
      gsap.to(machineRef.current, { y: 10, duration: 4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    }

    // Occasional Sparks
    if (sparksRef.current) {
      const sparks = sparksRef.current.children;
      Array.from(sparks).forEach((spark) => {
        gsap.to(spark, {
          opacity: Math.random() * 0.8 + 0.2,
          y: Math.random() * 50 + 20,
          x: Math.random() * 40 - 20,
          duration: Math.random() * 0.5 + 0.2,
          repeat: -1,
          repeatDelay: Math.random() * 5 + 2,
          ease: 'power4.out',
          onRepeat: () => {
             gsap.set(spark, { y: 0, x: 0, opacity: 0 });
          }
        });
      });
    }
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
      {/* Deep Fog Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050403] via-transparent to-transparent opacity-90 z-10" />
      
      {/* Distant Machine Silhouette */}
      <div className="absolute top-[40%] left-[60%] w-96 h-96 opacity-60">
        <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl">
          <g ref={machineRef}>
             {/* Base Structure */}
             <rect x="100" y="200" width="200" height="200" fill="#0c0b0a" />
             <polygon points="100,200 150,100 250,100 300,200" fill="#080706" />
             
             {/* Flywheel */}
             <circle cx="200" cy="200" r="80" fill="none" stroke="#1f1814" strokeWidth="20" strokeDasharray="30 10" className="animate-[spin_20s_linear_infinite]" style={{ transformOrigin: "200px 200px" }} />
             
             {/* Internal glow */}
             <circle cx="200" cy="200" r="50" fill="#fcdba1" opacity="0.1" filter="blur(20px)" />
             
             {/* The Red Warning Light */}
             <circle ref={redLightRef} cx="200" cy="110" r="5" fill="#ff2a2a" opacity="0" filter="blur(2px)" />
          </g>
        </svg>

        {/* Sparks */}
        <div ref={sparksRef} className="absolute top-[50%] left-[50%] w-10 h-10">
           <div className="absolute w-1 h-2 bg-[#fcdba1] opacity-0 rounded-full" />
           <div className="absolute w-1 h-3 bg-[#ffaa55] opacity-0 rounded-full" />
           <div className="absolute w-1 h-1 bg-[#ffffff] opacity-0 rounded-full" />
        </div>
      </div>
    </div>
  );
}
