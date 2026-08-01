import { useEffect, useRef, memo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import InventionFrame from '../gallery/InventionFrame';
import InventionInterior from '../gallery/InventionInterior';
import TwistEndingScene from './TwistEndingScene';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const SplitText = ({ text, className, lineId }: { text: string; className?: string; lineId: string }) => {
  return (
    <span className={className} aria-label={text} id={lineId}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className={`inline-block letter-${lineId} relative gpu-layer origin-center opacity-0 transform translate-y-4`}
          aria-hidden="true"
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

const CorridorScene = memo(function CorridorScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRigRef = useRef<HTMLDivElement>(null);
  const wallLeftRef = useRef<HTMLDivElement>(null);
  const wallRightRef = useRef<HTMLDivElement>(null);
  const floorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !cameraRigRef.current) return;
    
    let ctx = gsap.context(() => {
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        }
      });

      // 1. Fade out the whiteout from HeroScene (starts at Z=0)
      masterTl.to('.hallway-bg-fade', { opacity: 1, duration: 0.05, ease: 'none' }, 0);

      // 2. Animate the Intro Text (Z = 0 to 1000)
      const lines = ['line1', 'line2', 'line3'];
      lines.forEach((line, index) => {
        const letters = `.letter-${line}`;
        const startTime = 0.02 + (index * 0.02); 
        
        masterTl.to(letters, {
          y: 0,
          opacity: 1,
          stagger: 0.005,
          duration: 0.01,
          ease: 'power2.out',
        }, startTime);
        
        masterTl.to(letters, {
          x: () => (Math.random() - 0.5) * 300,
          y: () => (Math.random() - 0.5) * 300 - 100, 
          rotation: () => (Math.random() - 0.5) * 180,
          opacity: 0,
          scale: 0.2,
          stagger: 0.002,
          duration: 0.02,
          ease: 'power1.inOut',
          filter: 'blur(4px)',
          display: 'none',
        }, startTime + 0.03);
      });

      // 3. Drive the camera forward through the 3D tunnel (0% to 90% scroll)
      // We reduce the end trigger so we arrive faster.
      masterTl.to(cameraRigRef.current, {
        z: 9500, // Move world towards camera
        ease: 'none',
      }, 0); 
      
      // Moving flashlight effect on walls and floor
      // As camera moves to Z=9500, the light position on the walls (X-axis) and floor (Y-axis) moves 9500px
      masterTl.to(wallLeftRef.current, { '--light-x': '9500px', ease: 'none' }, 0);
      masterTl.to(wallRightRef.current, { '--light-x': '-9500px', ease: 'none' }, 0); // Right wall origin is right, so negative X goes deeper
      masterTl.to(floorRef.current, { '--light-y': '9500px', ease: 'none' }, 0);
      
      // 3.5 The Workbench Bridge (80% to 90% scroll)
      masterTl.addLabel('workbench', 0.8);
      masterTl.to('.workbench-scene', { opacity: 1, duration: 0.05, ease: 'power1.inOut' }, 'workbench');
      
      // Blueprint drift
      const blueprints = gsap.utils.toArray('.blueprint');
      blueprints.forEach((bp: any, i) => {
        masterTl.to(bp, {
          y: (Math.random() - 0.5) * 400,
          x: (Math.random() - 0.5) * 400,
          rotation: '+=30',
          duration: 0.1,
          ease: 'none'
        }, 'workbench');
      });

      // 4. The Twist Ending Sequence (90% to 100% scroll)
      masterTl.addLabel('chamberArrival', 0.9);
      
      // Fade out corridor walls into darkness
      masterTl.to([wallLeftRef.current, wallRightRef.current, floorRef.current], { opacity: 0, duration: 0.05, ease: 'power2.out' }, 'chamberArrival');
      
      masterTl.to(cameraRigRef.current, { z: 10000, ease: 'power2.out', duration: 0.1 }, 'chamberArrival');
      
      // Title card fades in
      masterTl.to('.title-card', { opacity: 1, scale: 1, duration: 0.05, ease: 'power2.out' }, 'chamberArrival+=0.02');
      
      // Trigger Framer Motion credits
      masterTl.call(() => {
         window.dispatchEvent(new CustomEvent('showTwistCredits', { detail: true }));
      }, [], 'chamberArrival+=0.06');
      
      masterTl.call(() => {
         window.dispatchEvent(new CustomEvent('showTwistCredits', { detail: false }));
      }, [], 'chamberArrival+=0.05');
      
      // Subtle walking bob
      gsap.to(cameraRigRef.current, {
        y: "+=15",
        yoyo: true,
        repeat: -1,
        duration: 1.2,
        ease: 'sine.inOut'
      });
      
      // Ignite frames as camera approaches them
      ['frame-eye', 'frame-brain', 'frame-automaton'].forEach((id, index) => {
        const triggerPos = 0.15 + (index * 0.3); 
        
        masterTl.to(`.${id} .case-rim-light`, { opacity: 1, duration: 0.02 }, triggerPos);
        masterTl.to(`.${id} .case-invention`, { opacity: 1, scale: 1, duration: 0.02 }, triggerPos);
        masterTl.to(`.${id} .frame-title`, { opacity: 1, duration: 0.02 }, triggerPos);
        masterTl.to(`.${id} .click-hint`, { opacity: 1, duration: 0.02 }, triggerPos);
      });
      
      // Archway lighting up as we approach
      masterTl.to('.archway-glow', { opacity: 1, duration: 0.05 }, 0.45);
      masterTl.to('.archway-glow', { opacity: 0.2, duration: 0.05 }, 0.55);

    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[4000vh] bg-[#050403]">
      <div 
        className="sticky top-0 w-full h-screen overflow-hidden"
        style={{ perspective: '800px', background: '#050403' }}
      >
        <div className="absolute inset-0 bg-[#050403] opacity-0 hallway-bg-fade pointer-events-none z-0" />
        
        {/* Fixed Vignette / Darkness Fog Overlay */}
        <div className="absolute inset-0 z-30 pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 30%, #050403 80%)' }} />
        
        {/* Intro Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-12 font-serif text-3xl md:text-5xl text-glow-strong text-[#e8c07a] z-[100] pointer-events-none">
          <SplitText lineId="line1" text="The workshop has been silent for years." />
          <SplitText lineId="line2" text="Everything it ever built... is still inside it." />
          <SplitText lineId="line3" text="One spark is all it needs." />
        </div>
        
        <div 
          ref={cameraRigRef} 
          className="w-full h-full absolute inset-0 z-20"
          style={{ transformStyle: 'preserve-3d' }}
        >
           {/* Left Wall */}
           <div 
             ref={wallLeftRef}
             className="absolute left-0 top-1/2 -translate-y-1/2 h-[1500px]"
             style={{ 
               width: '12000px', 
               transformOrigin: 'left center',
               transform: 'rotateY(90deg)',
               '--light-x': '0px',
               background: 'radial-gradient(1500px circle at var(--light-x) 50%, rgba(181,137,83,0.15) 0%, rgba(5,4,3,1) 80%), #050403',
               borderTop: '4px solid #1a1410',
               borderBottom: '4px solid #1a1410',
               transformStyle: 'preserve-3d'
             } as any}
           >
             <div className="absolute top-1/2 -translate-y-1/2" style={{ left: '2000px' }}>
                <InventionFrame id="frame-eye" title="The Mechanical Eye" type="eye" />
             </div>
             
             <div className="absolute top-1/2 -translate-y-1/2" style={{ left: '8000px' }}>
                <InventionFrame id="frame-automaton" title="The Automaton" type="automaton" />
             </div>
           </div>
           
           {/* Right Wall */}
           <div 
             ref={wallRightRef}
             className="absolute right-0 top-1/2 -translate-y-1/2 h-[1500px]"
             style={{ 
               width: '12000px', 
               transformOrigin: 'right center',
               transform: 'rotateY(-90deg)',
               '--light-x': '0px',
               background: 'radial-gradient(1500px circle at calc(100% + var(--light-x)) 50%, rgba(181,137,83,0.15) 0%, rgba(5,4,3,1) 80%), #050403',
               borderTop: '4px solid #1a1410',
               borderBottom: '4px solid #1a1410',
               transformStyle: 'preserve-3d'
             } as any}
           >
             <div className="absolute top-1/2 -translate-y-1/2" style={{ right: '5000px' }}>
                <InventionFrame id="frame-brain" title="The Reasoning Engine" type="brain" />
             </div>
           </div>
           
           {/* Floor */}
           <div 
             ref={floorRef}
             className="absolute left-0 top-full w-full"
             style={{ 
               height: '12000px', 
               transformOrigin: 'top center',
               transform: 'rotateX(90deg)',
               '--light-y': '0px',
               background: 'radial-gradient(1500px circle at 50% var(--light-y), rgba(181,137,83,0.1) 0%, rgba(5,4,3,1) 80%), repeating-linear-gradient(0deg, transparent, transparent 200px, rgba(232,168,74,0.02) 200px, rgba(232,168,74,0.02) 204px), #050403' 
             } as any}
           />
           
           {/* Ceiling */}
           <div 
             className="absolute left-0 bottom-full w-full"
             style={{ 
               height: '12000px', 
               transformOrigin: 'bottom center',
               transform: 'rotateX(-90deg)',
               background: 'rgba(5,4,3,1)' 
             }}
           />

           {/* The 3D Archway (Section Break) */}
           <div 
             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none"
             style={{ transform: 'translateZ(-6000px)', transformStyle: 'preserve-3d' }}
           >
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-[120vw] h-[1500px] border-[40px] border-[#0a0806] border-b-0 flex items-center justify-center relative shadow-[0_0_100px_rgba(0,0,0,1)]">
                   <div className="absolute inset-[-40px] border-[2px] border-[#b58953] archway-glow opacity-10 blur-[10px]" />
                   <div className="absolute inset-[-40px] border-[1px] border-[#b58953] archway-glow opacity-20" />
                 </div>
              </div>
           </div>

           {/* Section 3: The Workbench Bridge Scene */}
           <div 
             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none workbench-scene opacity-0"
             style={{ transform: 'translateZ(-8500px)', width: '1500px', height: '1500px' }}
           >
             <div className="absolute inset-0 flex items-center justify-center">
               <div className="relative w-full h-full flex flex-col items-center justify-center">
                 {/* Draped Shape */}
                 <div className="absolute inset-0 flex items-center justify-center z-10">
                   <div className="absolute w-[800px] h-[800px] bg-[#fcdba1] opacity-5 blur-[100px] rounded-full scale-150 animate-[pulse_4s_ease-in-out_infinite]" />
                   <svg width="400" height="500" viewBox="0 0 200 250" className="drop-shadow-[0_0_20px_rgba(232,168,74,0.4)] relative">
                     <path d="M50 250 C 50 150, 80 50, 100 20 C 120 50, 150 150, 150 250 Z" fill="#050403" stroke="#b58953" strokeWidth="2" />
                     <path d="M60 250 C 60 180, 90 80, 100 40 C 110 80, 140 180, 140 250 Z" fill="none" stroke="#fcdba1" strokeWidth="1" strokeDasharray="4 2" />
                     <path d="M40 250 C 40 200, 70 120, 100 80 C 130 120, 160 200, 160 250 Z" fill="none" stroke="#e8c07a" strokeWidth="0.5" className="opacity-50" />
                   </svg>
                 </div>
                 
                 {/* Blueprints drifting */}
                 <div className="blueprint absolute top-[10%] left-[20%] w-[180px] h-[240px] border border-[#b58953]/30 bg-[#0a0806]/60 p-4 opacity-70 z-20">
                   <div className="h-1 w-3/4 bg-[#b58953]/40 mb-2" />
                   <div className="h-1 w-1/2 bg-[#b58953]/40 mb-4" />
                   <div className="w-full h-1/2 border border-dashed border-[#b58953]/30" />
                 </div>
                 
                 <div className="blueprint absolute top-[15%] right-[15%] w-[150px] h-[200px] border border-[#b58953]/30 bg-[#0a0806]/60 p-4 opacity-50 z-20">
                   <div className="w-full h-full border border-dashed border-[#b58953]/30 rounded-full" />
                 </div>
                 
                 <div className="blueprint absolute bottom-[20%] left-[15%] w-[200px] h-[160px] border border-[#b58953]/30 bg-[#0a0806]/60 p-4 opacity-80 z-20">
                   <div className="h-full w-full border border-[#b58953]/20" />
                 </div>
               </div>
             </div>
           </div>

           {/* Final Chamber */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full" style={{ transform: 'translateZ(-10000px)' }}>
             <TwistEndingScene />
           </div>

        </div>
      </div>
      
      <InventionInterior />
    </div>
  );
});

export default CorridorScene;
