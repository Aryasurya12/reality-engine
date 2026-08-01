import gsap from 'gsap';
import { RefObject } from 'react';

interface EyeTrackingConfig {
  eyesRef: RefObject<SVGGElement | null>;
  headRef: RefObject<SVGGElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  isSleeping: boolean;
}

export function setupEyeTracking({
  eyesRef,
  headRef,
  containerRef,
  isSleeping,
}: EyeTrackingConfig) {
  if (isSleeping) {
    // When sleeping, eyes are closed — just return a noop cleanup
    return () => {};
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let blinkTimeout: ReturnType<typeof setTimeout>;
  let isBlinking = false;

  // Use quickTo for zero-latency smooth tracking
  const headRotateTo = gsap.quickTo(headRef.current, 'rotation', {
    duration: 0.9,
    ease: 'power3.out',
  });
  const eyesXTo = gsap.quickTo(eyesRef.current, 'x', {
    duration: 0.35,
    ease: 'power2.out',
  });
  const eyesYTo = gsap.quickTo(eyesRef.current, 'y', {
    duration: 0.35,
    ease: 'power2.out',
  });

  // ── Blink Function ────────────────────────────────────────────────────────
  const blink = () => {
    if (isBlinking || !eyesRef.current) return;
    isBlinking = true;

    const tl = gsap.timeline({
      onComplete: () => {
        isBlinking = false;
        scheduleBlink();
      },
    });

    // Fast close
    tl.to(eyesRef.current, {
      scaleY: 0.05,
      transformOrigin: '50% 50%',
      duration: 0.06,
      ease: 'power2.in',
    });
    // Slight pause (blink duration)
    tl.to({}, { duration: 0.04 });
    // Open — with slight overshoot (natural eyelid spring)
    tl.to(eyesRef.current, {
      scaleY: 1.12,
      duration: 0.12,
      ease: 'back.out(2)',
    });
    tl.to(eyesRef.current, {
      scaleY: 1,
      duration: 0.1,
      ease: 'power2.out',
    });
  };

  const scheduleBlink = () => {
    const delay = 3000 + Math.random() * 5000; // Blink every 3–8 seconds
    blinkTimeout = setTimeout(blink, delay);
  };

  // ── Tick Function — runs on GSAP ticker (not mousemove) ──────────────────
  const onTick = () => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width === 0) return; // Not yet in DOM

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    // Head rotation — only horizontal component, max ±18°
    const rawHeadRot = dx / window.innerWidth * 36; // -18 to +18
    const clampedHeadRot = Math.max(-18, Math.min(18, rawHeadRot));
    headRotateTo(clampedHeadRot);

    // Eyes track within their socket — max 3px in each direction
    const maxEyeTravel = 3;
    const influence = Math.min(distance / 400, 1); // Falls off after 400px
    const eyeX = Math.cos(angle) * maxEyeTravel * influence;
    const eyeY = Math.sin(angle) * maxEyeTravel * influence;

    eyesXTo(eyeX);
    eyesYTo(eyeY);
  };

  // ── Mouse position tracking (lightweight) ─────────────────────────────────
  const onMouseMove = (e: MouseEvent) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  };

  window.addEventListener('mousemove', onMouseMove, { passive: true });
  gsap.ticker.add(onTick);
  scheduleBlink();

  return () => {
    window.removeEventListener('mousemove', onMouseMove);
    gsap.ticker.remove(onTick);
    clearTimeout(blinkTimeout);
  };
}
