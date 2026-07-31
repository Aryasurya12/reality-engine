'use client';

import { useEffect, useRef, useState } from 'react';
import Robot from './Robot';
import { setupEyeTracking } from './EyeTracking';
import { playWakeUpSequence, playStartledAnimation, playDiscoverySequence, startWalkingCycle, stopWalkingCycle, playPointSequence, getRandomIdleAnimation, playWaveAnimation } from './RobotAnimations';
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

  const { isAwake, storyPhase, scrollProgress, wakeUp, setStoryPhase } = useWorkshopStore();

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
              setStoryPhase('curious');
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

        // Random Idle Behavior Engine
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        idleTimerRef.current = setTimeout(() => {
          if (robotState === 'idle' || robotState === 'waiting') {
             // Occasionally trigger random idle behavior
             if (Math.random() > 0.5) {
               getRandomIdleAnimation(robotRef, antennaRef, chestRef, legRightRef);
             } else if (storyPhase === 'guiding' && robotState === 'waiting') {
               // Encourage user to follow
               playPointSequence(robotRef);
               sounds.servo.play();
             }
          }
        }, 4000 + Math.random() * 4000); // Random interval between 4s and 8s
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

  // Handle Robot Follow System (Scroll Tracking)
  useEffect(() => {
    if (storyPhase === 'guiding' || storyPhase === 'waiting_at_door') {
      if (!robotRef.current) return;
      
      // Base guiding X is 50, map progress (0-100) to additional X (up to 400)
      const targetX = 50 + (scrollProgress * 4); 
      
      // Move robot smoothly to new X
      gsap.to(robotRef.current, {
        x: targetX,
        duration: 0.8,
        ease: "power2.out",
        onStart: () => {
          if (robotState !== 'guiding') {
            setRobotState('guiding');
            startWalkingCycle(robotRef, legLeftRef, legRightRef);
          }
        },
        onComplete: () => {
          setRobotState('waiting');
          stopWalkingCycle(robotRef, legLeftRef, legRightRef);
        }
      });
    }
  }, [scrollProgress, storyPhase, setStoryPhase]);

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
