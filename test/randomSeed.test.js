import { describe, expect, it } from 'vitest';
import { generateRandomSeed } from '../src/core/randomSeed.js';

const SEED_RE = /^[a-z]{3}-[a-z]{3}-[a-z]{3}-\d{1,3}$/;

describe('generateRandomSeed', () => {
  it('matches the expected syllable-syllable-syllable-number shape', () => {
    expect(generateRandomSeed()).toMatch(SEED_RE);
  });

  it('produces different seeds across calls with the default random source', () => {
    const seeds = new Set(Array.from({ length: 20 }, () => generateRandomSeed()));
    expect(seeds.size).toBeGreaterThan(1);
  });

  it('is deterministic for an injected random source', () => {
    const fixed = () => 0;
    expect(generateRandomSeed(fixed)).toBe(generateRandomSeed(fixed));
  });

  it('uses the full [0, 1) range of the injected source without throwing', () => {
    const nearOne = () => 0.9999999;
    expect(() => generateRandomSeed(nearOne)).not.toThrow();
    expect(generateRandomSeed(nearOne)).toMatch(SEED_RE);
  });
});
