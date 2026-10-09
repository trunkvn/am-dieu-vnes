/** Pitch keyframes: [x, level] with x in 0..1 and level 0 = bottom of the range, 1 = top. */
export type Keyframes = [x: number, level: number][];

export type Tone = {
  id: string;
  /** recording of the word, under /public */
  audio: string;
  vi: string;
  en: string;
  word: string;
  /** the bare vowel carrying the mark */
  mark: string;
  /** Chao tone numbers */
  num: string;
  /** id of the <g> in CurveDefs */
  curve: string;
  mean: string;
  example: [vi: string, en: string];
  how: string;
  key: Keyframes;
  /** seconds */
  dur: number;
  /** relative length, 1 = full */
  len: number;
};

/** Folder under /public/audio holding the six recordings (and their file type). Swap the voice by changing these. */
const AUDIO_SET = "phospeak";
const AUDIO_EXT = "mp3";

const TONE_DATA: Omit<Tone, "audio">[] = [
  { id: "ngang", vi: "ngang", en: "level", word: "ma", mark: "a", num: "33", curve: "c-ngang", mean: "ghost", example: ["ma quỷ", "ghosts and ghouls"], how: "Flat and even. Hold the note and don’t let it drift.", key: [[0, 0.5], [1, 0.5]], dur: 0.8, len: 1 },
  { id: "huyen", vi: "huyền", en: "low falling", word: "mà", mark: "à", num: "21", curve: "c-huyen", mean: "but, which", example: ["nhưng mà", "but, however"], how: "Starts a little low and relaxes downward, like a soft sigh.", key: [[0, 0.25], [1, 0]], dur: 0.8, len: 1 },
  { id: "sac", vi: "sắc", en: "rising", word: "má", mark: "á", num: "35", curve: "c-sac", mean: "cheek; mother in the south", example: ["má hồng", "rosy cheeks"], how: "Starts mid and climbs sharply. The bright one.", key: [[0, 0.5], [1, 1]], dur: 0.8, len: 1 },
  { id: "hoi", vi: "hỏi", en: "dipping", word: "mả", mark: "ả", num: "214", curve: "c-hoi", mean: "tomb", example: ["mồ mả", "graves"], how: "Dips down, then swings back up. A questioning shape; hỏi means “to ask”.", key: [[0, 0.25], [0.5, 0], [1, 0.75]], dur: 0.9, len: 1 },
  { id: "nga", vi: "ngã", en: "broken rising", word: "mã", mark: "ã", num: "3ˀ5", curve: "c-nga", mean: "horse, in Sino-Vietnamese words", example: ["quân mã", "the horse piece in Chinese chess"], how: "Rises with a catch in the throat halfway. The voice breaks, then lifts.", key: [[0, 0.5], [0.3, 0.38], [0.5, 0.55], [1, 1]], dur: 0.9, len: 1 },
  { id: "nang", vi: "nặng", en: "heavy", word: "mạ", mark: "ạ", num: "21ˀ", curve: "c-nang", mean: "rice seedling", example: ["mạ non", "young seedlings"], how: "Short and heavy: drops low and stops, as if closing a door.", key: [[0, 0.25], [1, 0]], dur: 0.35, len: 0.35 },
];

export const TONES: Tone[] = TONE_DATA.map((t) => ({
  ...t,
  audio: `/audio/${AUDIO_SET}/ma-${t.id}.${AUDIO_EXT}`,
}));

/** Resample keyframes into `n` evenly spaced levels. */
export function sample(key: Keyframes, n = 32): number[] {
  return Array.from({ length: n }, (_, i) => {
    const x = i / (n - 1);
    for (let k = 1; k < key.length; k++) {
      if (x <= key[k][0]) {
        const [x0, y0] = key[k - 1];
        const [x1, y1] = key[k];
        return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0 || 1);
      }
    }
    return key[key.length - 1][1];
  });
}
