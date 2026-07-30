'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Blueprint() {
  const paperRef = useRef<HTMLDivElement>(null);
  const cornerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Subtle breeze lifting the blueprint corner
    if (cornerRef.current) {
      gsap.to(cornerRef.current, {
        rotationX: -15,
        rotationY: -10,
        z: 10,
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        transformOrigin: "bottom right"
      });
    }

    // Interactive hover effect
    const paper = paperRef.current;
    if (!paper) return;

    const handleMouseEnter = () => {
      gsap.to(paper, { y: -5, rotationZ: -2, duration: 0.5, ease: "power2.out" });
    };
    
    const handleMouseLeave = () => {
      gsap.to(paper, { y: 0, rotationZ: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
    };

    paper.addEventListener('mouseenter', handleMouseEnter);
    paper.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      paper.removeEventListener('mouseenter', handleMouseEnter);
      paper.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={paperRef}
      className="absolute bottom-[10%] left-[20%] w-[300px] h-[200px] z-30 transform -rotate-3 transition-transform cursor-pointer"
      style={{ perspective: '800px' }}
    >
      <div className="relative w-full h-full bg-[#1e2a3b] border border-[#3b5374] shadow-2xl rounded-sm overflow-hidden p-4">
        {/* Blueprint Grid */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Blueprint Drawings */}
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-60 text-white">
          <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="4 2" />
          <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="2" fill="none" />
          <line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="1" />
          <line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" strokeWidth="1" />
          
          <rect x="35" y="35" width="30" height="30" stroke="currentColor" strokeWidth="1" fill="none" transform="rotate(45 50 50)" />
        </svg>

        {/* Lifting Corner (Top Left) */}
        <div 
          ref={cornerRef}
          className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-[#2a3c53] to-transparent pointer-events-none origin-bottom-right"
          style={{ transformStyle: 'preserve-3d' }}
        >
           {/* Fold shadow */}
           <div className="absolute inset-0 shadow-[-5px_-5px_10px_rgba(0,0,0,0.5)] opacity-50" />
        </div>
      </div>
    </div>
  );
}
