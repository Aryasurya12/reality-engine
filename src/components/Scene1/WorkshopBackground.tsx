'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function WorkshopBackground() {
  const bgRef = useRef<HTMLDivElement>(null);
  const lampRef = useRef<SVGSVGElement>(null);
  const smokeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Subtle background parallax
    if (bgRef.current) {
      const xTo = gsap.quickTo(bgRef.current, 'x', { duration: 1.5, ease: 'power2' });
      const yTo = gsap.quickTo(bgRef.current, 'y', { duration: 1.5, ease: 'power2' });

      const handleMouseMove = (e: MouseEvent) => {
        const xPos = (e.clientX / window.innerWidth - 0.5) * -20; // Furthest layer moves the least
        const yPos = (e.clientY / window.innerHeight - 0.5) * -20;
        xTo(xPos);
        yTo(yPos);
      };
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Swinging lamp animation
    if (lampRef.current) {
      gsap.to(lampRef.current, {
        rotation: 3,
        transformOrigin: "top center",
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });
    }

    // Smoke rising animation
    if (smokeRef.current) {
      const smokeParticles = smokeRef.current.children;
      Array.from(smokeParticles).forEach((p, i) => {
        gsap.fromTo(p, 
          { y: 0, opacity: 0, scale: 0.5, x: 0 },
          {
            y: -150,
            opacity: 0,
            scale: 2,
            x: Math.random() * 40 - 20,
            duration: 5,
            repeat: -1,
            ease: "sine.inOut",
            delay: i * 1.5
          }
        );
        // Mid-way fade in
        gsap.to(p, {
          opacity: 0.3,
          duration: 2.5,
          yoyo: true,
          repeat: -1,
          ease: "power1.inOut",
          delay: i * 1.5
        });
      });
    }

    return () => {
      // Cleanup event listener if needed
    };
  }, []);

  return (
    <div ref={bgRef} className="absolute inset-[-5%] w-[110%] h-[110%] z-10 pointer-events-none flex flex-col justify-between">
      
      {/* Hanging Lamp (Top Center) */}
      <div className="absolute top-0 left-1/3 w-32 flex flex-col items-center">
        {/* Lamp wire */}
        <div className="w-1 h-32 bg-[var(--color-workshop-wood)] opacity-80" />
        {/* Lamp Body */}
        <svg ref={lampRef} viewBox="0 0 100 100" className="w-24 h-24 text-[var(--color-workshop-copper)] drop-shadow-2xl">
          <path d="M20,50 L80,50 L60,20 L40,20 Z" fill="currentColor" opacity="0.9" />
          <path d="M10,50 L90,50 L90,60 L10,60 Z" fill="currentColor" />
          {/* Bulb glow */}
          <circle cx="50" cy="65" r="15" fill="#fcdba1" opacity="0.8" filter="blur(4px)" />
        </svg>
      </div>

      {/* Background Pipes (Left side) */}
      <div className="absolute top-1/4 left-10 w-16 h-3/4 border-l-8 border-t-8 border-[var(--color-workshop-copper)] opacity-20 rounded-tl-3xl" />
      <div className="absolute top-1/3 left-20 w-8 h-2/3 border-l-8 border-[var(--color-workshop-brass)] opacity-10" />

      {/* Tiny smoke coming from a pipe exhaust */}
      <div className="absolute top-[40%] left-[80px]">
        <div className="w-16 h-4 bg-[var(--color-workshop-wood)] border-2 border-[var(--color-workshop-copper)] rounded-sm transform -rotate-12" />
        <div ref={smokeRef} className="absolute top-[-10px] left-[60px] w-10 h-10">
          <div className="absolute w-8 h-8 rounded-full bg-[var(--color-workshop-brass)] mix-blend-screen blur-md" />
          <div className="absolute w-6 h-6 rounded-full bg-[var(--color-workshop-brass)] mix-blend-screen blur-md" />
          <div className="absolute w-10 h-10 rounded-full bg-[var(--color-workshop-brass)] mix-blend-screen blur-md" />
        </div>
      </div>

    </div>
  );
}
