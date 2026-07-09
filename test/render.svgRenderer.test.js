import { describe, expect, it } from 'vitest';
import { generatePalette } from '../src/core/palette.js';
import { generateNouveauMotif } from '../src/core/motifs/nouveau.js';
import { generateAstroMotif } from '../src/core/motifs/astro.js';
import { renderMotifBody, renderMotifToSvg } from '../src/core/render/svgRenderer.js';

function makeBundle(seed = 'first-light', family = 'astro') {
  return {
    palette: generatePalette(seed, family),
    nouveauPaths: generateNouveauMotif(seed),
    astro: generateAstroMotif(seed),
  };
}

describe('renderMotifBody', () => {
  it('renders one <line> per astro link and one <circle> per star', () => {
    const bundle = makeBundle();
    const body = renderMotifBody(bundle);
    expect((body.match(/<line /g) ?? []).length).toBe(bundle.astro.links.length);
    expect((body.match(/<circle /g) ?? []).length).toBe(bundle.astro.points.length);
  });

  it('renders one <path> per nouveau strand, colored with the palette accent', () => {
    const bundle = makeBundle();
    const body = renderMotifBody(bundle);
    expect((body.match(/<path /g) ?? []).length).toBe(bundle.nouveauPaths.length);
    expect(body).toContain(`stroke="${bundle.palette.accent}"`);
  });

  it('does not wrap the body in its own <svg> element', () => {
    const body = renderMotifBody(makeBundle());
    expect(body).not.toContain('<svg');
  });
});

describe('renderMotifToSvg', () => {
  it('wraps the body in a single self-contained square <svg>', () => {
    const svg = renderMotifToSvg(makeBundle());
    expect((svg.match(/<svg /g) ?? []).length).toBe(1);
    expect(svg).toContain('viewBox="0 0 512 512"');
    expect(svg.trim().endsWith('</svg>')).toBe(true);
  });

  it('fills the background rect with the palette bg color', () => {
    const bundle = makeBundle();
    const svg = renderMotifToSvg(bundle);
    expect(svg).toContain(`<rect width="512" height="512" fill="${bundle.palette.bg}" />`);
  });

  it('renders at a custom size while keeping the 512 viewBox', () => {
    const svg = renderMotifToSvg(makeBundle(), { size: 256 });
    expect(svg).toContain('width="256" height="256"');
    expect(svg).toContain('viewBox="0 0 512 512"');
  });
});
