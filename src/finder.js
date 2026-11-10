// Finder view: tap notes on the neck, one per string, and it names what they make: the interval
// between two notes, the chords with exactly these notes, the chords and scales that contain them.
// Every result opens in Explore.
import { state, set, spellingFor } from './store.js';
import { SCALES, CHORDS, INTERVALS, chordSymbolHtml, nameOf } from './catalog.js';
import { makeNeck, pitchAt, instrumentName, tuningName } from './instruments.js';
import { buildItem, relativeSet, mod, sharpNote, flatNote, noteName, parseInterval, transpose } from './theory.js';
import { renderFretboard } from './fretboard.js';
import { esc } from './dom.js';
import { t } from './i18n.js';
import * as audio from './audio.js';
import { chordEgg } from './easter.js';

let root = null;
let vertical = false;
let printing = false; // a printout always gets the neck lying down, across the page

// Laid out like Explore: on a wide screen the results go beside the neck.
const SKELETON = `
  <div class="stage split">
    <header class="finder-head">
      <div class="lcd static" data-slot="readout"></div>
      <div class="finder-actions">
        <button type="button" class="btn" data-act="clear" data-i18n="fd.clear"></button>
        <button type="button" class="btn start" data-act="play" data-i18n="ex.play"></button>
      </div>
    </header>
    <div class="stage-main">
      <section class="block board">
        <div class="fb-toolbar"><span class="module-label" data-i18n="fd.hint"></span><div class="finder-inst" data-slot="instrument"></div></div>
        <div class="screen fb-screen"><div class="fb-scroll" data-slot="fretboard"></div></div>
      </section>
    </div>
    <div class="stage-side">
      <section class="block info" data-slot="results"></section>
    </div>
  </div>`;

const slot = name => root.querySelector(`[data-slot="${name}"]`);

// Catalogue pitch-class sets, relative to their roots.
const sets = list => new Map(list.map(d => [d.id, relativeSet(buildItem(d, 0, 'auto'))]));
const scaleSets = sets(SCALES);
const chordSets = sets(CHORDS);

// Whether a chord tone can stand in the bass of an inversion: its root, 3rd, 5th or 7th (the 2nd
// or 4th of a sus chord). Keyed by chord id, as pitch classes relative to the root.
const bassTones = new Map(CHORDS.map(d => {
  const tones = buildItem(d, 0, 'auto').tones;
  const sus = !tones.some(x => x.iv.degree === 3);
  return [d.id, new Set(tones.filter(x => [1, 3, 5, 7].includes(x.iv.degree) || (sus && [2, 4].includes(x.iv.degree))).map(x => mod(x.iv.semis, 12)))];
}));

// Tones a voicing may leave out, as Explore's voicings do: the listed ones, and the 5th in a chord
// of four or more notes. Keyed by chord id, as pitch classes relative to the root, with their labels.
const omittable = new Map(CHORDS.map(d => {
  const tones = buildItem(d, 0, 'auto').tones;
  const ids = new Set(d.optional || []);
  if (tones.length >= 4) ids.add('5');
  return [d.id, new Map(tones.filter(x => ids.has(x.iv.id)).map(x => [mod(x.iv.semis, 12), x.iv.label]))];
}));

const stringOf = pos => pos.split(':')[0];

// The selected notes on this neck, low to high: { s, f, midi }. One per string, as in a chord shape;
// if a link names two on a string, the later one counts.
function selection(neck) {
  const byString = new Map();
  for (const pos of state.finder) {
    const [s, f] = pos.split(':').map(Number);
    const str = neck.strings[s];
    if (!str || f > state.frets) continue;
    const midi = pitchAt(str, f);
    if (midi !== null) byString.set(s, { s, f, midi });
  }
  return [...byString.values()].sort((a, b) => a.midi - b.midi);
}

// Interval labels in order of their number: "5" before "9" before "♭13".
const byNumber = (a, b) => parseInt(a.replace(/\D/g, ''), 10) - parseInt(b.replace(/\D/g, ''), 10);

