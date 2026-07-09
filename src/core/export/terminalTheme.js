/**
 * Renders a palette as a 16-color ANSI terminal theme, in the generic
 * name/hex-ish shape most terminal emulators (Alacritty, iTerm2, Windows
 * Terminal) can be mapped onto with a small per-app adapter.
 */
export function buildTerminalTheme(palette) {
  return {
    name: `ornament-${palette.seed}`,
    background: palette.bg,
    foreground: palette.text,
    cursor: palette.accent,
    selection: palette.surface2,
    black: palette.surface1,
    red: palette.danger,
    green: palette.success,
    yellow: palette.accent,
    blue: palette.accentSupport,
    magenta: palette.accentSupport,
    cyan: palette.accentSupport,
    white: palette.text,
    brightBlack: palette.textMuted,
    brightRed: palette.danger,
    brightGreen: palette.success,
    brightYellow: palette.accent,
    brightBlue: palette.accentSupport,
    brightMagenta: palette.accentSupport,
    brightCyan: palette.accentSupport,
    brightWhite: palette.text,
  };
}
