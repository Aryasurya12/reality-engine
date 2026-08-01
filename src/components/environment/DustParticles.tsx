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
  // Layer 1 — Dust motes (many, slow, barely visible)
  {
    count: 10,
    size: [1, 3],
    color: ['#fcdba1', '#e8c07a', '#c89040'],
    opacity: [0.05, 0.25],
    speed: [18, 30],
    blur: 0.5,
    drift: 80,
    rise: 200,
  },
  // Layer 2 — Floating embers (medium, warm orange, rise faster)
  {
    count: 6,
    size: [1.5, 3.5],
    color: ['#c45b36', '#e8723f', '#ffa052'],
    opacity: [0.15, 0.55],
    speed: [8, 16],
    blur: 1,
    drift: 40,
    rise: 350,
  },
  // Layer 3 — Sparks (tiny, bright, quick)
  {
    count: 8,
    size: [0.8, 1.8],
    color: ['#fcdba1', '#fff8e8'],
    opacity: [0.4, 0.9],
    speed: [4, 9],
    blur: 0.5,
    drift: 25,
    rise: 180,
  },
  // Layer 4 — Soft glowing particles (large, very transparent, slow)
  {
    count: 4,
    size: [6, 12],
    color: ['#fcdba1', '#b58953'],
    opacity: [0.02, 0.08],
    speed: [25, 40],
    blur: 6,
    drift: 60,
    rise: 120,
  },
  // Layer 5 — Floating fibres (long, very thin, twisting)
  {
    count: 3,
    size: [1, 5],
    color: ['#ffffff', '#fcdba1'],
    opacity: [0.1, 0.3],
    speed: [20, 35],
    blur: 0,
    drift: 100,
    rise: 250,
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
        if (i < 15 && layer.rise === 250) { // Is fibre layer
          el.style.width = `${size * 4}px`;
          el.style.height = `${size * 0.5}px`;
          el.style.borderRadius = '2px';
          gsap.set(el, { rotation: rand(0, 360) });
        } else {
          el.style.width = `${size}px`;
          el.style.height = `${size}px`;
          el.style.borderRadius = '50%';
        }

        const color = Array.isArray(layer.color) ? pick(layer.color) : layer.color;
        el.style.backgroundColor = color;
        el.style.boxShadow = layer.rise !== 250 ? `0 0 ${size * 2}px ${color}` : 'none';

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
          delay: rand(0, duration), // Start at random point in cycle
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          overwrite: false,
          onRepeat() {
            // Teleport to a new random position on each cycle (invisible during yoyo return)
            gsap.set(el, {
              left: `${rand(0, 100)}%`,
              top: `${rand(15, 85)}%`,
            });
          },
        });
      }
    });

    // ── Parallax: move entire container subtly with mouse ────────────
    // Single listener shared across all particles (performance win)
    const xTo = gsap.quickTo(container, 'x', { duration: 1.5, ease: 'power2.out' });
    const yTo = gsap.quickTo(container, 'y', { duration: 1.5, ease: 'power2.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const xPos = (e.clientX / window.innerWidth - 0.5) * -40;
      const yPos = (e.clientY / window.innerHeight - 0.5) * -30;
      xTo(xPos);
      yTo(yPos);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      // Kill all particle tweens
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