// Everything in the catalogue that the selected pitch classes make or fit into.
function analyse(notes) {
  const pcs = [...new Set(notes.map(n => mod(n.midi, 12)))];
  const bass = notes.length ? mod(notes[0].midi, 12) : null;
  // matches: chords made of these notes, possibly leaving out tones that are often omitted ({ omit })
  const res = { pcs, bass, interval: [], matches: [], chords: [], scales: [] };
  if (!pcs.length) return res;
  const relTo = r => pcs.map(pc => mod(pc - r, 12)).sort((a, b) => a - b);
  // the bass note first as a root, then the others, then the rest of the twelve
  const roots = [bass, ...pcs.filter(pc => pc !== bass), ...Array.from({ length: 12 }, (_, i) => i).filter(i => !pcs.includes(i))];

  if (pcs.length === 2) {
    const semis = notes.at(-1).midi - notes[0].midi;
    res.interval = INTERVALS.filter(d => buildItem(d, 0, 'auto').tones[1].iv.semis === (semis > 21 ? mod(semis, 12) : semis));
  }
  const loose = [];
  for (const r of roots) {
    const rel = relTo(r);
    for (const d of CHORDS) {
      const set = chordSets.get(d.id);
      if (!rel.every(x => set.includes(x))) continue;
      const missing = set.filter(x => !rel.includes(x));
      const omit = omittable.get(d.id);
      if (!missing.length) res.matches.push({ def: d, root: r, omit: [] });
      else if (pcs.length >= 3 && rel.includes(0) && missing.every(x => omit.has(x))) loose.push({ def: d, root: r, omit: missing.map(x => omit.get(x)).sort(byNumber) });
      else if (pcs.length >= 2) res.chords.push({ def: d, root: r });
    }
    for (const d of SCALES) {
      if (d.id !== 'chromatic' && rel.every(x => scaleSets.get(d.id).includes(x))) res.scales.push({ def: d, root: r });
    }
  }
  // A chord over a bass that isn't part of it ("D9/G", "F/G"): the notes above the bass make a
  // complete catalogue chord.
  const over = [];
  const upper = pcs.filter(pc => pc !== bass);
  if (upper.length >= 3) {
    for (const r of upper) {
      const rel = upper.map(pc => mod(pc - r, 12)).sort((a, b) => a - b);
      for (const d of CHORDS) {
        const set = chordSets.get(d.id);
        if (set.length === rel.length && set.every((x, i) => x === rel[i])) over.push({ def: d, root: r, omit: [] });
      }
    }
  }
  // Order: complete chords over one of their own root, 3rd, 5th or 7th; then a chord over a
  // foreign bass; then complete chords standing on a 9th, 11th or 13th (F G A C reads F/G, not
  // Fadd9/G); then chords with tones left out. Within each, the bass as root comes first.
  const real = x => bassTones.get(x.def.id).has(mod(bass - x.root, 12));
  res.matches = [...res.matches.filter(real), ...over, ...res.matches.filter(x => !real(x)), ...loose];
  // fewest extra notes first; the bass as root wins ties, as the roots were walked in that order
  const extra = (map, x) => map.get(x.def.id).length;
  res.chords.sort((a, b) => extra(chordSets, a) - extra(chordSets, b));
  res.scales.sort((a, b) => extra(scaleSets, a) - extra(scaleSets, b));
  res.chords = res.chords.slice(0, 18);
  res.scales = res.scales.slice(0, 24);
  return res;
}

// A result spelled the way Explore will show it.
function spelled(kind, def, pc) {
  const spelling = spellingFor(def, pc, 0);
  return { item: buildItem(def, pc, spelling), spelling };
}

// A chord as found: "C⁷", over another bass "C/E", with tones left out "C⁷ no 5".
// A note outside a chord, named by its interval from the chord's root (G under D9 is its 4th).
const OUTSIDE = ['1', 'b2', '2', 'b3', '3', '4', '#4', '5', 'b6', '6', 'b7', '7'];
function toneIn(item, pc) {
  const tone = item.byPc.get(pc);
  if (tone) return { name: tone.name, label: tone.iv.label };
  const iv = parseInterval(OUTSIDE[mod(pc - item.rootPc, 12)]);
  return { name: noteName(transpose(item.root, iv)), label: iv.label };
}

function chordLabel(x, bass) {
  const { item } = spelled('chord', x.def, x.root);
  const slash = x.root !== bass ? `/${toneIn(item, bass).name}` : '';
  const omit = x.omit?.length ? ` <small class="omit">${esc(t('fd.omit', { tones: x.omit.join(', ') }))}</small>` : '';
  return item.name + chordSymbolHtml(x.def, state.chordStyle) + slash + omit;
}

