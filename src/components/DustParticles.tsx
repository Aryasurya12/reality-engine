'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function DustParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const particleCount = 40;
    const container = containerRef.current;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute rounded-full bg-[var(--color-workshop-brass)] opacity-20 pointer-events-none mix-blend-screen';
      
      const size = Math.random() * 3 + 1;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Initial position
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      container.appendChild(particle);

      // Animate
      gsap.to(particle, {
        x: `+=${Math.random() * 100 - 50}`,
        y: `-=${Math.random() * 100 + 50}`,
        opacity: Math.random() * 0.4 + 0.1,
        duration: Math.random() * 10 + 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * -20,
      });
    }

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
    />
  );
}
