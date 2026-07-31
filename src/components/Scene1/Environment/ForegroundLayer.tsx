'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function ForegroundLayer() {
  const foregroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Flickering desk lamp
      gsap.to('.foreground-lamp-light', {
        opacity: "random(0.3, 0.8)",
        duration: "random(0.1, 0.3)",
        repeat: -1,
        repeatRefresh: true
      });
    }, foregroundRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={foregroundRef} className="absolute inset-0 w-full h-full z-30 pointer-events-none overflow-visible">
      {/* Heavy Wooden Workbench (Bottom Left) */}
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[30%] bg-[#1a110a] rounded-tr-3xl border-r-8 border-t-8 border-[#2d1f14] shadow-2xl">
        {/* Blueprints scattered on desk */}
        <div className="absolute top-4 right-10 w-48 h-32 bg-[#1b2b3a] border border-[#2a455a] transform rotate-12 opacity-80 shadow-lg">
          <svg viewBox="0 0 100 100" className="w-full h-full opacity-50">
            <line x1="10" y1="50" x2="90" y2="50" stroke="#4a7b9e" strokeWidth="1" />
            <line x1="50" y1="10" x2="50" y2="90" stroke="#4a7b9e" strokeWidth="1" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="#4a7b9e" strokeWidth="2" />
          </svg>
        </div>
        
        {/* Desk Lamp */}
        <div className="absolute top-[-40px] left-[20%] w-16 h-16">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M 50 100 L 50 50 L 80 20 L 60 10 Z" fill="var(--color-workshop-brass)" />
            <path d="M 50 10 L 90 30 L 70 40 Z" fill="var(--color-workshop-copper)" />
            <circle cx="70" cy="30" r="10" fill="#fcdba1" className="foreground-lamp-light" filter="blur(4px)" />
          </svg>
        </div>
      </div>

      {/* Storage Shelves (Right side) */}
      <div className="absolute top-[20%] right-[-5%] w-[20%] h-[60%] bg-[#150e09] border-l-8 border-[#2d1f14] flex flex-col justify-evenly">
        {/* Shelf 1 */}
        <div className="w-full h-4 bg-[#2d1f14] shadow-md relative">
          <div className="absolute bottom-4 left-4 w-12 h-16 bg-[var(--color-workshop-brass)] rounded-t-md opacity-70" />
          <div className="absolute bottom-4 left-20 w-8 h-10 bg-[var(--color-workshop-copper)] rounded-sm opacity-80" />
        </div>
        {/* Shelf 2 */}
        <div className="w-full h-4 bg-[#2d1f14] shadow-md relative">
          {/* Half-finished mechanism */}
          <svg viewBox="0 0 50 50" className="absolute bottom-4 left-10 w-16 h-16 opacity-80">
            <circle cx="25" cy="25" r="20" fill="none" stroke="var(--color-workshop-brass)" strokeWidth="4" strokeDasharray="5 5" />
            <rect x="20" y="10" width="10" height="30" fill="var(--color-workshop-copper)" />
          </svg>
        </div>
        {/* Shelf 3 */}
        <div className="w-full h-4 bg-[#2d1f14] shadow-md relative">
           <div className="absolute bottom-4 right-10 w-24 h-8 bg-[#1f1610] rounded-sm" />
        </div>
      </div>
    </div>
  );
}
