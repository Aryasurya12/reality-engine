'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useWorkshopStore } from '@/store/useWorkshopStore';

export default function Lighting() {
  const lightRef = useRef<HTMLDivElement>(null);
  const rayRef = useRef<HTMLDivElement>(null);
  const { isAwake } = useWorkshopStore();

  useEffect(() => {
    if (!lightRef.current || !rayRef.current) return;

    // Wake up animation: Lights get slightly brighter and warmer
    if (isAwake) {
      gsap.to(lightRef.current, {
        opacity: 0.6,
        duration: 3,
        ease: 'power2.inOut',
        filter: 'blur(30px)' // Slightly sharper glow
      });

      gsap.to(rayRef.current, {
        opacity: 0.25,
        duration: 4,
        ease: 'power2.inOut'
      });
    } else {
      gsap.to(lightRef.current, {
        opacity: 0.4,
        duration: 3,
        ease: 'power2.inOut',
        filter: 'blur(40px)'
      });

      gsap.to(rayRef.current, {
        opacity: 0.15,
        duration: 4,
        ease: 'power2.inOut'
      });
    }

  }, [isAwake]);

  useEffect(() => {
    if (!lightRef.current || !rayRef.current) return;

    // Parallax logic for light (very subtle)
    const xToLight = gsap.quickTo(lightRef.current, 'x', { duration: 0.8, ease: 'power3' });
    const yToLight = gsap.quickTo(lightRef.current, 'y', { duration: 0.8, ease: 'power3' });
    
    const xToRay = gsap.quickTo(rayRef.current, 'rotation', { duration: 1.5, ease: 'power2' });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 30; // 30px parallax
      const yPos = (clientY / window.innerHeight - 0.5) * 30;
      
      xToLight(xPos);
      yToLight(yPos);
      
      // Ray rotates slightly based on mouse X
      xToRay(-45 + (clientX / window.innerWidth - 0.5) * 10);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* Deepest Background Darkness */}
      <div className="absolute inset-0 bg-[#0c0b0a] z-0" />
      
      {/* Volumetric Light Source (Top Right) */}
      <div 
        ref={lightRef}
        className="absolute -top-[20%] -right-[10%] w-[1200px] h-[1200px] rounded-full pointer-events-none z-0 mix-blend-screen opacity-40 transition-colors"
        style={{
          background: 'radial-gradient(circle, #fcdba1 0%, rgba(181,137,83,0.4) 30%, transparent 70%)',
          filter: 'blur(40px)'
        }}
      />

      {/* Light Rays */}
      <div 
        ref={rayRef}
        className="absolute top-0 right-0 w-[200vw] h-[100vh] origin-top-right pointer-events-none z-10 mix-blend-screen opacity-15"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #fcdba1 50%, transparent 100%)',
          transform: 'rotate(-45deg)',
          filter: 'blur(30px)'
        }}
      />

      {/* Foreground Vignette */}
      <div className="absolute inset-0 pointer-events-none z-50 mix-blend-multiply opacity-80"
        style={{
          background: 'radial-gradient(circle at center, transparent 40%, #050403 100%)'
        }}
      />
    </>
  );
}
