'use client';

import { useEffect, useRef, forwardRef, useImperativeHandle, memo } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  opacity: number;
}

export interface TransitionParticlesHandle {
  burst: () => void;
  clear: () => void;
}

const COLORS = ['#fcdba1', '#e8c07a', '#c89040', '#f0a840', '#fff5d6', '#c45b36'];

// Creates a magical particle burst that simulates camera flying through dust
const TransitionParticles = memo(forwardRef<TransitionParticlesHandle>(function TransitionParticles(_, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const activeRef = useRef(false);
  const phaseRef = useRef<'burst' | 'swirl' | 'clear' | 'idle'>('idle');
  const phaseTimeRef = useRef(0);
  const onCompleteRef = useRef<(() => void) | null>(null);

  useImperativeHandle(ref, () => ({
    burst: () => {
      activeRef.current = true;
      phaseRef.current = 'burst';
      phaseTimeRef.current = 0;
      particlesRef.current = [];

      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.style.opacity = '1';

      startLoop();
    },
    clear: () => {
      phaseRef.current = 'clear';
    },
  }));

  const spawnBurstParticles = (canvas: HTMLCanvasElement, count: number) => {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      // Burst from centre outward — simulates flying through door
      const speed = 1 + Math.random() * 8;
      const size = 0.5 + Math.random() * 3.5;
      const life = 60 + Math.random() * 120;

      particlesRef.current.push({
        x: cx + (Math.random() - 0.5) * 60,
        y: cy + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed * 0.6 - 1.5, // Slight upward bias
        life,
        maxLife: life,
        size,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        opacity: 0.3 + Math.random() * 0.7,
      });
    }
  };

  const spawnSwirlParticles = (canvas: HTMLCanvasElement, count: number) => {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    for (let i = 0; i < count; i++) {
      const radius = 80 + Math.random() * 400;
      const startAngle = Math.random() * Math.PI * 2;
      const swirlDir = Math.random() > 0.5 ? 1 : -1;
      const speed = 0.5 + Math.random() * 2;

      particlesRef.current.push({
        x: cx + Math.cos(startAngle) * radius,
        y: cy + Math.sin(startAngle) * radius,
        vx: Math.cos(startAngle + (Math.PI / 2) * swirlDir) * speed,
        vy: Math.sin(startAngle + (Math.PI / 2) * swirlDir) * speed,
        life: 90 + Math.random() * 90,
        maxLife: 180,
        size: 0.5 + Math.random() * 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        opacity: 0.2 + Math.random() * 0.5,
      });
    }
  };

  const startLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: false });
    if (!ctx) return;

    let frame = 0;

    const loop = () => {
      if (!activeRef.current) return;

      frame++;
      phaseTimeRef.current++;

      // Resize canvas to window if needed
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      // Clear with slight trail (motion blur effect)
      ctx.fillStyle = 'rgba(5, 4, 3, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Phase-based spawning
      if (phaseRef.current === 'burst') {
        if (phaseTimeRef.current % 3 === 0) {
          spawnBurstParticles(canvas, 20);
        }
        if (phaseTimeRef.current > 60) {
          phaseRef.current = 'swirl';
          phaseTimeRef.current = 0;
        }
      } else if (phaseRef.current === 'swirl') {
        if (phaseTimeRef.current % 4 === 0) {
          spawnSwirlParticles(canvas, 8);
        }
        if (phaseTimeRef.current > 90) {
          phaseRef.current = 'clear';
          phaseTimeRef.current = 0;
        }
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.life--;

        // Physics
        p.x += p.vx;
        p.y += p.vy;

        // Air resistance
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Gravity (very slight)
        p.vy += 0.02;

        const lifeRatio = p.life / p.maxLife;
        const alpha = p.opacity * Math.sin(lifeRatio * Math.PI); // Fade in/out

        if (alpha <= 0.01) return false;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = p.size * 4;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        return p.life > 0;
      });

      // End condition: clear phase with no particles
      if (phaseRef.current === 'clear' && particlesRef.current.length === 0) {
        // Fade out canvas
        canvas.style.transition = 'opacity 0.5s ease-out';
        canvas.style.opacity = '0';
        activeRef.current = false;

        if (onCompleteRef.current) {
          setTimeout(onCompleteRef.current, 500);
          onCompleteRef.current = null;
        }
        return;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{
        zIndex: 99000,
        opacity: 0,
        transition: 'opacity 0.3s ease-in',
      }}
    />
  );
}));

export default TransitionParticles;
