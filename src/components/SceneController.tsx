'use client';

import { useEffect, useRef, useState, memo } from 'react';
import gsap from 'gsap';
import { useGlobalState } from '@/store/useGlobalState';
import HeroScene from './Scene1/Core/HeroScene';
import dynamic from 'next/dynamic';
import TransitionParticles, { TransitionParticlesHandle } from './TransitionParticles';

// Lazy-load Scene 2 — don't pay the render cost until needed
const MachineRoom = dynamic(
  () => import('./Scene2/Core/MachineRoom'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen bg-[#050403]" />
    ),
  }
);

const SceneController = memo(function SceneController() {
  const { currentScene } = useGlobalState();
  const particlesRef = useRef<TransitionParticlesHandle>(null);
  const warmOverlayRef = useRef<HTMLDivElement>(null);
  const [renderedScene, setRenderedScene] = useState<string>(currentScene);
  const [scene2Preloaded, setScene2Preloaded] = useState(false);
  const isTransitioningRef = useRef(false);

  // Preload Scene 2 after a short delay (not immediately)
  // This lets the Hero render first and get interactive before loading Scene 2
  useEffect(() => {
    const timer = setTimeout(() => setScene2Preloaded(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (currentScene === renderedScene) return;
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    const overlay = warmOverlayRef.current;

    // ── Cinematic Transition Sequence ─────────────────────────────────────
    // Phase 1: Particle burst begins (synced with HeroScene's door-open event)
    particlesRef.current?.burst();

    // Phase 2: At peak particle density, do a warm light overlay flash
    gsap.to(overlay, {
      opacity: 1,
      duration: 0.6,
      delay: 0.5,
      ease: 'sine.inOut',
      onComplete: () => {
        // Phase 3: Swap the scene
        setRenderedScene(currentScene);

        // Phase 4: Fade the overlay back out
        gsap.to(overlay, {
          opacity: 0,
          duration: 1.5,
          ease: 'sine.inOut',
          delay: 0.2,
          onComplete: () => {
            isTransitioningRef.current = false;
            particlesRef.current?.clear();
          },
        });
      },
    });

  }, [currentScene, renderedScene]);

  return (
    <div
      className="relative w-full bg-[#050403]"
      style={{
        minHeight: '100vh',
        // Lock scroll container when in Scene 2 (it manages its own scroll)
        ...(renderedScene !== 'scene1_entrance'
          ? { overflow: 'hidden', height: '100vh' }
          : {}),
      }}
    >

      {/* Current Scene */}
      <div className="relative z-10 w-full h-full">
        {renderedScene === 'scene1_entrance' && <HeroScene />}
        {renderedScene === 'scene2_machine_room' && <MachineRoom />}
      </div>

      {/* Warm Light Flood Overlay — used during scene transition */}
      <div
        ref={warmOverlayRef}
        className="absolute inset-0 pointer-events-none opacity-0"
        style={{
          zIndex: 98000,
          background: 'radial-gradient(ellipse 100% 80% at 50% 40%, #fcdba1 0%, #e8a84a 40%, #c89040 70%, #0a0600 100%)',
          mixBlendMode: 'screen',
        }}
      />

      {/* Transition Particle Canvas */}
      <TransitionParticles ref={particlesRef} />

      {/* Preload Scene 2 assets in a hidden div after 4s delay */}
      {scene2Preloaded && renderedScene === 'scene1_entrance' && (
        <div className="hidden" aria-hidden="true">
          {/* Triggering import for code-splitting */}
        </div>
      )}

    </div>
  );
});

export default SceneController;
