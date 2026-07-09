import { createRng } from './rng.js';

// Each family anchors a base hue (background/surfaces) and an accent hue,
// matching the two motif families this project draws (art-nouveau botanical
// tones vs. astronomical indigo/gold).
const HUE_FAMILIES = {
  nouveau: { base: 150, accent: 40 },
  astro: { base: 235, accent: 45 },
};

function hsl(h, s, l) {
  return `hsl(${Math.round(((h % 360) + 360) % 360)} ${Math.round(s)}% ${Math.round(l)}%)`;
}

/**
 * Generates a full palette (background surfaces, text, and accent colors)
 * from a seed and a hue family. The same seed + family always produces the
 * same palette.
 */
export function generatePalette(seed, family = 'astro') {
  const rng = createRng(`${seed}:palette`);
  const { base, accent } = HUE_FAMILIES[family] ?? HUE_FAMILIES.astro;
  const hueJitter = (rng() - 0.5) * 12;
  const bgHue = base + hueJitter;
  const accentHue = accent + (rng() - 0.5) * 8;

  return {
    seed: String(seed),
    family,
    bg: hsl(bgHue, 38, 14),
    surface1: hsl(bgHue, 34, 20),
    surface2: hsl(bgHue, 30, 27),
    text: hsl(bgHue, 45, 92),
    textMuted: hsl(bgHue, 20, 70),
    accent: hsl(accentHue, 55, 55),
    accentSupport: hsl(accentHue + 130, 45, 60),
    success: hsl(130, 40, 55),
    danger: hsl(6, 60, 58),
  };
}
