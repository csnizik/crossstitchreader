import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { savePattern, loadPattern } from './saveLoad';

describe('savePattern', () => {
  let createElementSpy: ReturnType<typeof vi.spyOn>;
  let clickSpy: ReturnType<typeof vi.spyOn>;

  beforeAll(() => {
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:mock-url'),
      revokeObjectURL: vi.fn(),
    });
  });

  beforeEach(() => {
    createElementSpy = vi.spyOn(document, 'createElement') as unknown as ReturnType<typeof vi.spyOn>;
    clickSpy = vi.fn();

    createElementSpy.mockImplementation(() => {
      return {
        href: '',
        download: '',
        click: clickSpy,
        style: {},
        setAttribute: vi.fn(),
      } as unknown as HTMLAnchorElement;
    });
  });

  afterEach(() => {
    createElementSpy.mockRestore();
  });

 it('creates a downloadable JSON file', () => {
   const clickSpy = vi.fn();
   const mockAnchor = {
     href: '',
     download: '',
     click: clickSpy,
   };

   vi.stubGlobal('URL', {
     createObjectURL: vi.fn(() => 'blob:mock-url'),
     revokeObjectURL: vi.fn(),
   });

   const appendChildSpy = vi.fn();
   const removeChildSpy = vi.fn();

   vi.spyOn(document, 'createElement').mockImplementation(
     () => mockAnchor as any
   );
   vi.spyOn(document.body, 'appendChild').mockImplementation(appendChildSpy);
   vi.spyOn(document.body, 'removeChild').mockImplementation(removeChildSpy);

   savePattern({ foo: 'bar' });

   expect(clickSpy).toHaveBeenCalled();
   expect(appendChildSpy).toHaveBeenCalledWith(mockAnchor);
   expect(removeChildSpy).toHaveBeenCalledWith(mockAnchor);
 });

});

describe('loadPattern', () => {
  const createTestFile = (content: string, name = 'test.json') =>
    new File([content], name, { type: 'application/json' });

  it('resolves with parsed JSON data', async () => {
    const file = createTestFile(JSON.stringify({ foo: 'bar' }));
    const result = await loadPattern(file);
    expect(result).toEqual({ foo: 'bar' });
  });

  it('rejects with error on invalid JSON', async () => {
    const file = createTestFile('{ invalid json }');

    await expect(loadPattern(file)).rejects.toThrow();
  });
});
