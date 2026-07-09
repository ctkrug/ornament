import { loadMutedPreference, saveMutedPreference } from './mutePreference.js';

function defaultAudioContextClass() {
  if (typeof window === 'undefined') return null;
  return window.AudioContext || window.webkitAudioContext || null;
}

/**
 * Creates a synthesized WebAudio chime player. The AudioContext is created
 * lazily on the first `play()` call (browsers require a user gesture before
 * audio can start), and every dependency is injectable so this can be
 * exercised in a headless test environment without a real AudioContext.
 */
export function createChimePlayer({
  audioContextClass = defaultAudioContextClass(),
  storage,
} = {}) {
  let ctx = null;
  let muted = loadMutedPreference(storage);

  function ensureContext() {
    if (!audioContextClass) return null;
    if (!ctx) ctx = new audioContextClass();
    return ctx;
  }

  function play(frequency = 660) {
    if (muted) return false;
    const context = ensureContext();
    if (!context) return false;

    const now = context.currentTime;
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = 'sine';
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    osc.connect(gain);
    gain.connect(context.destination);
    osc.start(now);
    osc.stop(now + 0.5);
    return true;
  }

  function setMuted(next) {
    muted = next;
    saveMutedPreference(muted, storage);
  }

  function isMuted() {
    return muted;
  }

  return { play, setMuted, isMuted };
}
