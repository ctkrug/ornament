import { describe, expect, it } from 'vitest';
import { generatePalette } from '../src/core/palette.js';
import { buildCssTokens } from '../src/core/export/cssTokens.js';

describe('buildCssTokens', () => {
  const palette = generatePalette('first-light', 'astro');
  const css = buildCssTokens(palette);

  it('wraps declarations in a :root block', () => {
    expect(css.trim().startsWith(':root {')).toBe(true);
    expect(css.trim().endsWith('}')).toBe(true);
  });

  it('emits a custom property for every palette color', () => {
    expect(css).toContain(`--ornament-bg: ${palette.bg};`);
    expect(css).toContain(`--ornament-accent: ${palette.accent};`);
    expect(css).toContain(`--ornament-accent-support: ${palette.accentSupport};`);
  });
});
