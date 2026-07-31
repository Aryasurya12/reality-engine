'use client';

export default function MechanicalCrank() {
  return (
    <div className="mechanical-crank absolute top-[50%] right-[25%] w-32 h-32 z-50 opacity-0 transform-gpu">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl overflow-visible">
        {/* Wall Mount */}
        <circle cx="50" cy="50" r="40" fill="#0c0a08" stroke="var(--color-workshop-brass)" strokeWidth="6" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="#1f1814" strokeWidth="4" strokeDasharray="5 5" />
        
        {/* The Rotatable Crank Handle */}
        <g style={{ transformOrigin: "50% 50%" }} className="crank-arm">
          {/* Main Arm */}
          <rect x="40" y="10" width="20" height="40" rx="5" fill="#14100c" stroke="var(--color-workshop-copper)" strokeWidth="3" />
          {/* Center Bolt */}
          <circle cx="50" cy="50" r="15" fill="var(--color-workshop-brass)" />
          {/* Handle Grip */}
          <rect x="35" y="0" width="30" height="15" rx="5" fill="var(--color-workshop-wood)" stroke="var(--color-workshop-brass)" strokeWidth="2" />
        </g>

        {/* Dynamic Progress Indicator (Pressure Steam Ring) */}
        <circle 
          cx="50" cy="50" r="45" 
          fill="none" 
          stroke="var(--color-workshop-copper)" 
          strokeWidth="3" 
          strokeDasharray="283"
          strokeDashoffset="283"
          className="crank-ring opacity-80"
        />
      </svg>
    </div>
  );
}
