import { describe, expect, it } from 'vitest';
import { buildExportFilename } from '../src/core/download.js';

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
