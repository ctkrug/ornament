import { describe, expect, it, vi } from 'vitest';
import { createChimePlayer } from '../src/core/audio/chime.js';

function fakeStorage() {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, value),
  };
}

class FakeOscillator {
  constructor() {
    this.frequency = { value: 0 };
    this.connect = vi.fn();
    this.start = vi.fn();
    this.stop = vi.fn();
  }
}

class FakeGain {
  constructor() {
    this.gain = { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() };
    this.connect = vi.fn();
  }
}

function makeFakeAudioContextClass() {
  return class FakeAudioContext {
    constructor() {
      this.currentTime = 0;
      this.destination = {};
      this.createOscillator = vi.fn(() => new FakeOscillator());
      this.createGain = vi.fn(() => new FakeGain());
    }
  };
}

describe('createChimePlayer', () => {
  it('is unmuted by default and plays a tone through the injected context', () => {
    const AudioContextClass = makeFakeAudioContextClass();
    const player = createChimePlayer({ audioContextClass: AudioContextClass, storage: fakeStorage() });
    expect(player.isMuted()).toBe(false);
    expect(player.play()).toBe(true);
  });

  it('does not play while muted', () => {
    const AudioContextClass = makeFakeAudioContextClass();
    const player = createChimePlayer({ audioContextClass: AudioContextClass, storage: fakeStorage() });
    player.setMuted(true);
    expect(player.play()).toBe(false);
  });

  it('persists the mute preference across player instances via shared storage', () => {
    const storage = fakeStorage();
    const AudioContextClass = makeFakeAudioContextClass();
    const first = createChimePlayer({ audioContextClass: AudioContextClass, storage });
    first.setMuted(true);
    const second = createChimePlayer({ audioContextClass: AudioContextClass, storage });
    expect(second.isMuted()).toBe(true);
  });

  it('reuses a single AudioContext instance across multiple plays', () => {
    const AudioContextClass = makeFakeAudioContextClass();
    const constructorSpy = vi.fn();
    class TrackedContext extends AudioContextClass {
      constructor() {
        super();
        constructorSpy();
      }
    }
    const player = createChimePlayer({ audioContextClass: TrackedContext, storage: fakeStorage() });
    player.play();
    player.play();
    expect(constructorSpy).toHaveBeenCalledTimes(1);
  });

  it('guards environments without an AudioContext instead of throwing', () => {
    const player = createChimePlayer({ audioContextClass: null, storage: fakeStorage() });
    expect(() => player.play()).not.toThrow();
    expect(player.play()).toBe(false);
  });
});
