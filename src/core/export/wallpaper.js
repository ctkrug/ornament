import { renderMotifBody } from '../render/svgRenderer.js';

const TILE_SIZE = 512;

/**
 * Composes a desktop wallpaper by tiling the motif body across a
 * width x height canvas, as a single self-contained SVG document.
 */
export function buildWallpaperSvg(motifBundle, { width = 1920, height = 1080 } = {}) {
  const { palette } = motifBundle;
  const cols = Math.ceil(width / TILE_SIZE) + 1;
  const rows = Math.ceil(height / TILE_SIZE) + 1;
  const body = renderMotifBody(motifBundle);

  const tiles = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      tiles.push(`<g transform="translate(${col * TILE_SIZE} ${row * TILE_SIZE})">${body}</g>`);
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${palette.bg}" />
  ${tiles.join('\n  ')}
</svg>`;
}
