/**
 * The pitch contours, on a 5-level scale: y=8 is the top of your range, y=72 the bottom.
 * `paths` are drawn with the ink stroke; `dot` is a filled point (the stop of nặng).
 */
export type Curve = { paths: string[]; dot?: { cx: number; cy: number; r: number } };

export const CURVES: Record<string, Curve> = {
  "c-ngang": { paths: ["M10 41 C40 39 80 39 110 40"] },
  "c-huyen": { paths: ["M10 54 C50 58 80 66 110 72"] },
  "c-sac": { paths: ["M10 40 C40 38 70 24 110 8"] },
  "c-hoi": { paths: ["M10 56 C30 68 46 72 62 72 C84 72 98 46 110 24"] },
  "c-nga": { paths: ["M10 40 C22 36 34 44 46 48", "M60 38 C80 30 96 16 110 8"] },
  "c-nang": { paths: ["M10 52 C26 56 40 66 52 72"], dot: { cx: 64, cy: 72, r: 3.4 } },
  "c-q": { paths: ["M10 52 C30 52 50 50 66 40 C80 30 92 18 108 12"] },
};