function chip(kind, def, pc, label = null) {
  const { item } = spelled(kind, def, pc);
  label ??= kind === 'chord' ? item.name + chordSymbolHtml(def, state.chordStyle)
    : kind === 'scale' ? esc(`${item.name} ${nameOf(kind, def)}`)
      : esc(nameOf(kind, def));
  return `<button type="button" class="btn link-chip" data-act="open" data-kind="${kind}" data-id="${def.id}" data-pc="${pc}"><span>${label}</span></button>`;
}

const group = (title, chips) => (chips.length ? `<h4>${esc(title)}</h4><div class="links">${chips.join('')}</div>` : '');

// Interval ids from the bass for notes no catalogue chord explains, named the way players read
// chords: with a 3rd and a 7th the other notes are tensions (♭9 9 ♯9 11 ♯11 ♭13 13), otherwise
// steps (♭2 2 4 ♯4 ♭6 6); a ♭3 beside a major 3rd is a ♯9, a tritone or minor 6th beside a perfect
// 5th is a ♯4 or ♭6, and without the 5th a ♭5 or ♯5.
function unnamedIds(rel) {
  const has = x => rel.includes(x);
  const chordal = (has(3) || has(4)) && (has(10) || has(11));
  const ids = {
    0: '1', 1: chordal ? 'b9' : 'b2', 2: chordal ? '9' : '2', 3: has(4) ? '#9' : 'b3', 4: '3',
    5: chordal ? '11' : '4', 6: has(7) ? (chordal ? '#11' : '#4') : 'b5', 7: '5',
    8: has(7) ? (chordal ? 'b13' : 'b6') : '#5', 9: chordal ? '13' : '6', 10: 'b7', 11: '7',
  };
  return rel.map(x => ids[x]);
}

// How to read the selection: each pitch class's note name and degree. From the best chord found,
// measured from its root; else from the bass, with the bass spelled ♯ or ♭, whichever needs fewer
// accidentals (or as the setting says).
function reading(res) {
  const m = res.matches[0];
  if (m) {
    const { item } = spelled('chord', m.def, m.root);
    return { note: pc => toneIn(item, pc).name, degree: pc => toneIn(item, pc).label };
  }
  if (res.bass === null) return null;
  const rel = res.pcs.map(pc => mod(pc - res.bass, 12)).sort((a, b) => a - b);
  const ids = unnamedIds(rel);
  const ivs = ids.map(parseInterval);
  const cost = bass => ivs.reduce((sum, iv) => sum + Math.abs(transpose(bass, iv).acc), 0);
  const options = { sharp: [sharpNote(res.bass)], flat: [flatNote(res.bass)] }[state.spelling] || [sharpNote(res.bass), flatNote(res.bass)];
  const bass = options.reduce((a, b) => (cost(b) < cost(a) ? b : a));
  const byPc = new Map(rel.map((x, i) => [mod(res.bass + x, 12), { name: noteName(transpose(bass, ivs[i])), label: ivs[i].label }]));
  return { bassName: noteName(bass), ids, labels: ivs.map(iv => iv.label), note: pc => byPc.get(pc).name, degree: pc => byPc.get(pc).label };
}

