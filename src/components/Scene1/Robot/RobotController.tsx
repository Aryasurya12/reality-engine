'use client';

import { useEffect, useRef, useState } from 'react';
import Robot from './Robot';
import { setupEyeTracking } from './EyeTracking';
import { playWakeUpSequence, playStartledAnimation, playDiscoverySequence, startWalkingCycle, stopWalkingCycle, playPointSequence } from './RobotAnimations';
import gsap from 'gsap';
import { useWorkshopStore } from '@/store/useWorkshopStore';
import { sounds, unlockAudio } from '../Core/AudioController';

type RobotState = 'sleeping' | 'waking' | 'idle' | 'startled' | 'discovering' | 'guiding' | 'waiting';

export default function RobotController() {
  const [robotState, setRobotState] = useState<RobotState>('sleeping');
  const robotRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<SVGRectElement>(null);
  const chestRef = useRef<SVGRectElement>(null);
  const eyesRef = useRef<SVGGElement>(null);
  const antennaRef = useRef<SVGCircleElement>(null);
  const legLeftRef = useRef<SVGPathElement>(null);
  const legRightRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse distance tracking
  const totalDistanceRef = useRef(0);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { wakeUp, setStoryPhase, storyPhase } = useWorkshopStore();

  useEffect(() => {
    // Initial Setup
    lastPosRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      unlockAudio(); // Attempt to unlock audio on first move

      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Update tracking refs
      totalDistanceRef.current += dist;
      lastPosRef.current = { x: e.clientX, y: e.clientY };

      // Base State Machine Logic
      if (robotState === 'sleeping') {
        if (totalDistanceRef.current > 100 && totalDistanceRef.current < 500) {
          gsap.to(antennaRef.current, { opacity: 1, duration: 0.1, yoyo: true, repeat: 3 });
          sounds.servo.play();
        } else if (totalDistanceRef.current > 500) {
          setRobotState('waking');
          wakeUp(); 
          sounds.robotBeep.play();
          playWakeUpSequence(robotRef, chestRef, eyesRef, antennaRef, () => {
            setRobotState('idle');
            
            // Trigger Discovery sequence shortly after waking up
            setTimeout(() => {
              setRobotState('discovering');
              setStoryPhase('discovery');
              sounds.gearClick.play();
              playDiscoverySequence(robotRef, () => {
                setRobotState('guiding');
                setStoryPhase('guiding');
              });
            }, 3000);
          });
        }
      } else if (robotState === 'idle' || robotState === 'waiting' || robotState === 'guiding') {
        // Fast movement check for startle
        if (dist > 150) {
          const oldState = robotState;
          setRobotState('startled');
          playStartledAnimation(robotRef);
          sounds.servo.play();
          setTimeout(() => setRobotState(oldState), 1000);
        }

        // Guiding logic: Check if user is following
        if (storyPhase === 'guiding' && containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const robotScreenX = rect.left + rect.width / 2;
          const distToRobot = Math.abs(e.clientX - robotScreenX);
          
          if (distToRobot < 300) {
            // User is close, keep walking
            if (robotState === 'waiting') {
               setRobotState('guiding');
               sounds.robotBeep.play();
            }
          } else {
             // User is far, stop and wait
             if (robotState === 'guiding') {
                setRobotState('waiting');
             }
          }
        }

        // Reset idle timer
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        idleTimerRef.current = setTimeout(() => {
          if (storyPhase === 'guiding' && robotState === 'waiting') {
             // Encourage user to follow
             playPointSequence(robotRef);
             sounds.servo.play();
          }
        }, 8000);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Eye Tracking Hook
    const cleanupEyeTracking = setupEyeTracking({
      eyesRef,
      headRef,
      containerRef,
      isSleeping: robotState === 'sleeping' || robotState === 'waking' || robotState === 'discovering'
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      cleanupEyeTracking();
    };
  }, [robotState, storyPhase, wakeUp, setStoryPhase]);

  // Handle Walking cycle based on Guiding state
  useEffect(() => {
    let walkTween: any = null;
    let moveTween: any = null;
    
    if (robotState === 'guiding') {
       walkTween = startWalkingCycle(robotRef, legLeftRef, legRightRef);
       
       // Move deeper into the background (scale down, move left/right)
       moveTween = gsap.to(robotRef.current, {
         x: "+=20",
         scale: "-=0.01",
         duration: 1,
         ease: "none",
         repeat: -1,
         onRepeat: () => {
           // Simulate footstep sound occasionally
           if (Math.random() > 0.5) sounds.footstep.play();
           
           // If we've walked far enough, reach the door
           const currentX = gsap.getProperty(robotRef.current, "x") as number;
           if (currentX > 300) {
             setRobotState('idle');
             setStoryPhase('waiting_at_door');
           }
         }
       });
    } else {
       stopWalkingCycle(robotRef, legLeftRef, legRightRef);
       if (moveTween) moveTween.kill();
    }

    return () => {
       if (walkTween) walkTween.kill();
       if (moveTween) moveTween.kill();
    };
  }, [robotState, setStoryPhase]);

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
