// Chord voicing finder. A voicing is { frets: [neck fret | -1 per string], pos, score }.
// Rules: root as the lowest sounding pitch (except on re-entrant tunings, which have no real bass
// string), every required tone present, at most one muted string inside the sounding range, four
// frets of stretch and four fingers (a barre on the lowest fret counts as one).
// Strings are { open, from }: a short string's "open" is its starting fret.
import { mod } from './theory.js';
import { pitchAt } from './instruments.js';

const SPAN = 3;

function optionalPcs(item) {
  const optional = new Set(item.def.optional || []);
  if (item.tones.length >= 4) optional.add('5');
  return new Set(item.tones.filter(t => optional.has(t.iv.id)).map(t => t.pc));
}

function fingersNeeded(frets, strings) {
  const fretted = [];
  frets.forEach((f, s) => f > strings[s].from && fretted.push(s));
  if (fretted.length <= 4) return fretted.length;
  const minF = Math.min(...fretted.map(s => frets[s]));
  const barred = fretted.filter(s => frets[s] === minF);
  const first = barred[0];
  const last = barred[barred.length - 1];
  // Every string under the barre must be fretted; open or muted strings there are impossible.
  for (let s = first; s <= last; s++) if (frets[s] <= strings[s].from) return Infinity;
  return 1 + fretted.filter(s => frets[s] > minF).length;
}

export function findVoicings(neck, maxFret, item) {
  const { strings } = neck;
  const S = strings.length;
  const tonePcs = new Set(item.tones.map(t => t.pc));
  const optional = optionalPcs(item);
  const required = [...tonePcs].filter(pc => !optional.has(pc));
  const minStrings = tonePcs.size <= 2 ? 2 : Math.min(S >= 6 ? 4 : 3, S);
  const maxStrings = item.def.maxStrings || S;
  const found = new Map();

  const evaluate = frets => {
    const sounding = [];
    frets.forEach((f, s) => f >= 0 && sounding.push(s));
    if (sounding.length < minStrings || sounding.length > maxStrings) return;
    const pitches = sounding.map(s => pitchAt(strings[s], frets[s]));
    if (!neck.reentrant && mod(Math.min(...pitches), 12) !== item.rootPc) return;
    const gaps = sounding[sounding.length - 1] - sounding[0] + 1 - sounding.length;
    if (gaps > 1) return;
    const present = new Set(pitches.map(p => mod(p, 12)));
    if (!required.every(pc => present.has(pc))) return;
    const fingers = fingersNeeded(frets, strings);
    if (fingers > 4) return;
    const isOpen = s => frets[s] === strings[s].from;
    const fretted = sounding.filter(s => !isOpen(s)).map(s => frets[s]);
    const minF = fretted.length ? Math.min(...fretted) : 0;
    const maxF = fretted.length ? Math.max(...fretted) : 0;
    const span = maxF - minF;
    // Open-position chords get their own slot (0) so they don't compete with first-fret barres.
    const opens = sounding.some(isOpen);
    const pos = opens && maxF <= 4 ? 0 : minF;
    const mixed = minF > 0 && maxF > 3 && sounding.some(s => isOpen(s) && !strings[s].from);
    const score = sounding.length * 4 + present.size * 5 + (present.size === tonePcs.size ? 4 : 0)
      - gaps * 5 - fingers - span * 1.5 - (mixed ? 8 : 0);
    const key = frets.join(',');
    if (!found.has(key)) found.set(key, { frets, pos, score });
  };

  for (let base = 0; base <= maxFret; base++) {
    const lo = Math.max(1, base);
    const hi = Math.min(maxFret, base === 0 ? SPAN : base + SPAN);
    const allowOpen = base <= 2;
    const options = strings.map(str => {
      const opts = [-1];
      // A short drone string rings open in any position.
      if ((allowOpen || str.from) && tonePcs.has(mod(str.open, 12))) opts.push(str.from);
      for (let f = Math.max(lo, str.from + 1); f <= hi; f++) if (tonePcs.has(mod(pitchAt(str, f), 12))) opts.push(f);
      return opts;
    });
    const frets = new Array(S);
    const walk = s => {
      if (s === S) return evaluate(frets.slice());
      for (const f of options[s]) {
        frets[s] = f;
        walk(s + 1);
      }
    };
    walk(0);
  }

  // Best voicing per neck position, minus any that is just a subset of a better one.
  const byPos = new Map();
  for (const v of found.values()) {
    const cur = byPos.get(v.pos);
    if (!cur || v.score > cur.score) byPos.set(v.pos, v);
  }
  let list = [...byPos.values()];
  list = list.filter(v => !list.some(o => o !== v && o.score >= v.score && contains(o.frets, v.frets)));
  return list.sort((a, b) => a.pos - b.pos).slice(0, 14);
}

function contains(big, small) {
  return small.every((f, s) => f < 0 || big[s] === f);
}
