import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalState } from '@/store/useGlobalState';

const Hotspot = ({ x, y, label, onHover, onLeave }: { x: number, y: number, label: string, onHover: () => void, onLeave: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div 
      className="absolute flex flex-col items-center justify-center cursor-crosshair z-50"
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
      onMouseEnter={() => { setIsHovered(true); onHover(); }}
      onMouseLeave={() => { setIsHovered(false); onLeave(); }}
    >
      <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#b58953] bg-[#b58953] bg-opacity-10 animate-[spin_4s_linear_infinite] hover:bg-opacity-40 transition-colors" />
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-16 whitespace-nowrap bg-[#0a0806] border border-[#b58953] px-4 py-2 rounded text-[#e8c07a] font-serif shadow-[0_0_15px_rgba(181,137,83,0.3)] pointer-events-none"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const EyeInterior = () => {
  const [activeSpot, setActiveSpot] = useState<string | null>(null);
  return (
    <div className="relative w-[800px] h-[800px]">
      <svg viewBox="-100 -100 200 200" className="w-full h-full drop-shadow-[0_0_40px_rgba(232,168,74,0.4)]">
        <motion.circle 
          cx="0" cy="0" r="60" 
          fill="none" stroke="#b58953" strokeWidth="8" 
          animate={activeSpot === 'lens' ? { strokeWidth: 16, stroke: '#fcdba1', scale: 1.1 } : { strokeWidth: 8, stroke: '#b58953', scale: 1 }}
        />
        <motion.circle 
          cx="0" cy="0" r="20" fill="#fcdba1" 
          animate={activeSpot === 'pupil' ? { scale: 0.3, fill: '#ffffff' } : { scale: 1, fill: '#fcdba1' }}
        />
        <line x1="-60" y1="0" x2="-90" y2="0" stroke="#b58953" strokeWidth="8" />
        <line x1="60" y1="0" x2="90" y2="0" stroke="#b58953" strokeWidth="8" />
      </svg>
      <Hotspot x={50} y={15} label="Focus Ring Calibration" onHover={() => setActiveSpot('lens')} onLeave={() => setActiveSpot(null)} />
      <Hotspot x={50} y={50} label="Iris Aperture Control" onHover={() => setActiveSpot('pupil')} onLeave={() => setActiveSpot(null)} />
    </div>
  );
};

const BrainInterior = () => {
  const [activeSpot, setActiveSpot] = useState<string | null>(null);
  return (
    <div className="relative w-[800px] h-[800px]">
      <svg viewBox="-100 -100 200 200" className="w-full h-full drop-shadow-[0_0_40px_rgba(232,168,74,0.4)]">
        <rect x="-50" y="-70" width="100" height="140" rx="30" fill="none" stroke="#b58953" strokeWidth="8" />
        <motion.circle cx="-20" cy="-30" r="8" fill="#634421" animate={activeSpot === 'logic' ? { fill: '#ffffff', scale: 1.5 } : {}} />
        <motion.circle cx="20" cy="-30" r="8" fill="#634421" animate={activeSpot === 'logic' ? { fill: '#ffffff', scale: 1.5 } : {}} />
        <motion.circle cx="-20" cy="30" r="8" fill="#634421" animate={activeSpot === 'memory' ? { fill: '#ffffff', scale: 1.5 } : {}} />
        <motion.circle cx="20" cy="30" r="8" fill="#634421" animate={activeSpot === 'memory' ? { fill: '#ffffff', scale: 1.5 } : {}} />
        <path d="M 0 -70 L 0 70 M -50 0 L 50 0" stroke="#b58953" strokeWidth="4" strokeDasharray="8 4" />
      </svg>
      <Hotspot x={50} y={20} label="Logic Processor" onHover={() => setActiveSpot('logic')} onLeave={() => setActiveSpot(null)} />
      <Hotspot x={50} y={80} label="Memory Core" onHover={() => setActiveSpot('memory')} onLeave={() => setActiveSpot(null)} />
    </div>
  );
};

const AutomatonInterior = () => {
  const [activeSpot, setActiveSpot] = useState<string | null>(null);
  return (
    <div className="relative w-[800px] h-[800px]">
      <svg viewBox="-100 -100 200 200" className="w-full h-full drop-shadow-[0_0_40px_rgba(232,168,74,0.4)]">
        <rect x="-40" y="-20" width="80" height="100" fill="none" stroke="#b58953" strokeWidth="8" />
        <motion.circle 
          cx="0" cy="-60" r="30" fill="none" stroke="#b58953" strokeWidth="8" 
          animate={activeSpot === 'head' ? { y: -10, stroke: '#fcdba1' } : { y: 0 }}
        />
        <motion.line 
          x1="40" y1="0" x2="80" y2="40" stroke="#fcdba1" strokeWidth="8" style={{ transformOrigin: '40px 0px' }}
          animate={activeSpot === 'arm' ? { rotation: -30 } : { rotation: 0 }}
        />
        <line x1="-40" y1="0" x2="-80" y2="40" stroke="#b58953" strokeWidth="8" />
      </svg>
      <Hotspot x={50} y={15} label="Optical Sensors" onHover={() => setActiveSpot('head')} onLeave={() => setActiveSpot(null)} />
      <Hotspot x={85} y={70} label="Actuator Joint" onHover={() => setActiveSpot('arm')} onLeave={() => setActiveSpot(null)} />
    </div>
  );
};


const InventionInterior = memo(function InventionInterior() {
  const { activeInvention, setActiveInvention } = useGlobalState();
  
  return (
    <AnimatePresence>
      {activeInvention && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }} // power3.inOut equivalent
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0a0806] bg-opacity-100"
        >
          {activeInvention.type === 'eye' && <EyeInterior />}
          {activeInvention.type === 'brain' && <BrainInterior />}
          {activeInvention.type === 'automaton' && <AutomatonInterior />}
          
          <div className="absolute top-12 text-center pointer-events-none">
             <h2 className="text-5xl font-serif text-glow-strong text-[#e8c07a] tracking-widest uppercase">
               {activeInvention.title}
             </h2>
          </div>
          
          <button 
            onClick={() => setActiveInvention(null)}
            className="absolute bottom-12 px-8 py-3 border border-[#b58953] text-[#b58953] rounded-full hover:bg-[#b58953] hover:text-[#0a0806] transition-colors cursor-pointer font-serif tracking-wider"
          >
            Leave Interior
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default InventionInterior;
