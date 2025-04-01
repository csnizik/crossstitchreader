// src/states/selectionStore.ts
import { create } from 'zustand';

interface SelectionState {
  selected: Set<string>; // Use "x,y" keys
  toggle: (key: string) => void;
  isSelected: (key: string) => boolean;
}

export const useSelectionStore = create<SelectionState>((set, get) => ({
  selected: new Set(),
  toggle: (key: string) => {
    const updated = new Set(get().selected);
    if (updated.has(key)) {
      updated.delete(key);
    } else {
      updated.add(key);
    }
    set({ selected: updated });
  },
  isSelected: (key: string) => get().selected.has(key),
}));
