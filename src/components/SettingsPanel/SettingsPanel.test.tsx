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
import SettingsPanel from './SettingsPanel';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';

// Create shared mocks so we can inspect their calls
const close = vi.fn();
const setMockFabricCount = vi.fn();
const setThickerGrid = vi.fn();

/**
 * Mock implementation of the settings Zustand store
 *
 * This mock provides controlled test values and spy functions
 * to verify component interactions with the store.
 */
vi.mock('../../states/settingsStore', async () => {
  return {
    useSettingsStore: (fn: any) =>
      fn({
        isOpen: true,        // Panel is always visible in tests
        close,               // Spy function to verify panel closing
        mockFabricCount: '14', // Default fabric count
        setMockFabricCount,  // Spy function for fabric count changes
        thickerGrid: false,  // Default grid thickness
        setThickerGrid,      // Spy function for grid thickness changes
      }),
  };
});

/**
 * SettingsPanel component test suite
 */
describe('SettingsPanel', () => {
  beforeEach(() => {
    // Reset all mocks before each test to prevent test interference
    vi.clearAllMocks();
  });

  /**
   * Verify basic rendering of the panel when isOpen is true
   */
  it('renders when isOpen is true', () => {
    render(<SettingsPanel />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByLabelText('Fabric Count')).toBeInTheDocument();
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
    // Mock window.confirm to return false (user clicks "Cancel" on confirm dialog)
    window.confirm = vi.fn(() => false);

    render(<SettingsPanel />);
    // Make a change to dirty the form
    await userEvent.selectOptions(screen.getByLabelText('Fabric Count'), '16');
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
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    // Confirm should not be shown for clean state
    expect(window.confirm).not.toHaveBeenCalled();

    // Panel should close directly
    expect(close).toHaveBeenCalled();
  });
});
