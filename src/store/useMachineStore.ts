import { create } from 'zustand';

export type ExplorationPhase = 'exploring' | 'noticing' | 'leading';
export type RobotReaction = 'curious' | 'interacting' | 'proud' | 'alert';

interface ExplorationStore {
  explorationPhase: ExplorationPhase;
  robotReaction: RobotReaction;
  setExplorationPhase: (phase: ExplorationPhase) => void;
  setRobotReaction: (reaction: RobotReaction) => void;
}

export const useMachineStore = create<ExplorationStore>((set) => ({
  explorationPhase: 'exploring',
  robotReaction: 'curious',
  setExplorationPhase: (phase) => set({ explorationPhase: phase }),
  setRobotReaction: (reaction) => set({ robotReaction: reaction })
}));
