// src/states/toolStore.ts
import { create } from 'zustand';

export type Tool =
  | 'Select'
  | 'Color Filter'
  | 'Mark'
  | 'Navigate'
  | 'Zoom'
  | 'Measure'
  | 'No Tool';

interface ToolState {
  tool: Tool;
  setTool: (tool: Tool) => void;
}

export const useToolStore = create<ToolState>((set) => ({
  tool: 'Select',
  setTool: (tool) => set({ tool }),
}));
