import { create } from 'zustand';

export type StoryPhase = 'sleeping' | 'waking' | 'idle' | 'curious' | 'guiding' | 'waiting_at_door';

interface WorkshopState {
  isAwake: boolean;
  storyPhase: StoryPhase;
  scrollProgress: number; // 0 to 100
  wakeUp: () => void;
  setStoryPhase: (phase: StoryPhase) => void;
  setScrollProgress: (progress: number) => void;
  sleep: () => void;
}

export const useWorkshopStore = create<WorkshopState>((set) => ({
  isAwake: false,
  storyPhase: 'sleeping',
  scrollProgress: 0,
  wakeUp: () => set({ isAwake: true, storyPhase: 'waking' }),
  setStoryPhase: (phase) => set({ storyPhase: phase }),
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  sleep: () => set({ isAwake: false, storyPhase: 'sleeping' }),
}));
