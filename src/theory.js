// Music theory primitives.
// A spelled note is { letter: 0–6 (C…B), acc: −2…+2 }. MIDI numbers carry the octave.
// An interval id is a formula token such as "1", "b3", "#11", "bb7".

export const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const LETTER_PC = [0, 2, 4, 5, 7, 9, 11];
const MAJOR = [0, 2, 4, 5, 7, 9, 11];

export const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

export const mod = (n, m) => ((n % m) + m) % m;

export const notePc = note => mod(LETTER_PC[note.letter] + note.acc, 12);

export const accText = acc => (acc > 0 ? '♯'.repeat(acc) : '♭'.repeat(-acc));

// Note names: letters with B (English), letters with H (German, Czech: H is B natural, B is B♭),
// or fixed-do solfège. The app sets the style; spelling logic never depends on it.
let naming = 'B';
let solfege = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si'];

export function setNaming(style, syllables) {
  naming = style;
  if (syllables?.length === 7) solfege = syllables;
}

export function noteName(note) {
  if (naming === 'S') return solfege[note.letter] + accText(note.acc);
  if (naming === 'H' && note.letter === 6) return note.acc < 0 ? 'B' + accText(note.acc + 1) : 'H' + accText(note.acc);
  return LETTERS[note.letter] + accText(note.acc);
}

// Always English letters with ASCII accidentals, for URLs.
export const asciiName = note => LETTERS[note.letter] + (note.acc > 0 ? '#'.repeat(note.acc) : 'b'.repeat(-note.acc));

// "F#3", "Eb2", "C4" → { note, midi }
export function parseNote(str) {
  const m = /^([A-G])(#{1,2}|b{1,2})?(-?\d)$/.exec(str);
  if (!m) throw new Error(`Bad note: ${str}`);
  const letter = LETTERS.indexOf(m[1]);
  const acc = m[2] ? (m[2][0] === '#' ? 1 : -1) * m[2].length : 0;
  return { note: { letter, acc }, midi: (Number(m[3]) + 1) * 12 + LETTER_PC[letter] + acc };
}

export function parseInterval(id) {
  const m = /^([b#]*)(\d+)$/.exec(id);
  if (!m) throw new Error(`Bad interval: ${id}`);
  let acc = 0;
  for (const c of m[1]) acc += c === '#' ? 1 : -1;
  const num = Number(m[2]);
  const semis = MAJOR[(num - 1) % 7] + 12 * Math.floor((num - 1) / 7) + acc;
  return { id, num, acc, semis, label: accText(acc) + num, degree: ((num - 1) % 7) + 1 };
}

export function transpose(root, iv) {
  const letter = (root.letter + iv.num - 1) % 7;
  const pc = mod(notePc(root) + iv.semis, 12);
  return { letter, acc: mod(pc - LETTER_PC[letter] + 6, 12) - 6 };
}

const SHARPS = [[0, 0], [0, 1], [1, 0], [1, 1], [2, 0], [3, 0], [3, 1], [4, 0], [4, 1], [5, 0], [5, 1], [6, 0]];
const FLATS = [[0, 0], [1, -1], [1, 0], [2, -1], [2, 0], [3, 0], [4, -1], [4, 0], [5, -1], [5, 0], [6, -1], [6, 0]];

export const sharpNote = pc => ({ letter: SHARPS[pc][0], acc: SHARPS[pc][1] });
export const flatNote = pc => ({ letter: FLATS[pc][0], acc: FLATS[pc][1] });

// Accidentals needed to spell the whole item from this root; double accidentals count extra.
function spellingCost(root, intervals) {
  return intervals.reduce((sum, iv) => {
    const a = Math.abs(transpose(root, iv).acc);
    return sum + a + (a > 1 ? 4 : 0);
  }, 0);
}

// pref: 'auto' picks whichever enharmonic root spells the item with fewer accidentals.
export function spellRoot(pc, pref, intervals) {
  const sharp = sharpNote(pc);
  const flat = flatNote(pc);
  if (sharp.acc === 0) return sharp;
  if (pref === 'sharp') return sharp;
  if (pref === 'flat') return flat;
  return spellingCost(flat, intervals) < spellingCost(sharp, intervals) ? flat : sharp;
}

// Attach an octave to a spelled note sounding at `midi` (B♯3 and C4 share MIDI 60).
export function spellMidi(midi, note) {
  return { ...note, midi, octave: Math.floor((midi - note.acc) / 12) - 1 };
}

// Diatonic position used for staff placement: C4 = 28, each letter step = 1.
export const staffStep = n => n.octave * 7 + n.letter;

export const midiFreq = midi => 440 * 2 ** ((midi - 69) / 12);

export function buildItem(def, rootPc, pref) {
  const intervals = def.formula.split(' ').map(parseInterval);
  const root = spellRoot(rootPc, pref, intervals);
  const tones = intervals.map((iv, index) => {
    const note = transpose(root, iv);
    return { index, iv, note, pc: notePc(note), name: noteName(note) };
  });
  const byPc = new Map();
  for (const t of tones) if (!byPc.has(t.pc)) byPc.set(t.pc, t);
  return { def, root, rootPc, tones, byPc, name: noteName(root) };
}

// Sorted pitch classes relative to the root, octave-folded and de-duplicated.
export const relativeSet = item => [...new Set(item.tones.map(t => mod(t.iv.semis, 12)))].sort((a, b) => a - b);

export function stepPattern(item) {
  const set = relativeSet(item);
  return set.map((s, i) => (i + 1 < set.length ? set[i + 1] : 12) - s);
}

export const sameSet = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
