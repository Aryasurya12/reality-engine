import { create } from 'zustand';

export type Scene = 'scene1_entrance' | 'scene2_machine_room';

interface GlobalState {
  currentScene: Scene;
  transitionToScene: (scene: Scene) => void;
}

export const useGlobalState = create<GlobalState>((set) => ({
  currentScene: 'scene1_entrance',
  transitionToScene: (scene) => set({ currentScene: scene }),
}));