export function renderFinder() {
  if (!root) return;
  const neck = makeNeck(state.instrument, state.tuning, state.custom[state.instrument]);
  const notes = selection(neck);
  const res = analyse(notes);
  const read = reading(res);
  const name = pc => read.note(pc);

  // Readout: the best name for what is selected (the bass and its intervals when the catalogue has
  // none), then the notes low to high with the degree each one is.
  let title = '—';
  if (res.pcs.length === 2 && res.interval.length) {
    // a tritone is a ♯4 or a ♭5 as the notes are spelled
    const iv = res.interval.find(d => read.ids && d.formula.split(' ')[1] === read.ids[1]) || res.interval[0];
    title = esc(nameOf('interval', iv));
  } else if (res.matches.length) {
    title = chordLabel(res.matches[0], res.bass);
  } else if (notes.length === 1) {
    title = esc(name(res.bass));
  } else if (notes.length) {
    title = `${esc(read.bassName)}<span class="ivs">(${esc(read.labels.join(' '))})</span>`;
  }
  const pcsOf = notes.map(n => mod(n.midi, 12));
  const sub = notes.length ? `${pcsOf.map(name).join(' ')} · ${pcsOf.map(pc => read.degree(pc)).join(' ')}` : t('fd.empty');
  slot('readout').innerHTML = `<h2>${title}</h2><p>${esc(sub)}</p>`;
  root.querySelector('[data-act="clear"]').disabled = !notes.length;
  root.querySelector('[data-act="play"]').disabled = !notes.length;

  const parts = [instrumentName(neck.instrument), tuningName(neck.instrument, neck.tuning)];
  slot('instrument').innerHTML = `<button type="button" class="btn inst-summary" data-act="instruments" title="${esc(t('ex.changeInstrument'))}">
    <span>${esc(parts.join(' · '))}</span><span class="inst-notes">${neck.strings.map(st => st.name).join(' ')}</span></button>`;

  // The lowest note is drawn as the root square; once a shape is started, unplayed strings get a ×.
  const markers = notes.map((n, i) => ({ s: n.s, f: n.f, midi: n.midi, label: name(mod(n.midi, 12)), cls: i === 0 ? 'root' : 'tone' }));
  const muted = notes.length ? neck.strings.map((_, s) => s).filter(s => !notes.some(n => n.s === s)) : [];
  slot('fretboard').innerHTML = renderFretboard({
    strings: neck.strings, fretless: neck.fretless, frets: state.frets, vertical, lefty: state.lefty,
    markers, muted, label: t('ex.fretboard'),
  });
  slot('fretboard').classList.toggle('is-vertical', vertical);

  if (!notes.length) {
    slot('results').innerHTML = `<p class="desc">${esc(t('fd.hint'))}</p>`;
    return;
  }
  slot('results').innerHTML = [
    chordEgg(res),
    res.interval.length ? group(t('fd.interval'), res.interval.map(d => chip('interval', d, res.bass))) : '',
    res.pcs.length >= 2
      ? (res.matches.length ? group(t('fd.exact'), res.matches.map(x => chip('chord', x.def, x.root, chordLabel(x, res.bass)))) : `<h4>${esc(t('fd.exact'))}</h4><p class="desc">${esc(t('fd.noExact'))}</p>`)
      : '',
    group(t('fd.chords'), res.chords.map(x => chip('chord', x.def, x.root))),
    group(t('fd.scales'), res.scales.map(x => chip('scale', x.def, x.root))),
  ].join('');
}

// Tapping a note removes it; tapping elsewhere on a string moves that string's note there.
function toggle(pos, midi) {
  const has = state.finder.includes(pos);
  const others = state.finder.filter(p => stringOf(p) !== stringOf(pos));
  set({ finder: has ? others : [...others, pos] });
  if (!has) audio.playNote(midi);
}

function onClick(e) {
  const act = e.target.closest('[data-act]');
  if (act) {
    const neck = makeNeck(state.instrument, state.tuning, state.custom[state.instrument]);
    switch (act.dataset.act) {
      case 'clear': audio.stop(); return set({ finder: [] });
      case 'play': {
        const midis = selection(neck).map(n => n.midi);
        return audio.playSequence([...midis.map(m => [m]), midis], state.tempo, () => {});
      }
      case 'instruments': set({ view: 'instruments' }); return window.scrollTo({ top: 0 });
      case 'open': {
        audio.stop();
        const { kind, id } = act.dataset;
        const pc = Number(act.dataset.pc);
        const def = { scale: SCALES, chord: CHORDS, interval: INTERVALS }[kind].find(d => d.id === id);
        set({ view: 'explore', kind, [kind]: id, rootPc: pc, spelling: spelled(kind, def, pc).spelling, box: 0, voicing: 0 });
        return window.scrollTo({ top: 0 });
      }
    }
    return;
  }
  const spot = e.target.closest('.fretboard [data-pos]');
  if (spot) toggle(spot.dataset.pos, Number(spot.dataset.midi));
}

export function mountFinder(el) {
  root = el;
  root.innerHTML = SKELETON;
  root.addEventListener('click', onClick);
  const stage = root.querySelector('.stage');
  // Same rule as Explore: a narrow screen gets the neck upright, a printout never does.
  const decide = () => {
    if (!stage.clientWidth) return; // hidden view
    const want = !printing && (state.orientation === 'auto' ? stage.clientWidth < 620 : state.orientation === 'vertical');
    if (want !== vertical) {
      vertical = want;
      renderFinder();
    }
  };
  new ResizeObserver(decide).observe(stage);
  window.addEventListener('beforeprint', () => { printing = true; decide(); });
  window.addEventListener('afterprint', () => { printing = false; decide(); });
}
