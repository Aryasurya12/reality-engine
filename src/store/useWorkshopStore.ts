import { create } from 'zustand';

export type StoryPhase = 'sleep' | 'awake_idle' | 'discovery' | 'guiding' | 'waiting_at_door';

interface WorkshopState {
  isAwake: boolean;
  storyPhase: StoryPhase;
  wakeUp: () => void;
  setStoryPhase: (phase: StoryPhase) => void;
  sleep: () => void;
}

export const useWorkshopStore = create<WorkshopState>((set) => ({
  isAwake: false,
  storyPhase: 'sleep',
  wakeUp: () => set({ isAwake: true, storyPhase: 'awake_idle' }),
  setStoryPhase: (phase) => set({ storyPhase: phase }),
  sleep: () => set({ isAwake: false, storyPhase: 'sleep' }),
}));
