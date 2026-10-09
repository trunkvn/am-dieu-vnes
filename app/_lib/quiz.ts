import { TONES } from "./tones";

export type Question = {
  /** index into TONES of the word that plays */
  target: number;
  /** indexes into TONES to choose from, shuffled; always includes the target */
  options: number[];
};

export const QUESTIONS = 10;
const EASY = QUESTIONS / 2;

/** Tones that sound clearly different from each one, for the first rounds. */
const FAR: Record<number, number[]> = { 0: [3, 4], 1: [2, 4], 2: [1, 3], 3: [0, 2], 4: [0, 1], 5: [2, 4] };

/** The pairs that fool everyone, for the later rounds. Indexes follow TONES: ngang, huyền, sắc, hỏi, ngã, nặng. */
const CLOSE: Record<number, number[]> = { 0: [1], 1: [0, 5], 2: [4], 3: [4], 4: [3, 2], 5: [1] };

function shuffle<T>(items: T[]): T[] {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Three choices: the answer, the given look-alikes, then random fillers. */
function optionsFor(target: number, likes: number[]): number[] {
  const picked = [target, ...shuffle(likes).slice(0, 2)];
  const rest = shuffle(TONES.map((_, i) => i).filter((i) => !picked.includes(i)));
  while (picked.length < 3) picked.push(rest.shift() as number);
  return shuffle(picked);
}

/** A fresh round: easy questions first, then the confusable pairs. No word repeats within a half. */
export function makeQuestions(): Question[] {
  const all = TONES.map((_, i) => i);
  const easy = shuffle(all).slice(0, EASY);
  // Start the hard half on a word that differs from the last easy one.
  let hard = shuffle(all).slice(0, QUESTIONS - EASY);
  if (hard[0] === easy[easy.length - 1]) hard = [...hard.slice(1), hard[0]];
  return [
    ...easy.map((target) => ({ target, options: optionsFor(target, FAR[target]) })),
    ...hard.map((target) => ({ target, options: optionsFor(target, CLOSE[target]) })),
  ];
}
