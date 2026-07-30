'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Move cursor with mouse
    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.2, // Adds a slight lag to the cursor
        ease: 'power2.out',
      });
    };

    // Add scale effect on click
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
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(235,178,111,0.6)] mix-blend-difference"
      style={{
        boxShadow: '0 0 10px rgba(235,178,111,0.4)',
      }}
    />
  );
}
