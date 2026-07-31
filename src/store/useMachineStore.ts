import { create } from 'zustand';

export type MachineState = 'broken' | 'stage1' | 'stage2' | 'overdrive';
export type RobotReaction = 'disappointed' | 'curious' | 'celebrating' | 'amazed';

interface MachineStore {
  gearsInstalled: number;
  machineState: MachineState;
  robotReaction: RobotReaction;
  installGear: () => void;
  setRobotReaction: (reaction: RobotReaction) => void;
}

export const useMachineStore = create<MachineStore>((set) => ({
  gearsInstalled: 0,
  machineState: 'broken',
  robotReaction: 'disappointed',
  installGear: () => set((state) => {
    const newCount = state.gearsInstalled + 1;
    let newState: MachineState = 'broken';
    if (newCount === 1) newState = 'stage1';
    if (newCount === 2) newState = 'stage2';
    if (newCount >= 3) newState = 'overdrive';
    
    return {
      gearsInstalled: newCount,
      machineState: newState,
      robotReaction: 'celebrating' // Momentary celebration on each install
    };
  }),
  setRobotReaction: (reaction) => set({ robotReaction: reaction })
}));
