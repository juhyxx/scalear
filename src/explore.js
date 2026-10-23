// Explore view: the selected scale, chord or interval on the fretboard, staff and note wheel.
// What to show is picked in the Catalog; this view only steps through it and sets the root and labels.
import { state, set } from './store.js';
import {
  KINDS, SCALES, CHORDS, findDef, itemTitleHtml, chordSymbolHtml, jazzGlyphs, intervalName,
  kindOne, nameOf, descOf, qualityName,
} from './catalog.js';
import { makeNeck, pitchAt, instrumentName, tuningName } from './instruments.js';
import {
  buildItem, relativeSet, stepPattern, spellMidi, spellRoot, parseInterval, sharpNote, flatNote,
  noteName, mod, sameSet, accText, ROMAN,
} from './theory.js';
import { methodLabel, methodHint, methodsFor, positions, fretSpan } from './boxes.js';
import { findVoicings } from './voicings.js';
import { renderFretboard } from './fretboard.js';
import { renderStaff } from './staff.js';
import { renderChordDiagram, renderNoteWheel } from './diagram.js';
import { esc, seg, icon } from './dom.js';
import { t } from './i18n.js';
import * as audio from './audio.js';

const SKELETON = `
  <div class="stage">
    <header class="item-head" data-slot="head"></header>
    <div class="controls">
      <div class="module"><span class="module-label" data-i18n="ex.root"></span><div class="module-row wrap" data-slot="root"></div></div>
      <div class="module"><span class="module-label" data-i18n="ex.labels"></span><div class="module-row wrap" data-slot="labels"></div></div>
      <div class="module"><span class="module-label" data-i18n="ex.instrument"></span><div data-slot="instrument"></div></div>
    </div>
    <section class="block">
      <div class="fb-toolbar" data-slot="toolbar"></div>
      <div class="screen fb-screen"><div class="fb-scroll" data-slot="fretboard"></div></div>
    </section>
    <div class="pair">
      <section class="block" data-slot="staffCard">
        <div class="block-head"><span class="module-label" data-i18n="ex.notation"></span><span class="module-label dim" data-slot="staffNote"></span></div>
        <div class="screen staff-screen"><div class="staff-scroll" data-slot="staff"></div></div>
      </section>
      <section class="block wheel-block">
        <div class="block-head"><span class="module-label" data-i18n="ex.wheel"></span><div data-slot="wheelMode"></div></div>
        <div class="screen wheel-screen" data-slot="wheel"></div>
      </section>
    </div>
    <section class="block info" data-slot="info"></section>
  </div>`;

let root = null;
let current = null; // derived data of the last render
let playing = false;
let vertical = false;

const slot = name => root.querySelector(`[data-slot="${name}"]`);

// ---------- derived data ----------

const isRoot = tone => tone.index === 0;
const toneClass = tone => (isRoot(tone) ? 'root' : state.colorize ? `d${tone.iv.degree}` : 'tone');
const toneLabel = tone => {
  if (state.labels === 'none') return '';
  if (state.labels === 'interval') return isRoot(tone) ? 'R' : tone.iv.label;
  return tone.name;
};

const scaleSets = new Map(SCALES.map(d => [d.id, relativeSet(buildItem(d, 0, 'auto'))]));
const chordSets = new Map(CHORDS.map(d => [d.id, relativeSet(buildItem(d, 0, 'auto'))]));

// Written root pitch (MIDI) that centres a figure of `span` semitones on the staff.
function writtenRoot(rootPc, span, clef) {
  const centre = { treble: 71, alto: 60, bass: 50 }[clef];
  let best = null;
  for (let o = 1; o < 8; o++) {
    const m = 12 * (o + 1) + rootPc;
    const d = Math.abs(m + span / 2 - centre);
    if (!best || d < best.d) best = { d, m };
  }
  return best.m;
}

