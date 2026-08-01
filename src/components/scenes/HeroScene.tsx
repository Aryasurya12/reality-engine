'use client';

import { useEffect, useRef, useCallback, memo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGlobalState } from '@/store/useGlobalState';
import { useWorkshopStore } from '@/store/useWorkshopStore';
import Lighting from '../environment/Lighting';
import DustParticles from '../environment/DustParticles';
import TextOverlay from './TextOverlay';
import BackgroundLayer from '../environment/BackgroundLayer';
import MidgroundLayer from '../environment/MidgroundLayer';
import ForegroundLayer from '../environment/ForegroundLayer';
import Robot from '../svg/Robot';
import { setupEyeTracking } from '../svg/EyeTracking';
import { playWakeUpSequence, startWalkingCycle, stopWalkingCycle } from '../svg/RobotAnimations';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const HeroScene = memo(function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  // Layer refs for parallax
  const bgRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);

  // Robot refs — now typed to SVGGElement since head/chest are <g> elements
  const robotContainerRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const chestRef = useRef<SVGGElement>(null);
  const eyesRef = useRef<SVGGElement>(null);
  const antennaRef = useRef<SVGCircleElement>(null);
  const legLeftRef = useRef<SVGGElement>(null);
  const legRightRef = useRef<SVGGElement>(null);
  const armLeftRef = useRef<SVGGElement>(null);
  const armRightRef = useRef<SVGGElement>(null);

  const { transitionToScene } = useGlobalState();
  const { isAwake, wakeUp } = useWorkshopStore();

  // Use refs so the scroll timeline useEffect never needs to re-run
  const isAwakeRef = useRef(isAwake);
  const wakeUpRef = useRef(wakeUp);
  useEffect(() => { isAwakeRef.current = isAwake; }, [isAwake]);
  useEffect(() => { wakeUpRef.current = wakeUp; }, [wakeUp]);

  // Track transition state to prevent double-trigger
  const hasTransitionedRef = useRef(false);

  const doTransition = useCallback(() => {
    if (hasTransitionedRef.current) return;
    hasTransitionedRef.current = true;
    transitionToScene('scene2_gallery');
  }, [transitionToScene]);

  // ── Eye tracking + blinking setup ──────────────────────────────────────────
  useEffect(() => {
    const cleanup = setupEyeTracking({
      eyesRef: eyesRef as any,
      headRef: headRef as any,
      containerRef: robotContainerRef,
      isSleeping: !isAwake,
    });
    return cleanup;
  }, [isAwake]);

  // ── Main Scroll Timeline ────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || !stickyRef.current) return;

    const ctx = gsap.context(() => {

      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8, // Faster scrub = more connected feel
          onUpdate: (self) => {
            const p = self.progress;

            // Wake the robot when scrolling begins (10%)
            if (p > 0.08 && !isAwakeRef.current) {
              wakeUpRef.current();
            }
          },
          onLeave: doTransition,
        },
      });

      // ╔══════════════════════════════════════════════════════════════╗
      // ║  0% – 15%: INITIAL DRIFT IN — subtle camera pull              ║
      // ║  Robot stirs. Atmosphere deepens. Light warms slightly.       ║
      // ╚══════════════════════════════════════════════════════════════╝

      // Very gentle camera drift inward — creates anticipation
      masterTl.to(bgRef.current, {
        scale: 1.04,
        duration: 0.15,
        ease: 'none',
      }, 0);

      masterTl.to(midRef.current, {
        scale: 1.05,
        duration: 0.15,
        ease: 'none',
      }, 0);

      // Foreground drifts slightly forward
      masterTl.to(fgRef.current, {
        scale: 1.08,
        duration: 0.15,
        ease: 'power1.in',
      }, 0);

      // ╔══════════════════════════════════════════════════════════════╗
      // ║  15% – 35%: ROBOT WAKES AND STANDS                          ║
      // ║  Title fades. Robot rises. Atmosphere shifts.               ║
      // ╚══════════════════════════════════════════════════════════════╝

      // Title group fades and moves up
      masterTl.to('.hero-title', {
        opacity: 0,
        y: -30,
        scale: 0.95,
        duration: 0.15,
        ease: 'power2.in',
      }, 0.12);

      masterTl.to('.hero-subtitle', {
        opacity: 0,
        y: -15,
        duration: 0.12,
        ease: 'power2.in',
      }, 0.12);

      // Robot container rises (waking up)
      masterTl.to(robotContainerRef.current, {
        y: -20,
        scale: 1.05,
        duration: 0.2,
        ease: 'back.out(1.2)',
      }, 0.18);

      // Head lifts
      masterTl.to(headRef.current, {
        rotation: 0,
        y: 0,
        transformOrigin: '50px 65px',
        duration: 0.2,
        ease: 'back.out(1.4)',
      }, 0.18);

      // Eyes open
      masterTl.to(eyesRef.current, {
        scaleY: 1,
        transformOrigin: '50% 50%',
        duration: 0.15,
        ease: 'back.out(2)',
      }, 0.22);

      // Antenna brightens
      masterTl.to(antennaRef.current, {
        opacity: 0.9,
        attr: { r: 5 },
        duration: 0.1,
      }, 0.2);

      // ╔══════════════════════════════════════════════════════════════╗
      // ║  35% – 60%: ROBOT WALKS TO DOOR                             ║
      // ║  Camera slowly pushes forward. Lamps sway.                  ║
      // ╚══════════════════════════════════════════════════════════════╝

      // Robot walks toward the door (left, toward centre of scene)
      masterTl.to(robotContainerRef.current, {
        x: '18vw',
        y: -15,
        scale: 0.72,
        duration: 0.28,
        ease: 'power1.inOut',
      }, 0.33);

      // Body bobbing (secondary motion)
      masterTl.to(chestRef.current, {
        y: -2,
        duration: 0.04,
        yoyo: true,
        repeat: 6,
        ease: 'sine.inOut',
      }, 0.35);

      masterTl.to(headRef.current, {
        y: 1,
        rotation: 2,
        duration: 0.04,
        yoyo: true,
        repeat: 6,
        ease: 'sine.inOut',
      }, 0.35);

      // Leg animation — alternating
      masterTl.to(legLeftRef.current, {
        rotation: -25,
        transformOrigin: '35px 108px',
        duration: 0.04,
        yoyo: true,
        repeat: 6,
        ease: 'sine.inOut',
      }, 0.35);

      masterTl.to(legRightRef.current, {
        rotation: 25,
        transformOrigin: '65px 108px',
        duration: 0.04,
        yoyo: true,
        repeat: 6,
        delay: 0.02, // Offset for alternating gait
        ease: 'sine.inOut',
      }, 0.35);

      // Arm swing — opposite to legs
      masterTl.to(armLeftRef.current, {
        rotation: 20,
        transformOrigin: '22px 75px',
        duration: 0.04,
        yoyo: true,
        repeat: 6,
        ease: 'sine.inOut',
      }, 0.35);

      masterTl.to(armRightRef.current, {
        rotation: -20,
        transformOrigin: '78px 75px',
        duration: 0.04,
        yoyo: true,
        repeat: 6,
        delay: 0.02,
        ease: 'sine.inOut',
      }, 0.35);

      // Robot looks back at user mid-walk
      masterTl.to(headRef.current, {
        rotation: -25,
        duration: 0.06,
        ease: 'back.out(1.5)',
        transformOrigin: '50px 65px',
      }, 0.48);
      masterTl.to(headRef.current, {
        rotation: 0,
        duration: 0.05,
        ease: 'power2.out',
      }, 0.54);

      // Camera push: BG scales slightly
      masterTl.to(bgRef.current, {
        scale: 1.15,
        duration: 0.28,
        ease: 'none',
      }, 0.33);

      masterTl.to(midRef.current, {
        scale: 1.18,
        y: 20,
        duration: 0.28,
        ease: 'none',
      }, 0.33);

      // Foreground begins moving past camera
      masterTl.to(fgRef.current, {
        scale: 1.5,
        opacity: 0.6,
        duration: 0.28,
        ease: 'power1.in',
      }, 0.33);

      // ╔══════════════════════════════════════════════════════════════╗
      // ║  60% – 75%: LOCK MECHANISM ENGAGES                          ║
      // ║  Door lights up. Bolts slide. Gears turn.                   ║
      // ╚══════════════════════════════════════════════════════════════╝

      // Door crack brightens (light seeping through seam)
      masterTl.to('.door-centre-crack', {
        opacity: 0.6,
        duration: 0.1,
        ease: 'power2.in',
      }, 0.60);

      masterTl.to('.door-crack-glow', {
        opacity: 0.4,
        duration: 0.1,
        ease: 'power2.inOut',
      }, 0.60);

      // Lock bars slide outward (left and right panels separate)
      masterTl.to('.door-lock-bar', {
        x: (i: number) => i % 2 === 0 ? -12 : 12,
        duration: 0.1,
        ease: 'power2.inOut',
        stagger: 0.01,
      }, 0.62);

      // Robot arrives at door — faces it
      masterTl.to(headRef.current, {
        rotation: 10,
        duration: 0.06,
        ease: 'power2.inOut',
        transformOrigin: '50px 65px',
      }, 0.63);

      // ╔══════════════════════════════════════════════════════════════╗
      // ║  75% – 90%: DOOR OPENS — LIGHT FLOODS IN                    ║
      // ║  Warm light fills the screen. Everything brightens.         ║
      // ╚══════════════════════════════════════════════════════════════╝

      // The door panels swing open (clip-path / scale-x)
      masterTl.to('.door-left-panel', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.15,
        ease: 'power3.inOut',
      }, 0.74);

      masterTl.to('.door-right-panel', {
        scaleX: 0,
        transformOrigin: 'right center',
        duration: 0.15,
        ease: 'power3.inOut',
      }, 0.74);

      // Door crack becomes a flood of warm light
      masterTl.to('.door-crack-glow', {
        opacity: 1,
        scaleX: 60, // Expands horizontally to fill arch
        transformOrigin: 'center',
        duration: 0.15,
        ease: 'power3.out',
      }, 0.75);

      masterTl.to('.door-centre-crack', {
        opacity: 1,
        strokeWidth: 80,
        duration: 0.15,
        ease: 'power2.out',
      }, 0.75);

      // Camera accelerates deeply into the door
      masterTl.to(bgRef.current, {
        scale: 15,
        opacity: 0,
        duration: 0.2,
        ease: 'power3.in',
      }, 0.78);

      masterTl.to(midRef.current, {
        scale: 5,
        opacity: 0,
        duration: 0.2,
        ease: 'power4.in',
      }, 0.78);

      masterTl.to(fgRef.current, {
        scale: 4,
        opacity: 0,
        duration: 0.15,
        ease: 'power3.in',
      }, 0.78);

      // Robot walks through — continues forward and fades
      masterTl.to(robotContainerRef.current, {
        x: '30vw',
        scale: 0.3,
        opacity: 0,
        duration: 0.2,
        ease: 'power3.in',
      }, 0.78);

      // ╔══════════════════════════════════════════════════════════════╗
      // ║  90% – 100%: PARTICLE BURST / SCENE SWAP                    ║
      // ║  Scene 2 transition triggered without fading to black.        ║
      // ╚══════════════════════════════════════════════════════════════╝

      // Pure whiteout from the warm light flood instead of fading to black
      masterTl.to(stickyRef.current, {
        backgroundColor: '#fcdba1',
        duration: 0.15,
        ease: 'power3.in',
      }, 0.85);

      // The light completely engulfs the camera before the scene swaps
      masterTl.to('.door-crack-glow', {
        opacity: 1,
        scaleX: 200,
        scaleY: 200,
        duration: 0.1,
        ease: 'power4.in',
      }, 0.90);

    }, containerRef);

    return () => {
      ctx.revert();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doTransition]); // Intentionally omit isAwake/wakeUp — use refs to prevent timeline rebuild

  return (
    <div
      ref={containerRef}
      className="hero-scroll-container relative w-full h-[400vh]"
    >
      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-screen overflow-hidden cursor-none bg-[#050403]"
      >
        {/* Layer 1: Deep Background (Stone wall, arch, skylights) */}
        <div
          ref={bgRef}
          className="absolute inset-0 w-full h-full gpu-layer origin-center"
        >
          <BackgroundLayer />
        </div>

        {/* Lighting System */}
        <Lighting />

        {/* Layer 2: Midground (Vault door, hanging lamps, clock) */}
        <div
          ref={midRef}
          className="absolute inset-0 w-full h-full gpu-layer origin-center"
        >
          <MidgroundLayer />
        </div>

        {/* Layer 2.5: Robot */}
        <div
          ref={robotContainerRef}
          className="absolute inset-0 z-[35] pointer-events-none gpu-layer origin-bottom"
        >
          <Robot
            headRef={headRef}
            chestRef={chestRef}
            eyesRef={eyesRef}
            antennaRef={antennaRef}
            legLeftRef={legLeftRef}
            legRightRef={legRightRef}
            armLeftRef={armLeftRef}
            armRightRef={armRightRef}
          />
        </div>

        {/* Particle Dust Layer */}
        <DustParticles />

        {/* Layer 3: Foreground (Stone floor, corner shadows) */}
        <div
          ref={fgRef}
          className="absolute inset-0 w-full h-full gpu-layer origin-center"
        >
          <ForegroundLayer />
        </div>

        {/* UI: Title, Subtitle, Scroll Hint */}
        <TextOverlay />
      </div>
    </div>
  );
});

export default HeroScene;
