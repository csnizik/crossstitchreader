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
  };
}

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
    useTimerStore: (selector: TimerStoreSelector) => {
      if (typeof selector === 'function') {
        return selector({ running: false, toggle: mockToggle });
      }
      return { running: false, toggle: mockToggle };
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

// Only after all mocks are defined, import the component
import Toolbar from '../Toolbar';

// Get references to our mocks
const toggleMock = global.__mocks__.toggleMock;
const openMock = global.__mocks__.openMock;
const saveMock = global.__mocks__.saveMock;
const loadMock = global.__mocks__.loadMock;

describe('Toolbar', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

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
});
