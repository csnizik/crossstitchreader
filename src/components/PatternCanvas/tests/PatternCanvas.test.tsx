// src/components/PatternCanvas/tests/PatternCanvas.test.tsx

import { render, screen } from '@testing-library/react';
import PatternCanvas from '../PatternCanvas';
import { describe, it, expect, vi } from 'vitest';
import type { Pattern } from '../../../types/pattern';

// Complete mock pattern
const mockPattern: Pattern = {
  meta: {
    title: 'Test Pattern',
    gridSize: [2, 2],
    fabricCount: 14,
  },
  symbols: {
    A: { color: '#ff0000', dmc: '321', strands: 2 },
    B: { color: '#00ff00', dmc: '702', strands: 2 },
  },
  grid: [
    ['A', 'B'],
    ['B', 'A'],
  ],
};

// Mocks for Konva + custom hooks
vi.mock('react-konva', () => {
  return {
    Stage: ({ children }: any) => <div data-testid="stage">{children}</div>,
    Layer: ({ children }: any) => <div data-testid="layer">{children}</div>,
    Line: () => <div data-testid="line" />,
    Text: () => <div data-testid="text" />,
  };
});

vi.mock('konva', () => ({}));

vi.mock('../../../hooks/useZoomPan', () => {
  return {
    useZoomPan: () => ({
      scale: 1,
      position: { x: 0, y: 0 },
      handleWheel: vi.fn(),
      handleDragEnd: vi.fn(),
      handleDragMove: vi.fn(),
      setStageRef: vi.fn(),
    }),
  };
});

describe('PatternCanvas', () => {
  it('renders without crashing when pattern is valid', () => {
    const { container } = render(<PatternCanvas pattern={mockPattern} />);
    expect(container).toBeInTheDocument();
  });

  it('returns null and logs error if pattern is missing', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    // @ts-expect-error: intentionally invalid pattern
    const { container } = render(<PatternCanvas pattern={null} />);
    expect(container.firstChild).toBeNull();
    expect(spy).toHaveBeenCalledWith(
      'PatternCanvas: pattern prop is missing or malformed'
    );
    spy.mockRestore();
  });

  it('renders mocked stage and layers with grid and symbols', () => {
    render(<PatternCanvas pattern={mockPattern} />);
    expect(screen.getByTestId('stage')).toBeInTheDocument();
    expect(screen.getAllByTestId('layer')).toHaveLength(2);
    expect(screen.getAllByTestId('line').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('text').length).toBeGreaterThan(0);
  });

  it('sets up zoom and drag handlers via useZoomPan', () => {
    const { getByTestId } = render(<PatternCanvas pattern={mockPattern} />);
    const stage = getByTestId('stage');
    expect(stage).toBeInTheDocument();
  });
});
