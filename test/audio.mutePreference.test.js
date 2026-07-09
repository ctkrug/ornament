import { describe, expect, it } from 'vitest';
import { loadMutedPreference, saveMutedPreference } from '../src/core/audio/mutePreference.js';

function fakeStorage() {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, value),
  };
}

describe('mute preference persistence', () => {
  it('defaults to unmuted when nothing is stored', () => {
    expect(loadMutedPreference(fakeStorage())).toBe(false);
  });

  it('round-trips a saved true value', () => {
    const storage = fakeStorage();
    saveMutedPreference(true, storage);
    expect(loadMutedPreference(storage)).toBe(true);
  });

  it('round-trips a saved false value', () => {
    const storage = fakeStorage();
    saveMutedPreference(true, storage);
    saveMutedPreference(false, storage);
    expect(loadMutedPreference(storage)).toBe(false);
  });

  it('does not throw when no storage is available', () => {
    expect(() => saveMutedPreference(true, null)).not.toThrow();
    expect(loadMutedPreference(null)).toBe(false);
  });

  it('falls back to unmuted when accessing localStorage itself throws', () => {
    // Mirrors Safari private browsing, where the localStorage getter throws
    // a SecurityError instead of the property simply being undefined.
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      get() {
        throw new Error('SecurityError');
      },
    });
    try {
      expect(() => loadMutedPreference(null)).not.toThrow();
      expect(loadMutedPreference(null)).toBe(false);
    } finally {
      delete globalThis.localStorage;
    }
  });
});
