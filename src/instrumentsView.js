// Instruments view: every instrument with its tunings, plus a custom tuning and the left-handed
// switch. These are set once and rarely touched, so they live here rather than in Explore.
import { state, set } from './store.js';
import { INSTRUMENTS, CUSTOM, makeNeck, findInstrument, instrumentName, instrumentGroup, tuningName } from './instruments.js';
import { groupsOf } from './catalog.js';
import { noteName, sharpNote } from './theory.js';
import { esc } from './dom.js';
import { t } from './i18n.js';

let root = null;

const SKELETON = `
  <div class="catalog-head">
    <p class="module-label" data-slot="current"></p>
    <div data-slot="player"></div>
  </div>
  <div data-slot="list"></div>`;

// A little neck: one line per string (a short string starts at its fret), frets or fretless dashes.
function neckIcon(neck) {
  const S = neck.strings.length;
  const sp = 5;
  const h = (S - 1) * sp + 10;
  const fx = i => 10 + i * 11;
  const out = [];
  for (let i = 1; i <= 6; i++) {
    out.push(`<line class="ni-fret${neck.fretless ? ' fretless' : ''}" x1="${fx(i)}" x2="${fx(i)}" y1="3" y2="${h - 3}"/>`);
  }
  out.push(`<rect class="ni-nut" x="${fx(0) - 2}" y="3" width="2.5" height="${h - 6}"/>`);
  neck.strings.forEach((st, s) => {
    const y = h - 5 - s * sp;
    out.push(`<line class="ni-string" x1="${st.from ? fx(st.from) : fx(0)}" x2="78" y1="${y}" y2="${y}"/>`);
  });
  return `<svg class="neck-icon" viewBox="0 0 80 ${h}" width="80" height="${h}" aria-hidden="true">${out.join('')}</svg>`;
}

const notesOf = neck => neck.strings.map(st => st.name).join(' ');

function tuner(neck) {
  return `<div class="tuner" role="group" aria-label="${esc(t('inst.customAria'))}">${neck.strings.map((st, i) => {
    const name = `${noteName(sharpNote(st.open % 12))}${Math.floor(st.open / 12) - 1}`;
    return `<div class="tuner-string">
      <button type="button" class="btn mini" data-act="tune" data-s="${i}" data-val="1" aria-label="${esc(t('inst.raise', { n: i + 1 }))}">+</button>
      <span class="tuner-note">${name}</span>
      <button type="button" class="btn mini" data-act="tune" data-s="${i}" data-val="-1" aria-label="${esc(t('inst.lower', { n: i + 1 }))}">−</button></div>`;
  }).join('')}</div>`;
}

function card(inst) {
  const active = inst.id === state.instrument;
  const base = makeNeck(inst.id, inst.tunings[0].id);
  const saved = state.custom[inst.id];
  const custom = saved?.length === base.strings.length ? makeNeck(inst.id, CUSTOM, saved) : null;
  const short = base.strings.find(st => st.from);
  const clef = t(`clef.${inst.clef}`);
  const meta = [
    t('inst.strings', { n: base.strings.length }),
    inst.fretless ? t('inst.fretless') : null,
    inst.transpose ? t('inst.octaveLower', { clef }) : clef,
    short ? t('inst.short', { note: short.name, n: short.from }) : null,
  ].filter(Boolean).join(' · ');

  const pressed = id => active && state.tuning === id;
  const tunings = inst.tunings.map(tn =>
    `<button type="button" class="btn tuning" data-act="pick" data-inst="${inst.id}" data-tuning="${tn.id}" aria-pressed="${pressed(tn.id)}">
      <span>${esc(tuningName(inst, tn))}</span><span class="tuning-notes">${notesOf(makeNeck(inst.id, tn.id))}</span></button>`).join('');
  const customBtn = `<button type="button" class="btn tuning" data-act="pick" data-inst="${inst.id}" data-tuning="${CUSTOM}" aria-pressed="${pressed(CUSTOM)}">
      <span>${esc(t('tuning.custom'))}</span><span class="tuning-notes">${custom ? notesOf(custom) : esc(t('inst.customHint'))}</span></button>`;
  const editing = pressed(CUSTOM) && custom;

  return `<section class="inst-card${active ? ' active' : ''}" aria-label="${esc(instrumentName(inst))}">
    <div class="inst-head">${neckIcon(base)}<div><h3>${esc(instrumentName(inst))}</h3><p class="cat-meta">${esc(meta)}</p></div></div>
    <div class="tunings">${tunings}${customBtn}</div>
    ${editing ? `${tuner(custom)}<div class="module-row"><button type="button" class="btn" data-act="use">${esc(t('inst.use'))}</button></div>` : ''}
  </section>`;
}

export function renderInstruments() {
  if (!root) return;
  const neck = makeNeck(state.instrument, state.tuning, state.custom[state.instrument]);
  root.querySelector('[data-slot="current"]').textContent = t('inst.current', {
    inst: instrumentName(neck.instrument), tuning: tuningName(neck.instrument, neck.tuning), notes: notesOf(neck),
  });
  root.querySelector('[data-slot="player"]').innerHTML =
    `<label class="btn toggle"><input type="checkbox" data-act="lefty"${state.lefty ? ' checked' : ''}>${esc(t('ex.leftHanded'))}</label>`;
  root.querySelector('[data-slot="list"]').innerHTML = [...groupsOf(INSTRUMENTS)].map(([g, list]) =>
    `<section class="cat-group"><h3>${esc(instrumentGroup(g))} <span class="count">${list.length}</span></h3><div class="inst-grid">${list.map(card).join('')}</div></section>`).join('');
}

function goExplore() {
  set({ view: 'explore' });
  window.scrollTo({ top: 0 });
}

export function mountInstruments(el) {
  root = el;
  root.innerHTML = SKELETON;
  root.addEventListener('click', e => {
    const btn = e.target.closest('[data-act]');
    if (!btn || btn.tagName === 'INPUT') return;
    const act = btn.dataset.act;
    if (act === 'pick') {
      const inst = findInstrument(btn.dataset.inst);
      const tuning = btn.dataset.tuning;
      const patch = { instrument: inst.id, tuning, box: 0, voicing: 0 };
      if (inst.id !== state.instrument) patch.frets = inst.frets;
      if (tuning !== CUSTOM) {
        set(patch);
        return goExplore();
      }
      // A new custom tuning starts from the tuning in use on this instrument (or its first one); a saved one is kept.
      const strings = makeNeck(inst.id, inst.id === state.instrument ? state.tuning : null, state.custom[inst.id]).strings;
      const saved = state.custom[inst.id];
      if (!(saved?.length === strings.length)) patch.custom = { ...state.custom, [inst.id]: strings.map(st => st.open) };
      return set(patch);
    }
    if (act === 'tune') {
      const tuned = [...state.custom[state.instrument]];
      const i = Number(btn.dataset.s);
      tuned[i] = Math.max(12, Math.min(100, tuned[i] + Number(btn.dataset.val)));
      return set({ custom: { ...state.custom, [state.instrument]: tuned } });
    }
    if (act === 'use') goExplore();
  });
  root.addEventListener('change', e => {
    if (e.target.dataset.act === 'lefty') set({ lefty: e.target.checked });
  });
}
