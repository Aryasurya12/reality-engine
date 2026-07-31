'use client';

import { useRef } from 'react';
import Robot from './Robot';

export default function RobotController() {
  const headRef = useRef<SVGRectElement>(null);
  const chestRef = useRef<SVGRectElement>(null);
  const eyesRef = useRef<SVGGElement>(null);
  const antennaRef = useRef<SVGCircleElement>(null);
  const legLeftRef = useRef<SVGPathElement>(null);
  const legRightRef = useRef<SVGPathElement>(null);

  // Note: All animation logic has been moved to the GSAP ScrollTrigger timeline in HeroScene.tsx
  // This ensures perfect synchronization with the scroll progress.

  return (
    <div className="robot-wrapper absolute inset-0 z-40 pointer-events-none">
      <Robot 
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
