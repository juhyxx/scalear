// Catalog view: searchable cards for every scale, chord and interval, shown in the current root.
// It is also where you choose what Explore shows.
import { state, set } from './store.js';
import {
  KINDS, groupsOf, itemTitleHtml, intervalName, chordSymbol, jazzGlyphs, kindLabel, nameOf, groupName,
} from './catalog.js';
import { buildItem, relativeSet, stepPattern } from './theory.js';
import { renderPcClock } from './diagram.js';
import { esc, seg, icon } from './dom.js';
import { t } from './i18n.js';

let root = null;

const SKELETON = `
  <div class="catalog-head">
    <div data-slot="tabs"></div>
    <label class="search">${icon.search}<input type="search" data-act="query" autocomplete="off"></label>
  </div>
  <p class="module-label" data-slot="hint"></p>
  <div data-slot="results"></div>`;

// Matches the translated and the English name, symbols, aliases, group and formula.
function matches(kind, def, q) {
  if (!q) return true;
  const hay = [nameOf(kind, def), def.name, def.symbol, def.symbol && chordSymbol(def), def.symbol && chordSymbol(def, 'jazz'),
    def.short, groupName(def.group), def.formula, ...(def.aliases || [])].filter(Boolean).join(' ').toLowerCase();
  return q.toLowerCase().split(/\s+/).every(w => hay.includes(w.replace('♭', 'b').replace('♯', '#')) || hay.includes(w));
}

function card(kind, def) {
  const item = buildItem(def, state.rootPc, state.spelling);
  const set = relativeSet(item);
  const meta = kind === 'scale'
    ? t('cat.scaleMeta', { n: set.length, steps: stepPattern(item).join(' ') })
    : kind === 'chord'
      ? `${nameOf(kind, def)}${def.aliases ? ` · ${def.aliases.join(', ')}` : ''}`
      : t('cat.intervalMeta', { n: item.tones[1].iv.semis, name: intervalName(def.inversion) });
  const title = kind === 'scale' ? esc(nameOf(kind, def)) : itemTitleHtml(kind, item, state.chordStyle);
  const alias = kind === 'scale' && def.aliases ? `<span class="cat-alias"> · ${esc(def.aliases.join(', '))}</span>` : '';
  return `<button type="button" class="cat-card" data-act="open" data-kind="${kind}" data-id="${def.id}">
    ${renderPcClock(set)}
    <span class="cat-body">
      <span class="cat-title">${title}${alias}</span>
      <span class="cat-formula">${item.tones.map(tone => `<i>${tone.iv.label}</i>`).join('')}</span>
      <span class="cat-notes">${item.tones.map(tone => tone.name).join(' ')}</span>
      <span class="cat-meta">${jazzGlyphs(esc(meta))}</span>
    </span></button>`;
}

function renderResults() {
  const kind = state.catalogTab;
  const list = KINDS[kind].list.filter(d => matches(kind, d, state.query));
  const el = root.querySelector('[data-slot="results"]');
  if (!list.length) {
    el.innerHTML = `<p class="empty">${esc(t('cat.empty', { q: state.query }))}</p>`;
    return;
  }
  el.innerHTML = [...groupsOf(list)].map(([g, defs]) =>
    `<section class="cat-group"><h3>${esc(groupName(g))} <span class="count">${defs.length}</span></h3><div class="cat-grid">${defs.map(d => card(kind, d)).join('')}</div></section>`).join('');
}

export function renderCatalog() {
  if (!root) return;
  root.querySelector('[data-slot="tabs"]').innerHTML = seg('tab', Object.keys(KINDS).map(k => [k, `${kindLabel(k)} <span class="count">${KINDS[k].list.length}</span>`]), state.catalogTab);
  const rootName = buildItem(KINDS.scale.list[0], state.rootPc, state.spelling).name;
  root.querySelector('[data-slot="hint"]').textContent = t('cat.hint', { root: rootName });
  const input = root.querySelector('input[data-act="query"]');
  input.placeholder = t('cat.search');
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
    if (btn.dataset.act === 'open') {
      const kind = btn.dataset.kind;
      set({ view: 'explore', kind, [kind]: btn.dataset.id, box: 0, voicing: 0 });
      window.scrollTo({ top: 0 });
    }
  });
  root.querySelector('input[data-act="query"]').addEventListener('input', e => {
    state.query = e.target.value;
    renderResults();
  });
}
