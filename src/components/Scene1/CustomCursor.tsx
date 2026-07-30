'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const gearRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const gear = gearRef.current;
    if (!cursor || !gear) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let velocityX = 0;
    let velocityY = 0;

    // Use GSAP's ticker for a smooth render loop
    const onTick = () => {
      // Calculate velocity and ease position
      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;
      
      cursorX += dx * 0.2; // Easing factor
      cursorY += dy * 0.2;
      
      velocityX = dx * 0.5;
      velocityY = dy * 0.5;

      const speed = Math.min(Math.sqrt(velocityX * velocityX + velocityY * velocityY), 100);
      const angle = Math.atan2(velocityY, velocityX);

      // Apply stretching based on speed
      const scaleX = 1 + speed * 0.01;
      const scaleY = 1 - speed * 0.005;

      gsap.set(cursor, {
        x: cursorX,
        y: cursorY,
        rotation: angle * (180 / Math.PI),
        scaleX: scaleX,
        scaleY: scaleY,
      });

      // Slowly rotate the inner gear
      gsap.set(gear, {
        rotation: "+=1"
      });
    };

    gsap.ticker.add(onTick);

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onMouseDown = () => {
      gsap.to(cursor, { scale: 0.7, duration: 0.1 });
    };

    const onMouseUp = () => {
      gsap.to(cursor, { scale: 1, duration: 0.2, ease: 'back.out(1.7)' });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      gsap.ticker.remove(onTick);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
    >
      <div 
        ref={gearRef}
        className="w-8 h-8 rounded-full border-2 border-[var(--color-workshop-brass)] flex items-center justify-center relative"
        style={{
          boxShadow: '0 0 15px rgba(235,178,111,0.5)',
          background: 'radial-gradient(circle, rgba(235,178,111,0.2) 0%, transparent 70%)'
        }}
      >
        {/* Tiny inner gear teeth using absolute divs */}
        {[0, 45, 90, 135].map((deg, i) => (
          <div 
            key={i} 
            className="absolute w-full h-[2px] bg-[var(--color-workshop-brass)] opacity-50"
            style={{ transform: `rotate(${deg}deg)` }}
          />
        ))}
        <div className="absolute w-4 h-4 bg-[var(--color-workshop-bg)] rounded-full border border-[var(--color-workshop-copper)]" />
      </div>
    </div>
  );
}
