'use client';

import { useEffect, useRef } from 'react';
import { Howl, Howler } from 'howler';

// In a real project, we would point these to actual audio files in the public folder.
// e.g. src: ['/audio/hover.mp3']
export function useAudio() {
  const hoverSoundRef = useRef<Howl | null>(null);
  const clickSoundRef = useRef<Howl | null>(null);
  const ambientSoundRef = useRef<Howl | null>(null);

  useEffect(() => {
    // Note: Since we don't have actual files, we wrap this in try-catch or just instantiate
    // with empty/placeholder paths. It will fail gracefully if the files are not found.
    hoverSoundRef.current = new Howl({
      src: ['/audio/tick.mp3'], // Placeholder
      volume: 0.2,
    });

    clickSoundRef.current = new Howl({
      src: ['/audio/clack.mp3'], // Placeholder
      volume: 0.4,
    });

    ambientSoundRef.current = new Howl({
      src: ['/audio/workshop-ambient.mp3'], // Placeholder
      volume: 0.1,
      loop: true,
      autoplay: false, // User interaction required for autoplay in most browsers
    });

    // Start ambient on first interaction
    const startAmbient = () => {
      if (ambientSoundRef.current && !ambientSoundRef.current.playing()) {
        ambientSoundRef.current.play();
      }
      window.removeEventListener('click', startAmbient);
    };
    
    window.addEventListener('click', startAmbient);

    return () => {
      window.removeEventListener('click', startAmbient);
      Howler.unload();
    };
  }, []);

  const playHover = () => hoverSoundRef.current?.play();
  const playClick = () => clickSoundRef.current?.play();

  return { playHover, playClick };
}
