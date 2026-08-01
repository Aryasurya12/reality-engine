'use client';

import { motion } from 'framer-motion';

export default function LaboratoryForeground() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-visible">
      
      {/* Heavy Workbench (Bottom Left) */}
      <div className="absolute bottom-[-15%] left-[-10%] w-[50%] h-[40%] bg-[#110b07] rounded-tr-3xl border-r-[12px] border-t-[12px] border-[#22170f] shadow-2xl flex items-start justify-end pr-10 pt-10 pointer-events-auto">
        
        {/* Interaction Target: Hover Blueprint */}
        <motion.div 
          className="relative w-64 h-48 bg-[#182a3a] border-2 border-[#2a455a] transform -rotate-6 shadow-xl cursor-pointer"
          whileHover={{ rotate: -2, y: -5, boxShadow: "0px 10px 30px rgba(0,0,0,0.5)" }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Blueprint Drawing */}
          <svg viewBox="0 0 100 100" className="w-full h-full opacity-60">
             <circle cx="50" cy="50" r="30" fill="none" stroke="#4a7b9e" strokeWidth="2" strokeDasharray="4 2" />
             <line x1="20" y1="50" x2="80" y2="50" stroke="#4a7b9e" strokeWidth="1" />
             <line x1="50" y1="20" x2="50" y2="80" stroke="#4a7b9e" strokeWidth="1" />
             <rect x="35" y="35" width="30" height="30" fill="none" stroke="#4a7b9e" strokeWidth="1" />
          </svg>
        </motion.div>

        {/* Scattered Tools / Bolts */}
        <div className="absolute top-[40%] left-[30%] w-4 h-4 bg-zinc-600 rounded-full shadow-md" />
        <div className="absolute top-[45%] left-[35%] w-3 h-3 bg-zinc-500 rounded-full shadow-md" />
        <div className="absolute top-[38%] left-[38%] w-5 h-2 bg-zinc-700 shadow-md transform rotate-45" />
      </div>

      {/* Hanging Chain (Right Side) */}
      <motion.div 
        className="absolute top-[-5%] right-[15%] w-8 h-[60%] flex flex-col items-center origin-top pointer-events-auto cursor-pointer"
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ rotate: [-5, 5, -3, 3, 0], transition: { duration: 2 } }}
      >
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className={`w-4 h-8 border-4 border-[#1a120c] rounded-full -mt-2 ${i % 2 === 0 ? 'bg-[#0a0705]' : 'bg-transparent'}`} />
        ))}
        {/* Hook */}
        <svg viewBox="0 0 50 100" className="w-12 h-24 -mt-2">
          <path d="M 25 0 L 25 30 Q 50 50 25 90 Q 0 80 10 60" fill="none" stroke="#1a120c" strokeWidth="8" strokeLinecap="round" />
        </svg>
      </motion.div>

      {/* Foreground Pipes (Right Edge, completely blocking edge to create framing) */}
      <div className="absolute top-0 right-[-5%] w-[15%] h-[120%] bg-gradient-to-l from-[#050302] to-[#110b07] border-l-[16px] border-[#1a120c] shadow-2xl" />

    </div>
  );
}
