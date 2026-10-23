// App state: one object, persisted to localStorage, with the current selection mirrored in the URL hash.
import { buildItem, spellRoot, parseInterval, asciiName, LETTERS } from './theory.js';
import { findDef } from './catalog.js';

const KEY = 'scalear:v1';

const DEFAULTS = {
  view: 'explore',
  kind: 'scale',
  rootPc: 9,
  spelling: 'auto',
  scale: 'minor-pentatonic',
  chord: 'maj',
  interval: 'P5',
  layout: 'neck', // scales: 'neck' | 'boxes'
  method: null, // box system; null = the scale's default
  box: 0,
  chordLayout: 'tones', // chords: 'tones' | 'voicings'
  voicing: 0,
  labels: 'note', // 'note' | 'interval' | 'none'
  wheel: 'chromatic', // note wheel order: 'chromatic' | 'fifths'
  lang: 'auto', // a key of i18n.LANGS, or 'auto' for the browser's language
  naming: null, // 'B' | 'H' | 'S'; null follows the language
  colorize: false,
  catalogTab: 'scale',
  query: '',
  // instrument
  instrument: 'guitar',
  tuning: 'standard',
  custom: {}, // instrument id → open-string MIDI numbers
  lefty: false,
  // settings
  frets: 15,
  orientation: 'auto',
  chordStyle: 'standard', // 'standard' (Cmin7) | 'jazz' (C−7)
  ghosts: true,
  staff: true,
  tempo: 140,
};

// Tuning ids saved before instruments existed.
const LEGACY_TUNINGS = {
  seven: ['guitar7', 'standard'], eight: ['guitar8', 'standard'],
  bass4: ['bass4', 'standard'], bass5: ['bass5', 'standard'], 'd-standard': ['guitar', 'whole-down'],
};

const listeners = new Set();

function load() {
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(KEY) || '{}') || {};
  } catch { /* unreadable or unavailable storage: start from defaults */ }
  if (!saved.instrument && saved.tuning) {
    const [instrument, tuning] = LEGACY_TUNINGS[saved.tuning] || ['guitar', saved.tuning];
    Object.assign(saved, { instrument, tuning });
  }
  delete saved.theme;
  return { ...DEFAULTS, ...saved };
}

export const state = load();

export function set(patch) {
  const viewChanged = 'view' in patch && patch.view !== state.view;
  Object.assign(state, patch);
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch { /* storage unavailable: state still works for this session */ }
  writeHash(viewChanged);
  for (const fn of listeners) fn(state, patch);
}

export const subscribe = fn => listeners.add(fn);

// --- URL hash: #/explore?k=scale&id=dorian&r=D&v=boxes&b=2, #/catalog?tab=chord or #/instruments

// The root as currently spelled, e.g. "Db" for D♭ major with automatic spelling (always English letters).
const rootLabel = s => asciiName(buildItem(findDef(s.kind, s[s.kind]), s.rootPc, s.spelling).root);

export function hashFor(s = state) {
  if (s.view === 'catalog') return `#/catalog?tab=${s.catalogTab}`;
  if (s.view === 'instruments') return '#/instruments';
  const p = new URLSearchParams({ k: s.kind, id: s[s.kind], r: rootLabel(s) });
  if (s.kind === 'scale' && s.layout === 'boxes') {
    p.set('v', 'boxes');
    if (s.method) p.set('m', s.method);
    p.set('b', String(s.box + 1));
  }
  if (s.kind === 'chord' && s.chordLayout === 'voicings') {
    p.set('v', 'voicings');
    p.set('b', String(s.voicing + 1));
  }
  return `#/explore?${p}`;
}

// Switching views adds a history entry (so Back works); everything else edits the current one.
function writeHash(push) {
  const h = hashFor();
  if (location.hash === h) return;
  if (push) history.pushState(null, '', h);
  else history.replaceState(null, '', h);
}

function parseRoot(str) {
  const m = /^([A-G])([#b]?)$/.exec(str || '');
  if (!m) return null;
  const base = [0, 2, 4, 5, 7, 9, 11][LETTERS.indexOf(m[1])];
  const acc = m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0;
  return { rootPc: (base + acc + 12) % 12, acc };
}

// Returns a state patch for the current hash (empty when the hash is absent or unrecognised).
export function readHash() {
  const m = /^#\/(explore|catalog|instruments)(?:\?(.*))?$/.exec(location.hash);
  if (!m) return {};
  if (m[1] === 'instruments') return { view: 'instruments' };
  const q = new URLSearchParams(m[2] || '');
  if (m[1] === 'catalog') {
    const tab = q.get('tab');
    return { view: 'catalog', ...(['scale', 'chord', 'interval'].includes(tab) ? { catalogTab: tab } : {}) };
  }
  const patch = { view: 'explore' };
  const k = q.get('k');
  if (['scale', 'chord', 'interval'].includes(k)) {
    patch.kind = k;
    if (q.get('id')) patch[k] = q.get('id');
  }
  const root = parseRoot(q.get('r'));
  if (root) {
    patch.rootPc = root.rootPc;
    // Keep automatic spelling when it already yields the linked root; otherwise pin it.
    if (root.acc !== 0) {
      const kind = patch.kind || state.kind;
      const def = findDef(kind, patch[kind] || state[kind]);
      const auto = spellRoot(root.rootPc, 'auto', def.formula.split(' ').map(parseInterval));
      const want = root.acc > 0 ? 'sharp' : 'flat';
      if (state.spelling === 'auto' ? auto.acc !== root.acc : state.spelling !== want) patch.spelling = want;
    }
  }
  const b = Math.max(0, (Number(q.get('b')) || 1) - 1);
  if (k === 'scale') {
    patch.layout = q.get('v') === 'boxes' ? 'boxes' : 'neck';
    if (q.get('m')) patch.method = q.get('m');
    patch.box = b;
  }
  if (k === 'chord') {
    patch.chordLayout = q.get('v') === 'voicings' ? 'voicings' : 'tones';
    patch.voicing = b;
  }
  return patch;
}
