import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalState } from '@/store/useGlobalState';

const INVENTION_DATA = {
  eye: {
    title: 'The Mechanical Eye',
    image: '/images/invention_eye.png',
    lore: 'Constructed in the early days of the workshop, this optical array was designed to see beyond the visible spectrum. Its interlocking brass irises and multi-focal crystal lenses can track microscopic fractures in reality itself. It is said that the inventor spent three years calibrating its focus ring, only to realize it was staring back at him.'
  },
  brain: {
    title: 'The Reasoning Engine',
    image: '/images/invention_brain.png',
    lore: 'A differential logic engine capable of unspooling paradoxes. Housed in a pressurized copper chassis, its vacuum tubes process thousands of philosophical queries per second. It was originally built to calculate the exact weight of a human soul, though its final output was merely a highly complicated question.'
  },
  automaton: {
    title: 'The Automaton',
    image: '/images/invention_automaton.png',
    lore: 'The crowning achievement of the workshop. A fully articulated, self-winding companion constructed from salvaged locomotive parts and precision clockwork. While its combat capabilities are undeniable, it was primarily programmed to play the cello and water the greenhouse plants.'
  }
};

const InventionInterior = memo(function InventionInterior() {
  const { activeInvention, setActiveInvention } = useGlobalState();
  
  if (!activeInvention) return null;

  const data = INVENTION_DATA[activeInvention.type];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, filter: 'blur(10px)' }}
        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
        className="fixed inset-0 z-[99999] bg-[#050403] bg-opacity-95 flex items-center justify-center p-12 overflow-hidden"
      >
        <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-12 relative">
          
          {/* Left Column: Lore */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="flex-1 text-left flex flex-col items-start justify-center pr-8 border-r border-[#b58953]/30"
          >
            <h2 className="text-5xl md:text-7xl font-serif text-glow-strong text-[#e8c07a] mb-6">
              {data.title}
            </h2>
            <p className="text-xl md:text-2xl font-serif text-[#b58953] leading-relaxed italic opacity-90 mb-12">
              {data.lore}
            </p>
            
            <button 
              onClick={() => setActiveInvention(null)}
              className="px-8 py-3 border border-[#b58953] text-[#b58953] rounded-full hover:bg-[#b58953] hover:text-[#0a0806] transition-colors cursor-pointer font-serif tracking-wider uppercase"
            >
              Return to Corridor
            </button>
          </motion.div>

          {/* Right Column: Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
            className="flex-1 flex items-center justify-center relative"
          >
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-[#e8c07a] opacity-5 blur-[100px] rounded-full scale-150 animate-pulse" />
            
            <motion.img 
              src={data.image} 
              alt={data.title}
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="w-full h-auto max-h-[80vh] object-contain drop-shadow-[0_0_50px_rgba(232,168,74,0.4)] opacity-90"
            />
          </motion.div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
});

export default InventionInterior;
