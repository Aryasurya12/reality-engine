'use client';

import { useEffect, useRef } from 'react';
import Robot from '../../Scene1/Robot/Robot';
import { setupEyeTracking } from '../../Scene1/Robot/EyeTracking';
import { startWalkingCycle, stopWalkingCycle, playPointSequence } from '../../Scene1/Robot/RobotAnimations';
import gsap from 'gsap';
import { useMachineStore } from '@/store/useMachineStore';
import { sounds } from '../../Scene1/Core/AudioController';

export default function RobotExplorer() {
  const robotRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<SVGRectElement>(null);
  const chestRef = useRef<SVGRectElement>(null);
  const eyesRef = useRef<SVGGElement>(null);
  const antennaRef = useRef<SVGCircleElement>(null);
  const legLeftRef = useRef<SVGPathElement>(null);
  const legRightRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { explorationPhase } = useMachineStore();

  useEffect(() => {
    // Eye Tracking Hook
    const cleanupEyeTracking = setupEyeTracking({
      eyesRef,
      headRef,
      containerRef,
      isSleeping: false
    });

    return cleanupEyeTracking;
  }, []);

  // Exploration Behavior Engine
  useEffect(() => {
    if (!robotRef.current) return;

    let wanderTimer: NodeJS.Timeout | undefined;

    if (explorationPhase === 'exploring') {
      // Entrance Walk-in
      gsap.fromTo(robotRef.current, 
        { x: -500, scale: 0.8 },
        { 
          x: -100, 
          scale: 1, 
          duration: 2, 
          ease: "power2.out", 
          delay: 0.5,
          onStart: () => {
             startWalkingCycle(robotRef, legLeftRef, legRightRef);
          },
          onComplete: () => {
             stopWalkingCycle(robotRef, legLeftRef, legRightRef);
             
             // Begin organic wandering behavior
             const wander = () => {
                const randomX = (Math.random() * 200) - 200; // Wander between -200 and 0
                gsap.to(robotRef.current, {
                   x: randomX,
                   duration: Math.random() * 2 + 1,
                   ease: "sine.inOut",
                   onStart: () => startWalkingCycle(robotRef, legLeftRef, legRightRef),
                   onComplete: () => {
                      stopWalkingCycle(robotRef, legLeftRef, legRightRef);
                      // Occasionally look proud/happy
                      if (Math.random() > 0.5) {
                         gsap.to(headRef.current, { rotation: -10, duration: 0.5, yoyo: true, repeat: 1 });
                      }
                      wanderTimer = setTimeout(wander, Math.random() * 3000 + 1000);
                   }
                });
             };
             wanderTimer = setTimeout(wander, 2000);
          }
        }
      );
    } else if (explorationPhase === 'noticing') {
      clearTimeout(wanderTimer);
      stopWalkingCycle(robotRef, legLeftRef, legRightRef);
      
      // Freeze, look right (towards machine), alert antenna
      gsap.killTweensOf(robotRef.current);
      const tl = gsap.timeline();
      
      tl.to(headRef.current, { rotation: 15, duration: 0.2 })
        .to(antennaRef.current, { opacity: 1, duration: 0.1, yoyo: true, repeat: 3 })
        .to(robotRef.current, { x: "+=10", duration: 0.2, yoyo: true, repeat: 1 }) // Startled flinch
        .call(() => {
           // Look back at user
           playPointSequence(robotRef);
        })
        .to(headRef.current, { rotation: 25, duration: 1, delay: 1 })
        .call(() => {
           // Begin leading towards the machine
           useMachineStore.getState().setExplorationPhase('leading');
        });

    } else if (explorationPhase === 'leading') {
      // Slowly walk towards the distant machine
      gsap.to(robotRef.current, {
        x: 600,
        scale: 0.5, // Perspective shrinking
        y: -50,
        duration: 10,
        ease: "sine.inOut",
        onStart: () => startWalkingCycle(robotRef, legLeftRef, legRightRef),
        onUpdate: function() {
           // Occasionally look back while walking
           if (this.progress() > 0.3 && this.progress() < 0.35) {
              gsap.to(headRef.current, { rotation: -20, duration: 0.5, yoyo: true, repeat: 1 });
           }
        }
      });
    }

    return () => clearTimeout(wanderTimer);
  }, [explorationPhase]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-40 pointer-events-none">
      <Robot 
        ref={robotRef}
        headRef={headRef}
        chestRef={chestRef}
        eyesRef={eyesRef}
        antennaRef={antennaRef}
        legLeftRef={legLeftRef}
        legRightRef={legRightRef}
      />
    </div>
  );
}
