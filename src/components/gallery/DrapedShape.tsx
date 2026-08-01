import { memo } from 'react';

interface DrapedShapeProps {
  className?: string;
  showTag?: boolean;
}

const DrapedShape = memo(function DrapedShape({ className = '', showTag = true }: DrapedShapeProps) {
  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
       {/* Ground drop shadow for realistic contact */}
       <div className="absolute bottom-0 w-[260px] h-[30px] bg-black/80 blur-[15px] rounded-[100%] translate-y-4" />
       
       {/* Ambient pulsing glow beneath the drape */}
       <div className="drape-pulse absolute inset-0 bg-[#fcdba1] blur-[80px] rounded-full scale-75 opacity-10 animate-[pulse_3s_ease-in-out_infinite]" />
       
       <svg width="400" height="500" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 drop-shadow-[0_0_30px_rgba(232,168,74,0.1)]">
         <defs>
           <linearGradient id="fold1" x1="200" y1="40" x2="340" y2="460" gradientUnits="userSpaceOnUse">
             <stop offset="0%" stopColor="#1a1510" />
             <stop offset="100%" stopColor="#080605" />
           </linearGradient>
           <linearGradient id="fold2" x1="200" y1="40" x2="130" y2="460" gradientUnits="userSpaceOnUse">
             <stop offset="0%" stopColor="#251f18" />
             <stop offset="60%" stopColor="#100c0a" />
             <stop offset="100%" stopColor="#050403" />
           </linearGradient>
           <linearGradient id="fold3" x1="160" y1="120" x2="60" y2="460" gradientUnits="userSpaceOnUse">
             <stop offset="0%" stopColor="#1e1814" />
             <stop offset="100%" stopColor="#0a0806" />
           </linearGradient>
           <linearGradient id="fold4" x1="240" y1="100" x2="270" y2="460" gradientUnits="userSpaceOnUse">
             <stop offset="0%" stopColor="#221b15" />
             <stop offset="100%" stopColor="#0a0806" />
           </linearGradient>
         </defs>

         {/* Base Shape / Back Layer */}
         <path 
           d="M200 40 C 260 90, 360 220, 340 460 C 270 480, 130 480, 60 460 C 40 220, 140 90, 200 40 Z" 
           fill="url(#fold1)" 
         />

         {/* Left Drape Fold */}
         <path 
           d="M200 40 C 180 80, 140 160, 60 460 C 130 480, 200 480, 200 460 C 180 300, 190 120, 200 40 Z" 
           fill="url(#fold3)"
         />
         
         {/* Center Prominent Fold */}
         <path 
           d="M200 40 C 210 100, 230 250, 270 460 C 220 470, 170 470, 130 460 C 160 280, 180 150, 200 40 Z" 
           fill="url(#fold2)"
         />

         {/* Right Drape Fold */}
         <path 
           d="M200 40 C 240 120, 280 200, 340 460 C 310 470, 280 470, 270 460 C 270 280, 240 140, 200 40 Z" 
           fill="url(#fold4)"
         />

         {/* Thin Wrinkles and Creases (Subtle Details) */}
         <path d="M190 100 C 160 180, 140 300, 150 460" stroke="#b58953" strokeWidth="1" strokeOpacity="0.1" fill="none" />
         <path d="M220 120 C 240 200, 250 320, 240 460" stroke="#b58953" strokeWidth="1" strokeOpacity="0.1" fill="none" />
         <path d="M140 250 C 160 300, 180 350, 170 460" stroke="#000000" strokeWidth="2" strokeOpacity="0.4" fill="none" style={{ filter: 'blur(2px)' }} />
         <path d="M260 280 C 240 340, 230 400, 250 460" stroke="#000000" strokeWidth="2" strokeOpacity="0.4" fill="none" style={{ filter: 'blur(2px)' }} />

         {/* Original dotted outline to maintain the blueprint style integration */}
         <path 
           d="M200 40 C 260 90, 360 220, 340 460 C 270 480, 130 480, 60 460 C 40 220, 140 90, 200 40 Z" 
           stroke="#b58953" 
           strokeWidth="1.5" 
           strokeDasharray="4 6" 
           strokeOpacity="0.6"
           fill="none"
         />

         {/* The Tag catching light */}
         {showTag && (
           <g className="animate-[pulse_3s_ease-in-out_infinite]" style={{ animationDelay: '1.5s' /* Peek brightness when glow is high */ }}>
             <path d="M230 220 L 250 210 L 250 250 L 230 260 Z" fill="#b58953" fillOpacity="0.3" stroke="#b58953" strokeWidth="1" />
             <circle cx="240" cy="220" r="2" fill="#0a0806" />
             <text x="240" y="240" fill="#fcdba1" fontSize="10" fontFamily="serif" textAnchor="middle" transform="rotate(-15 240 240)" className="tracking-widest opacity-80 uppercase" style={{ filter: 'drop-shadow(0px 0px 4px rgba(252,219,161,0.8))' }}>NEXT</text>
           </g>
         )}
       </svg>
    </div>
  );
});

export default DrapedShape;
