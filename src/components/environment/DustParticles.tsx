'use client';

import { useEffect, useRef, memo } from 'react';
import gsap from 'gsap';

interface ParticleConfig {
  count: number;
  size: [number, number]; // min, max px
  color: string | string[];
  opacity: [number, number];
  speed: [number, number]; // duration range in seconds
  blur: number;
  drift: number; // max horizontal drift px
  rise: number; // max vertical rise px
}

const LAYERS: ParticleConfig[] = [
  // Layer 1 — Dust motes (slow, barely visible)
  {
    count: 8,
    size: [1, 2.5],
    color: ['#fcdba1', '#e8c07a', '#c89040'],
    opacity: [0.06, 0.22],
    speed: [20, 35],
    blur: 0,
    drift: 70,
    rise: 180,
  },
  // Layer 2 — Bright sparks (tiny, quick)
  {
    count: 5,
    size: [0.8, 1.6],
    color: ['#fcdba1', '#fff8e8'],
    opacity: [0.35, 0.8],
    speed: [5, 10],
    blur: 0,
    drift: 20,
    rise: 150,
  },
  // Layer 3 — Soft glowing orbs (large, very transparent, slow)
  {
    count: 3,
    size: [5, 10],
    color: ['#fcdba1', '#b58953'],
    opacity: [0.02, 0.06],
    speed: [28, 45],
    blur: 4,
    drift: 50,
    rise: 100,
  },
];

const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

const DustParticles = memo(function DustParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear only once — create DOM nodes once and never destroy them
    container.innerHTML = '';
    const allParticles: HTMLElement[] = [];

    // Create all particles from all layers
    LAYERS.forEach((layer) => {
      for (let i = 0; i < layer.count; i++) {
        const el = document.createElement('div');
        el.style.position = 'absolute';
        el.style.pointerEvents = 'none';
        el.style.willChange = 'transform, opacity';
        el.style.backfaceVisibility = 'hidden';

        const size = rand(layer.size[0], layer.size[1]);
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.borderRadius = '50%';

        const color = Array.isArray(layer.color) ? pick(layer.color) : layer.color;
        el.style.backgroundColor = color;
        // NO box-shadow — each shadow creates a compositor layer (very expensive)

        if (layer.blur > 0) {
          el.style.filter = `blur(${layer.blur}px)`;
        }

        // Random initial position — spread across full viewport
        el.style.left = `${rand(0, 100)}%`;
        el.style.top = `${rand(10, 90)}%`;
        el.style.opacity = '0';

        container.appendChild(el);
        allParticles.push(el);

        // Animate — each particle loops forever on its own timeline
        const duration = rand(layer.speed[0], layer.speed[1]);
        const drift = rand(-layer.drift, layer.drift);
        const rise = rand(layer.rise * 0.4, layer.rise);
        const opacity = rand(layer.opacity[0], layer.opacity[1]);

        gsap.set(el, {
          x: rand(-20, 20),
          y: rand(-30, 30),
        });

        // Stagger start time so they don't all appear at once
        gsap.to(el, {
          x: `+=${drift}`,
          y: `-=${rise}`,
          opacity: opacity,
          duration: duration,
          delay: rand(0, duration),
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          overwrite: false,
          onRepeat() {
            gsap.set(el, {
              left: `${rand(0, 100)}%`,
              top: `${rand(15, 85)}%`,
            });
          },
        });
      }
    });

    // ── Parallax: throttled mouse move ────────────────────────────
    const xTo = gsap.quickTo(container, 'x', { duration: 2.0, ease: 'power2.out' });
    const yTo = gsap.quickTo(container, 'y', { duration: 2.0, ease: 'power2.out' });

    let rafId = 0;
    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) return; // throttle to one update per frame
      rafId = requestAnimationFrame(() => {
        const xPos = (e.clientX / window.innerWidth - 0.5) * -30;
        const yPos = (e.clientY / window.innerHeight - 0.5) * -20;
        xTo(xPos);
        yTo(yPos);
        rafId = 0;
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
      gsap.killTweensOf(allParticles);
    };
  }, []); // Empty deps — never re-creates particles

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-30 pointer-events-none overflow-hidden gpu-layer"
    />
  );
});

export default DustParticles;
