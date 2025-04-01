// src/states/selectionStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useSelectionStore } from '../selectionStore';

// Helper to reset the store between tests
beforeEach(() => {
  useSelectionStore.getState().clear();
});

describe('useSelectionStore', () => {
  it('toggles selection state correctly', () => {
    const key = '3,4';
    const { toggle, isSelected } = useSelectionStore.getState();

    expect(isSelected(key)).toBe(false);
    toggle(key);
    expect(isSelected(key)).toBe(true);
    toggle(key);
    expect(isSelected(key)).toBe(false);
  });

  it('clears all selections', () => {
    const { toggle, isSelected, clear } = useSelectionStore.getState();
    toggle('1,1');
    toggle('2,2');
    expect(isSelected('1,1')).toBe(true);
    expect(isSelected('2,2')).toBe(true);
    clear();
    expect(isSelected('1,1')).toBe(false);
    expect(isSelected('2,2')).toBe(false);
  });
});