function derive() {
  const kind = state.kind;
  const def = findDef(kind, state[kind]);
  const item = buildItem(def, state.rootPc, state.spelling);
  const neck = makeNeck(state.instrument, state.tuning, state.custom[state.instrument]);
  const S = neck.strings;
  const clef = neck.clef;
  const frets = state.frets;
  const d = { kind, def, item, neck, clef, frets };

  if (kind === 'scale') {
    d.semis = relativeSet(item);
    d.methods = methodsFor(d.semis, neck);
    d.method = d.methods.includes(state.method) ? state.method : d.methods[0];
    if (state.layout === 'boxes' && d.method) {
      d.boxes = positions(d.method, neck, item.rootPc, d.semis, frets).filter(b => b.length);
      d.boxIndex = Math.min(state.box, d.boxes.length - 1);
      d.box = d.boxes[d.boxIndex];
    }
  }
  if (kind === 'chord' && state.chordLayout === 'voicings') {
    d.voicings = findVoicings(neck, frets, item);
    d.voicingIndex = Math.min(state.voicing, d.voicings.length - 1);
    d.voicing = d.voicings[d.voicingIndex];
  }

  // Fretboard markers
  const inBox = d.box ? new Set(d.box.map(n => `${n.s}:${n.f}`)) : null;
  const voiced = d.voicing ? d.voicing.frets : null;
  d.markers = [];
  for (let s = 0; s < S.length; s++) {
    for (let f = S[s].from; f <= frets; f++) {
      const midi = pitchAt(S[s], f);
      const tone = item.byPc.get(midi % 12);
      if (!tone) continue;
      const ghost = (inBox && !inBox.has(`${s}:${f}`)) || (voiced && voiced[s] !== f);
      if (ghost && (!state.ghosts || (voiced && voiced[s] < 0 && f === S[s].from))) continue; // keep the × visible
      d.markers.push({ s, f, midi, label: toneLabel(tone), cls: toneClass(tone), ghost: Boolean(ghost) });
    }
  }
  if (d.box) d.band = fretSpan(d.box);
  if (d.voicing) {
    // An open drone string doesn't widen the highlighted fret range.
    const used = d.voicing.frets.filter((f, s) => f >= 0 && !(S[s].from && f === S[s].from));
    if (used.length) d.band = { lo: Math.min(...used), hi: Math.max(...used) };
    d.muted = d.voicing.frets.map((f, s) => (f < 0 ? s : -1)).filter(s => s >= 0);
  }

  // Staff columns (written pitch, which for guitar and bass is an octave up) and playback steps
  const toneAt = midi => item.byPc.get(midi % 12);
  const written = (midi, tone) => ({ ...spellMidi(midi + neck.transpose, tone.note), sound: midi, cls: toneClass(tone), name: tone.name, label: tone.iv.label });
  const columns = [];
  const bars = [];
  const melodic = midis => midis.forEach(m => columns.push({ notes: [written(m, toneAt(m))] }));
  const block = midis => {
    bars.push(columns.length);
    columns.push({ notes: midis.map(m => written(m, toneAt(m))) });
  };
  if (d.box) {
    melodic(d.box.map(n => n.midi).sort((a, b) => a - b));
    d.staffNote = t('staff.position', { n: d.boxIndex + 1 });
  } else if (d.voicing) {
    const midis = d.voicing.frets.map((f, s) => (f >= 0 ? pitchAt(S[s], f) : null)).filter(m => m !== null).sort((a, b) => a - b);
    melodic(midis);
    block(midis);
    d.staffNote = t('staff.voicing');
  } else {
    const span = Math.max(...item.tones.map(tone => tone.iv.semis)) + (kind === 'scale' ? 12 : 0);
    const r = writtenRoot(item.rootPc, span, clef) - neck.transpose;
    columns.push(...item.tones.map(tone => ({ notes: [written(r + tone.iv.semis, tone)] })));
    if (kind === 'scale') {
      columns.push({ notes: [{ ...written(r + 12, item.tones[0]), label: '8' }] });
      d.staffNote = t('staff.octave');
    } else {
      bars.push(columns.length);
      columns.push({ notes: item.tones.map(tone => written(r + tone.iv.semis, tone)) });
      d.staffNote = t(kind === 'chord' ? 'staff.arpeggio' : 'staff.melodic');
    }
  }
  // Note wheel slots; notes outside the item are spelled the way the item leans.
  const flats = item.tones.some(tone => tone.note.acc < 0);
  const low = Math.min(...S.map(st => st.open)) + 12;
  d.wheel = Array.from({ length: 12 }, (_, pc) => {
    const tone = item.byPc.get(pc) || null;
    return { pc, tone, midi: low + mod(pc - low, 12), name: tone ? tone.name : noteName((flats ? flatNote : sharpNote)(pc)) };
  });

  d.columns = columns;
  d.bars = bars;
  d.steps = columns.map(c => c.notes.map(n => n.sound));
  return d;
}

