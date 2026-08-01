import { memo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HalfInvention from '../gallery/HalfInvention';
import MedallionLink from '../svg/MedallionLink';

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
    <div className="absolute top-1/2 left-1/2 w-[100vw] h-[100vh] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none overflow-hidden bg-transparent">
      {/* The Climax Payload (Framer Motion) */}
      <AnimatePresence>
        {showCredits && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="relative z-50 flex flex-col items-center justify-center w-full h-full pointer-events-auto"
          >
            {/* The completed invention perfectly centered behind the text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <HalfInvention isEnding={true} className="scale-[1.3] opacity-60 mix-blend-screen" />
            </div>

            {/* Subtle burst overlay */}
            <motion.div 
              initial={{ opacity: 1, scale: 1.5 }}
              animate={{ opacity: 0, scale: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(252,219,161,0.15)_0%,_transparent_50%)] pointer-events-none z-10"
            />
            
            <div className="flex flex-col items-center text-center px-4 z-20 mt-10 w-full max-w-5xl mx-auto">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-glow-strong text-[#e8c07a] tracking-widest leading-tight drop-shadow-[0_0_40px_rgba(232,192,122,1)] drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] px-4">
                Workshop Lives Again
              </h1>
              
              <p className="text-xl md:text-2xl font-serif text-[#b58953] mt-8 max-w-2xl italic tracking-wide drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] bg-[#050403]/40 px-6 py-2 rounded-full backdrop-blur-sm border border-[#b58953]/20">
                "Every invention in this workshop began the same way — as one idea in the dark."
              </p>
            </div>
            
            <div className="flex gap-12 mt-12 z-20 bg-[#050403]/40 px-8 py-4 rounded-full backdrop-blur-sm border border-[#b58953]/20">
              <MedallionLink 
                href="https://github.com/Aryasurya12" 
                icon="github" 
                label="GitHub" 
                delay={0.5} 
              />
              <MedallionLink 
                href="https://www.linkedin.com/in/aryasurya12/" 
                icon="linkedin" 
                label="LinkedIn" 
                delay={0.7} 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default TwistEndingScene;
