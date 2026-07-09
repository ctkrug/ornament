import './style.css';
import { generatePalette } from './core/palette.js';
import { generateNouveauMotif } from './core/motifs/nouveau.js';
import { generateAstroMotif } from './core/motifs/astro.js';
import { renderMotifToSvg } from './core/render/svgRenderer.js';
import { parseSeedState, buildSeedQuery } from './core/urlState.js';
import { generateRandomSeed } from './core/randomSeed.js';

const DEFAULT_SEED = 'first-light';
const DEFAULT_FAMILY = 'astro';
const FADE_OUT_MS = 220;

const els = {
  preview: document.querySelector('#preview'),
  seedInput: document.querySelector('#seed-input'),
  newSeed: document.querySelector('#new-seed'),
  familyButtons: Array.from(document.querySelectorAll('[data-family]')),
};

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

function render({ animate = true } = {}) {
  const bundle = currentBundle();
  applyPaletteToPage(bundle.palette);
  swapPreview(renderMotifToSvg(bundle), { animate });
  syncFamilyButtons();
  syncUrl();
  return bundle;
}

function setSeed(seed) {
  state.seed = seed;
  els.seedInput.value = seed;
  render({ animate: true });
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
  });
}
