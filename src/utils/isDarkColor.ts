import getLuminance from './getLuminance';

export default function isDarkColor(hexColor: string): boolean {
  let color = hexColor;

  // Normalize 3-digit hex to 6-digit
  if (color.length === 4) {
    color =
      '#' +
      color
        .slice(1)
        .split('')
        .map((c) => c + c)
        .join('');
  }

  const bigint = parseInt(color.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  const luminance = getLuminance(r, g, b);
  return luminance < 0.5;
}
