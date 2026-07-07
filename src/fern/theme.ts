// Fern-style design tokens — see memory: fern_style_motion_graphics.md
// Warm charcoal documentary look: cream text, single rust accent, never pure black.

export const FERN = {
  bgTop: "#181613",
  bgBottom: "#0F0E0C",
  cream: "#E9E1CF",
  dim: "#787164",
  rust: "#C2492A",
  paper: "#E8DEC8",
  paperShadow: "#D8CCB2",
  ink: "#2B2620",
  // Condensed grotesque for headlines (Bahnschrift ships with Win10+),
  // mono for kickers/citations, serif for paper documents & quotes.
  headlineFont: "'Bahnschrift Condensed', 'Bahnschrift', 'Arial Narrow', sans-serif",
  monoFont: "'Consolas', 'Courier New', monospace",
  serifFont: "Georgia, 'Times New Roman', serif",
} as const;

export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

// Entrances: ease-out cubic. Draw-ons / camera: ease-in-out. Never linear, never bouncy.
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
export const easeInOutCubic = (t: number) => {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

// Stagger between sibling lines/cards: 0.5–0.7s at 30fps
export const STAGGER_FRAMES = 17;
