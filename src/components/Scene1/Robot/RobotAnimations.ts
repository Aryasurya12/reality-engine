import gsap from 'gsap';
import { RefObject } from 'react';

// All animations target sub-elements (head, chest, arms, legs) — NOT the whole container
// This prevents the robot from spinning/flipping unexpectedly during transitions

// ─── Wake Up Sequence ────────────────────────────────────────────────────────
export const playWakeUpSequence = (
  robotContainerRef: RefObject<HTMLDivElement | null>,
  headRef: RefObject<SVGGElement | null>,
  chestRef: RefObject<SVGGElement | null>,
  eyesRef: RefObject<SVGGElement | null>,
  antennaRef: RefObject<SVGCircleElement | null>,
  onComplete: () => void
) => {
  const tl = gsap.timeline({ onComplete });

  // Kill sleeping animations first
  gsap.killTweensOf([headRef.current, chestRef.current, eyesRef.current, antennaRef.current, '.robot-body-group']);

  // Stage 1: Antenna wakes up — signal received
  tl.to(antennaRef.current, {
    opacity: 1,
    attr: { r: 6 },
    duration: 0.3,
    ease: 'power2.out',
  });
  tl.to(antennaRef.current, {
    opacity: 0.3,
    attr: { r: 3 },
    duration: 0.15,
    yoyo: true,
    repeat: 3,
    ease: 'none',
  }, '+=0.1');

  // Stage 2: Eyes flutter open — with anticipation (slight squint first)
  tl.to(eyesRef.current, {
    scaleY: 0.05,
    transformOrigin: '50% 50%',
    duration: 0.08,
    ease: 'power2.in',
  }, '-=0.2');
  tl.to(eyesRef.current, {
    scaleY: 1,
    duration: 0.35,
    ease: 'back.out(1.8)',
  });
  tl.to(eyesRef.current, {
    scaleY: 0.1,
    duration: 0.08,
    ease: 'power2.in',
  }, '+=0.3'); // Blink
  tl.to(eyesRef.current, {
    scaleY: 1,
    duration: 0.2,
    ease: 'back.out(2)',
  });
  tl.to(eyesRef.current, {
    opacity: 1,
    duration: 0.2,
  });

  // Stage 3: Head lifts (was drooping while sleeping)
  tl.to(headRef.current, {
    rotation: 0,
    y: 0,
    transformOrigin: '50px 65px',
    duration: 1.2,
    ease: 'back.out(1.4)', // Overshoot — springs upright
  }, '-=0.5');

  // Stage 4: Yawn stretch — squash and stretch of chest
  tl.to(chestRef.current, {
    scaleX: 1.12,
    scaleY: 0.88,
    duration: 0.4,
    ease: 'power2.out',
    transformOrigin: 'bottom center',
  }, '-=0.2');
  tl.to(chestRef.current, {
    scaleX: 0.93,
    scaleY: 1.18,
    duration: 0.6,
    ease: 'back.out(1.5)',
  });
  tl.to(chestRef.current, {
    scaleX: 1,
    scaleY: 1,
    duration: 0.5,
    ease: 'elastic.out(1, 0.4)',
  });

  // Stage 5: Look around — curiosity (head sub-element only)
  tl.to(headRef.current, {
    rotation: -22,
    duration: 0.7,
    ease: 'power2.inOut',
    delay: 0.3,
  });
  tl.to(headRef.current, {
    rotation: 25,
    duration: 0.9,
    ease: 'power2.inOut',
    delay: 0.5,
  });
  tl.to(headRef.current, {
    rotation: 0,
    duration: 0.6,
    ease: 'power2.out',
    delay: 0.4,
  });

  // Stage 6: Robot rises / straightens — whole container lifts slightly
  tl.to(robotContainerRef.current, {
    y: -8,
    duration: 0.8,
    ease: 'back.out(1.2)',
  }, '-=0.6');

  return tl;
};

// ─── Startle (sudden noise) ─────────────────────────────────────────────────
export const playStartledAnimation = (
  headRef: RefObject<SVGGElement | null>,
  chestRef: RefObject<SVGGElement | null>
) => {
  const tl = gsap.timeline();
  // Anticipation: compress
  tl.to(chestRef.current, {
    scaleY: 0.85,
    scaleX: 1.1,
    transformOrigin: 'bottom center',
    duration: 0.05,
    ease: 'power3.out',
  });
  // Release: spring outward
  tl.to(chestRef.current, {
    scaleY: 1.15,
    scaleX: 0.9,
    duration: 0.2,
    ease: 'back.out(3)',
  });
  tl.to(chestRef.current, {
    scaleY: 1,
    scaleX: 1,
    duration: 0.6,
    ease: 'elastic.out(1, 0.3)',
  });
  // Head snaps up
  tl.to(headRef.current, {
    rotation: -5,
    y: -6,
    duration: 0.15,
    ease: 'power3.out',
  }, 0.05);
  tl.to(headRef.current, {
    rotation: 0,
    y: 0,
    duration: 0.8,
    ease: 'elastic.out(1, 0.3)',
  });
  return tl;
};

