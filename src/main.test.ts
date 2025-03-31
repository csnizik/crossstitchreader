import { describe, it, expect, vi } from 'vitest';

// Set up fake root before import
const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

// Mock App with a plain string component to avoid JSX issues
vi.mock('./App.tsx', () => ({
  default: () => 'MockedApp',
}));

// Mock createRoot
const renderMock = vi.fn();
vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({
    render: renderMock,
  })),
}));

describe('main.tsx', () => {
  it('calls createRoot with #root and renders App', async () => {
    await import('./main.tsx'); // triggers the real render logic

    const { createRoot } = await import('react-dom/client');
    expect(createRoot).toHaveBeenCalledOnce();
    expect(createRoot).toHaveBeenCalledWith(root);
    expect(renderMock).toHaveBeenCalledOnce();

    // Clean up
    root.remove();
  });
});
