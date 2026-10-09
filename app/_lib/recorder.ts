/** Record one spoken syllable from the microphone. Nothing leaves the browser. */

export type RecorderProblem = "unsupported" | "denied" | "failed";

export class RecorderError extends Error {
  constructor(readonly problem: RecorderProblem) {
    super(problem);
  }
}

export type Recording = { samples: Float32Array; sampleRate: number };

export type Session = {
  /** Stop recording and return the audio. */
  finish(): Promise<Recording>;
  /** Stop and throw the audio away. */
  cancel(): void;
};

/** Give up after this long even if it never goes quiet. */
const MAX_MS = 4000;
/** Quiet for this long after speech means the word is finished. */
const QUIET_MS = 700;
const POLL_MS = 50;

const rmsOf = (buf: Float32Array) => Math.sqrt(buf.reduce((s, v) => s + v * v, 0) / buf.length);

/**
 * Open the microphone and start recording. `onSpeechEnd` fires once the speaker
 * has said something and then gone quiet; call `finish()` in response.
 */
export async function startRecording(onSpeechEnd: () => void): Promise<Session> {
  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
    throw new RecorderError("unsupported");
  }

  let stream: MediaStream;
  try {
    // Echo and noise filters can chop up a creaky voice, so leave them off.
    stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: true },
    });
  } catch {
    throw new RecorderError("denied");
  }

  const meter = new AudioContext();
  const analyser = meter.createAnalyser();
  analyser.fftSize = 1024;
  meter.createMediaStreamSource(stream).connect(analyser);
  void meter.resume();

  const recorder = new MediaRecorder(stream);
  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => chunks.push(e.data);
  const stopped = new Promise<void>((resolve) => (recorder.onstop = () => resolve()));
  recorder.start();

  // Watch the level: learn the room's noise first, then wait for speech and for it to end.
  const buf = new Float32Array(analyser.fftSize);
  const started = performance.now();
  let floor = 0;
  let heard = false;
  let quietSince = 0;
  let ended = false;
  const end = () => {
    if (!ended) {
      ended = true;
      onSpeechEnd();
    }
  };
  const timer = setInterval(() => {
    analyser.getFloatTimeDomainData(buf);
    const level = rmsOf(buf);
    const now = performance.now();
    if (now - started < 300) {
      floor = Math.max(floor, level);
      return;
    }
    if (level > Math.max(0.02, floor * 3)) {
      heard = true;
      quietSince = 0;
    } else if (heard) {
      quietSince ||= now;
      if (now - quietSince > QUIET_MS) end();
    }
    if (now - started > MAX_MS) end();
  }, POLL_MS);

  const release = async () => {
    clearInterval(timer);
    if (recorder.state !== "inactive") recorder.stop();
    await stopped;
    stream.getTracks().forEach((t) => t.stop());
    await meter.close();
  };

  return {
    async finish() {
      await release();
      try {
        const decoder = new AudioContext();
        const audio = await decoder.decodeAudioData(await new Blob(chunks, { type: recorder.mimeType }).arrayBuffer());
        await decoder.close();
        return { samples: audio.getChannelData(0), sampleRate: audio.sampleRate };
      } catch {
        throw new RecorderError("failed");
      }
    },
    cancel() {
      void release();
    },
  };
}
