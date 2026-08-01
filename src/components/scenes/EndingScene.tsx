'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGlobalState } from '@/store/useGlobalState';

export default function EndingPanel() {
  const { showEnding } = useGlobalState();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showEnding && containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 3,
        ease: 'power2.inOut',
        delay: 1.5, // Wait for power-up sequence to peak
      });
    }
  }, [showEnding]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100000] flex items-center justify-center opacity-0 pointer-events-none"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(5,4,3,0.7) 0%, rgba(5,4,3,0.95) 100%)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="text-center p-12 border border-[#e8a84a]/20 rounded-2xl bg-[#0a0806]/50 shadow-[0_0_100px_rgba(232,168,74,0.1)] backdrop-blur-md">
        <h1 className="text-5xl md:text-7xl font-serif text-[#e8c07a] mb-6 tracking-wider" style={{ textShadow: '0 0 30px rgba(232,192,122,0.3)' }}>
          The Workshop Lives Again
        </h1>
        <p className="text-xl text-[#b58953] mb-12 uppercase tracking-[0.2em]">
          Thank you for visiting
        </p>
        
        <div className="flex gap-8 justify-center items-center">
          <a 
            href="#" 
            className="text-[#e8a84a] hover:text-white transition-colors duration-300 flex items-center gap-2 border border-[#e8a84a]/30 px-6 py-3 rounded-full hover:bg-[#e8a84a]/10 cursor-pointer"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            GitHub
          </a>
          <a 
            href="#" 
            className="text-[#e8a84a] hover:text-white transition-colors duration-300 flex items-center gap-2 border border-[#e8a84a]/30 px-6 py-3 rounded-full hover:bg-[#e8a84a]/10 cursor-pointer"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            LinkedIn
          </a>
        </div>
        
        <div className="mt-12 text-[#634421] text-sm uppercase tracking-widest">
          Made with Next.js, GSAP & Framer Motion
        </div>
      </div>
    </div>
  );
}
