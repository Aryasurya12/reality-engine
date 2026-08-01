'use client';

import { useEffect, useRef, memo } from 'react';
import gsap from 'gsap';
import { useCursorStore } from '@/store/useCursorStore';

const MechanicalCursor = memo(function MechanicalCursor() {
  const { cursorState } = useCursorStore();

  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const gearRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    const trail = trailRef.current;
    const gear = gearRef.current;
    if (!outer || !inner || !trail || !gear) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let lastX = mouseX;
    let lastY = mouseY;
    let totalRotation = 0;
    
    // QuickSetters for ultra performance (no tweening duration)
    const setOuterX = gsap.quickSetter(outer, 'x', 'px');
    const setOuterY = gsap.quickSetter(outer, 'y', 'px');
    const setInnerX = gsap.quickSetter(inner, 'x', 'px');
    const setInnerY = gsap.quickSetter(inner, 'y', 'px');
    const setTrailX = gsap.quickSetter(trail, 'x', 'px');
    const setTrailY = gsap.quickSetter(trail, 'y', 'px');
    const setGearRot = gsap.quickSetter(gear, 'rotation', 'deg');

    // Smoothing physics state
    const pos = {
      outer: { x: mouseX, y: mouseY },
      inner: { x: mouseX, y: mouseY },
      trail: { x: mouseX, y: mouseY }
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const ticker = () => {
      // Lerp speeds (higher = faster snap to mouse)
      const dt = gsap.ticker.deltaRatio();
      pos.outer.x += (mouseX - pos.outer.x) * 0.3 * dt;
      pos.outer.y += (mouseY - pos.outer.y) * 0.3 * dt;
      
      pos.inner.x += (mouseX - pos.inner.x) * 0.8 * dt;
      pos.inner.y += (mouseY - pos.inner.y) * 0.8 * dt;

      pos.trail.x += (mouseX - pos.trail.x) * 0.1 * dt;
      pos.trail.y += (mouseY - pos.trail.y) * 0.1 * dt;

      setOuterX(pos.outer.x - 20);
      setOuterY(pos.outer.y - 20);
      setInnerX(pos.inner.x - 4);
      setInnerY(pos.inner.y - 4);
      setTrailX(pos.trail.x - 14);
      setTrailY(pos.trail.y - 14);

      // Velocity calculation for stretch and rotation
      const dx = pos.outer.x - lastX;
      const dy = pos.outer.y - lastY;
      const velocity = Math.sqrt(dx * dx + dy * dy);

      totalRotation += velocity * 0.8;
      setGearRot(totalRotation);

      if (velocity > 0.5) {
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const stretch = Math.min(1 + velocity * 0.015, 2.0);
        const squash = Math.max(1 - velocity * 0.005, 0.5);
        gsap.to(outer, { scaleX: stretch, scaleY: squash, rotation: angle, duration: 0.1, overwrite: 'auto' });
      } else {
        gsap.to(outer, { scaleX: 1, scaleY: 1, rotation: 0, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
      }

      lastX = pos.outer.x;
      lastY = pos.outer.y;
    };

    gsap.ticker.add(ticker);

    const onMouseDown = () => {
      gsap.to([outer, inner], {
        scale: 0.75,
        duration: 0.12,
        ease: 'power3.out',
      });
      gsap.to(trail, { scale: 1.5, opacity: 0.08, duration: 0.15 });
    };

    const onMouseUp = () => {
      gsap.to([outer, inner], {
        scale: 1,
        duration: 0.4,
        ease: 'back.out(2)',
      });
      gsap.to(trail, { scale: 1, opacity: 0.05, duration: 0.4 });
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Initial setup
    gsap.set(trail, { zIndex: 999996 });
    gsap.set(outer, { zIndex: 999997 });
    gsap.set(inner, { zIndex: 999998 });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      gsap.ticker.remove(ticker);
    };
  }, []);

  // Handle cursor state changes
  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    const gear = gearRef.current;
    const trail = trailRef.current;
    if (!outer || !inner || !gear || !trail) return;

    // Reset animations
    gsap.killTweensOf([outer, inner, gear, trail]);

    switch (cursorState) {
      case 'hover-robot':
        gsap.to(outer, { scale: 1.4, borderColor: '#60a5fa', duration: 0.3, ease: 'back.out(1.5)' }); // Blue glow
        gsap.to(inner, { backgroundColor: '#93c5fd', boxShadow: '0 0 10px #60a5fa', duration: 0.3 });
        gsap.to(gear, { opacity: 0.9, scale: 1.2, duration: 0.3 });
        break;
      case 'hover-drag':
        gsap.to(outer, { scale: 1.6, borderColor: '#fbbf24', duration: 0.3, ease: 'back.out(2)' }); // Magnetic snap
        gsap.to(inner, { backgroundColor: '#fcd34d', boxShadow: '0 0 12px #fbbf24', duration: 0.3 });
        gsap.to(gear, { opacity: 1, scale: 1.5, duration: 0.3 });
        break;
      case 'hover-machine':
        gsap.to(outer, { scale: 1.3, borderColor: '#fcdba1', duration: 0.4 });
        gsap.to(inner, { backgroundColor: '#fcdba1', boxShadow: '0 0 8px #fcdba1', duration: 0.4 });
        gsap.to(gear, { opacity: 0.8, scale: 1.1, rotation: "+=360", duration: 4, ease: 'none', repeat: -1 });
        break;
      case 'dragging':
        gsap.to(outer, { scale: 0.8, borderColor: '#f87171', duration: 0.2 }); // Reddish sparks
        gsap.to(inner, { backgroundColor: '#fca5a5', boxShadow: '0 0 15px #ef4444', duration: 0.2 });
        gsap.to(gear, { opacity: 1, scale: 0.8, rotation: "+=720", duration: 1, ease: 'none', repeat: -1 });
        gsap.to(trail, { scale: 2, opacity: 0.15, duration: 0.2 });
        break;
      case 'placed':
        gsap.fromTo(outer, { scale: 0.5, borderColor: '#fbbf24' }, { scale: 2.5, opacity: 0, duration: 0.6, ease: 'power2.out' }); // Golden pulse
        gsap.to(inner, { backgroundColor: '#fbbf24', scale: 2, opacity: 0, duration: 0.4, ease: 'power2.out', onComplete: () => {
          gsap.set([outer, inner], { opacity: 1, scale: 1 });
        }});
        break;
      case 'default':
      default:
        gsap.to(outer, { scale: 1, borderColor: 'rgba(196,91,54,0.6)', opacity: 1, duration: 0.3 });
        gsap.to(inner, { backgroundColor: '#fcdba1', boxShadow: '0 0 6px #fcdba1', opacity: 1, scale: 1, duration: 0.3 });
        gsap.to(gear, { opacity: 0.7, scale: 1, duration: 0.3 });
        gsap.to(trail, { scale: 1, opacity: 0.05, duration: 0.3 });
        break;
    }
  }, [cursorState]);

  return (
    <>
      {/* Trail — slowest, large, very transparent */}
      <div
        ref={trailRef}
        className="fixed top-0 left-0 pointer-events-none gpu-layer"
        style={{
          zIndex: 999996,
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          backgroundColor: 'rgba(181,137,83,0.05)',
          border: '1px solid rgba(181,137,83,0.08)',
          mixBlendMode: 'screen',
        }}
      />

      {/* Outer ring — lagged slightly */}
      <div
        ref={outerRef}
        className="fixed top-0 left-0 pointer-events-none gpu-layer origin-center"
        style={{
          zIndex: 999997,
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '1.5px solid rgba(196,91,54,0.6)',
          mixBlendMode: 'screen',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Inner gear */}
        <svg
          ref={gearRef}
          viewBox="0 0 100 100"
          width="14"
          height="14"
          style={{ opacity: 0.7 }}
        >
          {/* Gear teeth */}
          <circle cx="50" cy="50" r="28" fill="none" stroke="#fcdba1" strokeWidth="14" strokeDasharray="9 7" />
          {/* Centre */}
          <circle cx="50" cy="50" r="11" fill="#fcdba1" />
          <circle cx="50" cy="50" r="5" fill="#c45b36" />
        </svg>
      </div>

      {/* Inner dot — fastest, nearly instant */}
      <div
        ref={innerRef}
        className="fixed top-0 left-0 pointer-events-none gpu-layer"
        style={{
          zIndex: 999998,
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#fcdba1',
          boxShadow: '0 0 6px #fcdba1',
          mixBlendMode: 'screen',
        }}
      />
    </>
  );
});

export default MechanicalCursor;
