'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const gearRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Use quickTo for the position for zero latency
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power3" });
    const rotateTo = gsap.quickTo(cursor, "rotation", { duration: 0.1, ease: "none" });
    const stretchTo = gsap.quickTo(cursor, "scaleX", { duration: 0.1, ease: "power3" });
    const squashTo = gsap.quickTo(cursor, "scaleY", { duration: 0.1, ease: "power3" });
    const gearRotateTo = gsap.quickTo(gearRef.current, "rotation", { duration: 0.5, ease: "none" });

    let lastX = 0;
    let lastY = 0;
    let totalDistance = 0;

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      
      // Calculate velocity and angle
      const dx = clientX - lastX;
      const dy = clientY - lastY;
      const velocity = Math.sqrt(dx * dx + dy * dy);
      totalDistance += velocity;
      
      // Only rotate if there's actual movement to prevent snapping
      if (velocity > 0.5) {
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        rotateTo(angle);
        
        // Spin the inner gear based on distance traveled
        gearRotateTo(totalDistance * 0.5);
      }

      // Stretch along movement axis, squash on perpendicular axis
      // Cap the stretch to prevent it looking broken
      const stretch = Math.min(1 + velocity * 0.015, 2.5);
      const squash = Math.max(1 - velocity * 0.005, 0.4);

      stretchTo(stretch);
      squashTo(squash);

      // Center the cursor
      xTo(clientX - 20);
      yTo(clientY - 20);

      lastX = clientX;
      lastY = clientY;
    };

    // When mouse stops, animate back to normal circle
    const checkStop = () => {
      gsap.to(cursor, {
        scaleX: 1,
        scaleY: 1,
        duration: 0.4,
        ease: "elastic.out(1, 0.3)"
      });
    };

    let stopTimeout: NodeJS.Timeout;
    const handleMove = (e: MouseEvent) => {
      onMouseMove(e);
      clearTimeout(stopTimeout);
      stopTimeout = setTimeout(checkStop, 50);
    };

    window.addEventListener('mousemove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      clearTimeout(stopTimeout);
    };
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className="fixed top-0 left-0 w-[40px] h-[40px] z-[9999] pointer-events-none mix-blend-screen origin-center flex items-center justify-center"
    >
      <div className="absolute inset-0 rounded-full border-2 border-[var(--color-workshop-copper)] opacity-50" />
      <div className="absolute inset-0 rounded-full bg-[var(--color-workshop-brass)] opacity-20 blur-sm" />
      
      {/* Tiny internal glowing gear */}
      <svg ref={gearRef} viewBox="0 0 100 100" className="w-4 h-4 text-[#fcdba1]">
        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="15" strokeDasharray="10 10" />
        <circle cx="50" cy="50" r="10" fill="currentColor" />
      </svg>
    </div>
  );
}
