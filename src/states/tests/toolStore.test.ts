import { describe, it, expect, beforeEach } from 'vitest';
import { useToolStore } from '../toolStore';

/**
 * Test suite for the toolStore Zustand store
 */
describe('toolStore', () => {
  /**
   * Reset the store state before each test to ensure test isolation
   */
  beforeEach(() => {
    // Reset store to initial state
    const { setTool } = useToolStore.getState();
    setTool('Select');
  });

  /**
   * Verify initial state has the expected default value
   */
  it('should initialize with "Select" as the default tool', () => {
    const { tool } = useToolStore.getState();
    expect(tool).toBe('Select');
  });

  /**
   * Test that setTool updates the state correctly
   */
  it('should update tool state when setTool is called', () => {
    const { setTool } = useToolStore.getState();

    // Change tool and verify
    setTool('Measure');
    expect(useToolStore.getState().tool).toBe('Measure');
  });

  /**
   * Verify multiple sequential updates work correctly
   */
  it('should handle multiple tool changes', () => {
    const { setTool } = useToolStore.getState();

    // Cycle through multiple tools and verify each change
    // Define the Tool type
        type Tool = 'Navigate' | 'Zoom' | 'Mark' | 'Color Filter' | 'No Tool';

        const toolSequence: Tool[] = ['Navigate', 'Zoom', 'Mark', 'Color Filter', 'No Tool'];

    toolSequence.forEach(tool => {
      setTool(tool);
      expect(useToolStore.getState().tool).toBe(tool);
    });
  });
});
