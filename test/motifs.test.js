import { describe, expect, it } from 'vitest';
import { generateNouveauMotif } from '../src/core/motifs/nouveau.js';
import { generateAstroMotif } from '../src/core/motifs/astro.js';

describe('generateNouveauMotif', () => {
  it('is deterministic for a given seed', () => {
    expect(generateNouveauMotif('first-light')).toEqual(generateNouveauMotif('first-light'));
  });

  it('returns one SVG path per requested strand', () => {
    const paths = generateNouveauMotif('first-light', { strands: 7 });
    expect(paths).toHaveLength(7);
    for (const d of paths) {
      expect(d).toMatch(/^M [\d.]+ [\d.]+ C /);
    }
  });

  it('varies with the seed', () => {
    const a = generateNouveauMotif('first-light');
    const b = generateNouveauMotif('second-light');
    expect(a).not.toEqual(b);
  });
});

describe('generateAstroMotif', () => {
  it('is deterministic for a given seed', () => {
    expect(generateAstroMotif('first-light')).toEqual(generateAstroMotif('first-light'));
  });

  it('returns the requested number of stars, each with a link back to an earlier star', () => {
    const { points, links } = generateAstroMotif('first-light', { stars: 10 });
    expect(points).toHaveLength(10);
    expect(links).toHaveLength(9);
    for (const [from, to] of links) {
      expect(to).toBeLessThan(from);
    }
  });

  it('keeps every star within the canvas margin', () => {
    const { points } = generateAstroMotif('first-light', { stars: 20 });
    for (const point of points) {
      expect(point.x).toBeGreaterThanOrEqual(24);
      expect(point.x).toBeLessThanOrEqual(488);
      expect(point.y).toBeGreaterThanOrEqual(24);
      expect(point.y).toBeLessThanOrEqual(488);
    }
  });
});
