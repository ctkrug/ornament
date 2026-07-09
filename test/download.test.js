import { describe, expect, it, vi } from 'vitest';
import { buildExportFilename, triggerDownload } from '../src/core/download.js';

function fakeDocument() {
  const anchor = { click: vi.fn() };
  const body = { appendChild: vi.fn(), removeChild: vi.fn() };
  return { anchor, body, createElement: vi.fn(() => anchor) };
}

describe('buildExportFilename', () => {
  it('builds the expected name for a clean seed', () => {
    expect(buildExportFilename('first-light', 'astro', 'css', 'css')).toBe(
      'ornament-first-light-astro-css.css',
    );
  });

  it('sanitizes spaces and punctuation in the seed', () => {
    expect(buildExportFilename('a seed! with $tuff', 'nouveau', 'terminal', 'json')).toBe(
      'ornament-a-seed-with-tuff-nouveau-terminal.json',
    );
  });

  it('falls back to "ornament" for a seed that sanitizes to nothing', () => {
    expect(buildExportFilename('!!!', 'astro', 'wallpaper', 'svg')).toBe(
      'ornament-ornament-astro-wallpaper.svg',
    );
  });

  it('lowercases mixed-case seeds', () => {
    expect(buildExportFilename('FirstLight', 'astro', 'css', 'css')).toBe(
      'ornament-firstlight-astro-css.css',
    );
  });

  it('caps an extremely long seed instead of producing an unbounded filename', () => {
    const filename = buildExportFilename('x'.repeat(10000), 'astro', 'css', 'css');
    expect(filename.length).toBeLessThan(80);
    expect(filename).toBe(`ornament-${'x'.repeat(40)}-astro-css.css`);
  });
});

describe('triggerDownload', () => {
  it('creates, clicks, and removes a temporary anchor with the given filename', () => {
    const doc = fakeDocument();
    triggerDownload('body { color: red; }', 'ornament-first-light-astro-css.css', 'text/css', doc);

    expect(doc.createElement).toHaveBeenCalledWith('a');
    expect(doc.anchor.download).toBe('ornament-first-light-astro-css.css');
    expect(doc.anchor.href).toMatch(/^blob:/);
    expect(doc.body.appendChild).toHaveBeenCalledWith(doc.anchor);
    expect(doc.anchor.click).toHaveBeenCalledOnce();
    expect(doc.body.removeChild).toHaveBeenCalledWith(doc.anchor);
  });

  it('does not throw for empty content', () => {
    const doc = fakeDocument();
    expect(() => triggerDownload('', 'empty.css', 'text/css', doc)).not.toThrow();
    expect(doc.anchor.click).toHaveBeenCalledOnce();
  });
});
