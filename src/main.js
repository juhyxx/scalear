// App shell: language, routing between views, settings, service worker and install prompt.
import './lang/en.js';
import './lang/cs.js';
import './lang/de.js';
import './lang/es.js';
import './lang/fr.js';
import './lang/it.js';
import './lang/pt-BR.js';
import './lang/zh.js';
import { state, set, subscribe, readHash, hashFor } from './store.js';
import { mountExplore, renderExplore } from './explore.js';
import { mountCatalog, renderCatalog } from './catalogView.js';
import { mountInstruments, renderInstruments } from './instrumentsView.js';
import { mountSettings } from './settings.js';
import { use, apply, t, naming } from './i18n.js';
import { setNaming } from './theory.js';

const $ = sel => document.querySelector(sel);

const VIEWS = ['explore', 'catalog', 'instruments'];
const VIEW_KEYS = ['view'];
const CATALOG_KEYS = ['catalogTab', 'rootPc', 'spelling', 'chordStyle'];
const INSTRUMENT_KEYS = ['instrument', 'tuning', 'custom', 'lefty'];
const TEXT_KEYS = ['lang', 'naming']; // relabel everything

// The language, and the note names: the player's pick, or else what their language uses.
function applyLanguage() {
  use(state.lang);
  setNaming(state.naming || naming(), t('music.solfege').split(' '));
  apply(document);
  $('meta[name="description"]').content = t('meta.desc');
}

function showView() {
  for (const v of VIEWS) $(`#${v}`).hidden = state.view !== v;
  document.querySelectorAll('[data-nav]').forEach(a => {
    a.setAttribute('aria-current', a.dataset.nav === state.view ? 'page' : 'false');
    if (a.dataset.nav === state.view) a.href = hashFor();
  });
}

function render(patch = null) {
  const keys = patch ? Object.keys(patch) : null;
  const touches = list => !keys || keys.some(k => list.includes(k));
  if (touches(TEXT_KEYS)) applyLanguage();
  if (touches(VIEW_KEYS)) showView();
  if (state.view === 'explore') renderExplore();
  if (state.view === 'catalog' && (touches(CATALOG_KEYS) || touches(VIEW_KEYS) || touches(TEXT_KEYS))) renderCatalog();
  if (state.view === 'instruments' && (touches(INSTRUMENT_KEYS) || touches(VIEW_KEYS) || touches(TEXT_KEYS))) renderInstruments();
}

function start() {
  Object.assign(state, readHash());
  const decideOrientation = mountExplore($('#explore'));
  mountCatalog($('#catalog'));
  mountInstruments($('#instruments'));
  mountSettings($('#settings'), $('#settingsBtn'));
  applyLanguage();

  subscribe((_, patch) => {
    if ('orientation' in patch) decideOrientation();
    render(patch);
  });
  window.addEventListener('popstate', () => set(readHash()));
  document.querySelectorAll('[data-nav]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    set({ view: a.dataset.nav });
    window.scrollTo({ top: 0 });
  }));

  showView();
  decideOrientation();
  render();
  history.replaceState(null, '', hashFor());
  document.documentElement.classList.remove('booting'); // shown once the text is in the right language

  setupInstall();
  registerServiceWorker();
}

function setupInstall() {
  let deferred = null;
  const btn = $('#installBtn');
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferred = e;
    btn.hidden = false;
  });
  btn.addEventListener('click', async () => {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice;
    deferred = null;
    btn.hidden = true;
  });
  window.addEventListener('appinstalled', () => (btn.hidden = true));
}

function toast(message, action, onAction) {
  const el = $('#toast');
  el.innerHTML = `<span>${message}</span>${action ? `<button type="button" class="btn">${action}</button>` : ''}`;
  el.hidden = false;
  el.querySelector('button')?.addEventListener('click', () => {
    el.hidden = true;
    onAction();
  });
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  // Register after load so precaching doesn't compete with the page's own requests.
  const register = () => navigator.serviceWorker.register('sw.js').then(reg => {
    const offer = worker => toast(t('toast.update'), t('toast.reload'), () => worker.postMessage('skip-waiting'));
    if (reg.waiting && navigator.serviceWorker.controller) offer(reg.waiting);
    reg.addEventListener('updatefound', () => {
      const worker = reg.installing;
      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) offer(worker);
      });
    });
  });
  if (document.readyState === 'complete') register();
  else window.addEventListener('load', register, { once: true });
  // Reload only when an existing worker is replaced, not when the first one takes control.
  const hadController = Boolean(navigator.serviceWorker.controller);
  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading || !hadController) return;
    reloading = true;
    location.reload();
  });
}

start();
