import { TONES, sample } from "./tones";

let ctx: AudioContext | undefined;

/** A synthesised pitch glide: the tone's shape alone, no word. Browser-only. */
export function playLevels(levels: number[], dur: number) {
  try {
    ctx = ctx ?? new AudioContext();
  } catch {
    return;
  }
  if (ctx.state === "suspended") void ctx.resume();

  const t = ctx.currentTime + 0.03;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueCurveAtTime(
    Float32Array.from(levels.map((p) => 110 * Math.pow(2, p * 1.3))),
    t,
    dur,
  );
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.2, t + 0.05);
  gain.gain.setValueAtTime(0.2, t + Math.max(0.06, dur - 0.09));
  gain.gain.linearRampToValueAtTime(0, t + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

/** Just the pitch of tone `index`, as a glide. */
export function playTone(index: number) {
  const tone = TONES[index];
  playLevels(sample(tone.key), tone.dur);
}

/**
 * Playback speed for the recordings (1 = as recorded). The browser stretches
 * the audio in time and keeps the pitch, so the tone is unchanged. The current
 * recordings are already unhurried (0.6-1.1 s); the old synthetic voice needed 0.65.
 */
const WORD_RATE = 1;

const words = new Map<number, HTMLAudioElement>();
let playing: HTMLAudioElement | undefined;

function wordAudio(index: number) {
  let el = words.get(index);
  if (!el) {
    el = new Audio(TONES[index].audio);
    el.preload = "auto";
    el.preservesPitch = true;
    el.playbackRate = WORD_RATE;
    words.set(index, el);
  }
  return el;
}

/** Fetch the six recordings ahead of the first tap. */
export function preloadWords() {
  TONES.forEach((_, i) => wordAudio(i));
}

/** The spoken word for tone `index`; falls back to the glide if the file can't play. */
export function playWord(index: number) {
  if (playing) {
    playing.pause();
    playing.currentTime = 0;
  }
  const el = wordAudio(index);
  el.currentTime = 0;
  playing = el;
  el.play().catch(() => {
    words.delete(index);
    playing = undefined;
    playTone(index);
  });
}
