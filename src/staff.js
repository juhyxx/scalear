// SVG staff notation. Staff lines are 10 units apart; a diatonic step is 5 units.
// Callers pass written pitches (guitar and bass are written an octave above sounding pitch).
import { staffStep } from './theory.js';

const GAP = 10;
const HALF = GAP / 2;

const CLEFS = {
  treble: { top: 38, bottom: 30 }, // F5 … E4
  alto: { top: 32, bottom: 24 }, // G4 … F3, middle C on the middle line
  bass: { top: 26, bottom: 18 }, // A3 … G2
};

// Variable-width stroke through [x, y, width] control points (Catmull-Rom), as a filled outline.
function brush(points, samples = 10) {
  const P = [points[0], ...points, points[points.length - 1]];
  const line = [];
  for (let i = 1; i < P.length - 2; i++) {
    for (let k = 0; k < samples; k++) {
      const t = k / samples;
      const t2 = t * t;
      const t3 = t2 * t;
      line.push([0, 1, 2].map(j =>
        0.5 * (2 * P[i][j] + (-P[i - 1][j] + P[i + 1][j]) * t +
          (2 * P[i - 1][j] - 5 * P[i][j] + 4 * P[i + 1][j] - P[i + 2][j]) * t2 +
          (-P[i - 1][j] + 3 * P[i][j] - 3 * P[i + 1][j] + P[i + 2][j]) * t3)));
    }
  }
  line.push(points[points.length - 1]);
  const left = [];
  const right = [];
  line.forEach((p, i) => {
    const a = line[Math.max(0, i - 1)];
    const b = line[Math.min(line.length - 1, i + 1)];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const nx = -(b[1] - a[1]) / len;
    const ny = (b[0] - a[0]) / len;
    const hw = p[2] / 2;
    left.push(`${(p[0] + nx * hw).toFixed(2)},${(p[1] + ny * hw).toFixed(2)}`);
    right.push(`${(p[0] - nx * hw).toFixed(2)},${(p[1] - ny * hw).toFixed(2)}`);
  });
  return `M${left.join('L')}L${right.reverse().join('L')}Z`;
}

const dot = (x, y, r) => `M${x - r},${y}a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0Z`;

// Clef outlines in staff units with the top staff line at y = 0.
const TREBLE_PATH = brush([
  [9, 51.5, 3.2], [11.5, 55.2, 2], [15.6, 55.4, 2], [17.6, 51, 2.2],
  [17, 40, 2.4], [15.6, 20, 2.4], [14.6, 5, 2.3], [14.6, -4, 2.1],
  [16.2, -11, 1.9], [19, -14.5, 1.6], [21.2, -10.5, 2.2], [19.8, -3.2, 3.4],
  [15, 4, 4.2], [8.2, 12, 4.6], [3.6, 20, 4.8], [2.2, 29, 4.6], [4.2, 38, 3.6],
  [10, 44.2, 2.6], [18, 45, 2], [24.4, 40, 2.3], [26.4, 31.5, 3.4], [23.4, 23.4, 2.6],
  [17, 21, 1.8], [10.8, 24.4, 2.4], [9, 30, 3], [11.4, 35.2, 2.6], [16.2, 35.6, 1.6],
]) + dot(9.2, 51.8, 3.4);

const BASS_PATH = brush([
  [4.6, 8.2, 2.4], [8, 2, 2.2], [14, -0.2, 2.6], [20, 3.6, 3.6], [21.6, 11, 4.4],
  [19, 20, 4.2], [12, 28, 3], [3, 34, 1.2],
]) + dot(5.2, 10.6, 3.6) + dot(27.5, 5, 1.9) + dot(27.5, 15, 1.9);

// C clef: a thick and a thin bar, and two curls meeting at the middle line.
const ALTO_PATH = `M0,-1h4.6v42h-4.6Z M6.8,-1h1.6v42h-1.6Z` +
  brush([[9, 20, 1.2], [11.5, 15, 2.2], [13.5, 9.5, 2], [16, 9, 2.4], [19.6, 6.5, 3.8], [20, 1.6, 3.4], [16, -0.6, 2.4], [12.6, 1.2, 1.8]]) +
  brush([[9, 20, 1.2], [11.5, 25, 2.2], [13.5, 30.5, 2], [16, 31, 2.4], [19.6, 33.5, 3.8], [20, 38.4, 3.4], [16, 40.6, 2.4], [12.6, 38.8, 1.8]]) +
  dot(12.6, 2.2, 2.6) + dot(12.6, 37.8, 2.6);

