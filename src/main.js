import './style.css';
import { generatePalette } from './core/palette.js';
import { generateNouveauMotif } from './core/motifs/nouveau.js';
import { generateAstroMotif } from './core/motifs/astro.js';
import { renderMotifToSvg } from './core/render/svgRenderer.js';
import { parseSeedState, buildSeedQuery } from './core/urlState.js';
import { generateRandomSeed } from './core/randomSeed.js';
import { buildCssTokens } from './core/export/cssTokens.js';
import { buildTerminalTheme } from './core/export/terminalTheme.js';
import { buildWallpaperSvg } from './core/export/wallpaper.js';
import { buildExportFilename, triggerDownload } from './core/download.js';
import { createChimePlayer } from './core/audio/chime.js';

const DEFAULT_SEED = 'first-light';
const DEFAULT_FAMILY = 'astro';
const FADE_OUT_MS = 220;

const els = {
  preview: document.querySelector('#preview'),
  seedInput: document.querySelector('#seed-input'),
  newSeed: document.querySelector('#new-seed'),
  familyButtons: Array.from(document.querySelectorAll('[data-family]')),
  exportCss: document.querySelector('#export-css'),
  exportTerminal: document.querySelector('#export-terminal'),
  exportWallpaper: document.querySelector('#export-wallpaper'),
  wallpaperResolution: document.querySelector('#wallpaper-resolution'),
  copySeed: document.querySelector('#copy-seed'),
  muteToggle: document.querySelector('#mute-toggle'),
  toast: document.querySelector('#toast'),
};

const TOAST_DURATION_MS = 2600;
let toastTimer = null;
const chime = createChimePlayer();

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add('is-visible');
  if (toastTimer) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => els.toast.classList.remove('is-visible'), TOAST_DURATION_MS);
}

const initialQueryState = parseSeedState(window.location.search);
const state = {
  seed: initialQueryState.seed ?? DEFAULT_SEED,
  family: initialQueryState.family ?? DEFAULT_FAMILY,
};

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function currentBundle() {
  return {
    palette: generatePalette(state.seed, state.family),
    nouveauPaths: generateNouveauMotif(state.seed),
    astro: generateAstroMotif(state.seed),
  };
}

function applyPaletteToPage(palette) {
  const root = document.documentElement.style;
  root.setProperty('--ornament-bg', palette.bg);
  root.setProperty('--ornament-surface-1', palette.surface1);
  root.setProperty('--ornament-surface-2', palette.surface2);
  root.setProperty('--ornament-text', palette.text);
  root.setProperty('--ornament-text-muted', palette.textMuted);
  root.setProperty('--ornament-accent', palette.accent);
  root.setProperty('--ornament-accent-support', palette.accentSupport);
  root.setProperty('--ornament-success', palette.success);
  root.setProperty('--ornament-danger', palette.danger);
}

function swapPreview(svgMarkup, { animate }) {
  if (!animate || prefersReducedMotion()) {
    els.preview.innerHTML = svgMarkup;
    return;
  }
  els.preview.classList.add('is-transitioning');
  window.setTimeout(() => {
    els.preview.innerHTML = svgMarkup;
    requestAnimationFrame(() => els.preview.classList.remove('is-transitioning'));
  }, FADE_OUT_MS);
}

function syncUrl() {
  window.history.replaceState(null, '', buildSeedQuery(state.seed, state.family));
}

function syncFamilyButtons() {
  for (const button of els.familyButtons) {
    button.setAttribute('aria-pressed', String(button.dataset.family === state.family));
  }
}

function setExportsEnabled(enabled) {
  els.exportCss.disabled = !enabled;
  els.exportTerminal.disabled = !enabled;
  els.exportWallpaper.disabled = !enabled;
}

function render({ animate = true } = {}) {
  const bundle = currentBundle();
  applyPaletteToPage(bundle.palette);
  swapPreview(renderMotifToSvg(bundle), { animate });
  syncFamilyButtons();
  syncUrl();
  setExportsEnabled(true);
  return bundle;
}

function setSeed(seed) {
  state.seed = seed;
  els.seedInput.value = seed;
  render({ animate: true });
  chime.play(660);
}

els.seedInput.value = state.seed;
render({ animate: false });

els.newSeed.addEventListener('click', () => {
  setSeed(generateRandomSeed());
});

els.seedInput.addEventListener('change', () => {
  const value = els.seedInput.value.trim();
  if (!value) {
    els.seedInput.value = state.seed;
    return;
  }
  setSeed(value);
});

for (const button of els.familyButtons) {
  button.addEventListener('click', () => {
    if (button.dataset.family === state.family) return;
    state.family = button.dataset.family;
    render({ animate: true });
    chime.play(660);
  });
}

function downloadExport(button, { content, mimeType, kind, extension, label }) {
  button.disabled = true;
  try {
    const filename = buildExportFilename(state.seed, state.family, kind, extension);
    triggerDownload(content, filename, mimeType);
    showToast(`✓ ${label} exported — ${filename}`);
    chime.play(880);
  } finally {
    window.setTimeout(() => {
      button.disabled = false;
    }, 400);
  }
}

els.exportCss.addEventListener('click', () => {
  downloadExport(els.exportCss, {
    content: buildCssTokens(generatePalette(state.seed, state.family)),
    mimeType: 'text/css',
    kind: 'css',
    extension: 'css',
    label: 'CSS tokens',
  });
});

els.exportTerminal.addEventListener('click', () => {
  downloadExport(els.exportTerminal, {
    content: JSON.stringify(buildTerminalTheme(generatePalette(state.seed, state.family)), null, 2),
    mimeType: 'application/json',
    kind: 'terminal',
    extension: 'json',
    label: 'Terminal theme',
  });
});

els.exportWallpaper.addEventListener('click', () => {
  const [width, height] = els.wallpaperResolution.value.split('x').map(Number);
  downloadExport(els.exportWallpaper, {
    content: buildWallpaperSvg(currentBundle(), { width, height }),
    mimeType: 'image/svg+xml',
    kind: 'wallpaper',
    extension: 'svg',
    label: 'Wallpaper',
  });
});

els.copySeed.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(state.seed);
    showToast(`✓ Copied seed "${state.seed}"`);
  } catch {
    showToast('Clipboard unavailable — copy the seed from the input above');
  }
});

els.muteToggle.setAttribute('aria-pressed', String(chime.isMuted()));

els.muteToggle.addEventListener('click', () => {
  const nextMuted = !chime.isMuted();
  chime.setMuted(nextMuted);
  els.muteToggle.setAttribute('aria-pressed', String(nextMuted));
  els.muteToggle.setAttribute('aria-label', nextMuted ? 'Unmute sound' : 'Mute sound');
});
