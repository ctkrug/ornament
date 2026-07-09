import { describe, expect, it } from 'vitest';
import { clamp, STRAND_COUNT_RANGE, STAR_COUNT_RANGE } from '../src/core/motifParams.js';

describe('clamp', () => {
  it('passes through a value already within range', () => {
    expect(clamp(5, STRAND_COUNT_RANGE)).toBe(5);
  });

  it('clamps a value below the minimum', () => {
    expect(clamp(0, STRAND_COUNT_RANGE)).toBe(3);
    expect(clamp(-100, STAR_COUNT_RANGE)).toBe(8);
  });

  it('clamps a value above the maximum', () => {
    expect(clamp(999, STRAND_COUNT_RANGE)).toBe(9);
    expect(clamp(1000, STAR_COUNT_RANGE)).toBe(24);
  });

  it('rounds a fractional value', () => {
    expect(clamp(5.6, STRAND_COUNT_RANGE)).toBe(6);
  });

  it('falls back to the minimum for non-numeric input', () => {
    expect(clamp('not-a-number', STRAND_COUNT_RANGE)).toBe(STRAND_COUNT_RANGE.min);
    expect(clamp(undefined, STAR_COUNT_RANGE)).toBe(STAR_COUNT_RANGE.min);
  });

  it('accepts numeric strings from range input values', () => {
    expect(clamp('7', STRAND_COUNT_RANGE)).toBe(7);
  });
});