// ─── Wave (greeting) ────────────────────────────────────────────────────────
export const playWaveAnimation = (armRightRef: RefObject<SVGGElement | null>) => {
  const tl = gsap.timeline();
  tl.to(armRightRef.current, {
    rotation: -70,
    transformOrigin: '78px 75px',
    duration: 0.4,
    ease: 'back.out(1.5)',
  });
  tl.to(armRightRef.current, {
    rotation: -40,
    duration: 0.18,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: 4,
  });
  tl.to(armRightRef.current, {
    rotation: 0,
    duration: 0.6,
    ease: 'elastic.out(1, 0.4)',
  });
  return tl;
};

// ─── Walking Cycle ──────────────────────────────────────────────────────────
export const startWalkingCycle = (
  robotContainerRef: RefObject<HTMLDivElement | null>,
  legLeftRef: RefObject<SVGGElement | null>,
  legRightRef: RefObject<SVGGElement | null>,
  armLeftRef: RefObject<SVGGElement | null>,
  armRightRef: RefObject<SVGGElement | null>
) => {
  // Proper alternating leg cycle
  const leftLeg = gsap.timeline({ repeat: -1 });
  leftLeg
    .to(legLeftRef.current, {
      rotation: -25,
      transformOrigin: '35px 108px',
      duration: 0.22,
      ease: 'power1.out',
    })
    .to(legLeftRef.current, {
      rotation: 15,
      duration: 0.22,
      ease: 'power1.in',
    });

  const rightLeg = gsap.timeline({ repeat: -1, delay: 0.22 });
  rightLeg
    .to(legRightRef.current, {
      rotation: -25,
      transformOrigin: '65px 108px',
      duration: 0.22,
      ease: 'power1.out',
    })
    .to(legRightRef.current, {
      rotation: 15,
      duration: 0.22,
      ease: 'power1.in',
    });

  // Arms swing opposite to legs (natural gait)
  const leftArm = gsap.timeline({ repeat: -1, delay: 0.22 });
  leftArm.to(armLeftRef.current, {
    rotation: -20,
    transformOrigin: '22px 75px',
    duration: 0.22,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: 1,
  });

  const rightArm = gsap.timeline({ repeat: -1 });
  rightArm.to(armRightRef.current, {
    rotation: 20,
    transformOrigin: '78px 75px',
    duration: 0.22,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: 1,
  });

  // Body bob — up on each step
  const bodyBob = gsap.to(robotContainerRef.current, {
    y: '-=5',
    duration: 0.22,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });

  return [leftLeg, rightLeg, leftArm, rightArm, bodyBob];
};

export const stopWalkingCycle = (
  robotContainerRef: RefObject<HTMLDivElement | null>,
  legLeftRef: RefObject<SVGGElement | null>,
  legRightRef: RefObject<SVGGElement | null>,
  armLeftRef?: RefObject<SVGGElement | null>,
  armRightRef?: RefObject<SVGGElement | null>
) => {
  const targets = [
    robotContainerRef.current,
    legLeftRef.current,
    legRightRef.current,
    armLeftRef?.current,
    armRightRef?.current,
  ].filter(Boolean);
  gsap.killTweensOf(targets);
  gsap.to(targets, {
    rotation: 0,
    y: 0,
    duration: 0.4,
    ease: 'power2.out',
    overwrite: true,
  });
};

// ─── Discovery Sequence ─────────────────────────────────────────────────────
export const playDiscoverySequence = (
  headRef: RefObject<SVGGElement | null>,
  chestRef: RefObject<SVGGElement | null>,
  eyesRef: RefObject<SVGGElement | null>,
  onComplete: () => void
) => {
  const tl = gsap.timeline({ onComplete });

  // Freeze — hears something
  tl.to(headRef.current, {
    rotation: 20,
    duration: 0.2,
    ease: 'power3.out',
    transformOrigin: '50px 65px',
  });

  // Eyes widen
  tl.to(eyesRef.current, {
    scaleY: 1.4,
    scaleX: 1.2,
    transformOrigin: '50% 50%',
    duration: 0.15,
    ease: 'back.out(2)',
  }, '<');

  // Stare
  tl.to({}, { duration: 0.8 });

  // Excitement bounce
  tl.to(chestRef.current, {
    scaleY: 0.85,
    scaleX: 1.1,
    transformOrigin: 'bottom center',
    duration: 0.1,
    ease: 'power3.in',
  });
  tl.to(chestRef.current, {
    scaleY: 1.1,
    scaleX: 0.95,
    duration: 0.25,
    ease: 'back.out(2)',
  });
  tl.to(chestRef.current, { scaleY: 1, scaleX: 1, duration: 0.4, ease: 'elastic.out(1, 0.4)' });

  // Look back at user
  tl.to(headRef.current, { rotation: -18, duration: 0.5, ease: 'power2.inOut' }, '-=0.3');
  tl.to(headRef.current, { rotation: 15, duration: 0.4, ease: 'power2.inOut', delay: 0.6 });
  tl.to(headRef.current, { rotation: -15, duration: 0.4, ease: 'power2.inOut', delay: 0.4 });
  tl.to(headRef.current, { rotation: 0, duration: 0.5, ease: 'power2.out', delay: 0.3 });

  return tl;
};

