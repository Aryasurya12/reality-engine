import { memo } from 'react';
import { motion } from 'framer-motion';

interface HalfInventionProps {
  className?: string;
  isEnding?: boolean;
  showTag?: boolean;
}

const HalfInvention = memo(function HalfInvention({ className = '', isEnding = false, showTag = false }: HalfInventionProps) {
  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* Ground drop shadow for realistic contact */}
      <div className="absolute bottom-[30px] w-[260px] h-[30px] bg-black/80 blur-[15px] rounded-[100%] translate-y-4" />
      
      {/* Ambient pulsing glow beneath the invention (Workbench only) */}
      {!isEnding && (
        <div className="drape-pulse absolute inset-0 bg-[#fcdba1] blur-[80px] rounded-full scale-75 opacity-10 animate-[pulse_3s_ease-in-out_infinite]" />
      )}
      
      {/* The Asset Container */}
      <div className="relative z-10 w-[400px] h-[500px]">
        {/* The generated asset */}
        <img 
          src="/assets/half-invention.png" 
          alt="Half-finished steampunk automaton" 
          className={`w-full h-full object-contain ${!isEnding ? 'opacity-70' : 'opacity-100'} transition-opacity duration-1000`} 
        />
        
        {/* Obscuring Mask for the unfinished half (assuming left half is unfinished) */}
        {/* We use a gradient mask that covers the left side */}
        <motion.div 
          initial={isEnding ? { opacity: 1 } : { opacity: 0.9 }}
          animate={isEnding ? { opacity: 0 } : { opacity: 0.9 }}
          transition={isEnding ? { duration: 1.5, ease: "easeOut", delay: 0.5 } : {}}
          className="absolute inset-0 bg-gradient-to-r from-[#050403] via-[#050403]/80 to-transparent z-20 pointer-events-none"
        />

        {/* Glow dots ignition (Ending only) */}
        {isEnding && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.4, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut", delay: 1 }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,_rgba(252,219,161,0.5)_0%,_transparent_20%)] pointer-events-none mix-blend-screen"
          />
        )}
        
        {/* The Tag catching light */}
        {showTag && (
          <svg className="absolute inset-0 z-30 pointer-events-none" width="400" height="500" viewBox="0 0 400 500">
            <g className="animate-[pulse_3s_ease-in-out_infinite]" style={{ animationDelay: '1.5s' }}>
              <path d="M230 220 L 250 210 L 250 250 L 230 260 Z" fill="#b58953" fillOpacity="0.3" stroke="#b58953" strokeWidth="1" />
              <circle cx="240" cy="220" r="2" fill="#0a0806" />
              <text x="240" y="240" fill="#fcdba1" fontSize="10" fontFamily="serif" textAnchor="middle" transform="rotate(-15 240 240)" className="tracking-widest opacity-80 uppercase" style={{ filter: 'drop-shadow(0px 0px 4px rgba(252,219,161,0.8))' }}>NEXT</text>
            </g>
          </svg>
        )}
      </div>
    </div>
  );
});

export default HalfInvention;
