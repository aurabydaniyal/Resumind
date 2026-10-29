export const ACCENT_PRESETS = [
  { id: 'cobalt', name: 'Royal Cobalt', hex: '#2563eb' },
  { id: 'indigo', name: 'Deep Indigo', hex: '#4f46e5' },
  { id: 'emerald', name: 'Emerald Teal', hex: '#059669' },
  { id: 'violet', name: 'Imperial Violet', hex: '#7c3aed' },
  { id: 'rose', name: 'Crimson Rose', hex: '#e11d48' },
  { id: 'amber', name: 'Warm Amber', hex: '#d97706' },
  { id: 'cyan', name: 'Ocean Cyan', hex: '#0891b2' },
  { id: 'slate', name: 'Executive Slate', hex: '#0f172a' }
];

export const RESUME_TEMPLATES = [
  { id: 'modern', name: 'Modern', badge: 'Popular', desc: 'Crisp timeline & bold accents' },
  { id: 'executive', name: 'Executive', badge: 'New', desc: 'Commanding dark header banner' },
  { id: 'creative', name: 'Creative', badge: 'New', desc: 'Two-column studio sidebar' },
  { id: 'classic', name: 'Classic', badge: 'ATS', desc: 'Timeless centered hierarchy' },
  { id: 'minimal', name: 'Minimal', badge: 'Clean', desc: 'Editorial whitespace layout' }
];

function sanitizeHex(hex) {
  if (!hex || typeof hex !== 'string') return '#2563eb';
  const clean = hex.trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(clean)) return clean;
  if (/^#[0-9A-Fa-f]{3}$/.test(clean)) {
    return (
      '#' +
      clean[1] + clean[1] +
      clean[2] + clean[2] +
      clean[3] + clean[3]
    );
  }
  return '#2563eb';
}

function hexToRgb(hex) {
  const safe = sanitizeHex(hex).slice(1);
  return {
    r: parseInt(safe.slice(0, 2), 16),
    g: parseInt(safe.slice(2, 4), 16),
    b: parseInt(safe.slice(4, 6), 16)
  };
}

function mixWithWhite(hex, weight = 0.88) {
  const { r, g, b } = hexToRgb(hex);
  const mr = Math.round(r + (255 - r) * weight);
  const mg = Math.round(g + (255 - g) * weight);
  const mb = Math.round(b + (255 - b) * weight);
  return `#${mr.toString(16).padStart(2, '0')}${mg.toString(16).padStart(2, '0')}${mb.toString(16).padStart(2, '0')}`;
}

function darkenHex(hex, factor = 0.25) {
  const { r, g, b } = hexToRgb(hex);
  const dr = Math.max(0, Math.round(r * (1 - factor)));
  const dg = Math.max(0, Math.round(g * (1 - factor)));
  const db = Math.max(0, Math.round(b * (1 - factor)));
  return `#${dr.toString(16).padStart(2, '0')}${dg.toString(16).padStart(2, '0')}${db.toString(16).padStart(2, '0')}`;
}

export function getThemePalette(accentColor = '#2563eb') {
  const primary = sanitizeHex(accentColor);
  return {
    primary,
    dark: darkenHex(primary, 0.25),
    darker: darkenHex(primary, 0.45),
    lightBg: mixWithWhite(primary, 0.91),
    mediumBg: mixWithWhite(primary, 0.82),
    borderLight: mixWithWhite(primary, 0.72)
  };
}

