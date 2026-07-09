export const STRAND_COUNT_RANGE = { min: 3, max: 9, default: 5 };
export const STAR_COUNT_RANGE = { min: 8, max: 24, default: 14 };

/**
 * Clamps a (possibly malformed) control value into a whole number within
 * [min, max], falling back to `min` for anything that doesn't parse as a
 * number. Used so a manually-edited or out-of-range slider value can never
 * ask a motif generator for zero, negative, or non-numeric strand/star
 * counts.
 */
export function clamp(value, { min, max }) {
  const num = Number(value);
  if (Number.isNaN(num)) return min;
  return Math.min(max, Math.max(min, Math.round(num)));
}
