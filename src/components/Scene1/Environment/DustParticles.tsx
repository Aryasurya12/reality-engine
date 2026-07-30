'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useWorkshopStore } from '@/store/useWorkshopStore';

export default function DustParticles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isAwake } = useWorkshopStore();

  useEffect(() => {
    if (!containerRef.current) return;

    const particleCount = 60;
    const container = containerRef.current;
    container.innerHTML = '';
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute rounded-full pointer-events-none mix-blend-screen transition-opacity duration-1000';
      
      const size = Math.random() * 4 + 1;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Warm dust color
      particle.style.backgroundColor = Math.random() > 0.5 ? '#fcdba1' : '#b58953';
      
      // Initial position
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      container.appendChild(particle);

      // Animate drifting gently
      gsap.to(particle, {
        x: `+=${Math.random() * (isAwake ? 300 : 150) - (isAwake ? 150 : 75)}`,
        y: `-=${Math.random() * (isAwake ? 300 : 200) + 50}`,
        opacity: isAwake ? (Math.random() * 0.8 + 0.2) : (Math.random() * 0.4 + 0.1),
        duration: Math.random() * (isAwake ? 10 : 15) + (isAwake ? 10 : 15), // Faster when awake
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * -30, // Start randomly scattered
        overwrite: "auto"
      });
    }

    // Parallax effect on the entire dust layer
    const xTo = gsap.quickTo(container, 'x', { duration: 1.2, ease: 'power2' });
    const yTo = gsap.quickTo(container, 'y', { duration: 1.2, ease: 'power2' });

    const handleMouseMove = (e: MouseEvent) => {
      const xPos = (e.clientX / window.innerWidth - 0.5) * -60; // Moves opposite to mouse
      const yPos = (e.clientY / window.innerHeight - 0.5) * -60;
      xTo(xPos);
      yTo(yPos);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isAwake]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-20 pointer-events-none"
    />
  );
}
