import { render, screen } from '@testing-library/react';
import Toolbar from './Toolbar';
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../states/timerStore', async () => {
  return {
    useTimerStore: (fn: any) =>
      fn({
        running: false,
        toggle: vi.fn(),
        set: vi.fn(),
      }),
  };
});

vi.mock('../../states/settingsStore', async () => {
  return {
    useSettingsStore: (fn: any) =>
      fn({
        open: vi.fn(),
      }),
  };
});

describe('Toolbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all tool buttons', () => {
    render(<Toolbar />);

    expect(screen.getByText('Undo')).toBeInTheDocument();
    expect(screen.getByText('Redo')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Load')).toBeInTheDocument();
    expect(screen.getByText(/Timer/)).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });


});
