import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mocks for Konva + child components used in App
vi.mock('react-konva', () => {
  const React = require('react');
  return {
    Stage: ({ children }: any) => <div data-testid="stage">{children}</div>,
    Layer: ({ children }: any) => <div data-testid="layer">{children}</div>,
    Line: () => <div data-testid="line" />,
    Text: () => <div data-testid="text" />,
  };
});

vi.mock('konva', () => ({}));

vi.mock('./components/Toolbar/Toolbar', () => ({
  default: () => <div data-testid="toolbar" />,
}));

vi.mock('./components/SettingsPanel/SettingsPanel', () => ({
  default: () => <div data-testid="settings-panel" />,
}));

vi.mock('./components/SymbolKey/SymbolKey', () => ({
  default: () => <div data-testid="symbol-key" />,
}));

vi.mock('./components/PatternCanvas/PatternCanvas', () => ({
  default: () => <div data-testid="pattern-canvas" />,
}));

describe('App', () => {
  it('renders key components', () => {
    render(<App />);

    expect(screen.getByTestId('pattern-canvas')).toBeInTheDocument();
    expect(screen.getByTestId('toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('settings-panel')).toBeInTheDocument();
    expect(screen.getByTestId('symbol-key')).toBeInTheDocument();
  });
});
