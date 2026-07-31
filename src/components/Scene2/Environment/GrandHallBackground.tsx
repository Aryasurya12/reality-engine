'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function GrandHallBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gear1Ref = useRef<SVGGElement>(null);
  const gear2Ref = useRef<SVGGElement>(null);
  const pendulumRef = useRef<SVGGElement>(null);
  const gaugeNeedleRef = useRef<SVGLineElement>(null);
  const lightsRef = useRef<HTMLDivElement>(null);
  
  // Parallax Effect
  useEffect(() => {
    if (!containerRef.current) return;
    const xTo = gsap.quickTo(containerRef.current, 'x', { duration: 1.5, ease: 'power2' });
    const yTo = gsap.quickTo(containerRef.current, 'y', { duration: 1.5, ease: 'power2' });

    const handleMouseMove = (e: MouseEvent) => {
      // Extremely subtle parallax to emphasize massive scale
      const xPos = (e.clientX / window.innerWidth - 0.5) * -30;
      const yPos = (e.clientY / window.innerHeight - 0.5) * -30;
      xTo(xPos);
      yTo(yPos);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Ambient Animations
  useEffect(() => {
    // Slow massive gears
    if (gear1Ref.current) gsap.to(gear1Ref.current, { rotation: 360, duration: 60, repeat: -1, ease: 'none', transformOrigin: 'center center' });
    if (gear2Ref.current) gsap.to(gear2Ref.current, { rotation: -360, duration: 90, repeat: -1, ease: 'none', transformOrigin: 'center center' });
    
    // Swinging pendulum
    if (pendulumRef.current) gsap.to(pendulumRef.current, { rotation: 10, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut', transformOrigin: 'top center' });
    
    // Twitching pressure gauge
    if (gaugeNeedleRef.current) {
      gsap.to(gaugeNeedleRef.current, { 
        rotation: () => Math.random() * 20 - 10, 
        duration: 0.1, 
        repeat: -1, 
        repeatDelay: 1.5,
        ease: 'rough', 
        transformOrigin: 'bottom center' 
      });
    }

    // Blinking lights
    if (lightsRef.current) {
      const lights = lightsRef.current.children;
      Array.from(lights).forEach((light) => {
        gsap.to(light, {
          opacity: 0.2,
          duration: Math.random() * 0.5 + 0.1,
          repeat: -1,
          yoyo: true,
          repeatDelay: Math.random() * 3,
          ease: 'steps(1)'
        });
      });
    }
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-[-5%] w-[110%] h-[110%] z-0 pointer-events-none">
      
      {/* Distant Hall Architecture */}
      <svg viewBox="0 0 1920 1080" className="w-full h-full opacity-30 drop-shadow-2xl">
        {/* Massive Archways */}
        <path d="M 0,1080 L 0,300 Q 960,0 1920,300 L 1920,1080 Z" fill="none" stroke="var(--color-workshop-brass)" strokeWidth="4" opacity="0.1" />
        <path d="M 200,1080 L 200,400 Q 960,150 1720,400 L 1720,1080 Z" fill="none" stroke="var(--color-workshop-brass)" strokeWidth="2" opacity="0.2" />
        
        {/* Giant Ceiling Gears */}
        <g ref={gear1Ref} style={{ transformOrigin: "400px -100px" }}>
          <circle cx="400" cy="-100" r="300" fill="none" stroke="var(--color-workshop-copper)" strokeWidth="10" strokeDasharray="50 20" opacity="0.3" />
          <circle cx="400" cy="-100" r="280" fill="none" stroke="#1f1814" strokeWidth="40" opacity="0.5" />
        </g>
        <g ref={gear2Ref} style={{ transformOrigin: "1400px -200px" }}>
          <circle cx="1400" cy="-200" r="500" fill="none" stroke="var(--color-workshop-brass)" strokeWidth="15" strokeDasharray="80 30" opacity="0.2" />
        </g>

        {/* Thick Copper Pipes */}
        <rect x="150" y="0" width="40" height="1080" fill="url(#pipe-gradient)" opacity="0.4" />
        <rect x="220" y="0" width="20" height="1080" fill="url(#pipe-gradient)" opacity="0.3" />
        <rect x="1650" y="0" width="60" height="1080" fill="url(#pipe-gradient)" opacity="0.4" />

        {/* Swinging Pendulum */}
        <g ref={pendulumRef} style={{ transformOrigin: "960px 0px" }}>
           <line x1="960" y1="0" x2="960" y2="400" stroke="var(--color-workshop-brass)" strokeWidth="4" opacity="0.4" />
           <circle cx="960" cy="400" r="40" fill="var(--color-workshop-copper)" opacity="0.6" />
           <circle cx="960" cy="400" r="20" fill="#050403" />
        </g>

        {/* Pressure Gauge on a Pipe */}
        <g transform="translate(145, 600)">
           <circle cx="25" cy="25" r="30" fill="#050403" stroke="var(--color-workshop-brass)" strokeWidth="4" />
           <circle cx="25" cy="25" r="25" fill="#14100c" />
           {/* Dial marks */}
           <path d="M 5,25 A 20 20 0 0 1 45 25" fill="none" stroke="white" strokeWidth="2" strokeDasharray="2 6" opacity="0.3" />
           {/* Needle */}
           <line ref={gaugeNeedleRef} x1="25" y1="25" x2="10" y2="15" stroke="red" strokeWidth="2" style={{ transformOrigin: "25px 25px" }} />
           <circle cx="25" cy="25" r="4" fill="var(--color-workshop-brass)" />
        </g>

        <defs>
          <linearGradient id="pipe-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#050403" />
            <stop offset="20%" stopColor="var(--color-workshop-copper)" />
            <stop offset="80%" stopColor="var(--color-workshop-copper)" />
            <stop offset="100%" stopColor="#050403" />
          </linearGradient>
        </defs>
      </svg>

      {/* Tiny Blinking Lights across the architecture */}
      <div ref={lightsRef} className="absolute inset-0">
         <div className="absolute top-[30%] left-[20%] w-2 h-2 rounded-full bg-blue-400 blur-[2px]" />
         <div className="absolute top-[45%] left-[80%] w-2 h-2 rounded-full bg-orange-400 blur-[2px]" />
         <div className="absolute top-[60%] left-[15%] w-1.5 h-1.5 rounded-full bg-red-500 blur-[1px]" />
         <div className="absolute top-[25%] left-[75%] w-3 h-3 rounded-full bg-green-500 blur-[3px]" />
      </div>

    </div>
  );
}
