// utils/color.ts

/**
 * Parses a hex color string (#RRGGBB) into an array of RGB values.
 * @param hex The hex color string.
 * @returns An array [r, g, b].
 */
function hexToRgb(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null;
}

/**
 * Calculates the relative luminance of a color.
 * See: https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
 * @param rgb An array of [r, g, b] values.
 * @returns The luminance value (0-1).
 */
function getLuminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculates the contrast ratio between two hex colors.
 * @param hex1 The first hex color.
 * @param hex2 The second hex color.
 * @returns The contrast ratio.
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  if (!rgb1 || !rgb2) {
    return 1; // Return a neutral value if colors are invalid
  }

  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}