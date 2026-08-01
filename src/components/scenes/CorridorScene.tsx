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

  useEffect(() => {
    if (!containerRef.current || !cameraRigRef.current) return;
    
    let ctx = gsap.context(() => {
      // The camera moves FORWARD into the screen (positive translateZ)
      // We scrub from Z=0 to Z=10000 over the course of 8000vh.
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
        const startTime = 0.05 + (index * 0.05); 
        
        masterTl.to(letters, {
          y: 0,
          opacity: 1,
          stagger: 0.01,
          duration: 0.02,
          ease: 'power2.out',
        }, startTime);
        
        masterTl.to(letters, {
          x: () => (Math.random() - 0.5) * 300,
          y: () => (Math.random() - 0.5) * 300 - 100, 
          rotation: () => (Math.random() - 0.5) * 180,
          opacity: 0,
          scale: 0.2,
          stagger: 0.005,
          duration: 0.05,
          ease: 'power1.inOut',
          filter: 'blur(4px)',
        }, startTime + 0.05);
      });

      // 3. Drive the camera forward through the 3D tunnel (0% to 80% scroll)
      masterTl.to(cameraRigRef.current, {
        z: 9500, // Move world towards camera
        ease: 'none',
      }, 0); 
      
      // 4. The Twist Ending Sequence (80% to 100% scroll)
      // Camera slows down dramatically as we reach the chamber
      masterTl.addLabel('chamberArrival', 0.8);
      
      masterTl.to(cameraRigRef.current, { z: 10000, ease: 'power2.out', duration: 0.2 }, 'chamberArrival');
      
      // Drape lifts and dissolves
      masterTl.to('.drape-svg', { y: -200, opacity: 0, duration: 0.1, ease: 'power2.inOut' }, 'chamberArrival+=0.05');
      
      // Title card fades in
      masterTl.to('.title-card', { opacity: 1, duration: 0.1, ease: 'power1.inOut' }, 'chamberArrival+=0.08');
      
      // We will trigger the Framer Motion credits via state inside TwistEndingScene
      // by dispatching a custom event or we can just animate it via GSAP to keep it perfectly synced.
      // The prompt says "fades into the credits layer (Framer Motion)", so we'll dispatch an event.
      // However, it's easier to just use a custom event on the window.
      masterTl.call(() => {
         window.dispatchEvent(new CustomEvent('showTwistCredits', { detail: true }));
      }, [], 'chamberArrival+=0.15');
      
      // And hide it if we scroll back
      masterTl.call(() => {
         window.dispatchEvent(new CustomEvent('showTwistCredits', { detail: false }));
      }, [], 'chamberArrival+=0.14');
      
      // Subtle walking bob
      gsap.to(cameraRigRef.current, {
        y: "+=15",
        yoyo: true,
        repeat: -1,
        duration: 1.2,
        ease: 'sine.inOut'
      });
      
      // Ignite frames as camera approaches them
      // Frames are at Z = 2500, 5000, 7500. Camera reaches them at 25%, 50%, 75% scroll.
      ['frame-eye', 'frame-brain', 'frame-automaton'].forEach((id, index) => {
        const triggerPos = 0.2 + (index * 0.25); 
        
        masterTl.to(`.${id} .case-rim-light`, { opacity: 1, duration: 0.02 }, triggerPos);
        masterTl.to(`.${id} .case-invention`, { opacity: 1, duration: 0.02 }, triggerPos);
        masterTl.to(`.${id} .frame-title`, { opacity: 1, duration: 0.02 }, triggerPos);
        
        // Idle loops for each invention
        if (id === 'frame-eye') {
          masterTl.to(`.${id} .eye-lens`, { scale: 1.1, yoyo: true, repeat: 10, duration: 0.01 }, triggerPos);
        } else if (id === 'frame-brain') {
          masterTl.to(`.${id} .brain-node`, { fill: '#fcdba1', yoyo: true, repeat: 10, duration: 0.01, stagger: 0.002 }, triggerPos);
        } else if (id === 'frame-automaton') {
          masterTl.to(`.${id} .auto-arm`, { rotation: 10, yoyo: true, repeat: 10, duration: 0.01 }, triggerPos);
        }
      });

    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[8000vh] bg-[#050403]">
      <div 
        className="sticky top-0 w-full h-screen overflow-hidden"
        style={{ perspective: '800px', background: '#fcdba1' }}
      >
        <div className="absolute inset-0 bg-[#050403] opacity-0 hallway-bg-fade pointer-events-none z-0" />
        
        {/* Intro Text (Fixed in Z space at the entrance) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-12 font-serif text-3xl md:text-5xl text-glow-strong text-[#e8c07a] z-10 pointer-events-none">
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
             className="absolute left-0 top-1/2 -translate-y-1/2 h-[1500px]"
             style={{ 
               width: '12000px', 
               transformOrigin: 'left center',
               transform: 'rotateY(90deg)',
               background: 'linear-gradient(to right, #0a0806, #020101)',
               borderTop: '4px solid #1a1410',
               borderBottom: '4px solid #1a1410',
               transformStyle: 'preserve-3d'
             }}
           >
             {/* Frame 1: The Mechanical Eye */}
             <div className="absolute top-1/2 -translate-y-1/2" style={{ left: '2500px' }}>
                <InventionFrame id="frame-eye" title="The Mechanical Eye" type="eye" />
             </div>
             
             {/* Frame 3: The Automaton */}
             <div className="absolute top-1/2 -translate-y-1/2" style={{ left: '7500px' }}>
                <InventionFrame id="frame-automaton" title="The Automaton" type="automaton" />
             </div>
           </div>
           
           {/* Right Wall */}
           <div 
             className="absolute right-0 top-1/2 -translate-y-1/2 h-[1500px]"
             style={{ 
               width: '12000px', 
               transformOrigin: 'right center',
               transform: 'rotateY(-90deg)',
               background: 'linear-gradient(to left, #0a0806, #020101)',
               borderTop: '4px solid #1a1410',
               borderBottom: '4px solid #1a1410',
               transformStyle: 'preserve-3d'
             }}
           >
             {/* Frame 2: The Reasoning Engine */}
             <div className="absolute top-1/2 -translate-y-1/2" style={{ right: '5000px' }}>
                <InventionFrame id="frame-brain" title="The Reasoning Engine" type="brain" />
             </div>
           </div>
           
           {/* Floor */}
           <div 
             className="absolute left-0 top-full w-full"
             style={{ 
               height: '12000px', 
               transformOrigin: 'top center',
               transform: 'rotateX(90deg)',
               background: 'repeating-linear-gradient(0deg, transparent, transparent 200px, rgba(232,168,74,0.03) 200px, rgba(232,168,74,0.03) 204px)' 
             }}
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

           {/* Final Chamber (Z = -10000) */}
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
