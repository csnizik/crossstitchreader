import { render, screen, fireEvent } from '@testing-library/react';
import Toolbar from '../Toolbar';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock Zustand stores
const toggleMock = vi.fn();
const openMock = vi.fn();

vi.mock('../../states/timerStore', async () => ({
  useTimerStore: (fn: any) =>
    fn({
      running: false,
      toggle: toggleMock,
      set: vi.fn(),
    }),
}));

vi.mock('../../states/settingsStore', () => ({
  useSettingsStore: Object.assign(() => ({ open: openMock }), {
    getState: () => ({ open: openMock }),
  }),
}));

// Mock save/load utils
import * as saveLoad from '../../../utils/saveLoad';
const saveMock = vi.spyOn(saveLoad, 'savePattern').mockImplementation(() => {});
// const loadMock = vi.spyOn(saveLoad, 'loadPattern').mockResolvedValue({});

describe('Toolbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Needed because jsdom doesn't implement this
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:mock-url'),
      revokeObjectURL: vi.fn(),
    });
  });

  it('renders all toolbar buttons', () => {
    render(<Toolbar />);

    expect(screen.getByText('Undo')).toBeInTheDocument();
    expect(screen.getByText('Redo')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Load')).toBeInTheDocument();
    expect(screen.getByText('Start Timer')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('calls toggleTimer when timer button is clicked', () => {
    render(<Toolbar />);
    fireEvent.click(screen.getByText('Start Timer'));
    expect(toggleMock).toHaveBeenCalledOnce();
  });

  it('calls settingsStore.open() when settings clicked', () => {
    render(<Toolbar />);
    fireEvent.click(screen.getByText('Settings'));
    expect(openMock).toHaveBeenCalledOnce();
  });

  it('calls savePattern when Save is clicked', () => {
    render(<Toolbar />);
    fireEvent.click(screen.getByText('Save'));
    expect(saveMock).toHaveBeenCalledOnce();
  });

  it('triggers hidden file input when Load is clicked', () => {
    render(<Toolbar />);
    const fileInput = screen.getByTestId('load-input');
    const clickSpy = vi.spyOn(fileInput, 'click');
    fireEvent.click(screen.getByText('Load'));
    expect(clickSpy).toHaveBeenCalledOnce();
  });

  it('supports drag behavior', () => {
    render(<Toolbar />);
    const toolbar = screen.getByTestId('toolbar');

    // Simulate dragging
    fireEvent.mouseDown(toolbar, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(window, { clientX: 120, clientY: 130 });
    fireEvent.mouseUp(window);

    // No assertion on position, but this confirms no crash
    expect(toolbar).toBeInTheDocument();
  });
});
