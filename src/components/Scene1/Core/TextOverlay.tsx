'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function TextOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Elegant fade up on mount
      gsap.fromTo([titleRef.current, subtitleRef.current],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 2,
          stagger: 0.5,
          ease: "power3.out",
          delay: 1 // Wait a second before text appears
        }
      );
    }, containerRef);

    // Subtle foreground parallax
    const xTo = gsap.quickTo(containerRef.current, 'x', { duration: 1.5, ease: 'power2' });
    const yTo = gsap.quickTo(containerRef.current, 'y', { duration: 1.5, ease: 'power2' });

    const handleMouseMove = (e: MouseEvent) => {
      const xPos = (e.clientX / window.innerWidth - 0.5) * -15; // Minimal movement for text readability
      const yPos = (e.clientY / window.innerHeight - 0.5) * -15;
      xTo(xPos);
      yTo(yPos);
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      ctx.revert();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-50 pointer-events-none flex flex-col items-center justify-center pt-24 text-center mix-blend-screen">
      <h1 
        ref={titleRef} 
        className="hero-title font-serif text-5xl md:text-7xl tracking-wider text-glow bg-gradient-to-b from-[#fcdba1] to-[#b58953] bg-clip-text text-transparent opacity-0"
      >
        The Inventor's Workshop
      </h1>
      <p 
        ref={subtitleRef}
        className="hero-subtitle mt-6 font-sans text-sm md:text-lg tracking-[0.4em] uppercase opacity-0 text-[var(--color-workshop-brass)]"
      >
        Every invention begins with curiosity
      </p>
    </div>
  );
}
