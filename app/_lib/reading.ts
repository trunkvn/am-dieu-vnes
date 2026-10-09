import { TONES, sample } from "./tones";

/** A point on the drawing pad: x and y in 0..1, y counted from the top. */
export type Point = [x: number, y: number];

/** Pad height that pitch levels 0..1 occupy; the rest is margin above and below. */
const TOP = 0.14;
const SPAN = 0.72;

/** Pitch level (0 = bottom of the range, 1 = top) to a pad y. */
export const levelToY = (level: number) => TOP + SPAN * (1 - level);

/** Pad y to a pitch level, clamped to 0..1. */
export const yToLevel = (y: number) => Math.min(1, Math.max(0, (TOP + SPAN - y) / SPAN));

const SAMPLES = 32;
const mean = (a: number[]) => a.reduce((s, v) => s + v, 0) / a.length;
/** end of the line minus its start, using the last and first quarters */
const slopeOf = (a: number[]) => {
  const q = Math.max(1, Math.floor(a.length / 4));
  return mean(a.slice(-q)) - mean(a.slice(0, q));
};

export type Match = {
  /** how close each tone is, in percent, same order as TONES */
  percent: number[];
  /** index of the closest tone */
  best: number;
};

type Weights = {
  /** how much the overall direction counts: where the line ends compared with where it starts */
  slope?: number;
  /** how much the line's overall height counts (0 to compare shape only) */
  height?: number;
  /** how much the line's length counts (nặng is short) */
  length?: number;
};

/**
 * Compare a pitch line, as `levels` (0 = bottom of the range, 1 = top), with the
 * six tones. Shape matters most; height and length count by their weights.
 * `length` is 0..1, 1 being a full-length syllable.
 */
export function classifyLevels(levels: number[], length: number, { height = 0.35, length: lengthWeight = 0.5, slope: slopeWeight = 0.8 }: Weights = {}): Match {
  const drawnMean = mean(levels);
  const drawnSlope = slopeOf(levels);
  const weights = TONES.map((t) => {
    const ref = sample(t.key, levels.length);
    const refMean = mean(ref);
    const shape = Math.sqrt(mean(levels.map((v, i) => (v - drawnMean - (ref[i] - refMean)) ** 2)));
    const direction = Math.abs(drawnSlope - slopeOf(ref));
    return Math.exp(
      -(0.7 * shape + slopeWeight * direction + height * Math.abs(drawnMean - refMean) + lengthWeight * Math.abs(length - t.len)) * 14,
    );
  });
  const total = weights.reduce((s, v) => s + v, 0);
  const percent = weights.map((v) => Math.round((100 * v) / total));
  return { percent, best: percent.indexOf(Math.max(...percent)) };
}

export type Reading = Match & {
  /** the drawn line resampled to 32 pitch levels, left to right */
  levels: number[];
  /** how wide the stroke was, 0..1 of the pad */
  span: number;
};

/**
 * Work out which tone a drawn line is nearest to. Direction of drawing is
 * ignored. Returns null for a stroke too short to read.
 */
export function readLine(points: Point[]): Reading | null {
  if (points.length < 4) return null;

  const pts = points.slice().sort((a, b) => a[0] - b[0]);
  const x0 = pts[0][0];
  const span = Math.max(pts[pts.length - 1][0] - x0, 0.001);

  const levels: number[] = [];
  let j = 0;
  for (let i = 0; i < SAMPLES; i++) {
    const x = x0 + (span * i) / (SAMPLES - 1);
    while (j < pts.length - 2 && pts[j + 1][0] < x) j++;
    const a = pts[j];
    const b = pts[j + 1];
    const t = b[0] - a[0] ? Math.min(1, Math.max(0, (x - a[0]) / (b[0] - a[0]))) : 0;
    levels.push(yToLevel(a[1] + (b[1] - a[1]) * t));
  }

  return { ...classifyLevels(levels, Math.min(1, span / 0.6)), levels, span };
}
