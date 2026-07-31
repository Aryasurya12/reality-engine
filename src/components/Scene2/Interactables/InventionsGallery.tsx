'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { sounds } from '../../Scene1/Core/AudioController';

export default function InventionsGallery() {
  // Invention Refs
  const birdWingRef = useRef<SVGPathElement>(null);
  const telescopeLensRef = useRef<SVGCircleElement>(null);
  const globeContinentsRef = useRef<SVGPathElement>(null);
  const blueprintCornerRef = useRef<SVGPathElement>(null);
  const robotHeadEyesRef = useRef<SVGGElement>(null);
  const musicMachineRef = useRef<SVGGElement>(null);
  const spiderLegRef = useRef<SVGPathElement>(null);

  // Hover Handlers
  const hoverBird = () => {
    if (birdWingRef.current) {
      gsap.to(birdWingRef.current, { rotation: -30, transformOrigin: "left bottom", duration: 0.1, yoyo: true, repeat: 1 });
      sounds.servo.play();
    }
  };

  const hoverTelescope = () => {
    if (telescopeLensRef.current) {
      gsap.to(telescopeLensRef.current, { rotation: 180, transformOrigin: "center", duration: 0.5, ease: "power2.out" });
      sounds.gearClick.play();
    }
  };

  const hoverGlobe = () => {
    if (globeContinentsRef.current) {
      gsap.to(globeContinentsRef.current, { fill: "#fcdba1", duration: 0.3, yoyo: true, repeat: 1 });
    }
  };

  const hoverBlueprint = () => {
    if (blueprintCornerRef.current) {
      gsap.to(blueprintCornerRef.current, { y: -5, x: 5, duration: 0.2, yoyo: true, repeat: 1 });
    }
  };

  const hoverRobotHead = () => {
    if (robotHeadEyesRef.current) {
      gsap.to(robotHeadEyesRef.current, { opacity: 0.8, duration: 0.1, yoyo: true, repeat: 3 });
      sounds.robotBeep.play();
    }
  };

  const hoverMusicMachine = () => {
    if (musicMachineRef.current) {
      gsap.to(musicMachineRef.current, { y: -5, duration: 0.1, yoyo: true, repeat: 1 });
      sounds.musicBox.play();
    }
  };

  const hoverSpider = () => {
    if (spiderLegRef.current) {
      gsap.to(spiderLegRef.current, { rotation: 20, transformOrigin: "top left", duration: 0.2, yoyo: true, repeat: 1 });
      sounds.metalExpansion.play();
    }
  };

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      <svg viewBox="0 0 1920 1080" className="w-full h-full drop-shadow-2xl">
        
        {/* Mechanical Bird */}
        <g transform="translate(300, 700)" className="pointer-events-auto cursor-help group" onMouseEnter={hoverBird}>
           <circle cx="50" cy="50" r="30" fill="var(--color-workshop-brass)" />
           <path d="M 80,50 L 120,40 L 90,60 Z" fill="var(--color-workshop-copper)" /> {/* Tail */}
           <path ref={birdWingRef} d="M 50,20 Q 20,0 10,30 Q 30,50 50,20 Z" fill="#b58953" /> {/* Wing */}
           <circle cx="65" cy="40" r="5" fill="#fcdba1" opacity="0.3" /> {/* Eye */}
           {/* Hitbox */}
           <rect x="0" y="0" width="130" height="100" fill="transparent" />
        </g>

        {/* Telescope */}
        <g transform="translate(1400, 600)" className="pointer-events-auto cursor-help" onMouseEnter={hoverTelescope}>
           <rect x="20" y="40" width="120" height="20" fill="var(--color-workshop-brass)" transform="rotate(-30 80 50)" />
           <polygon points="50,70 70,120 30,120" fill="var(--color-workshop-wood)" />
           <circle ref={telescopeLensRef} cx="130" cy="22" r="15" fill="#14100c" stroke="var(--color-workshop-copper)" strokeWidth="4" />
           {/* Hitbox */}
           <rect x="20" y="10" width="130" height="120" fill="transparent" />
        </g>

        {/* Globe */}
        <g transform="translate(700, 800)" className="pointer-events-auto cursor-help" onMouseEnter={hoverGlobe}>
           <path d="M 40,90 A 50 50 0 0 0 60,90" fill="none" stroke="var(--color-workshop-wood)" strokeWidth="6" />
           <line x1="50" y1="90" x2="50" y2="120" stroke="var(--color-workshop-brass)" strokeWidth="8" />
           <circle cx="50" cy="45" r="45" fill="#0c0b0a" stroke="var(--color-workshop-brass)" strokeWidth="2" />
           <path ref={globeContinentsRef} d="M 20,30 Q 40,20 60,40 T 70,70 Q 50,80 30,60 Z" fill="var(--color-workshop-copper)" opacity="0.6" />
           {/* Hitbox */}
           <rect x="0" y="0" width="100" height="120" fill="transparent" />
        </g>

        {/* Blueprint */}
        <g transform="translate(100, 850)" className="pointer-events-auto cursor-help" onMouseEnter={hoverBlueprint}>
           <rect x="10" y="10" width="100" height="70" fill="#1e2c3a" stroke="#4a6a8a" strokeWidth="2" transform="rotate(-10 60 45)" />
           <path ref={blueprintCornerRef} d="M 110,30 L 100,20 L 95,35 Z" fill="#2a3c4a" />
           {/* Hitbox */}
           <rect x="0" y="0" width="120" height="90" fill="transparent" />
        </g>

        {/* Robotic Head */}
        <g transform="translate(1100, 820)" className="pointer-events-auto cursor-help" onMouseEnter={hoverRobotHead}>
           <rect x="20" y="20" width="60" height="70" rx="10" fill="#050403" stroke="var(--color-workshop-brass)" strokeWidth="4" />
           <g ref={robotHeadEyesRef} opacity="0.2">
             <circle cx="35" cy="45" r="8" fill="red" />
             <circle cx="65" cy="45" r="8" fill="red" />
           </g>
           {/* Hitbox */}
           <rect x="10" y="10" width="80" height="90" fill="transparent" />
        </g>

        {/* Music Machine */}
        <g transform="translate(1600, 850)" className="pointer-events-auto cursor-help" onMouseEnter={hoverMusicMachine}>
           <rect x="10" y="30" width="80" height="50" fill="var(--color-workshop-wood)" stroke="var(--color-workshop-brass)" strokeWidth="2" />
           <g ref={musicMachineRef}>
             <circle cx="30" cy="30" r="15" fill="var(--color-workshop-copper)" />
             <circle cx="70" cy="30" r="15" fill="var(--color-workshop-copper)" />
           </g>
           <rect x="0" y="10" width="100" height="80" fill="transparent" />
        </g>

        {/* Steam Spider */}
        <g transform="translate(500, 880)" className="pointer-events-auto cursor-help" onMouseEnter={hoverSpider}>
           <circle cx="40" cy="30" r="15" fill="#14100c" stroke="var(--color-workshop-copper)" strokeWidth="2" />
           <path ref={spiderLegRef} d="M 25,30 Q 10,10 0,40" fill="none" stroke="var(--color-workshop-brass)" strokeWidth="3" />
           <path d="M 55,30 Q 70,10 80,40" fill="none" stroke="var(--color-workshop-brass)" strokeWidth="3" />
           <rect x="-10" y="0" width="100" height="50" fill="transparent" />
        </g>
      </svg>
    </div>
  );
}
