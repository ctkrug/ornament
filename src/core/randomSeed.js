const SYLLABLES = [
  'ael', 'bri', 'cor', 'dun', 'eth', 'fal', 'gor', 'hal', 'ith', 'jor',
  'kel', 'lor', 'myr', 'nor', 'oro', 'pyr', 'quo', 'ryn', 'syl', 'tor',
  'ulm', 'vex', 'wyn', 'xar', 'yll', 'zor',
];

/**
 * Generates a short, readable seed string ("cor-vex-407") by combining three
 * random syllables and a number. `random` is injectable so callers/tests can
 * supply a deterministic source instead of the global Math.random.
 */
export function generateRandomSeed(random = Math.random) {
  const parts = Array.from({ length: 3 }, () => SYLLABLES[Math.floor(random() * SYLLABLES.length)]);
  const suffix = Math.floor(random() * 1000);
  return `${parts.join('-')}-${suffix}`;
}