// ---------- render ----------

const toggle = (act, on, label) =>
  `<label class="btn toggle"><input type="checkbox" data-act="${act}"${on ? ' checked' : ''}>${label}</label>`;

function renderControls(d) {
  const intervals = d.def.formula.split(' ').map(parseInterval);
  const chips = [];
  for (let pc = 0; pc < 12; pc++) {
    const n = spellRoot(pc, state.spelling, intervals);
    chips.push(`<button type="button" class="btn root-chip${n.acc ? ' black' : ''}" data-act="root" data-val="${pc}" aria-pressed="${pc === state.rootPc}">${noteName(n)}</button>`);
  }
  slot('root').innerHTML = `<div class="roots">${chips.join('')}</div>` +
    seg('spelling', [['auto', t('ex.spellAuto'), t('ex.spellAutoHint')], ['sharp', '♯'], ['flat', '♭']], state.spelling, 'small');

  const ghostLabel = d.box ? t('ex.outside') : d.voicing ? t('ex.otherTones') : '';
  slot('labels').innerHTML = seg('labels', [['note', t('ex.labelNotes')], ['interval', t('ex.labelIntervals')], ['none', t('ex.labelNone')]], state.labels) +
    toggle('colorize', state.colorize, t('ex.colorize')) + (ghostLabel ? toggle('ghosts', state.ghosts, ghostLabel) : '');

  // Instrument and tuning rarely change, so Explore only shows what's in use; the Instruments view sets it.
  const { neck } = d;
  const parts = [instrumentName(neck.instrument), tuningName(neck.instrument, neck.tuning), state.lefty ? t('ex.leftHanded') : null].filter(Boolean);
  slot('instrument').innerHTML = `<button type="button" class="btn inst-summary" data-act="instruments" title="${esc(t('ex.changeInstrument'))}">
    <span>${esc(parts.join(' · '))}</span><span class="inst-notes">${neck.strings.map(st => st.name).join(' ')}</span></button>`;
}

const playButton = () =>
  `<button type="button" class="btn start${playing ? ' running' : ''}" data-act="play">${t(playing ? 'ex.stop' : 'ex.play')}</button>`;

function renderHead(d) {
  const { item, def, kind } = d;
  const notes = t('ex.notesCount', { n: relativeSet(item).length });
  let sub = kindOne(kind);
  if (kind === 'scale') sub = [sub, def.aliases?.join(' · '), notes].filter(Boolean).join(' · ');
  if (kind === 'chord') sub = `${sub} · ${item.name} ${nameOf(kind, def)}${def.aliases ? ` · ${def.aliases.join(' · ')}` : ''}`;
  if (kind === 'interval') sub = `${sub} · ${item.tones[0].name} → ${item.tones[1].name} · ${t('ex.semitones', { n: item.tones[1].iv.semis })}`;

  const seen = new Set();
  const chips = item.tones.filter(tone => !(kind !== 'interval' && seen.has(tone.pc)) && seen.add(tone.pc)).map(tone =>
    `<button type="button" class="tone-chip ${toneClass(tone)}" data-act="tone" data-val="${tone.index}" title="${esc(t('ex.playNote', { note: tone.name }))}">
      <span class="tc-iv">${isRoot(tone) ? 'R' : tone.iv.label}</span><span class="tc-name">${tone.name}</span></button>`).join('');

  slot('head').innerHTML = `
    <div class="title-row">
      <button type="button" class="btn icon" data-act="item-step" data-val="-1" aria-label="${esc(t('ex.prev'))}">${icon.prev}</button>
      <button type="button" class="lcd" data-act="browse" title="${esc(t('ex.browse'))}">
        <h2>${itemTitleHtml(kind, item, state.chordStyle)}</h2>
        <p>${jazzGlyphs(esc(sub))}</p>
      </button>
      <button type="button" class="btn icon" data-act="item-step" data-val="1" aria-label="${esc(t('ex.next'))}">${icon.next}</button>
      ${playButton()}
    </div>
    <div class="tone-chips">${chips}</div>`;
}

