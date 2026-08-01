import { memo } from 'react';
import { useGlobalState } from '@/store/useGlobalState';

export type InventionType = 'eye' | 'brain' | 'automaton';

export interface InventionFrameProps {
  id: string;
  title: string;
  type: InventionType;
}

const InventionFrame = memo(function InventionFrame({ id, title, type }: InventionFrameProps) {
  const { setActiveInvention } = useGlobalState();
  
  return (
    <div 
      className={`invention-frame ${id} flex flex-col items-center justify-center cursor-pointer opacity-80 hover:opacity-100 transition-opacity duration-500`}
      onClick={() => setActiveInvention({ id, title, type })}
      style={{ width: '800px', height: '1000px' }}
    >
      <div className="relative w-[500px] h-[700px] border-4 border-[#b58953] bg-[#1a1410] rounded-lg shadow-[0_0_30px_rgba(181,137,83,0.4)] overflow-hidden flex items-center justify-center pointer-events-none">
        <div className="case-rim-light absolute inset-0 opacity-0 transition-opacity duration-500" style={{ boxShadow: 'inset 0 0 40px #b58953' }} />
        
        <div className="z-10 w-3/4 h-3/4 case-invention opacity-0 scale-95 transition-all duration-700 pointer-events-none flex items-center justify-center">
           {type === 'eye' && (
             <svg viewBox="-50 -50 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(232,168,74,0.3)]">
               <circle className="eye-lens" cx="0" cy="0" r="30" fill="none" stroke="#b58953" strokeWidth="4" />
               <circle cx="0" cy="0" r="10" fill="#fcdba1" />
               <line x1="-30" y1="0" x2="-45" y2="0" stroke="#b58953" strokeWidth="4" />
               <line x1="30" y1="0" x2="45" y2="0" stroke="#b58953" strokeWidth="4" />
             </svg>
           )}
           {type === 'brain' && (
             <svg viewBox="-50 -50 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(232,168,74,0.3)]">
               <rect x="-25" y="-35" width="50" height="70" rx="15" fill="none" stroke="#b58953" strokeWidth="4" />
               <circle className="brain-node" cx="-10" cy="-15" r="4" fill="#634421" />
               <circle className="brain-node" cx="10" cy="-15" r="4" fill="#634421" />
               <circle className="brain-node" cx="-10" cy="15" r="4" fill="#634421" />
               <circle className="brain-node" cx="10" cy="15" r="4" fill="#634421" />
               <path d="M 0 -35 L 0 35 M -25 0 L 25 0" stroke="#b58953" strokeWidth="2" strokeDasharray="4 2" />
             </svg>
           )}
           {type === 'automaton' && (
             <svg viewBox="-50 -50 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(232,168,74,0.3)]">
               <rect x="-20" y="-10" width="40" height="50" fill="none" stroke="#b58953" strokeWidth="4" />
               <circle cx="0" cy="-30" r="15" fill="none" stroke="#b58953" strokeWidth="4" />
               <line className="auto-arm" x1="20" y1="0" x2="40" y2="20" stroke="#fcdba1" strokeWidth="4" style={{ transformOrigin: '20px 0px' }} />
               <line x1="-20" y1="0" x2="-40" y2="20" stroke="#b58953" strokeWidth="4" />
             </svg>
           )}
        </div>
      </div>
      
      <div className="mt-12 text-center pointer-events-none">
        <h3 className="text-4xl md:text-5xl font-serif text-glow text-[#e8c07a] opacity-0 frame-title transition-opacity duration-500 delay-100">{title}</h3>
      </div>
    </div>
  );
});

export default InventionFrame;
