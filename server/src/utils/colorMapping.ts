export function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const d = max - min;
  
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100)
  };
}

export const HEX_MAP: Record<string, string> = {
  White: '#FFFFFF',
  Black: '#000000',
  Gray: '#808080',
  Red: '#FF0000',
  Green: '#008000',
  Blue: '#0000FF',
  Yellow: '#FFFF00',
  Orange: '#FFA500',
  Brown: '#A52A2A',
  Pink: '#FFC0CB',
  Purple: '#800080'
};

export function classifyColor(h: number, s: number, v: number): string {
  if (v < 15) return 'Black';
  if (s < 15 && v > 85) return 'White';
  if (s < 15) return 'Gray';

  // Brown needs special handling as it overlaps with orange/red but has lower value and saturation
  if (h >= 10 && h <= 45 && s > 20 && v < 60) {
    return 'Brown';
  }

  if (h < 15 || h >= 345) return 'Red';
  if (h >= 15 && h < 45) return 'Orange';
  if (h >= 45 && h < 75) return 'Yellow';
  if (h >= 75 && h < 165) return 'Green';
  if (h >= 165 && h < 255) return 'Blue';
  if (h >= 255 && h < 295) return 'Purple';
  if (h >= 295 && h < 345) return 'Pink';

  return 'Gray'; // Fallback
}
