import './style.css';
import { generatePalette } from './core/palette.js';
import { generateNouveauMotif } from './core/motifs/nouveau.js';
import { generateAstroMotif } from './core/motifs/astro.js';
import { renderMotifToSvg } from './core/render/svgRenderer.js';
import { buildCssTokens } from './core/export/cssTokens.js';

const seed = 'first-light';
const family = 'astro';

const motifBundle = {
  palette: generatePalette(seed, family),
  nouveauPaths: generateNouveauMotif(seed),
  astro: generateAstroMotif(seed),
};

document.querySelector('#preview').innerHTML = renderMotifToSvg(motifBundle);

const tokenStyle = document.createElement('style');
tokenStyle.textContent = buildCssTokens(motifBundle.palette);
document.head.appendChild(tokenStyle);
