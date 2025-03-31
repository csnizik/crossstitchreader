import { render, screen } from '@testing-library/react';
import SymbolKey from './SymbolKey';
import { describe, it, expect } from 'vitest';

describe('SymbolKey', () => {
  it('renders header and all mock symbols', () => {
    render(<SymbolKey />);

    expect(screen.getByText('Symbol Key')).toBeInTheDocument();

    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('DMC 310')).toBeInTheDocument();
    expect(screen.getByText(/2 strands, 142 stitches/)).toBeInTheDocument();

    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('DMC 604')).toBeInTheDocument();
    expect(screen.getByText(/2 strands, 117 stitches/)).toBeInTheDocument();

    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('DMC 798')).toBeInTheDocument();
    expect(screen.getByText(/1 strand, 201 stitches/)).toBeInTheDocument();
  });
});
