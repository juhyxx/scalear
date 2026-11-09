// Note playback with a sampled archtop jazz guitar: 17 notes a minor third apart (audio/guitar,
// made by tools/guitar-samples.sh), each note played from the nearest sample, repitched. Until the
// samples have loaded, or if they can't be, a Karplus–Strong plucked string stands in.
import { midiFreq } from './theory.js';

const SAMPLED = [37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72, 75, 78, 81, 84];
const WAIT = 1500; // ms the first note may wait for the samples before the synth plays it

let ctx = null;
let out = null;
let samples = null; // Map midi → AudioBuffer, once decoded
let loading = null;
const synthBuffers = new Map();
let active = [];
let timers = [];
let generation = 0; // bumped by stop(), so playback still waiting for the samples is dropped

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
    loadSamples();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function loadSamples() {
  loading = Promise.all(SAMPLED.map(async midi => {
    const res = await fetch(new URL(`../audio/guitar/${midi}.mp3`, import.meta.url));
    if (!res.ok) throw new Error(`${res.status} ${res.url}`);
    return [midi, await ctx.decodeAudioData(await res.arrayBuffer())];
  })).then(
    list => { samples = new Map(list); },
    err => console.warn('Guitar samples unavailable; using the synth.', err),
  );
}

// Resolves once the samples are in, or after WAIT, whichever comes first.
const ready = () => (samples ? Promise.resolve() : Promise.race([loading, new Promise(r => setTimeout(r, WAIT))]));

// The nearest sample and the playback rate that turns it into `midi`.
function sampled(midi) {
  if (!samples) return null;
  const from = SAMPLED.reduce((best, m) => (Math.abs(m - midi) < Math.abs(best - midi) ? m : best));
  return { buf: samples.get(from), rate: 2 ** ((midi - from) / 12) };
}

// The stand-in: a plucked string rendered once per pitch.
function pluck(midi) {
  if (synthBuffers.has(midi)) return synthBuffers.get(midi);
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
  synthBuffers.set(midi, entry);
  return entry;
}

// One note at `when`. `length` (seconds) damps it early, as a player would in a run of notes;
// without it the note rings out.
function voice(midi, when, gain = 1, length = 0) {
  const { buf, rate } = sampled(midi) || pluck(midi);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.playbackRate.value = rate;
  const g = ctx.createGain();
  const rings = buf.duration / rate;
  const release = length ? Math.min(length, rings * 0.8) : rings * 0.8;
  g.gain.setValueAtTime(gain, when);
  g.gain.setTargetAtTime(0, when + release, length ? 0.06 : 0.08);
  src.connect(g).connect(out);
  src.start(when);
  src.stop(when + release + 0.6);
  active.push(src);
  src.onended = () => (active = active.filter(s => s !== src));
}

export function stop() {
  generation++;
  for (const s of active) {
    try { s.stop(); } catch { /* already stopped */ }
  }
  active = [];
  timers.forEach(clearTimeout);
  timers = [];
}

export async function playNote(midi) {
  if (!context()) return;
  const gen = generation;
  await ready();
  if (gen === generation) voice(midi, ctx.currentTime + 0.01);
}

/**
 * Play steps one after another. Each step is an array of MIDI numbers (several = strummed chord).
 * onStep(index) fires as each step sounds, and onStep(-1) when playback ends.
 */
export async function playSequence(steps, bpm, onStep) {
  if (!context()) return;
  stop();
  const gen = generation;
  await ready();
  if (gen !== generation) return;
  const beat = 60 / bpm;
  const t0 = ctx.currentTime + 0.05;
  steps.forEach((midis, i) => {
    const when = t0 + i * beat;
    const sorted = [...midis].sort((a, b) => a - b);
    // Single notes overlap a little, legato; a chord, and the last note, ring out.
    const length = sorted.length === 1 && i < steps.length - 1 ? Math.max(beat * 1.5, 0.35) : 0;
    sorted.forEach((m, j) => voice(m, when + j * 0.028, sorted.length > 1 ? 0.75 : 1, length));
    timers.push(setTimeout(() => onStep(i), (when - ctx.currentTime) * 1000));
  });
  const end = t0 + steps.length * beat + (steps.at(-1)?.length > 1 ? 0.8 : 0);
  timers.push(setTimeout(() => onStep(-1), (end - ctx.currentTime) * 1000));
}