function renderToolbar(d) {
  const el = slot('toolbar');
  if (d.kind === 'scale') {
    let html = seg('layout', [['neck', t('ex.wholeNeck')], ['boxes', t('ex.positions')]], state.layout);
    if (state.layout === 'boxes') {
      if (!d.methods.length) {
        html += `<span class="module-label">${t('ex.noPositions')}</span>`;
      } else {
        html += seg('method', d.methods.map(m => [m, methodLabel(m, d.neck), methodHint(m)]), d.method, 'small');
        const span = d.band ? `<span class="module-label nowrap">${t(d.neck.fretless ? 'ex.positionsRange' : 'ex.fretsRange', { a: d.band.lo, b: d.band.hi })}</span>` : '';
        html += `<div class="stepper">
          <button type="button" class="btn icon" data-act="box-step" data-val="-1" aria-label="${esc(t('ex.prevPosition'))}">${icon.prev}</button>
          <div class="box-chips">${d.boxes.map((_, i) => `<button type="button" class="btn" data-act="box" data-val="${i}" aria-pressed="${i === d.boxIndex}" aria-label="${esc(t('ex.position', { n: i + 1 }))}">${i + 1}</button>`).join('')}</div>
          <button type="button" class="btn icon" data-act="box-step" data-val="1" aria-label="${esc(t('ex.nextPosition'))}">${icon.next}</button>
          ${span}</div>`;
      }
    }
    el.innerHTML = html;
  } else if (d.kind === 'chord') {
    let html = seg('chordLayout', [['tones', t('ex.allTones')], ['voicings', t('ex.voicings')]], state.chordLayout);
    if (state.chordLayout === 'voicings') {
      // Tab-style labels: a short string's open note reads 0, like any other open string.
      const tab = v => v.frets.map((f, s) => (f < 0 ? '×' : f === d.neck.strings[s].from ? 0 : f));
      const ordered = v => (state.lefty ? [...tab(v)].reverse() : tab(v)).join(' ');
      html += d.voicings.length
        ? `<div class="voicings">${d.voicings.map((v, i) => `
            <button type="button" class="voicing" data-act="voicing" data-val="${i}" aria-pressed="${i === d.voicingIndex}" aria-label="${esc(t('ex.voicing', { frets: tab(v).join(' ') }))}">
              ${renderChordDiagram(v.frets, d.neck.strings, d.item.rootPc, state.lefty)}
              <span>${ordered(v)}</span></button>`).join('')}</div>`
        : `<span class="module-label">${t('ex.noVoicing')}</span>`;
    }
    el.innerHTML = html;
  } else {
    el.innerHTML = `<span class="module-label">${t('ex.intervalHint')}</span>`;
  }
}

function renderBoard(d) {
  const el = slot('fretboard');
  el.innerHTML = renderFretboard({
    strings: d.neck.strings, fretless: d.neck.fretless, frets: d.frets, vertical, lefty: state.lefty,
    markers: d.markers, band: d.band || null, muted: d.muted, label: t('ex.fretboard'),
  });
  el.classList.toggle('is-vertical', vertical);
  // Keep the selected position in view when the neck scrolls sideways.
  const band = el.querySelector('.fb-band');
  if (band && !vertical && el.scrollWidth > el.clientWidth) {
    const b = band.getBoundingClientRect();
    const c = el.getBoundingClientRect();
    el.scrollTo({ left: el.scrollLeft + b.left - c.left - (c.width - b.width) / 2, behavior: 'smooth' });
  }
}

