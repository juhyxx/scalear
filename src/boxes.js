// Scale positions ("boxes"). A position is a list of { s, f, midi } – string index (physical
// order), fret and sounding pitch – with every pitch appearing once.
import { mod } from './theory.js';
import { t } from './i18n.js';

const PENTATONIC = [0, 2, 4, 7, 9];

const PER_STRING = { nps2: 2, nps3: 3, nps4: 4 };
const CAGED_FAMILY = ['guitar', 'guitar7', 'guitar8', 'ukulele', 'baritone-uke'];

// "CAGED" is a guitar word; other instruments call the same system "5 positions".
export function methodLabel(id, neck) {
  if (id !== 'caged') return t('method.perString', { n: PER_STRING[id] });
  return CAGED_FAMILY.includes(neck.instrument.id) ? 'CAGED' : t('method.five');
}

export const methodHint = id => (id === 'caged' ? t('method.cagedHint') : t('method.perStringHint', { n: PER_STRING[id] }));

// Box systems that make sense for this scale on this neck. First entry is the default.
export function methodsFor(semis, neck) {
  const k = semis.length;
  const list = [];
  if (neck.fifths) {
    // A string spans a fifth, so four notes of a seven-note scale fit under one hand.
    if (k >= 6) list.push('nps4', 'nps3');
    else if (k === 5) list.push('nps3', 'nps2');
    return list;
  }
  if (k >= 6 && pentatonicSkeleton(semis)) list.push('caged');
  if (k >= 6) list.push('nps3');
  if (k <= 6) list.push('nps2');
  if (k === 5) list.push('nps3');
  if (k >= 8) list.push('nps4');
  return list;
}

// Boxes are computed on the full-length strings using their climbing "shape" pitches, so a
// re-entrant ukulele gets the same shapes as a low-G one; pitches are then mapped back to real ones.
export function positions(method, neck, rootPc, semis, maxFret) {
  const idx = neck.strings.map((_, i) => i).filter(i => !neck.strings[i].from);
  const shape = idx.map(i => neck.shape[i]);
  const boxes = method === 'caged'
    ? cagedPositions(shape, rootPc, semis, maxFret)
    : npsPositions(shape, rootPc, semis, PER_STRING[method], maxFret);
  return boxes.map(box => box.map(n => ({ s: idx[n.s], f: n.f, midi: neck.strings[idx[n.s]].open + n.f })));
}

// Shift a whole pattern by octaves so as many notes as possible land on the neck. Among equally
// complete placements, prefer the lowest one that does not start below `floor`, so consecutive
// positions climb the neck before wrapping back down.
function placeOnNeck(notes, maxFret, floor = 0) {
  let best = null;
  for (const shift of [-24, -12, 0, 12, 24]) {
    const moved = notes
      .map(n => ({ ...n, f: n.f + shift, midi: n.midi + shift }))
      .filter(n => n.f >= 0 && n.f <= maxFret);
    if (!moved.length) continue;
    const lo = Math.min(...moved.map(n => n.f));
    const rank = moved.length * 2 + (lo >= floor ? 1 : 0);
    if (!best || rank > best.rank) best = { rank, moved };
  }
  return best ? best.moved : [];
}

// One position per scale degree: start that degree on the lowest string and climb, n notes per string.
export function npsPositions(tuning, rootPc, semis, n, maxFret) {
  const k = semis.length;
  const steps = semis.map((s, i) => (i + 1 < k ? semis[i + 1] : 12) - s);
  let floor = 0;
  return semis.map((_, start) => {
    let midi = tuning[0] + mod(rootPc + semis[start] - tuning[0], 12);
    let deg = start;
    const notes = [];
    for (let s = 0; s < tuning.length; s++) {
      for (let j = 0; j < n; j++) {
        notes.push({ s, f: midi - tuning[s], midi });
        midi += steps[deg];
        deg = (deg + 1) % k;
      }
    }
    const placed = placeOnNeck(notes, maxFret, floor);
    if (placed.length) floor = Math.min(...placed.map(n => n.f));
    return placed;
  });
}

// A pentatonic subset containing the root, preferring one that keeps the scale's 3rd and 5th.
export function pentatonicSkeleton(semis) {
  const set = new Set(semis);
  const third = semis.find(x => x === 3 || x === 4);
  let best = null;
  let bestScore = -1;
  for (let t = 0; t < 12; t++) {
    const p = PENTATONIC.map(x => mod(t + x, 12));
    if (!p.includes(0) || !p.every(x => set.has(x))) continue;
    const score = (third !== undefined && p.includes(third) ? 2 : 0) + (p.includes(7) ? 1 : 0);
    if (score > bestScore) {
      bestScore = score;
      best = p.sort((a, b) => a - b);
    }
  }
  return best;
}

// The pentatonic boxes of the skeleton, with the remaining scale tones filled in around each box.
export function cagedPositions(tuning, rootPc, semis, maxFret) {
  const skeleton = pentatonicSkeleton(semis);
  if (!skeleton) return [];
  const pcs = new Set(semis.map(x => mod(rootPc + x, 12)));
  return npsPositions(tuning, rootPc, skeleton, 2, maxFret).map(box => fillBox(box, tuning, pcs, maxFret));
}

function fillBox(box, tuning, pcs, maxFret) {
  if (!box.length) return box;
  const frets = box.map(n => n.f);
  const lo = Math.min(...frets);
  const hi = Math.max(...frets);
  const center = (lo + hi) / 2;
  const minMidi = Math.min(...box.map(n => n.midi));
  const maxMidi = Math.max(...box.map(n => n.midi));
  const have = new Set(box.map(n => n.midi));
  const out = [...box];
  const top = tuning.length - 1;
  for (let m = tuning[0] + lo; m <= tuning[top] + hi; m++) {
    if (have.has(m) || !pcs.has(mod(m, 12))) continue;
    // Gaps inside the box may take a one-fret stretch; notes beyond its ends must fit the window.
    const slack = m > minMidi && m < maxMidi ? 1 : 0;
    let pick = null;
    tuning.forEach((open, s) => {
      const f = m - open;
      if (f < Math.max(0, lo - slack) || f > Math.min(maxFret, hi + slack)) return;
      const cost = (f < lo || f > hi ? 10 : 0) + Math.abs(f - center) + s * 0.01;
      if (!pick || cost < pick.cost) pick = { s, f, midi: m, cost };
    });
    if (pick) {
      out.push({ s: pick.s, f: pick.f, midi: pick.midi });
      have.add(m);
    }
  }
  return out.sort((a, b) => a.s - b.s || a.f - b.f);
}

export function fretSpan(box) {
  if (!box.length) return null;
  const frets = box.map(n => n.f);
  return { lo: Math.min(...frets), hi: Math.max(...frets) };
}
