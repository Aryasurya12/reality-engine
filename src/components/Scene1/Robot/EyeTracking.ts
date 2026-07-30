import gsap from 'gsap';
import { RefObject } from 'react';

interface EyeTrackingConfig {
  eyesRef: RefObject<SVGGElement | null>;
  headRef: RefObject<SVGRectElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  isSleeping: boolean;
}

export function setupEyeTracking({ eyesRef, headRef, containerRef, isSleeping }: EyeTrackingConfig) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  // We use quickTo for high performance tracking
  const headRotationTo = gsap.quickTo(headRef.current, "rotation", { duration: 0.8, ease: "power3.out" });
  const eyesXTo = gsap.quickTo(eyesRef.current, "x", { duration: 0.4, ease: "power2.out" });
  const eyesYTo = gsap.quickTo(eyesRef.current, "y", { duration: 0.4, ease: "power2.out" });

  const onTick = () => {
    if (isSleeping || !containerRef.current) return;

    // Calculate center of the robot
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate distance and angle
    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
    const angle = Math.atan2(dy, dx);
    const distance = Math.min(Math.sqrt(dx * dx + dy * dy), 300); // cap max distance influence

    // Convert angle to rotation and position offsets
    const headRot = (angle * 180) / Math.PI;
    
    // Smoothly constrain head rotation so it doesn't snap backwards
    let constrainedRot = headRot;
    if (headRot > 90) constrainedRot = 90;
    if (headRot < -90) constrainedRot = -90;

    headRotationTo(constrainedRot * 0.3); // Head turns slightly

    // Eyes move further to track
    const eyeOffsetX = Math.cos(angle) * (distance * 0.05);
    const eyeOffsetY = Math.sin(angle) * (distance * 0.05);
    
    eyesXTo(eyeOffsetX);
    eyesYTo(eyeOffsetY);
  };

  const onMouseMove = (e: MouseEvent) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  };

  window.addEventListener('mousemove', onMouseMove);
  gsap.ticker.add(onTick);

  return () => {
    window.removeEventListener('mousemove', onMouseMove);
    gsap.ticker.remove(onTick);
  };
}
