import { describe, expect, it } from 'vitest';
import { generatePalette } from '../src/core/palette.js';

const HSL_RE = /^hsl\(\d+(\.\d+)? \d+% \d+%\)$/;

describe('generatePalette', () => {
  it('is deterministic for a given seed and family', () => {
    const a = generatePalette('first-light', 'astro');
    const b = generatePalette('first-light', 'astro');
    expect(a).toEqual(b);
  });

  it('produces a different palette for a different seed', () => {
    const a = generatePalette('first-light', 'astro');
    const b = generatePalette('second-light', 'astro');
    expect(a.bg).not.toBe(b.bg);
  });

  it('produces a different palette for a different family with the same seed', () => {
    const a = generatePalette('first-light', 'astro');
    const b = generatePalette('first-light', 'nouveau');
    expect(a.bg).not.toBe(b.bg);
  });

  it('returns valid hsl() strings for every color token', () => {
    const palette = generatePalette('first-light', 'astro');
    const colorKeys = [
      'bg',
      'surface1',
      'surface2',
      'text',
      'textMuted',
      'accent',
      'accentSupport',
      'success',
      'danger',
    ];
    for (const key of colorKeys) {
      expect(palette[key]).toMatch(HSL_RE);
    }
  });

  it('falls back to the astro family for an unknown family name', () => {
    const fallback = generatePalette('first-light', 'unknown');
    const astro = generatePalette('first-light', 'astro');
    expect(fallback.bg).toBe(astro.bg);
  });
});
