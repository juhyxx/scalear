// Chord builder, as in a notation program's chord dialog: a type, an extension, altered tensions
// and a bass note. It gives a chord definition shaped like the catalogue's, so the
// chord is spelled, named and voiced like any other. A chord the catalogue has keeps its name there.
import { CHORDS } from './catalog.js';
import { parseInterval } from './theory.js';

// Chord types: the triads, whose 6th or 7th comes from the Extension row and whose altered 5th from
// the Alterations (min + 7 + ♭5 is m7♭5), and the power chord. `#` in a symbol stands for the 7th,
// which an extension raises to a 9, 11 or 13. A type whose symbol says what its 5th is (aug, dim,
// …) has a `base`: its symbol once the 5th is altered, to which the altered 5th is added (dim with
// a ♯5 is m(♯5)).
export const TYPES = [
  { id: 'maj', formula: '1 3 5', symbol: '' },
  { id: 'min', formula: '1 b3 5', symbol: 'm' },
  { id: 'aug', formula: '1 3 #5', symbol: '+', base: '' },
  { id: 'dim', formula: '1 b3 b5', symbol: '°', base: 'm' },
  { id: 'sus2', formula: '1 2 5', symbol: 'sus2' },
  { id: 'sus4', formula: '1 4 5', symbol: 'sus4' },
  { id: '5', formula: '1 5', symbol: '5', base: '5' },
];

// 6 and 6/9 add a 6th (and a 9th) to a triad, 7 and maj7 a ♭7 or a major 7th; 9, 11 and 13 (maj9,
// maj11, maj13) extend a 7th chord, giving a triad its 7th first (a 13 leaves out the 11, as the
// catalogue's do).
export const EXTENSIONS = ['6', '69', '7', '9', '11', '13', 'maj7', 'maj9', 'maj11', 'maj13']; // or none ('')
// Additions put one more tone on whatever the type and extension make (C7 + add13 = C7(add13));
// any of them, or none.
export const ADDITIONS = [9, 11, 13];
export const extLabel = ext => (ext === '69' ? '6/9' : ext);
const STACK = { 6: [], 69: ['9'], 7: [], 9: ['9'], 11: ['9', '11'], 13: ['9', '13'] };
for (const n of [7, 9, 11, 13]) STACK[`maj${n}`] = STACK[n];
const SIXTHS = ['6', '69'];
const SEVENTHS = ['7', '9', '11', '13'];
const MAJ_SEVENTHS = SEVENTHS.map(x => `maj${x}`);
// the number a stacked extension goes up to: 7, 9, 11 or 13 (NaN for the others)
const stackTop = ext => Number(String(ext).replace('maj', ''));

// What a triad becomes with a 6th or a 7th from the Extension row: C + 6 = C6, Csus4 + 6 = C6sus4,
// C + 7 = C7, Cm + 9 = Cm9, C+ + 7 = C7♯5, C° + 7 = C°7, C + maj7 = Cmaj7, Cm + maj9 = Cm(maj9),
// C+ + maj7 = Cmaj7♯5, C° + maj7 = C°(maj7). Other types don't take them.
const GROWN = {
  6: {
    maj: { id: '6', formula: '1 3 5 6', symbol: '6' },
    min: { id: 'm6', formula: '1 b3 5 6', symbol: 'm6' },
    sus2: { id: '6sus2', formula: '1 2 5 6', symbol: '6sus2' },
    sus4: { id: '6sus4', formula: '1 4 5 6', symbol: '6sus4' },
  },
  7: {
    maj: { id: '7', formula: '1 3 5 b7', symbol: '#' },
    min: { id: 'm7', formula: '1 b3 5 b7', symbol: 'm#' },
    aug: { id: 'aug7', formula: '1 3 #5 b7', symbol: '#♯5', base: '#' },
    dim: { id: 'dim7', formula: '1 b3 b5 bb7', symbol: '°#', base: '°#' },
    sus2: { id: '7sus2', formula: '1 2 5 b7', symbol: '#sus2' },
    sus4: { id: '7sus4', formula: '1 4 5 b7', symbol: '#sus4' },
  },
  maj7: {
    maj: { id: 'maj7', formula: '1 3 5 7', symbol: 'maj#' },
    min: { id: 'mmaj7', formula: '1 b3 5 7', symbol: 'm(maj#)' },
    aug: { id: 'maj7s5', formula: '1 3 #5 7', symbol: 'maj#♯5', base: 'maj#' },
    dim: { id: 'dimmaj7', formula: '1 b3 b5 7', symbol: '°(maj#)', base: 'm(maj#)' },
    sus2: { id: 'maj7sus2', formula: '1 2 5 7', symbol: 'maj#sus2' },
    sus4: { id: 'maj7sus4', formula: '1 4 5 7', symbol: 'maj#sus4' },
  },
};

