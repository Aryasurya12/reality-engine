'use client';

import { useEffect, useRef, memo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const TextOverlay = memo(function TextOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const titleWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      const letterSpans = titleRef.current?.querySelectorAll('span.letter-span');
      if (!letterSpans || letterSpans.length === 0) return;

      // ── Entrance: Letters stagger in from below ─────────────────────
      gsap.fromTo(
        letterSpans,
        {
          opacity: 0,
          y: 28,
          rotateX: -40,
          filter: 'blur(4px)',
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          filter: 'blur(0px)',
          duration: 0.7,
          stagger: 0.035,
          ease: 'power3.out',
          delay: 0.8,
        }
      );

      // ── Shimmer pass across text after letters settle ───────────────
      gsap.to('.title-shimmer-overlay', {
        x: '120%',
        duration: 1.5,
        ease: 'power2.inOut',
        delay: 2.8,
        repeat: -1,
        repeatDelay: 6,
      });

      // ── Floating idle motion ────────────────────────────────────────
      if (titleWrapRef.current) {
        gsap.to(titleWrapRef.current, {
          y: -6,
          duration: 4,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 3,
        });
      }

      // ── Subtitle entrance ───────────────────────────────────────────
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 16, letterSpacing: '0.2em' },
        {
          opacity: 1,
          y: 0,
          letterSpacing: '0.4em',
          duration: 1.5,
          ease: 'power3.out',
          delay: 2.2,
        }
      );

      // ── Scroll hint entrance ────────────────────────────────────────
      gsap.fromTo(
        scrollHintRef.current,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          delay: 3.5,
        }
      );

      // ── Scroll-driven exit: title moves up and fades ────────────────
      // Triggered by HeroScene's container scroll
      if (titleWrapRef.current && scrollHintRef.current) {
        gsap.to([titleWrapRef.current], {
          y: -60,
          opacity: 0,
          scale: 0.92,
          duration: 0.25,
          ease: 'power2.in',
          scrollTrigger: {
            trigger: '.hero-scroll-container',
            start: 'top top',
            end: '15% top',
            scrub: 0.6,
          },
        });

        gsap.to(scrollHintRef.current, {
          y: -30,
          opacity: 0,
          duration: 0.15,
          ease: 'power2.in',
          scrollTrigger: {
            trigger: '.hero-scroll-container',
            start: 'top top',
            end: '8% top',
            scrub: 0.4,
          },
        });
      }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-50 pointer-events-none flex flex-col items-center justify-end pb-[12%] text-center"
      style={{ perspective: '800px' }}
    >
      {/* Title group */}
      <div ref={titleWrapRef} className="relative will-change-transform">
        {/* Shimmer overlay */}
        <div
          className="title-shimmer-overlay absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(252,219,161,0.4) 50%, transparent 100%)',
            transform: 'translateX(-120%)',
            zIndex: 1,
            mixBlendMode: 'screen',
          }}
        />

        <h1
          ref={titleRef}
          className="hero-title font-serif text-4xl md:text-6xl lg:text-7xl tracking-wider leading-tight flex flex-wrap justify-center"
          style={{
            background: 'linear-gradient(180deg, #fcdba1 0%, #c89040 60%, #8a6535 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: 'none',
            filter: 'drop-shadow(0 0 30px rgba(181,137,83,0.35)) drop-shadow(0 4px 12px rgba(0,0,0,0.8))',
          }}
          aria-label="The Inventor's Workshop"
        >
          {"The Inventor's Workshop".split('').map((char, i) => (
            char === ' ' ? (
              <span key={i} className="inline-block whitespace-pre">&nbsp;</span>
            ) : (
              <span key={i} className="letter-span inline-block will-change-transform">
                {char}
              </span>
            )
          ))}
        </h1>
      </div>

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        className="hero-subtitle mt-4 font-sans text-xs md:text-sm tracking-[0.4em] uppercase opacity-0"
        style={{
          color: '#8a6535',
          letterSpacing: '0.4em',
          textShadow: '0 0 20px rgba(138,101,53,0.4)',
        }}
      >
        Every invention begins with curiosity
      </p>

      {/* Scroll hint */}
      <div
        ref={scrollHintRef}
        className="mt-8 flex flex-col items-center gap-2 opacity-0"
      >
        <span
          className="font-sans text-[10px] tracking-[0.3em] uppercase"
          style={{ color: '#6b4e28', opacity: 0.8 }}
        >
          Scroll to Enter
        </span>
        {/* Animated chevron arrow */}
        <div className="animate-scroll-bounce">
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
            <path
              d="M 8 2 L 8 18 M 2 12 L 8 20 L 14 12"
              stroke="#b58953"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
});

export default TextOverlay;
