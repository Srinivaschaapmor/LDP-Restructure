const HEX_PATTERN = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

export type Rgb = [number, number, number];

export function hexToRgb(value?: string): Rgb | null {
  const match = value?.trim().match(HEX_PATTERN);
  if (!match) return null;
  let hex = match[1];
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  return [
    Number.parseInt(hex.slice(0, 2), 16),
    Number.parseInt(hex.slice(2, 4), 16),
    Number.parseInt(hex.slice(4, 6), 16),
  ];
}

export function overlayGradient(direction: string, rgb: Rgb): string {
  const [r, g, b] = rgb;
  const angle = direction === "right" ? 270 : 90;
  return `linear-gradient(${angle}deg, rgba(${r},${g},${b},.6), rgba(${r},${g},${b},0))`;
}

export function overlayWash(rgb: Rgb, alphaVar: string): string {
  const [r, g, b] = rgb;
  return `rgb(${r} ${g} ${b} / var(${alphaVar}))`;
}
