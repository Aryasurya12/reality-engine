import { memo, useRef, useEffect } from 'react';
import gsap from 'gsap';

interface MedallionLinkProps {
  href: string;
  icon: 'github' | 'linkedin';
  label: string;
  className?: string;
  delay?: number; // Delay for the sweep effect
}

const MedallionLink = memo(function MedallionLink({ href, icon, label, className = '', delay = 0 }: MedallionLinkProps) {
  const containerRef = useRef<HTMLAnchorElement>(null);
  const sweepRef = useRef<SVGLinearGradientElement>(null);

  useEffect(() => {
    // Shimmer sweep effect on mount (delayed to sync with the climax reveal)
    const ctx = gsap.context(() => {
      if (sweepRef.current) {
        gsap.fromTo(sweepRef.current.querySelector('stop'), 
          { stopColor: 'rgba(252,219,161,0)' },
          { 
            stopColor: 'rgba(252,219,161,0.8)', 
            duration: 0.5, 
            ease: 'power2.out',
            delay: delay,
            yoyo: true,
            repeat: 1
          }
        );
      }
    });
    return () => ctx.revert();
  }, [delay]);

  return (
    <a 
      ref={containerRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex items-center justify-center w-16 h-16 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#e8c07a] ${className}`}
      aria-label={label}
    >
      {/* Outer Glow */}
      <div className="absolute inset-0 bg-[#e8c07a] opacity-0 group-hover:opacity-20 blur-[15px] rounded-full transition-opacity duration-700" />
      
      {/* The Brass Medallion */}
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 transition-transform duration-[4s] ease-linear group-hover:rotate-[360deg]">
        <defs>
          {/* Base metallic gradient */}
          <radialGradient id={`brass-base-${icon}`} cx="32" cy="32" r="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#b58953" />
            <stop offset="1" stopColor="#3d2e1c" />
          </radialGradient>
          
          {/* Shimmer sweep gradient */}
          <linearGradient id={`shimmer-${icon}`} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse" ref={sweepRef}>
            <stop offset="0.5" stopColor="rgba(252,219,161,0)" />
          </linearGradient>
        </defs>

        {/* Outer Ring */}
        <circle cx="32" cy="32" r="30" fill={`url(#brass-base-${icon})`} stroke="#0a0806" strokeWidth="2" />
        {/* Inner Etched Ring */}
        <circle cx="32" cy="32" r="26" fill="none" stroke="#fcdba1" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="2 2" />
        {/* Deep Inner Ring */}
        <circle cx="32" cy="32" r="22" fill="#0a0806" stroke="#5c4427" strokeWidth="1.5" />
        
        {/* Shimmer overlay */}
        <circle cx="32" cy="32" r="30" fill={`url(#shimmer-${icon})`} style={{ mixBlendMode: 'overlay' }} />

        {/* Icons */}
        <g className="text-[#e8c07a]" transform="translate(19.5, 19.5) scale(1)">
          {icon === 'github' && (
            <path 
              d="M12.5 1C6.15 1 1 6.15 1 12.5C1 17.58 4.29 21.9 8.87 23.42C9.44 23.53 9.65 23.18 9.65 22.88C9.65 22.61 9.64 21.72 9.64 20.73C6.44 21.43 5.76 19.19 5.76 19.19C5.24 17.87 4.5 17.52 4.5 17.52C3.47 16.82 4.58 16.83 4.58 16.83C5.72 16.91 6.32 18 6.32 18C7.33 19.73 8.97 19.23 9.69 18.94C9.79 18.12 10.13 17.62 10.51 17.34C7.96 17.05 5.27 16.06 5.27 11.89C5.27 10.7 5.7 9.73 6.4 8.97C6.29 8.68 5.91 7.57 6.51 6.1C6.51 6.1 7.43 5.81 9.63 7.3C10.5 7.06 11.45 6.94 12.39 6.94C13.33 6.94 14.28 7.06 15.15 7.3C17.35 5.81 18.27 6.1 18.27 6.1C18.87 7.57 18.49 8.68 18.38 8.97C19.08 9.73 19.51 10.7 19.51 11.89C19.51 16.08 16.81 17.05 14.25 17.33C14.73 17.74 15.16 18.55 15.16 19.79C15.16 21.57 15.14 23 15.14 22.88C15.14 23.18 15.35 23.54 15.93 23.42C20.5 21.9 23.79 17.58 23.79 12.5C23.79 6.15 18.64 1 12.5 1Z" 
              fill="currentColor" 
            />
          )}
          {icon === 'linkedin' && (
            <path 
              d="M5.61 22.39V8.01H1.05V22.39H5.61ZM3.33 6.06C4.92 6.06 5.91 5.01 5.91 3.7C5.88 2.36 4.92 1.35 3.36 1.35C1.8 1.35 0.78 2.36 0.78 3.7C0.78 5.01 1.77 6.06 3.3 6.06H3.33ZM7.92 22.39H12.48V14.37C12.48 13.94 12.51 13.52 12.64 13.22C12.98 12.36 13.77 11.48 15.08 11.48C16.8 11.48 17.49 12.79 17.49 14.71V22.39H22.05V14.16C22.05 9.75 19.69 7.68 16.42 7.68C13.85 7.68 12.71 9.1 12.08 10.15H12.11V8.01H7.55C7.61 9.29 7.92 22.39 7.92 22.39Z" 
              fill="currentColor" 
            />
          )}
        </g>
      </svg>
    </a>
  );
});

export default MedallionLink;
