import { memo, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';

const TwistEndingScene = memo(function TwistEndingScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const drapeRef = useRef<SVGPathElement>(null);
  const [showCredits, setShowCredits] = useState(false);

  useEffect(() => {
    const handleCredits = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      setShowCredits(customEvent.detail);
    };
    window.addEventListener('showTwistCredits', handleCredits);
    return () => window.removeEventListener('showTwistCredits', handleCredits);
  }, []);

  return (
    <div ref={containerRef} className="absolute top-1/2 left-1/2 w-[1200px] h-[800px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
      
      {/* Blueprint Panel Floating beside */}
      <div className="absolute right-[800px] top-[200px] w-[300px] h-[400px] border border-[#b58953] bg-[#0a0806] bg-opacity-80 p-6 opacity-30 rotate-y-12">
         <h4 className="text-[#e8c07a] font-serif text-xl border-b border-[#b58953] pb-2 mb-4">Project: Genesis</h4>
         <ul className="text-[#b58953] font-serif space-y-4">
           <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#fcdba1]" /> Vision</li>
           <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#fcdba1]" /> Logic</li>
           <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#fcdba1]" /> Build</li>
         </ul>
      </div>

      {/* The Draped Shape */}
      <div className="relative w-[600px] h-[500px] flex items-center justify-center ending-centerpiece">
        {/* Faint glow beneath */}
        <div className="absolute inset-0 bg-[#fcdba1] opacity-10 blur-[50px] rounded-full" />
        
        {/* Title Card hidden underneath */}
        <div className="absolute inset-0 flex flex-col items-center justify-center title-card opacity-0">
           <h1 className="text-6xl font-serif text-glow-strong text-[#e8c07a]">ARYA</h1>
           <p className="text-xl font-serif text-[#b58953] mt-4 italic">The Workshop's Next Invention</p>
        </div>

        {/* The Cloth Drape (SVG) */}
        <svg viewBox="0 0 600 500" className="absolute inset-0 w-full h-full drape-svg">
          <path 
            ref={drapeRef}
            d="M 100 500 Q 300 0 500 500 Z" 
            fill="url(#drapeGradient)" 
            stroke="#b58953" 
            strokeWidth="2"
          />
          <defs>
            <linearGradient id="drapeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1a1410" />
              <stop offset="100%" stopColor="#050403" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Credits Layer (Framer Motion) */}
      <AnimatePresence>
        {showCredits && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute bottom-10 flex flex-col items-center credits-layer"
          >
            <div className="flex gap-8 mb-6">
              <a href="#" className="text-[#e8c07a] hover:text-white transition-colors uppercase tracking-widest text-sm border border-[#b58953] px-6 py-2 rounded-full hover:bg-[#b58953] hover:text-[#0a0806]">GitHub</a>
              <a href="#" className="text-[#e8c07a] hover:text-white transition-colors uppercase tracking-widest text-sm border border-[#b58953] px-6 py-2 rounded-full hover:bg-[#b58953] hover:text-[#0a0806]">LinkedIn</a>
            </div>
            <div className="flex gap-4">
              <span className="px-3 py-1 border border-[#b58953] text-[#b58953] text-xs rounded-full">Next.js</span>
              <span className="px-3 py-1 border border-[#b58953] text-[#b58953] text-xs rounded-full">GSAP</span>
              <span className="px-3 py-1 border border-[#b58953] text-[#b58953] text-xs rounded-full">Framer Motion</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
});

export default TwistEndingScene;
