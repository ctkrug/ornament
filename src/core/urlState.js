const FAMILIES = ['nouveau', 'astro'];

/**
 * Reads a seed/family pair out of a `location.search`-style query string.
 * Returns null for either field when it's missing or not a recognized
 * family, so callers can fall back to their own defaults.
 */
export function parseSeedState(search) {
  const params = new URLSearchParams(search);
  const seed = params.get('seed');
  const family = params.get('family');

  return {
    seed: seed && seed.trim() ? seed : null,
    family: FAMILIES.includes(family) ? family : null,
  };
}

/**
 * Builds a `?seed=...&family=...` query string for the given state, so the
 * current studio state can be pushed into the address bar and shared.
 */
export function buildSeedQuery(seed, family) {
  const params = new URLSearchParams();
  params.set('seed', seed);
  params.set('family', family);
  return `?${params.toString()}`;
}
