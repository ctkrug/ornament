const STORAGE_KEY = 'ornament:muted';

function resolveStorage(storage) {
  if (storage) return storage;
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

/**
 * Reads the persisted mute preference. `storage` is injectable (tests pass a
 * fake); falls back to the global localStorage in the browser, and to
 * "unmuted" when no storage is available at all.
 */
export function loadMutedPreference(storage) {
  const resolved = resolveStorage(storage);
  return resolved?.getItem(STORAGE_KEY) === 'true';
}

export function saveMutedPreference(muted, storage) {
  resolveStorage(storage)?.setItem(STORAGE_KEY, String(muted));
}