// Accidental glyphs centred on the note's line or space.
const ACCIDENTALS = {
  1: `<path class="acc-stroke" d="M-1.8,-9.5V10.5M1.8,-10.5V9.5"/><path d="M-4,-1.6L4,-4.4V-2L-4,0.8ZM-4,4.4L4,1.6V4L-4,6.8Z"/>`,
  [-1]: `<path class="acc-stroke" d="M-2.6,-15V4.4"/><path class="acc-stroke thick" d="M-2.6,4.2C1.5,1.8 5,-1 3.6,-3.6C2.4,-5.6 -0.6,-4.6 -2.6,-2.2"/>`,
  0: `<path class="acc-stroke" d="M-2.6,-12V5.5M2.6,-5.5V12"/><path d="M-2.6,-2.2L2.6,-4V-1.6L-2.6,0.2ZM-2.6,4L2.6,2.2V4.6L-2.6,6.4Z"/>`,
  2: `<path class="acc-stroke thick" d="M-3.6,-3.6L3.6,3.6M-3.6,3.6L3.6,-3.6"/><path d="M-4.6,-4.6h2.6v2.6h-2.6ZM2,-4.6h2.6v2.6h-2.6ZM-4.6,2h2.6v2.6h-2.6ZM2,2h2.6v2.6h-2.6Z"/>`,
  [-2]: `<g transform="translate(-3.4,0)"><path class="acc-stroke" d="M-2.6,-15V4.4"/><path class="acc-stroke thick" d="M-2.6,4.2C1.5,1.8 5,-1 3.6,-3.6C2.4,-5.6 -0.6,-4.6 -2.6,-2.2"/></g><g transform="translate(3.4,0)"><path class="acc-stroke" d="M-2.6,-15V4.4"/><path class="acc-stroke thick" d="M-2.6,4.2C1.5,1.8 5,-1 3.6,-3.6C2.4,-5.6 -0.6,-4.6 -2.6,-2.2"/></g>`,
};
const ACC_WIDTH = { 1: 9, [-1]: 8, 0: 7, 2: 10, [-2]: 14 };

// Whole note: outer ellipse with a tilted inner hole (even-odd fill).
function noteHead(x, y) {
  const rx = 6.4;
  const ry = 4.5;
  const a = (-38 * Math.PI) / 180;
  const ix = 2.4;
  const iy = 3.7;
  const dx = ix * Math.cos(a);
  const dy = ix * Math.sin(a);
  return `<path class="nh" fill-rule="evenodd" d="M${x - rx},${y}a${rx},${ry} 0 1,0 ${2 * rx},0a${rx},${ry} 0 1,0 ${-2 * rx},0Z` +
    `M${(x - dx).toFixed(2)},${(y - dy).toFixed(2)}A${ix},${iy} -38 1,0 ${(x + dx).toFixed(2)},${(y + dy).toFixed(2)}` +
    `A${ix},${iy} -38 1,0 ${(x - dx).toFixed(2)},${(y - dy).toFixed(2)}Z"/>`;
}

/**
 * @param {object} o
 * @param {'treble'|'alto'|'bass'} o.clef
 * @param {boolean} [o.octave]  draw the "8" of an octave-transposing clef
 * @param {Array<{notes: Array<{letter:number,acc:number,octave:number,midi:number,sound:number,cls?:string,name?:string,label?:string}>}>} o.columns
 *   Each column is one beat: a single note (melodic) or several (a chord). `midi` is written, `sound` sounding.
 * @param {number[]} [o.bars]  column indexes before which a barline is drawn
 * @param {string} [o.label]  accessible name
 */