// Builder settings saved earlier: an add9, add11 or add13 that was an extension becomes an
// addition; a sixth or seventh chord that was a type becomes the triad with that extension (a 9, 11
// or 13 already gives the 7th) and any altered 5th.
const MOVED = {
  6: ['maj', '6'], m6: ['min', '6'],
  7: ['maj', '7'], m7: ['min', '7'], dim7: ['dim', '7'], '7sus2': ['sus2', '7'], '7sus4': ['sus4', '7'], m7b5: ['min', '7', -1],
  maj7: ['maj', 'maj'], mmaj7: ['min', 'maj'], maj7s5: ['maj', 'maj', 1], maj7sus2: ['sus2', 'maj'], maj7sus4: ['sus4', 'maj'],
};
export function migrateBuild(saved) {
  let b = { ...saved, add: saved.add || [] };
  if (/^add\d+$/.test(b.ext)) b = { ...b, ext: '', add: [...b.add, Number(b.ext.slice(3))] };
  const moved = MOVED[b.type];
  if (!moved) return tidy(b);
  const [type, kind, fifth] = moved;
  const stacked = ['9', '11', '13'].includes(b.ext);
  const ext = kind === '6' ? '6' : kind === '7' ? (stacked ? b.ext : '7') : stacked ? `maj${b.ext}` : 'maj7';
  return tidy({ ...b, type, ext, alt: fifth ? { ...b.alt, 5: [fifth] } : b.alt });
}

// Tensions that can be lowered or raised: each replaces the natural tone, or is added.
export const ALTERABLE = [5, 9, 11, 13];

export const DEFAULT_BUILD = { open: true, type: 'maj', ext: '', add: [], alt: {}, bass: 0, voicing: 0 };

export const typeOf = id => TYPES.find(x => x.id === id) || TYPES[0];
export const hasSeventh = type => type.symbol.includes('#');

// The type a triad grows into with a 6th or 7th extension, or null.
function grown(type, ext) {
  if (SIXTHS.includes(ext)) return GROWN[6][type.id] || null;
  if (hasSeventh(type)) return null;
  if (SEVENTHS.includes(ext)) return GROWN[7][type.id] || null;
  if (MAJ_SEVENTHS.includes(ext)) return GROWN.maj7[type.id] || null;
  return null;
}
// The type as built: the chosen one, or what the extension makes of it.
const typeFor = b => grown(typeOf(b.type), b.ext) || typeOf(b.type);

// Whether an extension can go with a type: a 9, 11 or 13 on a chord that has its 7th; else when it
// makes something of a triad.
export function extAllowed(type, ext) {
  if (!ext) return true;
  if (['9', '11', '13'].includes(ext) && hasSeventh(type)) return true;
  return Boolean(grown(type, ext));
}

const num = id => parseInterval(id).num;
const bySemis = (a, b) => parseInterval(a).semis - parseInterval(b).semis;
const sameTones = (a, b) => a.length === b.length && a.every(id => b.includes(id));

