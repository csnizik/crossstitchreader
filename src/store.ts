import { create } from 'zustand';

type Store = {
  pattern: any; // Replace with a specific type as needed
  stitches: any[]; // Update type as needed
  displayMode: string;
  placeholder: any; // Adjust type if necessary
};

export const useStore = create<Store>(() => ({
  pattern: null,
  stitches: [],
  displayMode: 'default',
  placeholder: null,
}));
