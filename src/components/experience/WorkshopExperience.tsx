'use client';

import { useEffect, useRef, useState, memo, Suspense, lazy } from 'react';
import gsap from 'gsap';
import { useGlobalState } from '@/store/useGlobalState';
import HeroScene from '../scenes/HeroScene';
import TransitionParticles, { TransitionParticlesHandle } from '../TransitionParticles';
import EndingPanel from '../scenes/EndingScene';

// Lazy-load Scene 2 — don't pay the render cost until needed
const GalleryScene = lazy(() => import('../scenes/GalleryScene'));

// Lazy-load Scene 3
const EngineEndingScene = lazy(() => import('../scenes/EngineEndingScene'));


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
        <Suspense fallback={<div className="w-full h-screen bg-[#050403]" />}>
          {renderedScene === 'scene2_gallery' && <GalleryScene />}
          {renderedScene === 'scene3_ending' && <EngineEndingScene />}
        </Suspense>
      </div>

      {/* Dark Transition Overlay — used during scene transition */}
      <div
        ref={warmOverlayRef}
        className="absolute inset-0 pointer-events-none opacity-0"
        style={{
          zIndex: 98000,
          background: '#000000',
        }}
      />

      {/* Transition Particle Canvas */}
      <TransitionParticles ref={particlesRef} />

      {/* Preload Scene 2/3 assets in a hidden div after delay */}
      {scene2Preloaded && renderedScene !== 'scene3_ending' && (
        <div className="hidden" aria-hidden="true">
          {/* Triggering import for code-splitting */}
        </div>
      )}

      {/* Final Ending UI Overlay */}
      {renderedScene === 'scene3_ending' && <EndingPanel />}

    </div>
  );
});

export default SceneController;
