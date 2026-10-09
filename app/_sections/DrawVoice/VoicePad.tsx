"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Button, PlayIcon } from "@/app/_components/Button/Button";
import { Note } from "@/app/_components/Note/Note";
import { playLevels, playWord, preloadWords } from "@/app/_lib/audio";
import { cx } from "@/app/_lib/cx";
import { levelToY, readLine, type Point } from "@/app/_lib/reading";
import { TONES, sample } from "@/app/_lib/tones";
import styles from "./VoicePad.module.css";

const GUIDES = [14, 32, 50, 68, 86];
/** Reference lines span this part of the pad's width, in percent. */
const REF_LEFT = 15;
const REF_WIDTH = 70;
/** Nudge labels apart where two reference lines end at the same spot (sắc, ngã). */
const LABEL_DY = [0, 0, -14, 0, 14, 0];

/** A first line (a rising "má") so the pad never starts empty. */
const SEED: Point[] = sample(TONES[2].key).map((level, i) => [
  0.12 + (0.76 * i) / 31 + (((i * 7) % 5) - 2) * 0.002,
  levelToY(level) + (((i * 5) % 7) - 3) * 0.002,
]);

export function VoicePad() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const points = useRef<Point[]>(SEED);
  /** id of the pointer currently drawing, or null */
  const drawing = useRef<number | null>(null);
  const [reading, setReading] = useState(() => readLine(SEED));
  const [touched, setTouched] = useState(false);
  const [showSix, setShowSix] = useState(false);

  useEffect(preloadWords, []);

  function redraw() {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    const { width, height } = el.getBoundingClientRect();
    ctx.clearRect(0, 0, width, height);
    const pts = points.current;
    if (pts.length < 2) return;
    ctx.lineWidth = 5;
    ctx.lineCap = ctx.lineJoin = "round";
    ctx.strokeStyle = getComputedStyle(el).color;
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(x * width, y * height) : ctx.moveTo(x * width, y * height)));
    ctx.stroke();
  }

  // Keep the canvas sharp at any size and pixel ratio.
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const fit = () => {
      const { width, height } = el.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      el.width = width * ratio;
      el.height = height * ratio;
      el.getContext("2d")?.setTransform(ratio, 0, 0, ratio, 0, 0);
      redraw();
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const at = (e: PointerEvent<HTMLCanvasElement>): Point => {
    const r = e.currentTarget.getBoundingClientRect();
    return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height];
  };

  function down(e: PointerEvent<HTMLCanvasElement>) {
    if (drawing.current !== null) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = e.pointerId;
    points.current = [at(e)];
    setTouched(true);
  }

  function move(e: PointerEvent<HTMLCanvasElement>) {
    if (drawing.current !== e.pointerId) return;
    // The release can be missed (let go outside the pad or window); no button down means the stroke is over.
    if (e.buttons === 0) return up(e);
    points.current.push(at(e));
    redraw();
  }

  function up(e: PointerEvent<HTMLCanvasElement>) {
    if (drawing.current !== e.pointerId) return;
    drawing.current = null;
    setReading(readLine(points.current));
  }

  function erase() {
    points.current = [];
    setReading(null);
    setTouched(true);
    redraw();
  }

  const best = reading ? TONES[reading.best] : null;

  return (
    <div className={styles.draw}>
      <div>
        <div className={styles.pad}>
          {GUIDES.map((top) => (
            <i key={top} className={styles.guide} style={{ top: `${top}%` }} />
          ))}
          <span className={styles.label} style={{ top: "6%" }}>
            high
          </span>
          <span className={styles.label} style={{ top: "88%" }}>
            low
          </span>

          <canvas
            ref={canvas}
            className={styles.canvas}
            role="img"
            aria-label="Drawing pad: draw a pitch line"
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
            onLostPointerCapture={up}
          />

          {showSix && (
            <>
              <svg className={styles.lines} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                {TONES.map((t, i) => {
                  const width = REF_WIDTH * t.len;
                  const d = sample(t.key)
                    .map((level, k) => `${k ? "L" : "M"}${(REF_LEFT + (width * k) / 31).toFixed(2)} ${(levelToY(level) * 100).toFixed(2)}`)
                    .join("");
                  return <path key={t.id} d={d} className={cx(styles.ref, reading?.best === i && styles.refBest)} />;
                })}
              </svg>
              {TONES.map((t, i) => {
                const lastLevel = t.key[t.key.length - 1][1];
                return (
                  <span
                    key={t.id}
                    className={cx(styles.refLabel, reading?.best === i && styles.refLabelBest)}
                    lang="vi"
                    style={{
                      left: `${REF_LEFT + REF_WIDTH * t.len}%`,
                      top: `${levelToY(lastLevel) * 100}%`,
                      translate: `8px calc(-50% + ${LABEL_DY[i]}px)`,
                    }}
                  >
                    {t.word}
                  </span>
                );
              })}
            </>
          )}

          {!touched && <span className={styles.hint}>draw here →</span>}
        </div>

        <div className={styles.actions}>
          <Button solid disabled={!reading} onClick={() => reading && playLevels(reading.levels, reading.span < 0.4 ? 0.35 : 0.9)}>
            <PlayIcon />
            Play your line
          </Button>
          <Button aria-pressed={showSix} onClick={() => setShowSix((v) => !v)}>
            Show me the six
          </Button>
          <Button onClick={erase}>Erase</Button>
        </div>
      </div>

      <div className={styles.result} aria-live="polite">
        <h3 className={styles.title}>Closest tone</h3>
        {best ? (
          <p className={styles.best} lang="vi">
            {best.word}
            <small>
              {best.vi} · {best.num}
            </small>
          </p>
        ) : (
          <p className={styles.empty}>Draw a line to begin.</p>
        )}

        <ul className={styles.bars}>
          {TONES.map((t, i) => (
            <li key={t.id} className={cx(reading?.best === i && styles.top)}>
              <span className={styles.word} lang="vi">
                {t.word}
              </span>
              <span className={styles.bar}>
                <i style={{ width: `${reading?.percent[i] ?? 0}%` }} />
              </span>
              <b>{reading ? `${reading.percent[i]}%` : "–"}</b>
            </li>
          ))}
        </ul>

        {best && reading && (
          <Button small className={styles.hear} onClick={() => playWord(reading.best)}>
            <PlayIcon />
            Hear {best.word}
          </Button>
        )}
        <p className={styles.tip}>
          <Note>tip: a short, sharp stroke is nặng</Note>
        </p>
      </div>
    </div>
  );
}
