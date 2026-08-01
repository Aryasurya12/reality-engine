import { memo, useState } from 'react';
import { useGlobalState } from '@/store/useGlobalState';

export type InventionType = 'eye' | 'brain' | 'automaton';

export interface InventionFrameProps {
  id: string;
  title: string;
  type: InventionType;
}

const InventionFrame = memo(function InventionFrame({ id, title, type }: InventionFrameProps) {
  const { setActiveInvention } = useGlobalState();
  const [clicked, setClicked] = useState(false);
  
  const handleClick = () => {
    setClicked(true);
    setActiveInvention({ id, title, type });
  };

  return (
    <div 
      className={`invention-frame ${id} flex flex-col items-center justify-center cursor-pointer transition-opacity duration-500`}
      onClick={handleClick}
      style={{ width: '800px', height: '1000px' }}
    >
      <div className="relative w-[500px] h-[700px] border-4 border-[#b58953] bg-[#0a0806] rounded-lg shadow-[0_0_30px_rgba(181,137,83,0.4)] overflow-hidden flex items-center justify-center pointer-events-none">
        <div className="case-rim-light absolute inset-0 opacity-0 transition-opacity duration-500" style={{ boxShadow: 'inset 0 0 60px #b58953' }} />
        
        <div className="z-10 w-full h-full case-invention flex items-center justify-center pointer-events-none transition-transform duration-500">
           {type === 'eye' && (
             <img src="/images/invention_eye.png?v=3" alt="The Mechanical Eye" className="w-[120%] h-[120%] object-contain drop-shadow-[0_0_30px_rgba(232,168,74,0.6)] brightness-150 contrast-125" />
           )}
           {type === 'brain' && (
             <img src="/images/invention_brain.png?v=3" alt="The Reasoning Engine" className="w-[120%] h-[120%] object-contain drop-shadow-[0_0_30px_rgba(232,168,74,0.6)] brightness-150 contrast-125" />
           )}
           {type === 'automaton' && (
             <img src="/images/invention_automaton.png?v=3" alt="The Automaton" className="w-[120%] h-[120%] object-contain drop-shadow-[0_0_30px_rgba(232,168,74,0.6)] brightness-150 contrast-125" />
           )}
        </div>
      </div>
      
      <div className="mt-12 text-center pointer-events-none flex flex-col items-center">
        <h3 className="text-4xl md:text-5xl font-serif text-glow text-[#e8c07a] frame-title transition-opacity duration-500">{title}</h3>
        {!clicked && (
          <span className="text-[#e8c07a] text-sm tracking-[0.3em] uppercase mt-4 opacity-0 click-hint border border-[#b58953]/30 px-4 py-1 rounded-full bg-[#0a0806]/50 animate-[pulse_2s_ease-in-out_infinite]">
            Click to explore
          </span>
        )}
      </div>
    </div>
  );
});

export default InventionFrame;
