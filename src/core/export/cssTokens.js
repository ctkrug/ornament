/**
 * Renders a palette as a `:root { --ornament-* }` CSS custom-property
 * stylesheet, ready to drop into any project.
 */
export function buildCssTokens(palette) {
  return `:root {
  --ornament-bg: ${palette.bg};
  --ornament-surface-1: ${palette.surface1};
  --ornament-surface-2: ${palette.surface2};
  --ornament-text: ${palette.text};
  --ornament-text-muted: ${palette.textMuted};
  --ornament-accent: ${palette.accent};
  --ornament-accent-support: ${palette.accentSupport};
  --ornament-success: ${palette.success};
  --ornament-danger: ${palette.danger};
}
`;
}
