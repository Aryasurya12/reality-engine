import { create } from 'zustand';

export type CursorState = 'default' | 'hover-robot' | 'hover-drag' | 'hover-machine' | 'dragging' | 'placed';

interface CursorStore {
  cursorState: CursorState;
  setCursorState: (state: CursorState) => void;
}

export const useCursorStore = create<CursorStore>((set) => ({
  cursorState: 'default',
  setCursorState: (state) => set({ cursorState: state }),
}));
