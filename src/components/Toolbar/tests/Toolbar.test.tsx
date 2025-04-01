import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// IMPORTANT: First declare all vi.mock calls
// These need to be BEFORE any imports that might use the mocked modules

// Create mocks inside the mock factory functions to avoid hoisting issues
// Extend global type to include __mocks__
declare global {
  var __mocks__: {
    saveMock?: jest.Mock;
    loadMock?: jest.Mock;
    toggleMock?: jest.Mock;
    openMock?: jest.Mock;
    setToolMock?: jest.Mock;
    toastSuccess?: jest.Mock;
    toastError?: jest.Mock;
  };
}

// Mock the toast module AT THE TOP with the other mocks
vi.mock('sonner', () => {
  const mockSuccessFn = vi.fn();
  const mockErrorFn = vi.fn();

  // Store references
  vi.stubGlobal('__mocks__', {
    ...(global.__mocks__ || {}),
    toastSuccess: mockSuccessFn,
    toastError: mockErrorFn
  });

  return {
    toast: {
      success: mockSuccessFn,
      error: mockErrorFn
    }
  };
});

vi.mock('../../../utils/saveLoad', () => {
  const mockSave = vi.fn();
  const mockLoad = vi.fn();

  // Store references in global object to access them in our tests
  vi.stubGlobal('__mocks__', {
      ...(global.__mocks__ || {}),
      saveMock: mockSave,
      loadMock: mockLoad
  });

  return {
    savePattern: mockSave,
    loadPattern: mockLoad
  };
});

// Create state holders for our mocks that we can modify between tests
let timerState = { running: false };
let toolState = { tool: 'No Tool' };

// Define mocks INSIDE the vi.mock call to avoid hoisting issues
vi.mock('../../../states/timerStore', () => {
  const mockToggle = vi.fn();

  // Store references
  vi.stubGlobal('__mocks__', {
    ...(global.__mocks__ || {}),
    toggleMock: mockToggle
  });

  interface TimerStore {
    running: boolean;
    toggle: () => void;
  }

  type TimerStoreSelector = (state: TimerStore) => any;

  return {
    useTimerStore: (selector: TimerStoreSelector): any => {
      if (typeof selector === 'function') {
        // Use the timerState that can be modified between tests
        return selector({ ...timerState, toggle: mockToggle });
      }
      return { ...timerState, toggle: mockToggle };
    }
  };
});

vi.mock('../../../states/settingsStore', () => {
  const mockOpen = vi.fn();

  // Store references
  vi.stubGlobal('__mocks__', {
    ...(global.__mocks__ || {}),
    openMock: mockOpen
  });

  const mockStore = {
    isOpen: false,
    open: mockOpen
  };

  // Create a proper Zustand store mock with getState
  interface SettingsStore {
    isOpen: boolean;
    open: () => void;
  }

  type SettingsStoreSelector = (state: SettingsStore) => any;

  const useStore = (selector: SettingsStoreSelector): any => {
    if (typeof selector === 'function') {
      return selector(mockStore);
    }
    return mockStore;
  };

  // Add getState method that's used in the component
  useStore.getState = () => mockStore;

  return {
    useSettingsStore: useStore
  };
});

// Add the toolStore mock
vi.mock('../../../states/toolStore', () => {
  const mockSetTool = vi.fn();

  // Store references
  vi.stubGlobal('__mocks__', {
    ...(global.__mocks__ || {}),
    setToolMock: mockSetTool
  });

  interface ToolStore {
    tool: string;
    setTool: (tool: string) => void;
  }

  type ToolStoreSelector = (state: ToolStore) => any;

  return {
    useToolStore: (selector: ToolStoreSelector): any => {
      if (typeof selector === 'function') {
        // Use the toolState that can be modified between tests
        return selector({ ...toolState, setTool: mockSetTool });
      }
      return { ...toolState, setTool: mockSetTool };
    }
  };
});

// Only after all mocks are defined, import the component
import Toolbar from '../Toolbar';

// Get references to our mocks
const toggleMock = global.__mocks__.toggleMock;
const openMock = global.__mocks__.openMock;
const saveMock = global.__mocks__.saveMock;
const loadMock = global.__mocks__.loadMock;
const setToolMock = global.__mocks__.setToolMock;
// Removed unused toastSuccess declaration
const toastError = global.__mocks__.toastError;

