// AudioController: Sound management with graceful fallback
// All play() calls are guarded with try/catch — missing files don't break the experience

let Howl: typeof import('howler').Howl | null = null;
let howlerLoaded = false;

// Lazy-load Howler only on client
async function loadHowler() {
  if (typeof window === 'undefined') return null;
  if (howlerLoaded) return Howl;
  try {
    const { Howl: H } = await import('howler');
    Howl = H;
    howlerLoaded = true;
  } catch {
    // Howler unavailable — all sounds silently skip
  }
  return Howl;
}

// Minimal no-op sound stub for when files don't exist
const silentSound = {
  play: () => {},
  pause: () => {},
  stop: () => {},
  volume: 0,
  loop: false,
};

function createSound(src: string[], volume: number, loop = false) {
  if (typeof window === 'undefined') return silentSound;

  try {
    // Dynamically try creating — fails silently if Howler not loaded
    const { Howl: H } = require('howler');
    return new H({
      src,
      volume,
      loop,
      onloaderror: () => {
        // File not found — sound silently skipped
      },
    });
  } catch {
    return silentSound;
  }
}

export const sounds = {
  servo:          createSound(['/sounds/servo.mp3'], 0.2),
  footstep:       createSound(['/sounds/metal_step.mp3'], 0.3),
  gearClick:      createSound(['/sounds/gear_click.mp3'], 0.4),
  steamHiss:      createSound(['/sounds/steam_hiss.mp3'], 0.1),
  robotBeep:      createSound(['/sounds/robot_beep.mp3'], 0.3),
  ambientHum:     createSound(['/sounds/ambient_hum.mp3'], 0.1, true),
  clockTick:      createSound(['/sounds/clock_tick.mp3'], 0.1),
  metalExpansion: createSound(['/sounds/metal_expansion.mp3'], 0.2),
  redAlert:       createSound(['/sounds/red_alert.mp3'], 0.2),
  musicBox:       createSound(['/sounds/music_box.mp3'], 0.4),
  doorCreak:      createSound(['/sounds/door_creak.mp3'], 0.5),
  boltEngage:     createSound(['/sounds/bolt_engage.mp3'], 0.6),
  heavyImpact:    createSound(['/sounds/heavy_impact.mp3'], 0.8),
  metalScrape:    createSound(['/sounds/metal_scrape.mp3'], 0.4),
  mechHum:        createSound(['/sounds/mech_hum.mp3'], 0.3, true),
  snapClick:      createSound(['/sounds/snap_click.mp3'], 0.7),
  happyBeep:      createSound(['/sounds/happy_beep.mp3'], 0.5),
};

let audioUnlocked = false;

export const unlockAudio = () => {
  if (audioUnlocked) return;
  try {
    sounds.ambientHum.play();
  } catch {
    // Audio unlock failed silently
  }
  audioUnlocked = true;
};

export const safePlay = (sound: typeof silentSound) => {
  try {
    sound.play();
  } catch {
    // Silent fail
  }
};
