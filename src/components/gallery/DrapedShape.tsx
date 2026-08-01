import { memo } from 'react';

interface DrapedShapeProps {
  className?: string;
  showTag?: boolean;
}

const DrapedShape = memo(function DrapedShape({ className = '', showTag = true }: DrapedShapeProps) {
  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
       {/* Ambient pulsing glow beneath the drape */}
       <div className="absolute inset-0 bg-[#fcdba1] blur-[80px] rounded-full scale-75 opacity-10 animate-[pulse_3s_ease-in-out_infinite]" />
       
       <svg width="400" height="500" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 drop-shadow-[0_0_40px_rgba(232,168,74,0.3)]">
         {/* The cloth drape outline */}
         <path 
           d="M200 40 C 260 90, 360 220, 340 460 C 270 480, 130 480, 60 460 C 40 220, 140 90, 200 40 Z" 
           fill="#0a0806" 
           stroke="#b58953" 
           strokeWidth="2" 
           strokeDasharray="6 6" 
         />
         {/* Cloth folds/creases */}
         <path d="M200 40 C 200 150, 130 280, 130 460" stroke="#b58953" strokeWidth="1" strokeOpacity="0.4" />
         <path d="M200 40 C 200 150, 270 280, 270 460" stroke="#b58953" strokeWidth="1" strokeOpacity="0.4" />
         <path d="M150 150 C 180 200, 220 200, 250 150" stroke="#b58953" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="2 4" />
         
         {/* The Tag catching light */}
         {showTag && (
           <g className="animate-[pulse_3s_ease-in-out_infinite]" style={{ animationDelay: '1.5s' /* Peek brightness when glow is high */ }}>
             <path d="M230 220 L 250 210 L 250 250 L 230 260 Z" fill="#b58953" fillOpacity="0.2" stroke="#b58953" strokeWidth="1" />
             <circle cx="240" cy="220" r="2" fill="#0a0806" />
             <text x="240" y="240" fill="#fcdba1" fontSize="10" fontFamily="serif" textAnchor="middle" transform="rotate(-15 240 240)" className="tracking-widest opacity-80 uppercase" style={{ filter: 'drop-shadow(0px 0px 4px rgba(252,219,161,0.8))' }}>NEXT</text>
           </g>
         )}
       </svg>
    </div>
  );
});

export default DrapedShape;
