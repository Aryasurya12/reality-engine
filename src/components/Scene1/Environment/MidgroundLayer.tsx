'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function MidgroundLayer() {
  const machineRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    // Continuous environment animations for the giant machine
    const ctx = gsap.context(() => {
      // Rotating main flywheels
      gsap.to('.midground-flywheel', {
        rotation: 360,
        transformOrigin: "center center",
        ease: "none",
        duration: 10,
        repeat: -1
      });

      // Piston pumping
      gsap.to('.midground-piston', {
        y: 20,
        duration: 0.5,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut"
      });

      // Pressure gauge twitching randomly
      gsap.to('.midground-gauge-needle', {
        rotation: "random(-20, 60)",
        duration: "random(0.1, 0.5)",
        transformOrigin: "bottom center",
        repeat: -1,
        ease: "elastic.out(1, 0.3)",
        repeatRefresh: true
      });
      
    }, machineRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full z-20 pointer-events-none flex items-center justify-center">
      {/* The Giant Central Machine */}
      <svg ref={machineRef} viewBox="0 0 1000 1000" className="w-[80%] h-[80%] drop-shadow-2xl opacity-90 origin-center">
        {/* Main Central Boiler / Core */}
        <circle cx="500" cy="500" r="200" fill="#110d0a" stroke="var(--color-workshop-copper)" strokeWidth="10" />
        <circle cx="500" cy="500" r="180" fill="none" stroke="var(--color-workshop-brass)" strokeWidth="4" strokeDasharray="10 10" className="opacity-50" />
        
        {/* Glowing Heart of Machine */}
        <circle cx="500" cy="500" r="80" fill="#fcdba1" opacity="0.3" filter="blur(20px)" />
        <circle cx="500" cy="500" r="40" fill="#fcdba1" opacity="0.6" filter="blur(5px)" />
        <circle cx="500" cy="500" r="20" fill="#fff" opacity="0.9" filter="blur(2px)" />

        {/* Giant Left Flywheel */}
        <g style={{ transformOrigin: "250px 450px" }} className="midground-flywheel">
          <circle cx="250" cy="450" r="120" fill="none" stroke="var(--color-workshop-copper)" strokeWidth="15" />
          <line x1="130" y1="450" x2="370" y2="450" stroke="var(--color-workshop-brass)" strokeWidth="8" />
          <line x1="250" y1="330" x2="250" y2="570" stroke="var(--color-workshop-brass)" strokeWidth="8" />
          <circle cx="250" cy="450" r="20" fill="#110d0a" stroke="var(--color-workshop-copper)" strokeWidth="4" />
        </g>

        {/* Giant Right Gear */}
        <g style={{ transformOrigin: "750px 550px" }} className="midground-flywheel">
          <circle cx="750" cy="550" r="100" fill="none" stroke="var(--color-workshop-brass)" strokeWidth="20" strokeDasharray="30 10" />
          <circle cx="750" cy="550" r="80" fill="none" stroke="var(--color-workshop-copper)" strokeWidth="5" />
          <circle cx="750" cy="550" r="15" fill="var(--color-workshop-brass)" />
          {[0, 45, 90, 135].map(angle => (
             <line key={angle} x1="670" y1="550" x2="830" y2="550" stroke="var(--color-workshop-brass)" strokeWidth="6" transform={`rotate(${angle} 750 550)`} />
          ))}
        </g>

        {/* Massive Pipes branching up to ceiling */}
        <path d="M 400 300 Q 400 100 200 0" fill="none" stroke="var(--color-workshop-copper)" strokeWidth="30" strokeLinecap="round" />
        <path d="M 600 300 Q 600 50 800 0" fill="none" stroke="var(--color-workshop-brass)" strokeWidth="20" strokeLinecap="round" />
        <path d="M 500 300 L 500 0" fill="none" stroke="#2a1f18" strokeWidth="40" />

        {/* Steam Piston Assembly */}
        <g transform="translate(450, 700)">
          <rect x="0" y="0" width="100" height="150" fill="#110d0a" stroke="var(--color-workshop-brass)" strokeWidth="4" />
          <rect x="25" y="20" width="50" height="110" fill="#080605" />
          {/* Animated piston rod */}
          <rect x="40" y="20" width="20" height="80" fill="var(--color-workshop-copper)" className="midground-piston" />
        </g>

        {/* Pressure Gauge */}
        <g transform="translate(680, 350)">
          <circle cx="50" cy="50" r="40" fill="#fcdba1" stroke="var(--color-workshop-brass)" strokeWidth="6" opacity="0.9" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="#110d0a" strokeWidth="1" strokeDasharray="2 4" />
          <line x1="50" y1="50" x2="30" y2="30" stroke="red" strokeWidth="3" strokeLinecap="round" className="midground-gauge-needle" style={{ transformOrigin: "50px 50px" }} />
          <circle cx="50" cy="50" r="5" fill="#110d0a" />
        </g>
      </svg>
    </div>
  );
}
