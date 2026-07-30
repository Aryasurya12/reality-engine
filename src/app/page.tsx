'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DustParticles from "@/components/DustParticles";
import PhysicsRoom from "@/components/PhysicsRoom";
import Observatory from "@/components/Observatory";
import { useAudio } from "@/hooks/useAudio";
import { Settings, Wrench, Compass } from "lucide-react";

export default function Home() {
  const { playHover, playClick } = useAudio();
  const mainRef = useRef<HTMLElement>(null);
  const entranceRef = useRef<HTMLElement>(null);
  const machineRoomRef = useRef<HTMLElement>(null);
  const physicsRoomRef = useRef<HTMLElement>(null);
  const observatoryRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Entrance Parallax and Fade
      gsap.to('.entrance-title', {
        y: 100,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: entranceRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });

      // Machine Room Reveal
      gsap.fromTo('.machine-content',
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: machineRoomRef.current,
            start: 'top center',
            end: 'center center',
            scrub: false,
          }
        }
      );
      
      // Rotate the compass based on scroll
      gsap.to('.machine-compass', {
        rotation: 360,
        ease: 'none',
        scrollTrigger: {
          trigger: machineRoomRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });
      
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={mainRef} className="relative w-full bg-[var(--color-workshop-bg)] text-workshop-brass overflow-hidden">
      <DustParticles />
      
      {/* Background Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 bg-radial-glow opacity-30" />
        <div className="absolute top-3/4 right-1/4 w-[1000px] h-[1000px] translate-x-1/4 -translate-y-1/4 bg-radial-glow opacity-20" />
      </div>

      {/* Room 1: The Entrance */}
      <section ref={entranceRef} className="relative z-10 flex min-h-screen flex-col items-center justify-center p-24">
        <div className="entrance-title text-center flex flex-col items-center gap-6">
          <Settings className="w-16 h-16 text-[var(--color-workshop-brass)] opacity-80 animate-[spin_20s_linear_infinite]" />
          <h1 
            onMouseEnter={playHover}
            onClick={playClick}
            className="font-serif text-6xl md:text-8xl tracking-wider text-glow bg-gradient-to-b from-[#fcdba1] to-[#b58953] bg-clip-text text-transparent hover:scale-105 transition-transform duration-500 cursor-pointer"
          >
            The Inventor's Workshop
          </h1>
          <p className="font-sans text-xl tracking-[0.2em] uppercase opacity-60 text-[var(--color-workshop-copper)]">
            Awaits Your Curiosity
          </p>
          <div className="mt-12 w-[1px] h-32 bg-gradient-to-b from-[var(--color-workshop-brass)] to-transparent opacity-50" />
        </div>
      </section>

      {/* Room 2: The Machine Room */}
      <section ref={machineRoomRef} className="relative z-10 flex min-h-screen flex-col items-center justify-center p-24">
        <div className="machine-content flex w-full max-w-6xl justify-between items-center">
          <div className="w-1/2 flex flex-col gap-8">
            <Wrench className="w-12 h-12 text-[var(--color-workshop-copper)]" />
            <h2 
              onMouseEnter={playHover} 
              className="font-serif text-5xl text-glow"
            >
              The Machine Room
            </h2>
            <p className="font-sans text-lg font-light leading-relaxed opacity-70">
              Gears grind slowly in the background. The scent of old oil and polished wood fills the air. Every mechanism here was built with purpose, waiting for a master to return.
            </p>
          </div>
          <div 
            onMouseEnter={playHover}
            onClick={playClick}
            className="w-1/3 h-[500px] border border-[var(--color-workshop-brass)] border-opacity-30 rounded-full flex items-center justify-center relative overflow-hidden bg-[rgba(2c,1a,0e,0.2)] backdrop-blur-sm hover:border-opacity-100 transition-colors duration-500 cursor-pointer group"
          >
             <div className="absolute inset-0 bg-radial-glow opacity-40 group-hover:opacity-80 transition-opacity duration-500" />
             <Compass className="machine-compass w-32 h-32 text-[var(--color-workshop-brass)] opacity-20 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>
      </section>

      {/* Room 3: The Physics Lab */}
      <section ref={physicsRoomRef} className="relative z-10 flex min-h-screen flex-col items-center justify-center p-0">
        <PhysicsRoom />
      </section>

      {/* Room 4: The Observatory Finale */}
      <section ref={observatoryRef} className="relative z-10 flex min-h-screen flex-col items-center justify-center p-0">
        <Observatory />
      </section>

    </main>
  );
}
