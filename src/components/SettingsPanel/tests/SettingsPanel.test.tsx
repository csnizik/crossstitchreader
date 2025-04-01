/**
 * Test suite for the SettingsPanel component
 *
 * These tests verify:
 * - Rendering behavior when the panel is open
 * - Form state management (dirty tracking, validation)
 * - Button behaviors (Apply, Cancel)
 * - Confirmation dialogs for unsaved changes
 */
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';

// Define mocks INSIDE the vi.mock call to avoid hoisting issues
vi.mock('../../../states/settingsStore', () => {
  // Create mock functions inside the factory to avoid hoisting problems
  const mockClose = vi.fn();
  const mockSetMockFabricCount = vi.fn();
  const mockSetThickerGrid = vi.fn();

  // Store references globally so tests can access them
  vi.stubGlobal('__settingsMocks', {
    close: mockClose,
    setMockFabricCount: mockSetMockFabricCount,
    setThickerGrid: mockSetThickerGrid
  });

  // Create a proper Zustand-like store implementation with correct property names
  const store = {
    isOpen: true,                  // Panel is always visible in tests
    close: mockClose,              // Spy function to verify panel closing
    mockFabricCount: '14',         // Match the property name in the component
    setMockFabricCount: mockSetMockFabricCount, // Match the property name
    thickerGrid: false,            // Default grid thickness
    setThickerGrid: mockSetThickerGrid, // Spy function for grid thickness
  };

  // Create a proper Zustand store mock with getState
  interface SettingsStore {
    isOpen: boolean;
    close: () => void;
    mockFabricCount: string;
    setMockFabricCount: (value: string) => void;
    thickerGrid: boolean;
    setThickerGrid: (value: boolean) => void;
  }


  type Selector<T> = (state: SettingsStore) => T;

  const useStore = <T,>(selector?: Selector<T>): T | SettingsStore => {
    if (typeof selector === 'function') {
      return selector(store);
    }
    return store;
  };

  // Add getState method that's used in the component
  useStore.getState = () => store;

  return {
    useSettingsStore: useStore
  };
});

// Import component AFTER mocks are defined
import SettingsPanel from '../SettingsPanel';

// Extend the global namespace to include __settingsMocks
declare global {
  var __settingsMocks: {
    close: jest.Mock;
    setMockFabricCount: jest.Mock;
    setThickerGrid: jest.Mock;
  };
}

// Access mocks from global object
const { close, setMockFabricCount, setThickerGrid } = global.__settingsMocks;

/**
 * SettingsPanel component test suite
 */
describe('SettingsPanel', () => {
  beforeEach(() => {
    // Reset all mocks before each test to prevent test interference
    vi.clearAllMocks();

    // Mock window.confirm to return true by default
    vi.spyOn(window, 'confirm').mockImplementation(() => true);

    // Mock createPortal since we're testing with JSDOM
    vi.mock('react-dom', async () => {
      const actual = await vi.importActual('react-dom');
      return {
        ...actual,
        createPortal: (children: React.ReactNode): React.ReactNode => children,
      };
    });
  });

  /**
   * Verify basic rendering of the panel when isOpen is true
   */
  it('renders when isOpen is true', () => {
    render(<SettingsPanel />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  /**
   * Test the dirty state tracking logic that enables/disables the Apply button
   * The Apply button should only be enabled when changes have been made
   */
  it('enables Apply button when settings are dirty', async () => {
    render(<SettingsPanel />);
    const select = screen.getByLabelText('Fabric Count');
    const apply = screen.getByRole('button', { name: 'Apply' });

    // Initially button should be disabled (no changes)
    expect(apply).toBeDisabled();

    // After changing a value, button should become enabled
    await userEvent.selectOptions(select, '16');
    expect(apply).toBeEnabled();
  });

  /**
   * Verify the Cancel button works properly when no changes have been made
   * It should close the panel without prompting for confirmation
   */
  it('calls close() when Cancel is clicked and settings are not dirty', async () => {
    render(<SettingsPanel />);
    const cancelBtn = screen.getByRole('button', { name: 'Cancel' });
    await userEvent.click(cancelBtn);
    expect(close).toHaveBeenCalled();
  });

  /**
   * Test the Apply button functionality
   * It should update all settings and close the panel
   */
  it('applies settings and closes panel when Apply is clicked', async () => {
    render(<SettingsPanel />);
    await userEvent.selectOptions(screen.getByLabelText('Fabric Count'), '16');
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }));

    // Verify settings were updated
    expect(setMockFabricCount).toHaveBeenCalledWith('16');
    expect(setThickerGrid).toHaveBeenCalledWith(false);

    // Verify panel was closed
    expect(close).toHaveBeenCalled();
  });

  /**
   * Test that the confirmation dialog appears when trying to cancel with unsaved changes
   * And that cancellation is aborted when the user declines
   */
  it('shows confirm dialog and cancels close when rejected', async () => {
    // IMPORTANT: Define a new mock implementation for this test only
    // This needs to be done BEFORE rendering the component
    vi.spyOn(window, 'confirm').mockImplementation(() => false);

    // Reset the close mock to ensure we're starting fresh
    close.mockReset();

    render(<SettingsPanel />);

    // Make a change to dirty the form
    await userEvent.selectOptions(screen.getByLabelText('Fabric Count'), '16');

    // Click Cancel button
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    // Confirm dialog should have been shown
    expect(window.confirm).toHaveBeenCalled();

    // Panel should not close when confirmation is rejected
    expect(close).not.toHaveBeenCalled();
  });

  /**
   * Verify that no confirmation is requested when cancelling with clean state
   */
  it('closes without confirm if not dirty', async () => {
    window.confirm = vi.fn(); // shouldn't be called

    render(<SettingsPanel />);
    // Missing closing parenthesis here:
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    // Confirm should not be shown for clean state
    expect(window.confirm).not.toHaveBeenCalled();

    // Panel should close directly
    expect(close).toHaveBeenCalled();
  });
});
