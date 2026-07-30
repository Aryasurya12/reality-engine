import gsap from 'gsap';
import { RefObject } from 'react';

export const playWakeUpSequence = (
  robotRef: RefObject<HTMLDivElement | null>,
  chestRef: RefObject<SVGRectElement | null>,
  eyesRef: RefObject<SVGGElement | null>,
  antennaRef: RefObject<SVGCircleElement | null>,
  onComplete: () => void
) => {
  const tl = gsap.timeline({ onComplete });

  // Stage 2: Eye opens, blinks, closes
  tl.to(eyesRef.current, { opacity: 0.8, duration: 0.2 })
    .to(eyesRef.current, { opacity: 0.1, duration: 0.1, delay: 0.5 })
    
  // Stage 3: Full Wake up
    .to(eyesRef.current, { opacity: 1, duration: 0.3, delay: 0.5 })
    
  // Yawn & Stretch (Squash and Stretch)
    .to(chestRef.current, { scaleY: 0.8, scaleX: 1.1, duration: 0.3, ease: 'power2.in' })
    .to(chestRef.current, { scaleY: 1.2, scaleX: 0.9, duration: 0.5, ease: 'back.out(1.7)' })
    .to(chestRef.current, { scaleY: 1, scaleX: 1, duration: 0.4, ease: 'power2.out' }, "-=0.2")

  // Stand/Sit upright
    .to(robotRef.current, { rotation: 0, y: -10, duration: 1, ease: 'back.out(1.2)' }, "-=0.8")
    
  // Look around (Anticipation and Overshoot)
    .to(robotRef.current, { rotation: -15, duration: 0.6, ease: 'power2.inOut', delay: 0.2 })
    .to(robotRef.current, { rotation: 15, duration: 0.8, ease: 'power2.inOut', delay: 0.2 })
    .to(robotRef.current, { rotation: 0, duration: 0.5, ease: 'power2.out', delay: 0.2 });

  return tl;
};

export const playStartledAnimation = (robotRef: RefObject<HTMLDivElement | null>) => {
  const tl = gsap.timeline();
  tl.to(robotRef.current, {
    x: "-=10",
    rotation: "-=5",
    duration: 0.1,
    ease: "power2.out"
  }).to(robotRef.current, {
    x: "+=10",
    rotation: "+=5",
    duration: 0.4,
    ease: "elastic.out(1, 0.3)"
  });
};

export const playWaveAnimation = (robotRef: RefObject<HTMLDivElement | null>) => {
  const tl = gsap.timeline();
  tl.to(robotRef.current, { rotation: 10, duration: 0.2, yoyo: true, repeat: 3, ease: 'sine.inOut' });
  return tl;
};

export const playDiscoverySequence = (robotRef: RefObject<HTMLDivElement | null>, onComplete: () => void) => {
  const tl = gsap.timeline({ onComplete });
  
  // Robot hears something and freezes
  tl.to(robotRef.current, { scaleY: 1.05, duration: 0.2, ease: "power2.out" })
    .to(robotRef.current, { rotation: -30, duration: 0.5, ease: "back.out(1.5)", delay: 0.5 }) // Looks back right
    .to(robotRef.current, { scaleY: 1, duration: 2 }) // Stares
    
    // Gets excited
    .to(robotRef.current, { y: "-=20", duration: 0.2, yoyo: true, repeat: 1, ease: "sine.out" })
    .to(robotRef.current, { rotation: 0, duration: 0.4, ease: "power2.inOut" }) // Looks back at user
    .to(robotRef.current, { rotation: -30, duration: 0.3, ease: "power2.inOut", delay: 0.2 }) // Looks at door again
    .to(robotRef.current, { rotation: 0, duration: 0.4, ease: "power2.inOut", delay: 0.2 }); // Looks at user
    
  return tl;
};

export const playPointSequence = (robotRef: RefObject<HTMLDivElement | null>) => {
  // Simulate pointing with a small hop and rotation
  const tl = gsap.timeline();
  tl.to(robotRef.current, { rotation: -15, duration: 0.3, ease: "power2.out" })
    .to(robotRef.current, { rotation: 0, duration: 0.5, ease: "back.out(1)", delay: 0.5 });
  return tl;
};

export const startWalkingCycle = (
  robotRef: RefObject<HTMLDivElement | null>,
  legLeftRef: RefObject<SVGPathElement | null>,
  legRightRef: RefObject<SVGPathElement | null>
) => {
  const walkTl = gsap.timeline({ repeat: -1 });
  
  // Bobbing body
  gsap.to(robotRef.current, { y: "-=5", duration: 0.2, yoyo: true, repeat: -1, ease: "sine.inOut" });

  // Swinging legs
  if (legLeftRef.current && legRightRef.current) {
    walkTl.to(legLeftRef.current, { rotation: 20, duration: 0.2, ease: "sine.inOut" })
          .to(legLeftRef.current, { rotation: -20, duration: 0.2, ease: "sine.inOut" })
          
    gsap.to(legRightRef.current, { rotation: -20, duration: 0.2, yoyo: true, repeat: -1, ease: "sine.inOut" });
  }

  return walkTl;
};

export const stopWalkingCycle = (
  robotRef: RefObject<HTMLDivElement | null>,
  legLeftRef: RefObject<SVGPathElement | null>,
  legRightRef: RefObject<SVGPathElement | null>
) => {
  gsap.killTweensOf([robotRef.current, legLeftRef.current, legRightRef.current]);
  gsap.to([robotRef.current, legLeftRef.current, legRightRef.current], { y: 0, rotation: 0, duration: 0.3, ease: "power2.out" });
};
