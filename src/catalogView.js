// Catalog view: searchable cards for every scale, chord and interval, shown in the current root.
// It is also where you choose what Explore shows.
import { state, set, spellingFor, isFavorite, toggleFavorite } from './store.js';
import {
  KINDS, groupsOf, itemTitleHtml, intervalName, chordSymbol, jazzGlyphs, kindLabel, nameOf, groupName,
  chordForSymbol, parseChord, chordSymbolParts,
} from './catalog.js';
import { buildItem, relativeSet, stepPattern, notePc } from './theory.js';
import { renderPcClock } from './diagram.js';
import { rootPicker } from './roots.js';
import { esc, seg, icon, favButton } from './dom.js';
import { t } from './i18n.js';

let root = null;

const SKELETON = `
  <div class="catalog-head">
    <div data-slot="tabs"></div>
    <label class="search">${icon.search}<input type="search" data-act="query" autocomplete="off"></label>
  </div>
  <div class="root-row" data-slot="root"></div>
  <p class="module-label" data-slot="hint"></p>
  <div data-slot="results"></div>`;

// Symbols as typed on a keyboard: ♭ ♯ − Δ ø ° as b # - ^ h o.
const ascii = str => str.replace(/♭/g, 'b').replace(/♯/g, '#').replace(/−/g, '-').replace(/Δ/g, '^').replace(/ø/g, 'h').replace(/°/g, 'o');

// Matches the translated and the English name, symbols, aliases, group and formula.
// A chord also matches its symbol written any common way ("-7", "mi7", "ø", "^7").
function matches(kind, def, q) {
  if (!q) return true;
  if (kind === 'chord' && chordForSymbol(q) === def) return true;
  const symbols = def.symbol === undefined ? [] : [def.symbol, chordSymbol(def), chordSymbol(def, 'jazz')];
  const hay = [nameOf(kind, def), def.name, ...symbols, ...symbols.map(ascii), def.short, groupName(def.group), def.formula,
    ...(def.aliases || [])].filter(Boolean).join(' ').toLowerCase();
  return q.toLowerCase().split(/\s+/).every(w => hay.includes(ascii(w)) || hay.includes(w));
}

// root: { pc, spelling } to show a chord typed with its root ("F#-7") in that root instead of the current one.
function card(kind, def, root = null) {
  const item = buildItem(def, root ? root.pc : state.rootPc, root ? root.spelling : state.spelling);
  const set = relativeSet(item);
  const meta = kind === 'scale'
    ? t('cat.scaleMeta', { n: set.length, steps: stepPattern(item).join(' ') })
    : kind === 'chord'
      ? `${nameOf(kind, def)}${def.aliases ? ` · ${def.aliases.join(', ')}` : ''}`
      : t('cat.intervalMeta', { n: item.tones[1].iv.semis, name: intervalName(def.inversion) });
  const title = kind === 'scale' ? esc(nameOf(kind, def)) : itemTitleHtml(kind, item, state.chordStyle);
  const alias = kind === 'scale' && def.aliases ? `<span class="cat-alias"> · ${esc(def.aliases.join(', '))}</span>` : '';
  const rootData = root ? ` data-pc="${root.pc}" data-spelling="${root.spelling}"` : '';
  // A chord is shown by its symbol, as big as the card allows; scales and intervals by their note circle.
  const visual = kind === 'chord' ? symbolScreen(item, title) : renderPcClock(set);
  const fav = isFavorite(kind, def.id);
  return `<div class="cat-item"><button type="button" class="cat-card${kind === 'chord' ? ' chord' : ''}" data-act="open" data-kind="${kind}" data-id="${def.id}"${rootData}>
    ${visual}
    <span class="cat-body">
      ${kind === 'chord' ? '' : `<span class="cat-title">${title}${alias}</span>`}
      <span class="cat-formula">${item.tones.map(tone => `<i>${tone.iv.label}</i>`).join('')}</span>
      <span class="cat-notes">${item.tones.map(tone => tone.name).join(' ')}</span>
      <span class="cat-meta">${jazzGlyphs(esc(meta))}</span>
    </span></button>${favButton(fav, kind, def.id, t(fav ? 'fav.remove' : 'fav.add'))}</div>`;
}

