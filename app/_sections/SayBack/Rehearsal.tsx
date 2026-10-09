"use client";

import { useEffect, useRef, useState } from "react";
import { Button, PlayIcon } from "@/app/_components/Button/Button";
import { InkCurve } from "@/app/_components/InkCurve/InkCurve";
import { Note } from "@/app/_components/Note/Note";
import { Slip } from "@/app/_components/Slip/Slip";
import { playWord, preloadWords } from "@/app/_lib/audio";
import { cx } from "@/app/_lib/cx";
import { analyseUtterance } from "@/app/_lib/pitch";
import { classifyLevels, type Match } from "@/app/_lib/reading";
import { RecorderError, startRecording, type Session } from "@/app/_lib/recorder";
import { TONES, sample } from "@/app/_lib/tones";
import styles from "./Rehearsal.module.css";

type Status = "idle" | "recording" | "analysing";
type Problem = "unsupported" | "denied" | "quiet" | "failed";
type Attempt = { id: number; levels: number[]; match: Match };

/** Voiced length that counts as a full-length syllable, in seconds. */
const FULL_SYLLABLE_S = 0.7;
/** Tones whose creaky voice the pitch tracker can't follow. */
const CREAKY = new Set(["hoi", "nga", "nang"]);

const PROBLEMS: Record<Problem, string> = {
  unsupported: "This browser can't record from a microphone.",
  denied: "The microphone is blocked. Allow it in the browser's address bar and try again.",
  quiet: "I couldn't hear a clear pitch. Try again, a little closer and a little louder.",
  failed: "The recording didn't work. Try once more.",
};

const mean = (a: number[]) => a.reduce((s, v) => s + v, 0) / a.length;

/** Pitch levels (0 = low, 1 = high) as an SVG path in the curve library's units. */
function pathOf(levels: number[]) {
  return levels
    .map((l, i) => {
      const y = Math.min(84, Math.max(-4, 72 - 64 * l));
      return `${i ? "L" : "M"}${(10 + (100 * i) / (levels.length - 1)).toFixed(1)} ${y.toFixed(1)}`;
    })
    .join("");
}

