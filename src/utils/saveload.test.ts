// utils/saveLoad.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { savePattern, loadPattern } from './saveLoad';

const mockClick = vi.fn();
const mockAppend = vi.fn();
const mockRemove = vi.fn();
const mockRevoke = vi.fn();

vi.stubGlobal('document', {
  createElement: () => ({
    click: mockClick,
    set href(v: string) {},
    set download(v: string) {},
  }),
  body: {
    appendChild: mockAppend,
    removeChild: mockRemove,
  },
});

vi.stubGlobal('URL', {
  createObjectURL: () => 'blob:url',
  revokeObjectURL: mockRevoke,
});

describe('savePattern', () => {
  it('creates and downloads a JSON file', () => {
    savePattern({ test: true });
    expect(mockClick).toHaveBeenCalled();
    expect(mockAppend).toHaveBeenCalled();
    expect(mockRemove).toHaveBeenCalled();
    expect(mockRevoke).toHaveBeenCalled();
  });
});

describe('loadPattern', () => {
  it('reads JSON from file and resolves parsed object', async () => {
    const file = new File([JSON.stringify({ foo: 'bar' })], 'pattern.json', {
      type: 'application/json',
    });
    const result = await loadPattern(file);
    expect(result).toEqual({ foo: 'bar' });
  });

  it('rejects if JSON is invalid', async () => {
    const file = new File(['invalid-json'], 'pattern.json', {
      type: 'application/json',
    });
    await expect(loadPattern(file)).rejects.toThrow();
  });
});
