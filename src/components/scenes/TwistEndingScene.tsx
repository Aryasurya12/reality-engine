import { memo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TwistEndingScene = memo(function TwistEndingScene() {
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
    <div className="absolute top-1/2 left-1/2 w-[1200px] h-[800px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
      
      {/* Title Card fading in from darkness */}
      <div className="relative flex flex-col items-center justify-center title-card opacity-0 scale-95">
         <div className="absolute inset-0 bg-[#fcdba1] opacity-5 blur-[100px] rounded-full scale-150 animate-[pulse_4s_ease-in-out_infinite]" />
         <h1 className="text-7xl md:text-8xl font-serif text-glow-strong text-[#e8c07a] tracking-widest relative z-10">ARYA</h1>
         <p className="text-2xl font-serif text-[#b58953] mt-6 italic relative z-10">Workshop Lives Again</p>
      </div>
      
      {/* Credits Layer (Framer Motion) */}
      <AnimatePresence>
        {showCredits && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            className="absolute bottom-10 flex flex-col items-center credits-layer"
          >
            <div className="flex gap-8 mb-6">
              <a href="#" className="text-[#e8c07a] hover:text-white transition-colors uppercase tracking-widest text-sm border border-[#b58953] px-6 py-2 rounded-full hover:bg-[#b58953] hover:text-[#0a0806]">GitHub</a>
              <a href="#" className="text-[#e8c07a] hover:text-white transition-colors uppercase tracking-widest text-sm border border-[#b58953] px-6 py-2 rounded-full hover:bg-[#b58953] hover:text-[#0a0806]">LinkedIn</a>
            </div>
            <div className="flex gap-4">
              <span className="px-3 py-1 border border-[#b58953] text-[#b58953] text-xs rounded-full bg-[#1a1410]">React</span>
              <span className="px-3 py-1 border border-[#b58953] text-[#b58953] text-xs rounded-full bg-[#1a1410]">GSAP</span>
              <span className="px-3 py-1 border border-[#b58953] text-[#b58953] text-xs rounded-full bg-[#1a1410]">Framer Motion</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
});

export default TwistEndingScene;
