'use client';

export default function BackgroundLayer() {
  return (
    <div className="absolute inset-0 w-full h-full z-10 pointer-events-none overflow-hidden">
      {/* Heavy stone/metal back wall */}
      <div className="absolute inset-0 bg-[#080605] opacity-80" />
      
      {/* Giant Arched Windows (Left & Right) */}
      <svg viewBox="0 0 1000 500" className="absolute top-[-10%] w-[120%] h-[120%] -left-[10%] opacity-20">
        <path d="M 200 500 L 200 200 Q 300 100 400 200 L 400 500 Z" fill="none" stroke="var(--color-workshop-brass)" strokeWidth="4" />
        <path d="M 600 500 L 600 200 Q 700 100 800 200 L 800 500 Z" fill="none" stroke="var(--color-workshop-brass)" strokeWidth="4" />
        {/* Volumetric Light Beams */}
        <path d="M 300 100 L 100 600 L 400 600 Z" fill="#fcdba1" opacity="0.05" style={{ filter: 'blur(30px)' }} />
        <path d="M 700 100 L 500 600 L 800 600 Z" fill="#fcdba1" opacity="0.05" style={{ filter: 'blur(30px)' }} />
      </svg>

      {/* Massive Background Exhaust Fan */}
      <div className="absolute top-[20%] left-[50%] w-64 h-64 -translate-x-1/2 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
          <circle cx="50" cy="50" r="48" fill="none" stroke="var(--color-workshop-copper)" strokeWidth="2" />
          {[0, 60, 120, 180, 240, 300].map(angle => (
            <path key={angle} d="M 50 50 L 50 10 Q 70 20 50 50" fill="var(--color-workshop-copper)" transform={`rotate(${angle} 50 50)`} />
          ))}
          <circle cx="50" cy="50" r="10" fill="var(--color-workshop-brass)" />
        </svg>
      </div>

      {/* Far Background Pipes */}
      <div className="absolute top-0 right-1/4 w-32 h-full border-l-8 border-r-8 border-[#1f1610] opacity-30" />
      <div className="absolute top-1/4 left-1/3 w-full h-16 border-t-8 border-b-8 border-[#1f1610] opacity-30" />
    </div>
  );
}
