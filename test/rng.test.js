import { describe, expect, it } from 'vitest';
import { createRng } from '../src/core/rng.js';

describe('createRng', () => {
  it('produces the same sequence for the same seed', () => {
    const a = createRng('first-light');
    const b = createRng('first-light');
    const seqA = Array.from({ length: 5 }, () => a());
    const seqB = Array.from({ length: 5 }, () => b());
    expect(seqA).toEqual(seqB);
  });

  it('produces different sequences for different seeds', () => {
    const a = createRng('first-light');
    const b = createRng('second-light');
    expect(a()).not.toBe(b());
  });

  it('stays within the [0, 1) range', () => {
    const rng = createRng(42);
    for (let i = 0; i < 100; i++) {
      const value = rng();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('accepts numeric and string seeds interchangeably', () => {
    const a = createRng(42);
    const b = createRng('42');
    expect(a()).toBe(b());
  });
});