// The type's and the extension's interval ids.
function stackedFormula(b) {
  const ids = typeFor(b).formula.split(' ');
  if (extAllowed(typeOf(b.type), b.ext)) ids.push(...(STACK[b.ext] || []));
  return ids;
}

// An addition puts in a tone the type and extension don't already have (no add9 on a 9 or 13).
export const addAllowed = (b, n) => !stackedFormula(b).some(id => num(id) === n);
const added = b => ADDITIONS.filter(n => b.add?.includes(n) && addAllowed(b, n));

// The interval ids with the additions, before any alteration.
const naturalFormula = b => [...stackedFormula(b), ...added(b).map(String)];

// An alteration changes a tone the chord has: every chord has a 5th, but a ♭9 or ♯9 needs a 9th
// (from 9, 11, 13, 6/9 or add9), a ♯11 an 11th and a ♭13 a 13th.
export const altAllowed = (b, d) => d === 5 || naturalFormula(b).some(id => num(id) === d);
// A tone can be lowered, raised or both (7alt has a ♭5 and a ♯5, a ♭9 and a ♯9): −1 and/or 1, low
// first. (A single number is how they were saved before both could be on.)
export const altDirs = (b, d) => {
  const v = b.alt?.[d];
  return (Array.isArray(v) ? v : v ? [v] : []).filter(x => x === -1 || x === 1).sort();
};
const altered = (b, d) => altDirs(b, d).length > 0 && altAllowed(b, d);

// The builder without what no longer fits: an extension the type can't take, an addition of a
// tone the chord already has, an alteration of a tone it doesn't have.
export function tidy({ omit, ...b }) { // (tones left out were an option once)
  let next = { ...b, ext: extAllowed(typeOf(b.type), b.ext) ? b.ext : '' };
  next = { ...next, add: added(next) };
  const alt = ALTERABLE.map(d => [d, altDirs(b, d)]).filter(([d, dirs]) => dirs.length && altAllowed(next, d));
  return { ...next, alt: Object.fromEntries(alt) };
}

// Interval ids of the chord, low to high. A dominant 11th leaves out its 3rd, which clashes with
// the 11th, as the catalogue's does (C11 is 1 5 ♭7 9 11); with a ♯11 the 3rd stays (C9♯11).
export function fullFormula(b) {
  let ids = naturalFormula(b);
  for (const d of ALTERABLE) {
    if (!altered(b, d)) continue;
    ids = ids.filter(id => num(id) !== d);
    ids.push(...altDirs(b, d).map(dir => (dir < 0 ? 'b' : '#') + d));
  }
  if (b.ext === '11' && ['3', 'b7', '11'].every(id => ids.includes(id))) ids = ids.filter(id => id !== '3');
  return [...new Set(ids)].sort(bySemis);
}

// The symbol in the catalogue's notation: "m9", "maj7♯11", "sus4(♭9)", "6/9", "7(add13)". It is
// numbered by the highest stacked tone left natural: a 9 with a ♭9 is a 7♭9, an 11 with a ♯11 a
// 9♯11; an altered 6/9 or addition drops its tone from the name: C6(♯9), C(♭9).
function symbolOf(b) {
  const type = typeFor(b);
  let top = STACK[b.ext] && hasSeventh(type) ? stackTop(b.ext) || 7 : 7;
  while (top > 7 && altered(b, top)) top = top === 9 ? 7 : 9; // 13 stacks on 9, not 11
  let adds = added(b).filter(n => !altered(b, n));
  let s = (altered(b, 5) && type.base !== undefined ? type.base : type.symbol).replace('#', top);
  // a sixth chord's 9th, from 6/9 or add9, makes it a 6/9 (6/9, m6/9, 6/9sus4)
  if (/^m?6/.test(s) && ((b.ext === '69' && !altered(b, 9)) || adds.includes(9))) {
    s = s.replace('6', '6/9');
    adds = adds.filter(n => n !== 9);
  }
  const alts = ALTERABLE.filter(d => altered(b, d)).flatMap(d => altDirs(b, d).map(dir => (dir < 0 ? '♭' : '♯') + d)).join('');
  // after a 7th, 9th, 11th or 13th directly (7♭9, maj7♯11), else in brackets (sus4(♭9), (♭5))
  if (alts) s += hasSeventh(type) ? alts : `(${alts})`;
  // then the additions: add9 on its own, else in brackets (m(add9), 7(add13), (add9,11))
  const add = adds.map(n => `add${n}`).join(',');
  if (add) s = s || adds.length > 1 ? `${s}(${add})` : add;
  return s;
}

