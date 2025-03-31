import { create } from 'zustand';

export const useTimerStore = create<TimerState>((set) => ({
  running: false,
  toggle: () => set((state) => ({ running: !state.running })),
  set: (value) => set({ running: value }),
}));

export type TimerState = {
  running: boolean;
  toggle: () => void;
  set: (value: boolean) => void;
};
