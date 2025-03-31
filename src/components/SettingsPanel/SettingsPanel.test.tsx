import { render, screen } from '@testing-library/react';
import SettingsPanel from './SettingsPanel';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

// Mock Zustand store
vi.mock('../../states/settingsStore', async () => {
  return {
    useSettingsStore: (fn: any) =>
      fn({
        isOpen: true,
        close: vi.fn(),
        mockFabricCount: '14',
        setMockFabricCount: vi.fn(),
        thickerGrid: false,
        setThickerGrid: vi.fn(),
      }),
  };
});

describe('SettingsPanel', () => {
  it('renders when isOpen is true', () => {
    render(<SettingsPanel />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByLabelText('Fabric Count')).toBeInTheDocument();
  });

  it('enables Apply button when settings are dirty', async () => {
    render(<SettingsPanel />);
    const select = screen.getByLabelText('Fabric Count');
    const apply = screen.getByRole('button', { name: 'Apply' });

    // Initially disabled
    expect(apply).toBeDisabled();

    // Simulate change
    await userEvent.selectOptions(select, '16');

    // Should now be enabled
    expect(apply).toBeEnabled();
  });
  
});
