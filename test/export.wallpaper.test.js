import { describe, expect, it } from 'vitest';
import { generatePalette } from '../src/core/palette.js';
import { generateNouveauMotif } from '../src/core/motifs/nouveau.js';
import { generateAstroMotif } from '../src/core/motifs/astro.js';
import { buildWallpaperSvg } from '../src/core/export/wallpaper.js';

function makeBundle(seed) {
  return {
    palette: generatePalette(seed, 'astro'),
    nouveauPaths: generateNouveauMotif(seed),
    astro: generateAstroMotif(seed),
  };
}

describe('buildWallpaperSvg', () => {
  it('produces an SVG sized to the requested dimensions', () => {
    const svg = buildWallpaperSvg(makeBundle('first-light'), { width: 1920, height: 1080 });
    expect(svg).toContain('width="1920"');
    expect(svg).toContain('height="1080"');
    expect(svg).toContain('viewBox="0 0 1920 1080"');
  });

  it('tiles enough copies of the motif to cover the canvas', () => {
    const svg = buildWallpaperSvg(makeBundle('first-light'), { width: 1024, height: 512 });
    const tileCount = (svg.match(/<g transform="translate/g) ?? []).length;
    // 3 columns (1024 / 512 + 1) x 2 rows (512 / 512 + 1)
    expect(tileCount).toBe(6);
  });

  it('does not nest <svg> elements', () => {
    const svg = buildWallpaperSvg(makeBundle('first-light'));
    const svgTagCount = (svg.match(/<svg /g) ?? []).length;
    expect(svgTagCount).toBe(1);
  });
});