function renderNotation(d) {
  const card = slot('staffCard');
  card.hidden = !state.staff;
  if (!state.staff) return;
  slot('staffNote').textContent = d.staffNote;
  slot('staff').innerHTML = renderStaff({ clef: d.clef, octave: d.neck.transpose === 12, columns: d.columns, bars: d.bars, label: t('ex.notation') });
}

function renderWheel(d) {
  slot('wheelMode').innerHTML = seg('wheel', [['chromatic', t('ex.chromatic')], ['fifths', t('ex.fifths')]], state.wheel, 'small');
  slot('wheel').innerHTML = renderNoteWheel(d.wheel.map(w => ({
    pc: w.pc, midi: w.midi, name: w.name, member: Boolean(w.tone),
    cls: w.tone ? toneClass(w.tone) : 'off',
    label: w.tone ? toneLabel(w.tone) : '',
    // the ring inside shows whichever of name and interval the markers don't
    sub: !w.tone || state.labels === 'none' ? '' : state.labels === 'interval' ? w.tone.name : isRoot(w.tone) ? 'R' : w.tone.iv.label,
  })), state.wheel, t('ex.wheel'));
}

function chordLink(rootTone, chordId, numeral) {
  const def = CHORDS.find(c => c.id === chordId);
  const name = def ? rootTone.name + chordSymbolHtml(def, state.chordStyle) : rootTone.name;
  return `<button type="button" class="btn link-chip" data-act="open" data-kind="chord" data-id="${chordId}" data-pc="${rootTone.pc}" data-acc="${rootTone.note.acc}">
    ${numeral ? `<span class="numeral">${numeral}</span>` : ''}<span>${name}</span></button>`;
}

const scaleLink = (scale, tone) =>
  `<button type="button" class="btn link-chip" data-act="open" data-kind="scale" data-id="${scale.id}" data-pc="${tone.pc}" data-acc="${tone.note.acc}"><span>${esc(`${tone.name} ${nameOf('scale', scale)}`)}</span></button>`;

function matchChord(set, group) {
  return CHORDS.find(c => c.group === group && !['power', 'sus2', 'sus4', '7sus4'].includes(c.id) && sameSet(chordSets.get(c.id), set));
}

function scaleInfo(d) {
  const { item } = d;
  const tones = item.tones;
  const parts = [];
  parts.push(facts([
    [t('info.formula'), tones.map(tone => tone.iv.label).join(' ')],
    [t('info.notes'), tones.map(tone => tone.name).join(' ')],
    [t('info.steps'), `${stepPattern(item).join(' – ')} <span class="muted">${esc(t('info.semitonesUnit'))}</span>`],
  ]));

  if (tones.length === 7) {
    const rows = [];
    for (const size of [3, 4]) {
      const links = tones.map((tone, i) => {
        const stack = [0, 2, 4, 6].slice(0, size).map(k => tones[(i + k) % 7]);
        const chordSet = [...new Set(stack.map(x => mod(x.pc - tone.pc, 12)))].sort((a, b) => a - b);
        const match = matchChord(chordSet, size === 3 ? 'Triads' : 'Sevenths');
        const third = mod(stack[1].pc - tone.pc, 12);
        let numeral = accText(tone.iv.acc) + ROMAN[tone.iv.degree - 1];
        if (third === 3) numeral = numeral.toLowerCase();
        if (size === 3 && match?.id === 'dim') numeral += '°';
        if (size === 3 && match?.id === 'aug') numeral += '+';
        return match ? chordLink(tone, match.id, numeral)
          : `<span class="link-chip static"><span class="numeral">${numeral}</span><span>${stack.map(x => x.name).join(' ')}</span></span>`;
      });
      rows.push(`<h4>${t(size === 3 ? 'info.triads' : 'info.sevenths')}</h4><div class="links">${links.join('')}</div>`);
    }
    parts.push(rows.join(''));
  } else {
    const fits = CHORDS.filter(c => ['Triads', 'Sixths & added', 'Sevenths'].includes(c.group) && chordSets.get(c.id).every(x => d.semis.includes(x)));
    if (fits.length) parts.push(`<h4>${t('info.rootChords')}</h4><div class="links">${fits.map(c => chordLink(tones[0], c.id)).join('')}</div>`);
  }

  // Other catalog scales that use the same notes, starting from another degree.
  const rel = [];
  const seen = new Set();
  tones.forEach(tone => {
    if (isRoot(tone) || seen.has(tone.pc)) return;
    seen.add(tone.pc);
    const rotated = [...new Set(d.semis.map(x => mod(x - mod(tone.iv.semis, 12), 12)))].sort((a, b) => a - b);
    for (const scale of SCALES) if (sameSet(scaleSets.get(scale.id), rotated)) rel.push(scaleLink(scale, tone));
  });
  if (rel.length) parts.push(`<h4>${t('info.sameNotes')}</h4><div class="links">${rel.join('')}</div>`);
  return parts.join('');
}

