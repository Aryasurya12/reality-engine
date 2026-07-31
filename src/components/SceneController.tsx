'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGlobalState } from '@/store/useGlobalState';
import HeroScene from './Scene1/Core/HeroScene';
import MachineRoom from './Scene2/Core/MachineRoom';

export default function SceneController() {
  const { currentScene } = useGlobalState();
  const transitionRef = useRef<HTMLDivElement>(null);
  const [renderedScene, setRenderedScene] = useState(currentScene);

  useEffect(() => {
    if (currentScene !== renderedScene && transitionRef.current) {
      // Warm Light Flood
      gsap.to(transitionRef.current, {
        opacity: 1,
        duration: 1,
        ease: "power2.in",
        onComplete: () => {
          setRenderedScene(currentScene);
          // Fade back in
          gsap.to(transitionRef.current, {
            opacity: 0,
            duration: 1.5,
            ease: "power2.out"
          });
        }
      });
    }
  }, [currentScene, renderedScene]);

  return (
    <div className={`relative w-full min-h-screen bg-[#050403] ${renderedScene === 'scene1_entrance' ? '' : 'overflow-hidden h-screen'}`}>
      
      {/* Background / Upcoming Scene (Preloaded) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {renderedScene === 'scene1_entrance' && <MachineRoom />}
      </div>

      {/* Current Scenes */}
      <div className="relative z-10 w-full h-full">
        {renderedScene === 'scene1_entrance' && <HeroScene />}
        {renderedScene === 'scene2_machine_room' && <MachineRoom />}
      </div>

      {/* Global Transition Overlay (Warm Light Flood) */}
      <div 
        ref={transitionRef} 
        className="absolute inset-0 z-[99999] bg-[#fcdba1] pointer-events-none opacity-0"
        style={{ mixBlendMode: 'screen' }}
      />
    </div>
  );
}
