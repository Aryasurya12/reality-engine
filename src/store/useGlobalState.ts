import { create } from 'zustand';
import React from 'react';

export type SceneState = 'scene1_entrance' | 'scene2_gallery' | 'scene3_ending';

interface GlobalState {
  currentScene: SceneState;
  transitionToScene: (scene: SceneState) => void;
  isAudioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  // Legacy properties for old components to avoid build errors
  showEnding: boolean;
  setShowEnding: (show: boolean) => void;
  repairPhase: 'idle' | 'transitioning' | 'repaired';
  
  activeInvention: { id: string; title: string; type: 'eye' | 'brain' | 'automaton' } | null;
  setActiveInvention: (invention: { id: string; title: string; type: 'eye' | 'brain' | 'automaton' } | null) => void;
}

export const useGlobalState = create<GlobalState>((set) => ({
  // Start at scene 1
  currentScene: 'scene1_entrance',
  
  transitionToScene: (scene) => {
    set({ currentScene: scene });
  },

  isAudioEnabled: false,
  setAudioEnabled: (enabled) => set({ isAudioEnabled: enabled }),
  
  showEnding: false,
  setShowEnding: (show) => set({ showEnding: show }),
  repairPhase: 'idle',
  
  activeInvention: null,
  setActiveInvention: (invention) => set({ activeInvention: invention }),
}));
