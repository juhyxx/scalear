// Plucked-string playback (Karplus–Strong), rendered once per pitch and cached as an AudioBuffer.
import { midiFreq } from './theory.js';

let ctx = null;
let out = null;
const buffers = new Map();
let active = [];
let timers = [];

function context() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 4;
    out = ctx.createGain();
    out.gain.value = 0.7;
    out.connect(comp).connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function pluck(midi) {
  if (buffers.has(midi)) return buffers.get(midi);
  const sr = ctx.sampleRate;
  const freq = midiFreq(midi);
  // The two-point average adds half a sample of delay; playbackRate corrects the rounding.
  const N = Math.max(2, Math.round(sr / freq - 0.5));
  const rate = freq / (sr / (N + 0.5));
  const len = Math.floor(sr * 2.4);
  const buf = ctx.createBuffer(1, len, sr);
  const data = buf.getChannelData(0);
  const ring = new Float32Array(N);
  let lp = 0;
  for (let i = 0; i < N; i++) {
    lp = lp * 0.4 + (Math.random() * 2 - 1) * 0.6;
    ring[i] = lp;
  }
  const decay = Math.pow(0.02, 1 / (freq * 2.4));
  let idx = 0;
  for (let i = 0; i < len; i++) {
    const next = (idx + 1) % N;
    const v = ring[idx];
    ring[idx] = decay * 0.5 * (v + ring[next]);
    data[i] = v * 0.5;
    idx = next;
  }
  const entry = { buf, rate };
  buffers.set(midi, entry);
  return entry;
}

function voice(midi, when, gain = 1) {
  const { buf, rate } = pluck(midi);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.playbackRate.value = rate;
  const g = ctx.createGain();
  g.gain.setValueAtTime(gain, when);
  g.gain.setTargetAtTime(0, when + buf.duration * 0.8, 0.08);
  src.connect(g).connect(out);
  src.start(when);
  active.push(src);
  src.onended = () => (active = active.filter(s => s !== src));
}

export function stop() {
  for (const s of active) {
    try { s.stop(); } catch { /* already stopped */ }
  }
  active = [];
  timers.forEach(clearTimeout);
  timers = [];
}

export function playNote(midi) {
  if (!context()) return;
  voice(midi, ctx.currentTime + 0.01);
}

/**
 * Play steps one after another. Each step is an array of MIDI numbers (several = strummed chord).
 * onStep(index) fires as each step sounds, and onStep(-1) when playback ends.
 */
export function playSequence(steps, bpm, onStep) {
  if (!context()) return;
  stop();
  const beat = 60 / bpm;
  const t0 = ctx.currentTime + 0.05;
  steps.forEach((midis, i) => {
    const when = t0 + i * beat;
    const sorted = [...midis].sort((a, b) => a - b);
    sorted.forEach((m, j) => voice(m, when + j * 0.028, sorted.length > 1 ? 0.75 : 1));
    timers.push(setTimeout(() => onStep(i), (when - ctx.currentTime) * 1000));
  });
  const end = t0 + steps.length * beat + (steps.at(-1)?.length > 1 ? 0.8 : 0);
  timers.push(setTimeout(() => onStep(-1), (end - ctx.currentTime) * 1000));
}