export function Rehearsal() {
  const [target, setTarget] = useState(0);
  const targetRef = useRef(0);
  const [status, setStatus] = useState<Status>("idle");
  const [problem, setProblem] = useState<Problem | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [done, setDone] = useState<number[]>([]);
  const session = useRef<Session | null>(null);
  const count = useRef(0);

  useEffect(() => {
    preloadWords();
    return () => session.current?.cancel();
  }, []);

  function choose(index: number) {
    if (status !== "idle") return;
    targetRef.current = index;
    setTarget(index);
    setAttempt(null);
    setProblem(null);
  }

  async function finish() {
    const current = session.current;
    if (!current) return;
    session.current = null;
    setStatus("analysing");
    try {
      const recording = await current.finish();
      const utterance = analyseUtterance(recording.samples, recording.sampleRate);
      if (!utterance) {
        setAttempt(null);
        setProblem("quiet");
        return;
      }
      const match = classifyLevels(utterance.levels, Math.min(1, utterance.voiced / FULL_SYLLABLE_S), {
        height: 0,
        length: 0.3,
      });
      setProblem(null);
      setAttempt({ id: ++count.current, levels: utterance.levels, match });
      if (match.best === targetRef.current) {
        const hit = targetRef.current;
        setDone((d) => (d.includes(hit) ? d : [...d, hit]));
      }
    } catch (e) {
      setProblem(e instanceof RecorderError && e.problem !== "denied" ? e.problem : "failed");
    } finally {
      setStatus("idle");
    }
  }

  async function toggle() {
    if (status === "recording") return void finish();
    if (status !== "idle") return;
    setProblem(null);
    setAttempt(null);
    try {
      session.current = await startRecording(() => void finish());
      setStatus("recording");
    } catch (e) {
      setProblem(e instanceof RecorderError ? e.problem : "failed");
    }
  }

  const tone = TONES[target];
  const model = sample(tone.key);
  const drawn = attempt ? attempt.levels.map((l) => l - mean(attempt.levels) + mean(model)) : null;
  const best = attempt ? TONES[attempt.match.best] : null;
  const matched = attempt?.match.best === target;
  const close = !!attempt && (matched || attempt.match.percent[target] >= 20);

  return (
    <div className={styles.say} data-state={status}>
      <div>
        <div className={styles.prompt}>
          <button
            type="button"
            className={styles.mic}
            onClick={toggle}
            disabled={status === "analysing"}
            aria-label={status === "recording" ? "Stop recording" : "Record"}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 15a4 4 0 0 0 4-4V6a4 4 0 0 0-8 0v5a4 4 0 0 0 4 4zm7-4a7 7 0 0 1-14 0H3a9 9 0 0 0 8 8.94V23h2v-3.06A9 9 0 0 0 21 11z" />
            </svg>
          </button>
          <div>
            <small className={styles.say_label}>Say</small>
            <span className={styles.sayWord} lang="vi">
              {tone.word}
            </span>
          </div>
          <Button small onClick={() => playWord(target)}>
            <PlayIcon />
            Hear it
          </Button>
        </div>

        <ul className={styles.progress} aria-label="Words to practise">
          {TONES.map((t, i) => (
            <li key={t.id}>
              <button
                type="button"
                lang="vi"
                className={cx(styles.chip, done.includes(i) && styles.done, i === target && styles.now)}
                aria-pressed={i === target}
                onClick={() => choose(i)}
              >
                {t.word}
              </button>
            </li>
          ))}
        </ul>

        <Slip tilt="left" className={styles.overlay}>
          <div className={styles.chart}>
            <InkCurve curve={tone.curve} tone="ghost" staff className={styles.layer} />
            {drawn && (
              <svg key={attempt?.id} className={cx(styles.layer, styles.you)} viewBox="-4 -4 128 88" aria-hidden="true">
                <path d={pathOf(drawn)} />
              </svg>
            )}
          </div>
          <div className={styles.legend}>
            <span>
              <i className={styles.keyModel} />
              model
            </span>
            <span>
              <i />
              you
            </span>
          </div>
        </Slip>
      </div>

      <Slip tilt="right" className={styles.remark} aria-live="polite">
        <h3 className={styles.noteTitle}>
          <span lang="vi">Lời phê</span> · Teacher’s note
        </h3>
        {status === "recording" ? (
          <p className={styles.t}>
            <span lang="vi">Đang nghe…</span>
            <span>Say “{tone.word}” once, then stop. I’ll know when you’re done.</span>
          </p>
        ) : status === "analysing" ? (
          <p className={styles.t}>
            <span lang="vi">Chờ một chút…</span>
            <span>Reading your pitch.</span>
          </p>
        ) : problem ? (
          <p className={styles.t}>
            <span lang="vi">Chưa nghe rõ.</span>
            <span>{PROBLEMS[problem]}</span>
          </p>
        ) : attempt && best ? (
          <>
            <p className={styles.t}>
              <span lang="vi">{matched ? "Đúng rồi!" : close ? "Gần đúng rồi!" : "Thử lại nhé!"}</span>
              <span>
                {matched ? (
                  <>
                    Your line follows the model for <b lang="vi">{tone.word}</b>.
                  </>
                ) : (
                  <>
                    That sounded closest to <b lang="vi">{best.word}</b> ({best.vi}). For{" "}
                    <b lang="vi">{tone.word}</b>: {tone.how}
                  </>
                )}
              </span>
            </p>
            <p className={styles.closest}>
              <Note>
                closest line: {best.word} · {attempt.match.percent[attempt.match.best]}%
              </Note>
            </p>
          </>
        ) : (
          <p className={styles.t}>
            <span lang="vi">Sẵn sàng!</span>
            <span>
              Tap the microphone and say “{tone.word}”. {tone.how}
            </span>
          </p>
        )}

        {CREAKY.has(tone.id) && (
          <p className={styles.caveat}>
            Pitch tracking can’t follow a creaky voice, so {tone.vi} may look broken or be misread.
            Trust your ear as much as the chart.
          </p>
        )}
        <p className={styles.caveat}>Recorded in your browser. Nothing is uploaded.</p>
      </Slip>
    </div>
  );
}
