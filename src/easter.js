// Easter eggs: two chords famous enough to have a name of their own greet whoever finds them in the
// Finder, each with a pixel picture in the app's LED style (drawn, not photographed).
import { esc } from './dom.js';
import { t } from './i18n.js';

// Pixel pictures, one character per pixel: hair (#), headband (h), face (.), light features (o),
// dark features (k); a space is empty.
const PIXEL = { '#': 'px-hair', h: 'px-band', '.': 'px-face', o: 'px-feat', k: 'px-dark' };

// Hendrix: afro, headband, moustache and goatee.
const HENDRIX = [
  '      ##########      ',
  '    ##############    ',
  '  ##################  ',
  ' #################### ',
  '######################',
  '######################',
  '####hhhhhhhhhhhhhh####',
  '####hhhhhhhhhhhhhh####',
  '###................###',
  '###................###',
  '###...oo......oo...###',
  '###................###',
  '###.......oo.......###',
  ' ##................## ',
  ' ##...oooooooooo...## ',
  '  #..oo........oo..#  ',
  '  #..o..........o..#  ',
  '   ................   ',
  '    ......oo......    ',
  '     .....oo.....     ',
  '       ........       ',
];

// The Beatles: four mop tops in a row, fringes down to the eyebrows.
const MOP_TOP = [
  '  ######  ',
  ' ######## ',
  '##########',
  '##########',
  '##########',
  '#.kk..kk.#',
  '#........#',
  '#........#',
  '#.k....k.#',
  ' ..kkkk.. ',
  '  ......  ',
];
const BEATLES = MOP_TOP.map(row => [row, row, row, row].join('  '));

function picture(rows, scale, cls = '') {
  const w = rows[0].length;
  const h = rows.length;
  const rects = rows.flatMap((row, y) => [...row].map((c, x) =>
    (PIXEL[c] ? `<rect class="${PIXEL[c]}" x="${x}" y="${y}" width="1.02" height="1.02"/>` : ''))).join('');
  return `<svg class="egg-portrait ${cls}" viewBox="0 0 ${w} ${h}" width="${w * scale}" height="${h * scale}" aria-hidden="true">${rects}</svg>`;
}

// A catalogue chord among the Finder's matches, leaving out nothing but (optionally) the 5th.
const found = (res, id, root = null) => res.matches.some(m =>
  m.def.id === id && (root === null || m.root === root) && m.omit.every(x => x === '5'));

const EGGS = [
  // 7♯9, as in "Purple Haze" (x-7-6-7-8-x, without the 5th)
  { id: 'hendrix', picture: () => picture(HENDRIX, 5, 'hendrix'), test: res => found(res, '7s9') },
  // the Beatles' opening chord: G7sus4, also with its added 9th (G9sus4)
  { id: 'hardday', picture: () => picture(BEATLES, 5, 'beatles'), test: res => found(res, '7sus4', 7) || found(res, '9sus4', 7) },
];

// The card for what the Finder found, or '' when it isn't a named chord.
export function chordEgg(res) {
  const egg = EGGS.find(e => e.test(res));
  if (!egg) return '';
  return `<div class="egg" role="note">${egg.picture()}
    <div><p class="egg-found">${esc(t('egg.found'))}</p><p class="egg-title">${esc(t(`egg.${egg.id}`))}</p><p class="egg-text">${esc(t(`egg.${egg.id}Text`))}</p></div></div>`;
}
