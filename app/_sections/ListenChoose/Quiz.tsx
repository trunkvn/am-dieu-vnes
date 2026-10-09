"use client";

import { useEffect, useState } from "react";
import { Button, PlayIcon } from "@/app/_components/Button/Button";
import { Note } from "@/app/_components/Note/Note";
import { Slip } from "@/app/_components/Slip/Slip";
import { playWord, preloadWords } from "@/app/_lib/audio";
import { cx } from "@/app/_lib/cx";
import { makeQuestions, QUESTIONS, type Question } from "@/app/_lib/quiz";
import { TONES } from "@/app/_lib/tones";
import styles from "./Quiz.module.css";

type Phase = "intro" | "asking" | "done";

function verdict(score: number) {
  if (score >= 9) return ["Tai tốt lắm!", "An excellent ear. Even the confusable pairs didn’t fool you."];
  if (score >= 6) return ["Khá lắm!", "A good ear. Run it again and watch the pairs that tripped you."];
  return ["Cố lên!", "Tones take time. Go back to the six shapes, listen again, then retry."];
}

export function Quiz() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);

  useEffect(preloadWords, []);

  const question = questions[index];
  const score = answers.filter(Boolean).length;
  const answered = picked !== null;

  function start() {
    const next = makeQuestions();
    setQuestions(next);
    setIndex(0);
    setPicked(null);
    setAnswers([]);
    setPhase("asking");
    playWord(next[0].target);
  }

  function choose(option: number) {
    if (answered) return;
    setPicked(option);
    setAnswers((a) => [...a, option === question.target]);
  }

  function next() {
    if (index === QUESTIONS - 1) return setPhase("done");
    setIndex(index + 1);
    setPicked(null);
    playWord(questions[index + 1].target);
  }

  if (phase === "intro") {
    return (
      <Slip tilt="right" className={styles.quiz}>
        <p className={styles.start}>Ten sounds, three choices each.</p>
        <Button solid onClick={start}>
          <PlayIcon />
          Start
        </Button>
      </Slip>
    );
  }

  if (phase === "done") {
    const [title, text] = verdict(score);
    const missed = questions.flatMap((q, i) => (answers[i] ? [] : [q.target]));
    return (
      <Slip tilt="right" className={styles.quiz}>
        <p className={styles.top}>
          <span>Finished</span>
          <span>
            Score {score} / {QUESTIONS}
          </span>
        </p>
        <p className={styles.verdictTitle} lang="vi">
          {title}
        </p>
        <p className={styles.verdictText}>{text}</p>
        {missed.length > 0 && (
          <p className={styles.missed}>
            Missed:{" "}
            {[...new Set(missed)].map((t) => (
              <span key={t} className={styles.missedWord} lang="vi">
                {TONES[t].word}
              </span>
            ))}
          </p>
        )}
        <div className={styles.foot}>
          <span />
          <Button solid onClick={start}>
            Play again
          </Button>
        </div>
      </Slip>
    );
  }

  const target = TONES[question.target];
  const chosen = picked === null ? null : TONES[picked];

  return (
    <Slip tilt="right" className={styles.quiz}>
      <p className={styles.top}>
        <span>
          Question {index + 1} of {QUESTIONS}
        </span>
        <span>
          Score {score} / {answers.length}
        </span>
      </p>

      <div className={styles.listen}>
        <Button solid round className={styles.play} onClick={() => playWord(question.target)} aria-label="Play sound">
          <PlayIcon />
        </Button>
        <p>Tap to hear it again</p>
      </div>

      <div className={styles.choices}>
        {question.options.map((option) => {
          const t = TONES[option];
          const right = answered && option === question.target;
          const wrong = answered && option === picked && option !== question.target;
          return (
            <button
              key={t.id}
              type="button"
              lang="vi"
              disabled={answered}
              className={cx(styles.choice, right && styles.right, wrong && styles.wrong)}
              onClick={() => choose(option)}
            >
              {t.word}
              <small>{t.vi}</small>
              {right && <span className={cx(styles.mark, styles.markRight)}>✓</span>}
              {wrong && <span className={cx(styles.mark, styles.markWrong)}>✗</span>}
            </button>
          );
        })}
      </div>

      <div className={styles.feedback} aria-live="polite">
        {chosen &&
          (picked === question.target ? (
            <Note>Đúng rồi! Well heard.</Note>
          ) : (
            <>
              <Note>
                It was <span lang="vi">{target.word}</span> ({target.en}).
              </Note>
              <p className={styles.why}>
                You chose <span lang="vi">{chosen.word}</span> ({chosen.en}). <span lang="vi">{target.word}</span>:{" "}
                {target.how}
              </p>
            </>
          ))}
      </div>

      <div className={styles.foot}>
        <div className={styles.dots} aria-hidden="true">
          {Array.from({ length: QUESTIONS }, (_, i) => (
            <i key={i} className={answers[i] === undefined ? undefined : answers[i] ? styles.ok : styles.no} />
          ))}
        </div>
        <Button disabled={!answered} onClick={next}>
          {index === QUESTIONS - 1 ? "Finish" : "Next →"}
        </Button>
      </div>
    </Slip>
  );
}
