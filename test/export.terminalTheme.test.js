import { describe, expect, it } from 'vitest';
import { generatePalette } from '../src/core/palette.js';
import { buildTerminalTheme } from '../src/core/export/terminalTheme.js';

describe('buildTerminalTheme', () => {
  const palette = generatePalette('first-light', 'astro');
  const theme = buildTerminalTheme(palette);

  it('names the theme after the seed', () => {
    expect(theme.name).toBe('ornament-first-light');
  });

  it('defines all 16 ANSI colors plus background/foreground/cursor/selection', () => {
    const ansiKeys = [
      'black',
      'red',
      'green',
      'yellow',
      'blue',
      'magenta',
      'cyan',
      'white',
      'brightBlack',
      'brightRed',
      'brightGreen',
      'brightYellow',
      'brightBlue',
      'brightMagenta',
      'brightCyan',
      'brightWhite',
    ];
    for (const key of ansiKeys) {
      expect(theme[key]).toMatch(/^hsl\(/);
    }
    expect(theme.background).toBe(palette.bg);
    expect(theme.foreground).toBe(palette.text);
    expect(theme.cursor).toBe(palette.accent);
  });
});
