/**
 * Find the pitch contour of one spoken syllable, relative to the speaker's own
 * voice, so a deep and a high voice give the same shape.
 */

export type Utterance = {
  /** 32 pitch levels, left to right, centred on 0.5 (see SEMITONES_PER_UNIT) */
  levels: number[];
  /** length of the voiced stretch, in seconds */
  voiced: number;
};

/** Semitones that make up one unit of level; Hanoi tones span roughly this much. */
export const SEMITONES_PER_UNIT = 12;

const LOW_HZ = 70;
const HIGH_HZ = 450;
const WORK_RATE = 16000;
const WINDOW_S = 0.04;
const HOP_S = 0.01;
/** quietest a frame can be, relative to the loudest, to count as speech */
const GATE = 0.1;
/** how clearly periodic a frame must be to trust its pitch (creaky voice scores low) */
const CLARITY = 0.5;
/** a change bigger than this between neighbouring 10 ms frames is a tracking error, not speech */
const MAX_JUMP_ST = 5;
/** frames apart that still count as neighbours for the jump check; a real break in the voice may jump */
const NEIGHBOUR = 3;
/** longest stretch of lost pitch, in frames, still bridged inside one syllable (creaky voice drops out for a while) */
const MAX_GAP = 40;
/** share of the voiced stretch dropped at each end, where the consonant makes the pitch unstable */
const TRIM = 0.08;
const MIN_FRAMES = 10;
const OUT_POINTS = 32;

const toSemitones = (hz: number) => 12 * Math.log2(hz / 100);

/** One pitch per 10 ms frame, in Hz, or null where there is no clear pitch. */
export function trackPitch(input: Float32Array, sampleRate: number): (number | null)[] {
  // Work at about 16 kHz: plenty for voice pitch and far cheaper.
  const factor = Math.max(1, Math.round(sampleRate / WORK_RATE));
  const rate = sampleRate / factor;
  const x = new Float32Array(Math.floor(input.length / factor));
  for (let i = 0; i < x.length; i++) {
    let sum = 0;
    for (let k = 0; k < factor; k++) sum += input[i * factor + k];
    x[i] = sum / factor;
  }

  const win = Math.round(rate * WINDOW_S);
  const hop = Math.round(rate * HOP_S);
  const minLag = Math.floor(rate / HIGH_HZ);
  const maxLag = Math.ceil(rate / LOW_HZ);
  const frames = Math.max(0, Math.floor((x.length - win - maxLag) / hop));

  const rms: number[] = [];
  for (let f = 0; f < frames; f++) {
    let e = 0;
    for (let i = 0; i < win; i++) e += x[f * hop + i] ** 2;
    rms.push(Math.sqrt(e / win));
  }
  const loudest = Math.max(0, ...rms);

  const nsdf = new Float32Array(maxLag + 2);
  const out: (number | null)[] = [];
  for (let f = 0; f < frames; f++) {
    if (rms[f] < GATE * loudest) {
      out.push(null);
      continue;
    }
    const s = f * hop;
    // Normalised square difference (McLeod): 1 means a perfect repeat at that lag.
    for (let tau = minLag - 1; tau <= maxLag + 1; tau++) {
      let r = 0;
      let m = 0;
      for (let i = 0; i < win; i++) {
        const a = x[s + i];
        const b = x[s + i + tau];
        r += a * b;
        m += a * a + b * b;
      }
      nsdf[tau] = m > 0 ? (2 * r) / m : 0;
    }
    // Take the first strong peak, not the tallest: that avoids octave-down errors.
    let top = 0;
    for (let tau = minLag; tau <= maxLag; tau++) top = Math.max(top, nsdf[tau]);
    let lag = 0;
    for (let tau = minLag; tau <= maxLag; tau++) {
      if (nsdf[tau] > nsdf[tau - 1] && nsdf[tau] >= nsdf[tau + 1] && nsdf[tau] >= 0.85 * top) {
        const a = nsdf[tau - 1];
        const b = nsdf[tau];
        const c = nsdf[tau + 1];
        const shift = a - 2 * b + c !== 0 ? (0.5 * (a - c)) / (a - 2 * b + c) : 0;
        lag = tau + shift;
        break;
      }
    }
    out.push(top >= CLARITY && lag > 0 ? rate / lag : null);
  }
  return out;
}

const median = (a: number[]) => a.slice().sort((p, q) => p - q)[Math.floor(a.length / 2)];

/**
 * Turn a recording of one syllable into a relative pitch line. Returns null when
 * no clear stretch of pitch can be found (too quiet, too short, or only noise).
 */
export function analyseUtterance(samples: Float32Array, sampleRate: number): Utterance | null {
  const st = trackPitch(samples, sampleRate).map((hz) => (hz === null ? null : toSemitones(hz)));

  // Smooth lone glitches with a 5-frame median, then drop impossible jumps.
  const smooth = st.map((v, i) => {
    if (v === null) return null;
    const near = st.slice(Math.max(0, i - 2), i + 3).filter((n): n is number => n !== null);
    return near.length >= 3 ? median(near) : null;
  });
  let prev: { at: number; v: number } | null = null;
  const clean = smooth.map((v, i) => {
    if (v === null) return null;
    if (prev && i - prev.at <= NEIGHBOUR && Math.abs(v - prev.v) > MAX_JUMP_ST) return null;
    prev = { at: i, v };
    return v;
  });

  // Group voiced frames into runs, bridging short gaps; keep the longest run.
  let best: { start: number; end: number; count: number } | null = null;
  let run: { start: number; end: number; count: number } | null = null;
  clean.forEach((v, i) => {
    if (v === null) return;
    if (run && i - run.end <= MAX_GAP) {
      run.end = i;
      run.count++;
    } else {
      run = { start: i, end: i, count: 1 };
    }
    if (!best || run.count > best.count) best = run;
  });
  const found = best as { start: number; end: number; count: number } | null;
  if (!found || found.count < MIN_FRAMES) return null;

  // Fill the gaps by straight lines, then resample to a fixed number of points.
  const line: number[] = [];
  for (let i = found.start; i <= found.end; i++) {
    let v = clean[i];
    if (v === null) {
      let lo = i - 1;
      while (clean[lo] === null) lo--;
      let hi = i + 1;
      while (clean[hi] === null) hi++;
      v = (clean[lo] as number) + (((clean[hi] as number) - (clean[lo] as number)) * (i - lo)) / (hi - lo);
    }
    line.push(v);
  }
  const cut = line.length >= 15 ? Math.round(line.length * TRIM) : 0;
  const core = line.slice(cut, line.length - cut);
  const points = Array.from({ length: OUT_POINTS }, (_, k) => {
    const pos = (k * (core.length - 1)) / (OUT_POINTS - 1);
    const i = Math.floor(pos);
    const next = Math.min(core.length - 1, i + 1);
    return core[i] + (core[next] - core[i]) * (pos - i);
  });
  const centre = points.reduce((s, v) => s + v, 0) / points.length;

  return {
    levels: points.map((v) => 0.5 + (v - centre) / SEMITONES_PER_UNIT),
    voiced: (found.end - found.start + 1) * HOP_S,
  };
}
