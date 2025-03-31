import { render, screen, fireEvent } from '@testing-library/react';
import Toolbar from './Toolbar';
import { describe, it, expect, beforeEach, vi } from 'vitest';

const toggleMock = vi.fn();
const openMock = vi.fn();

vi.mock('../../states/timerStore', async () => {
  return {
    useTimerStore: (fn: any) =>
      fn({
        running: false,
        toggle: toggleMock,
        set: vi.fn(),
      }),
  };
});


vi.mock('../../states/settingsStore', () => ({
  useSettingsStore: Object.assign(() => ({ open: openMock }), {
    getState: () => ({ open: openMock }),
  }),
}));


describe('Toolbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  it('triggers console logs on other buttons', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    render(<Toolbar />);
    fireEvent.click(screen.getByText('Undo'));
    fireEvent.click(screen.getByText('Redo'));
    fireEvent.click(screen.getByText('Save'));
    fireEvent.click(screen.getByText('Load'));

    expect(logSpy).toHaveBeenCalledWith('Undo');
    expect(logSpy).toHaveBeenCalledWith('Redo');
    expect(logSpy).toHaveBeenCalledWith('Save');
    expect(logSpy).toHaveBeenCalledWith('Load');

    logSpy.mockRestore();
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