function chordInfo(d) {
  const { item } = d;
  const chordSet = relativeSet(item);
  const optional = new Set(item.def.optional || []);
  if (item.tones.length >= 4) optional.add('5');
  const omit = item.tones.filter(tone => optional.has(tone.iv.id)).map(tone => tone.iv.label);
  const parts = [facts([
    [t('info.formula'), item.tones.map(tone => tone.iv.label).join(' ')],
    [t('info.notes'), item.tones.map(tone => tone.name).join(' ')],
    ...(omit.length ? [[t('info.omitted'), omit.join(', ')]] : []),
  ])];
  const fits = SCALES.filter(s => s.id !== 'chromatic' && chordSet.every(x => scaleSets.get(s.id).includes(x)));
  fits.sort((a, b) => scaleSets.get(a.id).length - scaleSets.get(b.id).length);
  if (fits.length) parts.push(`<h4>${t('info.scalesFit')}</h4><div class="links">${fits.slice(0, 16).map(s => scaleLink(s, item.tones[0])).join('')}</div>`);
  return parts.join('');
}

function intervalInfo(d) {
  const { def, item } = d;
  const iv = item.tones[1].iv;
  return facts([
    [t('info.semitones'), `${iv.semis} <span class="muted">${esc(t('info.fretsApart', { n: iv.semis }))}</span>`],
    [t('info.quality'), esc(qualityName(def))],
    [t('info.inverts'), esc(intervalName(def.inversion))],
    ...(def.aliases ? [[t('info.aka'), esc(def.aliases.join(', '))]] : []),
    ...(def.mnemonic ? [[t('info.soundsLike'), esc(def.mnemonic)]] : []),
  ]);
}

