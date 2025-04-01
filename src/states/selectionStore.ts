// states/selectionStore.ts
import { create } from 'zustand';

type SelectionState = {
  selected: Set<string>;
  toggle: (key: string) => void;
  clear: () => void;
  isSelected: (key: string) => boolean;
};

export const useSelectionStore = create<SelectionState>((set, get) => ({
  selected: new Set(),

  toggle: (key: string) => {
    const newSelected = new Set(get().selected);
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    if (process.env.NODE_ENV === 'development') {
      console.log('Selected:', [...newSelected]); // 👈 log update
    }
    set({ selected: newSelected });
  },

  clear: () => {
    set({ selected: new Set() });
    console.log('Selected: []'); // 👈 clear log
  },

  isSelected: (key: string) => get().selected.has(key),
}));
