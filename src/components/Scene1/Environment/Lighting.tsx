'use client';

import { useEffect, useRef, memo } from 'react';
import gsap from 'gsap';

// Single shared mouse position — avoids duplicate mousemove listeners
let sharedMouseX = 0;
let sharedMouseY = 0;
let listenerAttached = false;
const mouseListeners: Set<(x: number, y: number) => void> = new Set();

function attachSharedMouseListener() {
  if (listenerAttached) return;
  listenerAttached = true;
  window.addEventListener(
    'mousemove',
    (e) => {
      sharedMouseX = e.clientX;
      sharedMouseY = e.clientY;
      mouseListeners.forEach((fn) => fn(e.clientX, e.clientY));
    },
    { passive: true }
  );
}

const Lighting = memo(function Lighting() {
  const mainGlowRef = useRef<HTMLDivElement>(null);
  const rayRef = useRef<HTMLDivElement>(null);
  const doorLightRef = useRef<HTMLDivElement>(null);
  const leftBeamRef = useRef<HTMLDivElement>(null);
  const rightBeamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    attachSharedMouseListener();

    // ── Mouse parallax for main glow ──────────────────────────────────
    const xToGlow = gsap.quickTo(mainGlowRef.current, 'x', {
      duration: 1.2,
      ease: 'power3.out',
    });
    const yToGlow = gsap.quickTo(mainGlowRef.current, 'y', {
      duration: 1.2,
      ease: 'power3.out',
    });
    const rotateRay = gsap.quickTo(rayRef.current, 'rotation', {
      duration: 2,
      ease: 'power2.out',
    });

    const onMouse = (x: number, y: number) => {
      const normX = x / window.innerWidth - 0.5;
      const normY = y / window.innerHeight - 0.5;

      xToGlow(normX * 40);
      yToGlow(normY * 30);
      rotateRay(-42 + normX * 8);
    };

    mouseListeners.add(onMouse);

    // ── Organic light breathing ────────────────────────────────────────
    gsap.to(mainGlowRef.current, {
      opacity: 0.5,
      duration: 4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    // ── Door light breathing — warm pulse from behind vault door ───────
    gsap.to(doorLightRef.current, {
      opacity: 0.15,
      scale: 1.05,
      duration: 2.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      transformOrigin: 'center center',
    });

    // ── Skylight beams — very subtle sway ─────────────────────────────
    gsap.to(leftBeamRef.current, {
      opacity: 0.07,
      duration: 5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
    gsap.to(rightBeamRef.current, {
      opacity: 0.05,
      duration: 6,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 1.5,
    });

    return () => {
      mouseListeners.delete(onMouse);
    };
  }, []);

  return (
    <>
      {/* ── Base darkness ──────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-[#060403] z-0" />

      {/* ── Main warm glow source (top right) ─────────────────────────── */}
      <div
        ref={mainGlowRef}
        className="absolute pointer-events-none gpu-layer"
        style={{
          zIndex: 1,
          top: '-25%',
          right: '-15%',
          width: '900px',
          height: '900px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(252,219,161,0.22) 0%, rgba(181,137,83,0.1) 35%, transparent 70%)',
          filter: 'blur(60px)',
          mixBlendMode: 'screen',
          opacity: 0.4,
        }}
      />

      {/* ── Secondary warm source (centre-left for balance) ───────────── */}
      <div
        className="absolute pointer-events-none"
        style={{
          zIndex: 1,
          top: '0',
          left: '-20%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(181,137,83,0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
          mixBlendMode: 'screen',
        }}
      />

      {/* ── Light ray from skylight ────────────────────────────────────── */}
      <div
        ref={rayRef}
        className="absolute pointer-events-none gpu-layer"
        style={{
          zIndex: 2,
          top: 0,
          right: 0,
          width: '200vw',
          height: '100vh',
          transformOrigin: 'top right',
          transform: 'rotate(-42deg)',
          background: 'linear-gradient(90deg, transparent 0%, rgba(252,219,161,0.06) 50%, transparent 100%)',
          filter: 'blur(40px)',
          mixBlendMode: 'screen',
          opacity: 0.12,
        }}
      />

      {/* Second thinner ray (left skylight) */}
      <div
        ref={leftBeamRef}
        className="absolute pointer-events-none"
        style={{
          zIndex: 2,
          top: 0,
          left: '10%',
          width: '200px',
          height: '80vh',
          transformOrigin: 'top center',
          transform: 'rotate(12deg)',
          background: 'linear-gradient(180deg, rgba(252,219,161,0.12) 0%, transparent 100%)',
          filter: 'blur(20px)',
          mixBlendMode: 'screen',
          opacity: 0.06,
        }}
      />

      {/* Right beam */}
      <div
        ref={rightBeamRef}
        className="absolute pointer-events-none"
        style={{
          zIndex: 2,
          top: 0,
          right: '15%',
          width: '200px',
          height: '80vh',
          transformOrigin: 'top center',
          transform: 'rotate(-12deg)',
          background: 'linear-gradient(180deg, rgba(252,219,161,0.10) 0%, transparent 100%)',
          filter: 'blur(20px)',
          mixBlendMode: 'screen',
          opacity: 0.05,
        }}
      />

      {/* ── Door warm glow (behind the vault door) ─────────────────────── */}
      <div
        ref={doorLightRef}
        className="absolute pointer-events-none"
        style={{
          zIndex: 3,
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '600px',
          background: 'radial-gradient(ellipse 60% 80% at 50% 40%, rgba(252,219,161,0.12) 0%, transparent 70%)',
          filter: 'blur(30px)',
          mixBlendMode: 'screen',
          opacity: 0.1,
        }}
      />

      {/* ── Foreground Vignette (darkens edges, focuses attention on door) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 55,
          mixBlendMode: 'multiply',
          background: 'radial-gradient(ellipse 85% 90% at 50% 50%, transparent 30%, #030201 100%)',
          opacity: 0.85,
        }}
      />

      {/* ── Bottom darkness ───────────────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 w-full h-[30%] pointer-events-none"
        style={{
          zIndex: 54,
          background: 'linear-gradient(to top, #020101 0%, transparent 100%)',
        }}
      />
    </>
  );
});

export default Lighting;