// ─── Point / Beckon ──────────────────────────────────────────────────────────
export const playPointSequence = (
  headRef: RefObject<SVGGElement | null>,
  armRightRef: RefObject<SVGGElement | null>
) => {
  const tl = gsap.timeline();
  tl.to(headRef.current, { rotation: -20, duration: 0.3, ease: 'power2.out', transformOrigin: '50px 65px' });
  tl.to(armRightRef.current, {
    rotation: -50,
    transformOrigin: '78px 75px',
    duration: 0.4,
    ease: 'back.out(1.5)',
  }, '<');
  tl.to({}, { duration: 0.8 });
  tl.to([headRef.current, armRightRef.current], {
    rotation: 0,
    duration: 0.7,
    ease: 'elastic.out(1, 0.4)',
    stagger: 0.1,
  });
  return tl;
};

// ─── Idle Animations ─────────────────────────────────────────────────────────
export const playIdleScratchHead = (headRef: RefObject<SVGGElement | null>) => {
  const tl = gsap.timeline();
  tl.to(headRef.current, {
    rotation: 8,
    transformOrigin: '50px 65px',
    duration: 0.3,
    ease: 'power1.inOut',
  });
  tl.to(headRef.current, {
    y: '-=3',
    duration: 0.1,
    yoyo: true,
    repeat: 4,
    ease: 'sine.inOut',
  });
  tl.to(headRef.current, {
    rotation: 0,
    y: 0,
    duration: 0.5,
    ease: 'elastic.out(1, 0.4)',
    delay: 0.2,
  });
  return tl;
};

export const playIdleAdjustAntenna = (antennaRef: RefObject<SVGCircleElement | null>) => {
  const tl = gsap.timeline();
  tl.to(antennaRef.current, {
    opacity: 1,
    attr: { r: 7 },
    duration: 0.15,
    yoyo: true,
    repeat: 5,
    ease: 'power2.inOut',
  });
  return tl;
};

export const playIdleLookAround = (headRef: RefObject<SVGGElement | null>) => {
  const tl = gsap.timeline();
  tl.to(headRef.current, { rotation: -25, duration: 0.7, ease: 'power2.inOut', transformOrigin: '50px 65px' });
  tl.to(headRef.current, { rotation: 28, duration: 1.0, ease: 'power2.inOut', delay: 0.8 });
  tl.to(headRef.current, { rotation: 0, duration: 0.6, ease: 'power2.out', delay: 0.6 });
  return tl;
};

export const playIdleTapFoot = (legRightRef: RefObject<SVGGElement | null>) => {
  const tl = gsap.timeline();
  tl.to(legRightRef.current, {
    rotation: -12,
    transformOrigin: '65px 108px',
    duration: 0.08,
    yoyo: true,
    repeat: 7,
    ease: 'sine.inOut',
  });
  return tl;
};

export const playIdleYawn = (chestRef: RefObject<SVGGElement | null>) => {
  const tl = gsap.timeline();
  tl.to(chestRef.current, {
    scaleY: 1.25,
    scaleX: 0.9,
    transformOrigin: 'bottom center',
    duration: 1.2,
    ease: 'power1.out',
  });
  tl.to(chestRef.current, {
    scaleY: 1,
    scaleX: 1,
    duration: 0.6,
    ease: 'bounce.out',
  });
  return tl;
};

export const getRandomIdleAnimation = (
  headRef: RefObject<SVGGElement | null>,
  antennaRef: RefObject<SVGCircleElement | null>,
  chestRef: RefObject<SVGGElement | null>,
  legRightRef: RefObject<SVGGElement | null>
) => {
  const animations = [
    () => playIdleScratchHead(headRef),
    () => playIdleAdjustAntenna(antennaRef),
    () => playIdleLookAround(headRef),
    () => playIdleTapFoot(legRightRef),
    () => playIdleYawn(chestRef),
  ];
  const randomIndex = Math.floor(Math.random() * animations.length);
  return animations[randomIndex]();
};