/**
 * The chord as a definition: { kind, id, symbol, formula, optional, known }. `known` is the
 * catalogue chord with the same tones, if there is one.
 */
// Rewrites that keep the notes but say them more plainly: an addition that completes the stack
// joins the extension (7 + add9 is a 9, 9 + add13 a 13, 6 + add9 a 6/9), and an altered 5th that
// makes another type becomes that type (C + ♯5 is C+, Cm + ♭5 is C°; C+ + ♭5 is C(♭5)).
// (An 11 with an add13 is said as a 13 with an add11: 13♯11 rather than 9♯11(add13).)
const FOLD = {
  7: { 9: '9' }, maj7: { 9: 'maj9' }, 9: { 11: '11', 13: '13' }, maj9: { 11: 'maj11', 13: 'maj13' },
  11: { 13: '13' }, maj11: { 13: 'maj13' }, 6: { 9: '69' },
};
const FIFTH_TYPE = { maj: [1, 'aug'], min: [-1, 'dim'], aug: [1, 'maj'], dim: [-1, 'min'] };
// Each gives the settings it would try instead (any number of them).
const REWRITES = [
  b => ADDITIONS.filter(n => FOLD[b.ext]?.[n] && b.add.includes(n)).map(n => {
    const ext = FOLD[b.ext][n];
    const moved = stackTop(b.ext) === 11 ? [11] : []; // 11 + add13 → 13 + add11
    return { ...b, ext, add: [...b.add.filter(x => x !== n), ...moved] };
  }),
  b => {
    const [dir, other] = FIFTH_TYPE[b.type] || [];
    const dirs = altDirs(b, 5);
    if (!other || !dirs.length) return [];
    // maj + ♯5 → aug, min + ♭5 → dim
    if (b.type === 'maj' || b.type === 'min') return dirs.length === 1 && dirs[0] === dir ? [{ ...b, type: other, alt: { ...b.alt, 5: [] } }] : [];
    // C+ + ♯5 is just C+; C+ + ♭5 is C(♭5)
    if (dirs.length === 1 && dirs[0] === dir) return [{ ...b, alt: { ...b.alt, 5: [] } }];
    return [{ ...b, type: other, alt: { ...b.alt, 5: dirs } }];
  },
];

// The plainest builder settings for the same notes, so a chord's name doesn't depend on the way it
// was put together.
function canonical(b) {
  const notes = fullFormula(b).join(' ');
  let cur = tidy(b);
  for (let changed = true, guard = 0; changed && guard < 10; guard++) {
    changed = false;
    for (const rewrite of REWRITES) {
      const next = rewrite(cur).map(tidy).find(x => fullFormula(x).join(' ') === notes);
      if (next) {
        cur = next;
        changed = true;
      }
    }
  }
  return cur;
}

export function buildDef(b) {
  const ids = fullFormula(b);
  const known = CHORDS.find(d => sameTones(d.formula.split(' '), ids)) || null;
  // voicings may drop the 5th, and the 9th under an 11th or 13th, as in the catalogue
  const optional = known?.optional || (stackTop(b.ext) > 9 && !altered(b, 9) ? ['9'] : []);
  return {
    kind: 'chord',
    id: known ? known.id : 'built',
    name: known ? known.name : '',
    symbol: known ? known.symbol : symbolOf(canonical(b)),
    formula: ids.join(' '),
    optional,
    maxStrings: known?.maxStrings,
    known,
  };
}
