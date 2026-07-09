import { describe, expect, it } from 'vitest';
import { parseSeedState, buildSeedQuery } from '../src/core/urlState.js';

describe('parseSeedState', () => {
  it('reads a valid seed and family from the query string', () => {
    expect(parseSeedState('?seed=first-light&family=astro')).toEqual({
      seed: 'first-light',
      family: 'astro',
    });
  });

  it('returns null seed for an empty query string', () => {
    expect(parseSeedState('')).toEqual({ seed: null, family: null });
  });

  it('returns null seed for a blank seed value', () => {
    expect(parseSeedState('?seed=&family=astro').seed).toBeNull();
  });

  it('returns null family for an unrecognized family value', () => {
    expect(parseSeedState('?seed=first-light&family=bogus').family).toBeNull();
  });
});

describe('buildSeedQuery', () => {
  it('round-trips through parseSeedState', () => {
    const query = buildSeedQuery('second-light', 'nouveau');
    expect(parseSeedState(query)).toEqual({ seed: 'second-light', family: 'nouveau' });
  });

  it('URL-encodes special characters in the seed', () => {
    const query = buildSeedQuery('a seed/with weird chars', 'astro');
    expect(query).not.toContain(' ');
    expect(parseSeedState(query).seed).toBe('a seed/with weird chars');
  });
});