export function renderStaff(o) {
  const clef = CLEFS[o.clef];
  const allSteps = o.columns.flatMap(c => c.notes.map(staffStep));
  const minStep = Math.min(clef.bottom, ...allSteps);
  const maxStep = Math.max(clef.top, ...allSteps);
  const yOf = step => (clef.top - step) * HALF;

  const top = Math.min(-26, yOf(maxStep) - 14);
  const labelY = Math.max(4 * GAP + 26, yOf(minStep) + 20);
  const bottom = labelY + 24;

  const out = [];
  const cols = [];
  const seen = new Map(); // letter+octave → last accidental shown, for courtesy naturals
  let x = 52;
  const bars = new Set(o.bars || []);
  const barXs = [];

  o.columns.forEach((col, ci) => {
    if (bars.has(ci)) {
      x += 6;
      barXs.push(x);
      x += 18;
      seen.clear();
    }
    const notes = [...col.notes].sort((a, b) => staffStep(a) - staffStep(b));
    // Seconds inside a chord: shift the upper note of each adjacent pair to the right.
    const shifted = notes.map(() => false);
    for (let i = 1; i < notes.length; i++) {
      if (staffStep(notes[i]) - staffStep(notes[i - 1]) === 1 && !shifted[i - 1]) shifted[i] = true;
    }
    // Accidentals: which ones to print, then stack into columns so they don't collide.
    const accs = notes.map(nt => {
      const key = `${nt.letter}:${nt.octave}`;
      const prev = seen.has(key) ? seen.get(key) : 0;
      return nt.acc !== 0 || prev !== 0 ? nt.acc : null;
    });
    notes.forEach(nt => seen.set(`${nt.letter}:${nt.octave}`, nt.acc));
    const accCol = notes.map(() => -1);
    const colBottoms = [];
    for (let i = notes.length - 1; i >= 0; i--) {
      if (accs[i] === null) continue;
      const step = staffStep(notes[i]);
      let c = 0;
      while (colBottoms[c] !== undefined && colBottoms[c] - step < 6) c++;
      colBottoms[c] = step;
      accCol[i] = c;
    }
    const accCols = colBottoms.length;
    const accSpace = accCols ? accCols * 11 + 2 : 0;
    const anyShift = shifted.some(Boolean);
    const cx = x + accSpace + 8;
    const parts = [];

    notes.forEach((nt, i) => {
      const y = yOf(staffStep(nt));
      const hx = cx + (shifted[i] ? 12.4 : 0);
      const step = staffStep(nt);
      for (let l = clef.bottom - 2; l >= step; l -= 2) parts.push(`<line class="ledger" x1="${hx - 10}" x2="${hx + 10}" y1="${yOf(l)}" y2="${yOf(l)}"/>`);
      for (let l = clef.top + 2; l <= step; l += 2) parts.push(`<line class="ledger" x1="${hx - 10}" x2="${hx + 10}" y1="${yOf(l)}" y2="${yOf(l)}"/>`);
      if (accs[i] !== null) {
        const ax = cx - 8 - 5 - accCol[i] * 11 - (ACC_WIDTH[accs[i]] > 10 ? 3 : 0);
        parts.push(`<g class="acc" transform="translate(${ax},${y})">${ACCIDENTALS[accs[i]]}</g>`);
      }
      parts.push(`<g class="note ${nt.cls || ''}" data-midi="${nt.sound}">${noteHead(hx, y)}</g>`);
    });

    if (notes.length === 1 && (notes[0].name || notes[0].label)) {
      const nt = notes[0];
      parts.push(`<text class="st-name ${nt.cls || ''}" x="${cx}" y="${labelY}">${nt.name || ''}</text>`);
      if (nt.label) parts.push(`<text class="st-label" x="${cx}" y="${labelY + 14}">${nt.label}</text>`);
    }

    cols.push(`<g class="col" data-col="${ci}">${parts.join('')}</g>`);
    x = cx + (anyShift ? 12.4 : 0) + 20;
  });

  const width = x + 12;
  barXs.push(width - 6);
  for (let i = 0; i < 5; i++) out.push(`<line class="staff-line" x1="0" x2="${width - 6}" y1="${i * GAP}" y2="${i * GAP}"/>`);
  for (const bx of barXs) out.push(`<line class="barline" x1="${bx}" x2="${bx}" y1="0" y2="${4 * GAP}"/>`);
  // A small 8 under the clef marks instruments that sound an octave below the written note.
  if (o.clef === 'treble') {
    out.push(`<path class="clef" d="${TREBLE_PATH}" transform="translate(6,0)"/>`);
    if (o.octave) out.push(`<text class="clef-8" x="21" y="70">8</text>`);
  } else if (o.clef === 'alto') {
    out.push(`<path class="clef" d="${ALTO_PATH}" transform="translate(8,0)"/>`);
  } else {
    out.push(`<path class="clef" d="${BASS_PATH}" transform="translate(6,0)"/>`);
    if (o.octave) out.push(`<text class="clef-8" x="18" y="49">8</text>`);
  }
  out.push(...cols);

  const h = bottom - top;
  return `<svg class="staff" viewBox="0 ${top} ${width} ${h}" width="${width}" height="${h}" style="--w:${Math.round(width)}px" role="img" aria-label="${o.label || ''}">${out.join('')}</svg>`;
}