function facts(rows) {
  return `<dl class="facts">${rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${v}</dd>`).join('')}</dl>`;
}

function renderInfo(d) {
  const body = d.kind === 'scale' ? scaleInfo(d) : d.kind === 'chord' ? chordInfo(d) : intervalInfo(d);
  slot('info').innerHTML = `<p class="desc">${esc(descOf(d.kind, d.def))}</p>${body}`;
}

export function renderExplore() {
  if (!root) return;
  const d = derive();
  current = d;
  renderHead(d);
  renderControls(d);
  renderToolbar(d);
  renderBoard(d);
  renderNotation(d);
  renderWheel(d);
  renderInfo(d);
}

// ---------- interaction ----------

function cycle(list, id, dir) {
  const i = list.findIndex(x => x.id === id);
  return list[mod(i + dir, list.length)].id;
}

function togglePlay() {
  if (playing) {
    audio.stop();
    setPlaying(false);
    return;
  }
  setPlaying(true);
  audio.playSequence(current.steps, state.tempo, i => {
    root.querySelectorAll('.playing').forEach(n => n.classList.remove('playing'));
    if (i < 0) return setPlaying(false);
    root.querySelector(`.staff .col[data-col="${i}"]`)?.classList.add('playing');
    for (const m of current.steps[i]) {
      root.querySelectorAll(`.fretboard .mk:not(.ghost)[data-midi="${m}"], .wheel .wk[data-pc="${mod(m, 12)}"]`).forEach(n => n.classList.add('playing'));
    }
  });
}

function setPlaying(on) {
  playing = on;
  root.querySelector('[data-act="play"]')?.replaceWith(document.createRange().createContextualFragment(playButton()));
}

function stopPlayback() {
  if (playing) {
    audio.stop();
    setPlaying(false);
  }
}

function onClick(e) {
  const midiEl = e.target.closest('[data-midi]');
  if (midiEl && !e.target.closest('[data-act]')) {
    audio.playNote(Number(midiEl.dataset.midi));
    return;
  }
  const el = e.target.closest('[data-act]');
  if (!el || el.tagName === 'SELECT' || el.tagName === 'INPUT') return;
  const v = el.dataset.val;
  const list = KINDS[state.kind].list;
  switch (el.dataset.act) {
    case 'root': stopPlayback(); return set({ rootPc: Number(v) });
    case 'spelling': return set({ spelling: v });
    case 'item-step': stopPlayback(); return set({ [state.kind]: cycle(list, current.def.id, Number(v)), box: 0, voicing: 0 });
    case 'labels': return set({ labels: v });
    case 'layout': return set({ layout: v });
    case 'method': return set({ method: v, box: 0 });
    case 'box': return set({ box: Number(v) });
    case 'box-step': return set({ box: mod(current.boxIndex + Number(v), current.boxes.length) });
    case 'chordLayout': return set({ chordLayout: v });
    case 'voicing': {
      stopPlayback();
      set({ voicing: Number(v) });
      return audio.playSequence([current.steps.at(-1)], state.tempo, () => {});
    }
    case 'tone': {
      const tone = current.item.tones[Number(v)];
      const r = writtenRoot(current.item.rootPc, 0, current.clef) - current.neck.transpose;
      return audio.playNote(r + tone.iv.semis);
    }
    case 'play': return togglePlay();
    case 'instruments': stopPlayback(); set({ view: 'instruments' }); return window.scrollTo({ top: 0 });
    case 'browse': stopPlayback(); set({ view: 'catalog', catalogTab: state.kind }); return window.scrollTo({ top: 0 });
    case 'wheel': return set({ wheel: v });
    case 'open': {
      stopPlayback();
      const acc = Number(el.dataset.acc);
      const patch = { kind: el.dataset.kind, [el.dataset.kind]: el.dataset.id, rootPc: Number(el.dataset.pc), box: 0, voicing: 0 };
      if (acc !== 0 && state.spelling !== 'auto') patch.spelling = acc > 0 ? 'sharp' : 'flat';
      set(patch);
      return window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}

function onChange(e) {
  const el = e.target;
  switch (el.dataset.act) {
    case 'colorize': return set({ colorize: el.checked });
    case 'ghosts': return set({ ghosts: el.checked });
  }
}

function onKey(e) {
  if (state.view !== 'explore' || e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.target instanceof Element && e.target.closest('input, select, textarea, dialog')) return;
  const d = current;
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    const dir = e.key === 'ArrowRight' ? 1 : -1;
    if (d.boxes?.length) set({ box: mod(d.boxIndex + dir, d.boxes.length) });
    else if (d.voicings?.length) set({ voicing: mod(d.voicingIndex + dir, d.voicings.length) });
    else return;
    e.preventDefault();
  } else if (e.key === '[' || e.key === ']') {
    set({ [state.kind]: cycle(KINDS[state.kind].list, d.def.id, e.key === ']' ? 1 : -1), box: 0, voicing: 0 });
  } else if (e.key === 'p') {
    togglePlay();
  }
}

export function mountExplore(el) {
  root = el;
  root.innerHTML = SKELETON;
  root.addEventListener('click', onClick);
  root.addEventListener('change', onChange);
  document.addEventListener('keydown', onKey);
  const stage = root.querySelector('.stage');
  const decide = () => {
    if (!stage.clientWidth) return; // hidden view
    const want = state.orientation === 'auto' ? stage.clientWidth < 620 : state.orientation === 'vertical';
    if (want !== vertical) {
      vertical = want;
      if (current) renderBoard(current);
    }
  };
  new ResizeObserver(decide).observe(stage);
  vertical = state.orientation === 'vertical' || (state.orientation === 'auto' && stage.clientWidth > 0 && stage.clientWidth < 620);
  return decide;
}