const section = (title, cards, count = '') =>
  `<section class="cat-group"><h3>${esc(title)}${count && ` <span class="count">${count}</span>`}</h3><div class="cat-grid">${cards}</div></section>`;

// The symbol on its own screen, sized so long ones ("Amin(add11)") still fit its width.
// Silkscreen letters are about 0.72em wide; the index is set at 0.62em.
function symbolScreen(item, html) {
  const [quality, ext] = chordSymbolParts(item.def, state.chordStyle);
  const ems = 0.72 * ([...item.name].length + [...quality].length + [...ext].length * 0.62);
  const size = Math.max(14, Math.min(44, Math.floor(98 / ems)));
  return `<span class="cat-symbol" style="font-size: ${size}px"><span>${html}</span></span>`;
}

function renderResults() {
  const kind = state.catalogTab;
  const list = KINDS[kind].list.filter(d => matches(kind, d, state.query));
  const el = root.querySelector('[data-slot="results"]');
  // A chord typed with its root ("Am7", "Bbø7") comes first, shown in that root.
  const hit = kind === 'chord' ? parseChord(state.query) : null;
  let html = '';
  if (hit) {
    const pc = notePc(hit.root);
    html += section(t('cat.symbolHit'), card(kind, hit.def, { pc, spelling: spellingFor(hit.def, pc, Math.sign(hit.root.acc)) }));
  }
  if (!list.length && !hit) html = `<p class="empty">${esc(t('cat.empty', { q: state.query }))}</p>`;
  // Starred items first, in the order they were starred (they stay in their groups too).
  const favs = state.favorites.map(f => f.split(':')).filter(([k]) => k === kind)
    .map(([, id]) => list.find(d => d.id === id)).filter(Boolean);
  if (favs.length) html += section(t('fav.title'), favs.map(d => card(kind, d)).join(''), favs.length);
  html += [...groupsOf(list)].map(([g, defs]) => section(groupName(g), defs.map(d => card(kind, d)).join(''), defs.length)).join('');
  el.innerHTML = html;
}

export function renderCatalog() {
  if (!root) return;
  root.querySelector('[data-slot="tabs"]').innerHTML = seg('tab', Object.keys(KINDS).map(k => [k, `${kindLabel(k)} <span class="count">${KINDS[k].list.length}</span>`]), state.catalogTab);
  // keys spelled as the major scale on each root would be
  root.querySelector('[data-slot="root"]').innerHTML = rootPicker(KINDS.scale.list[0]);
  const rootName = buildItem(KINDS.scale.list[0], state.rootPc, state.spelling).name;
  root.querySelector('[data-slot="hint"]').textContent = t('cat.hint', { root: rootName });
  const input = root.querySelector('input[data-act="query"]');
  input.placeholder = t(state.catalogTab === 'chord' ? 'cat.searchChord' : 'cat.search');
  input.setAttribute('aria-label', t('cat.searchLabel'));
  if (input.value !== state.query) input.value = state.query;
  renderResults();
}

export function mountCatalog(el) {
  root = el;
  root.innerHTML = SKELETON;
  root.addEventListener('click', e => {
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    if (btn.dataset.act === 'tab') set({ catalogTab: btn.dataset.val });
    if (btn.dataset.act === 'root') set({ rootPc: Number(btn.dataset.val) });
    if (btn.dataset.act === 'fav') toggleFavorite(btn.dataset.kind, btn.dataset.id);
    if (btn.dataset.act === 'spelling') set({ spelling: btn.dataset.val });
    if (btn.dataset.act === 'open') {
      const kind = btn.dataset.kind;
      const rootPatch = btn.dataset.pc ? { rootPc: Number(btn.dataset.pc), spelling: btn.dataset.spelling } : {};
      set({ view: 'explore', kind, [kind]: btn.dataset.id, box: 0, voicing: 0, ...rootPatch });
      window.scrollTo({ top: 0 });
    }
  });
  root.querySelector('input[data-act="query"]').addEventListener('input', e => {
    state.query = e.target.value;
    renderResults();
  });
}
