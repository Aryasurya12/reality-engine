import { create } from 'zustand';

interface GlobalState {
  currentScene: 'scene1_entrance' | 'scene2_machine_room' | 'scene3_observatory';
  isTransitioning: boolean;
  repairPhase: 'idle' | 'transitioning' | 'ready_to_repair' | 'repaired';
  transitionToScene: (scene: 'scene1_entrance' | 'scene2_machine_room' | 'scene3_observatory') => void;
  setRepairPhase: (phase: 'idle' | 'transitioning' | 'ready_to_repair' | 'repaired') => void;
}

export const useGlobalState = create<GlobalState>((set) => ({
  currentScene: 'scene1_entrance',
  isTransitioning: false,
  repairPhase: 'idle',
  transitionToScene: (scene) => set({ currentScene: scene }),
  setRepairPhase: (phase) => set({ repairPhase: phase }),
}));
