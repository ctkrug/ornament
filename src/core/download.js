const MAX_SEED_SLUG_LENGTH = 40;

/**
 * Builds a stable, filesystem-safe export filename from the current studio
 * state, e.g. "ornament-first-light-astro-css.css". Non-alphanumeric
 * characters in the seed are collapsed to hyphens so a seed containing
 * spaces or punctuation never breaks the downloaded file name, and the
 * result is capped to MAX_SEED_SLUG_LENGTH so a pasted or hand-typed
 * seed of unbounded length can't produce a filename that exceeds a
 * filesystem's path-length limit.
 */
export function buildExportFilename(seed, family, kind, extension) {
  const safeSeed =
    String(seed)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, MAX_SEED_SLUG_LENGTH) || 'ornament';
  return `ornament-${safeSeed}-${family}-${kind}.${extension}`;
}

/**
 * Triggers a browser download of `content` as `filename`. Thin DOM plumbing
 * around Blob/anchor-click; `doc` is injectable so callers can point it at a
 * different document, but this is otherwise exercised via manual browser
 * verification rather than a headless test.
 */
export function triggerDownload(content, filename, mimeType, doc = document) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = doc.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  doc.body.appendChild(anchor);
  anchor.click();
  doc.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
