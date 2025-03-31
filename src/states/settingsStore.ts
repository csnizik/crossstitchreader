import { create } from 'zustand';

type SettingsStore = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;

  mockFabricCount: string;
  setMockFabricCount: (value: string) => void;
};

export const useSettingsStore = create<SettingsStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),

  mockFabricCount: '14',
  setMockFabricCount: (value) => set({ mockFabricCount: value }),
}));