describe('Toolbar', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Reset state for each test
    timerState = { running: false };
    toolState = { tool: 'No Tool' };

    // Mock URL APIs
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:mock-url'),
      revokeObjectURL: vi.fn(),
    });

    // Mock window.location
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        ...window.location,
        assign: vi.fn(),
        replace: vi.fn(),
        reload: vi.fn(),
      },
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
    expect(toggleMock).toHaveBeenCalledTimes(1);
  });

  it('calls settingsStore.open() when settings clicked', () => {
    render(<Toolbar />);
    fireEvent.click(screen.getByText('Settings'));
    expect(openMock).toHaveBeenCalledTimes(1);
  });

  it('calls savePattern when Save is clicked', () => {
    render(<Toolbar />);
    fireEvent.click(screen.getByText('Save'));
    expect(saveMock).toHaveBeenCalledTimes(1);
  });

  it('triggers hidden file input when Load is clicked', () => {
    render(<Toolbar />);
    const fileInput = screen.getByTestId('load-input');
    const clickSpy = vi.spyOn(fileInput, 'click');

    fireEvent.click(screen.getByText('Load'));
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  /**
   * Test that the timer button displays different text based on timer state
   */
  it('shows different text based on timer state', () => {
    // First render with running: false
    render(<Toolbar />);
    expect(screen.getByText('Start Timer')).toBeInTheDocument();

    // Clean up
    vi.clearAllMocks();

    // Change the timer state to running
    timerState.running = true;

    // Re-render with running: true
    render(<Toolbar />);
    expect(screen.getByText('Stop Timer')).toBeInTheDocument();
  });

  /**
   * Test that the Select tool button toggles the tool state
   */
  it('toggles tool selection when Select button is clicked', () => {
    // Create a separate container for the first render
    const { unmount } = render(<Toolbar />);

    // Add a test ID to target the specific button we want
    const selectButtons = screen.getAllByText('Select');
    // Get the first Select button (there should be only one)
    const selectButton = selectButtons[0];

    fireEvent.click(selectButton);
    expect(setToolMock).toHaveBeenCalledWith('Select');

    // Important: Unmount the first instance to clean up the DOM
    unmount();

    // Reset mock for next test
    setToolMock?.mockReset();

    // Change the tool state to selected
    toolState.tool = 'Select';

    // Re-render with a fresh DOM
    render(<Toolbar />);

    // Get the button again in the new render
    const updatedSelectButtons = screen.getAllByText('Select');
    const updatedSelectButton = updatedSelectButtons[0];

    fireEvent.click(updatedSelectButton);
    expect(setToolMock).toHaveBeenCalledWith('No Tool');
  });

  /**
   * Test file loading error handling
   */
  it('shows error toast when file loading fails', async () => {
    // Clear any previous mock implementations
    loadMock?.mockReset();

    // Suppress console.error temporarily to avoid test noise
    const originalConsoleError = console.error;
    console.error = vi.fn();

    // Set up mock to reject with error
    loadMock?.mockRejectedValue(new Error('Invalid file'));

    render(<Toolbar />);

    // Create a mock file
    const file = new File(['invalid content'], 'pattern.json', { type: 'application/json' });
    const fileInput = screen.getByTestId('load-input');

    // Trigger file input change
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Wait for the toast to be called
    await vi.waitFor(() => {
      expect(toastError).toHaveBeenCalledWith('Invalid pattern file.');
    });

    // Verify the load function was called
    expect(loadMock).toHaveBeenCalled();

    // Restore console.error
    console.error = originalConsoleError;
  });

  /**
   * Test comprehensive drag behavior
   */
  it('updates position when dragged', () => {
    // Create a more comprehensive test for dragging
    render(<Toolbar />);
    const toolbar = screen.getByTestId('toolbar');

    // Initial position check
    expect(toolbar.style.left).toBe('16px');
    expect(toolbar.style.top).toBe('16px');

    // Mouse down event
    fireEvent.mouseDown(toolbar, { clientX: 100, clientY: 100 });

    // Mouse move events
    fireEvent.mouseMove(window, { clientX: 200, clientY: 150 });

    // Check position update
    expect(toolbar.style.left).toBe('116px');
    expect(toolbar.style.top).toBe('66px');

    // Mouse up to end dragging
    fireEvent.mouseUp(window);

    // Additional move should not change position now
    fireEvent.mouseMove(window, { clientX: 300, clientY: 300 });
    expect(toolbar.style.left).toBe('116px');
    expect(toolbar.style.top).toBe('66px');
  });
});
