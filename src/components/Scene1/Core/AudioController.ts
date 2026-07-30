import { Howl } from 'howler';

// In a real production environment, these would point to actual sound assets.
// Howler handles loading and caching automatically.

export const sounds = {
  servo: new Howl({ src: ['/sounds/servo.mp3'], volume: 0.2 }),
  footstep: new Howl({ src: ['/sounds/metal_step.mp3'], volume: 0.3 }),
  gearClick: new Howl({ src: ['/sounds/gear_click.mp3'], volume: 0.4 }),
  steamHiss: new Howl({ src: ['/sounds/steam_hiss.mp3'], volume: 0.1 }),
  robotBeep: new Howl({ src: ['/sounds/robot_beep.mp3'], volume: 0.3 }),
  ambientHum: new Howl({ src: ['/sounds/ambient_hum.mp3'], volume: 0.1, loop: true })
};

let audioUnlocked = false;

// Call this on the first user interaction
export const unlockAudio = () => {
  if (audioUnlocked) return;
  // Howler automatically unlocks audio on user gesture, but we can explicitly start the ambient hum
  sounds.ambientHum.play();
  audioUnlocked = true;
};
