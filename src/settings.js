// Settings dialog: language, note names, display and sound. Changes apply immediately.
// Instrument, tuning and left-handed mode have their own Instruments view (left-handed is here too).
import { state, set } from './store.js';
import { esc } from './dom.js';
import { LANGS, t, detect, naming } from './i18n.js';
import { VERSION } from './version.js';

const FRETS = [12, 15, 17, 19, 21, 22, 24];

const select = (key, options, label) => `
  <label class="module"><span class="module-label">${esc(label)}</span>
    <select data-key="${key}">${options.map(([v, l, lang]) => `<option value="${esc(v)}"${lang ? ` lang="${lang}"` : ''}${String(state[key]) === String(v) ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select>
  </label>`;

const toggle = (key, label) =>
  `<label class="btn toggle"><input type="checkbox" data-key="${key}"${state[key] ? ' checked' : ''}>${esc(label)}</label>`;

// Sliders light up to their value, as in Pitcher.
const fill = el => el.style.setProperty('--pct', `${((el.value - el.min) / (el.max - el.min)) * 100}%`);

function body() {
  // every language under its own name; "Automatic" names the one it picked
  const langs = [['auto', t('set.langAuto', { name: LANGS[detect()] })], ...Object.entries(LANGS).map(([code, name]) => [code, name, code])];
  const style = state.naming || naming();
  const names = [['B', 'C D E F G A B', t('set.namingB')], ['H', 'C D E F G A H', t('set.namingH')], ['S', t('music.solfege'), t('set.namingS')]];
  return `
    <form method="dialog" class="settings">
      <header><h2>${esc(t('set.title'))}</h2><button class="btn icon close" value="close" aria-label="${esc(t('set.close'))}">✕</button></header>
      ${select('lang', langs, t('set.language'))}
      <fieldset class="module"><legend class="module-label">${esc(t('set.naming'))}</legend>
        <div class="naming">${names.map(([v, sample, label]) => `
          <label class="btn toggle naming-option"><input type="radio" name="naming" data-key="naming" value="${v}"${style === v ? ' checked' : ''}>
            <span>${esc(sample)}</span><small>${esc(label)}</small></label>`).join('')}</div>
      </fieldset>
      ${select('chordStyle', [['standard', t('set.chordsStd')], ['jazz', t('set.chordsJazz')]], t('set.chords'))}
      ${select('frets', FRETS.map(f => [f, t('set.fretsN', { n: f })]), t('set.frets'))}
      ${select('orientation', [['auto', t('set.orientAuto')], ['horizontal', t('set.orientH')], ['vertical', t('set.orientV')]], t('set.orientation'))}
      <label class="module"><span class="module-label">${esc(t('set.tempo'))} <output>${esc(t('set.bpm', { n: state.tempo }))}</output></span>
        <input type="range" min="60" max="240" step="4" value="${state.tempo}" data-key="tempo"></label>
      <div class="module-row wrap">${toggle('staff', t('set.notation'))}${toggle('lefty', t('ex.leftHanded'))}</div>
      <p class="module-label dim">${esc(t('set.footer'))}</p>
      <p class="module-label dim">Scalear ${esc(VERSION)}</p>
    </form>`;
}

function fillBody(dialog) {
  dialog.innerHTML = body();
  dialog.querySelectorAll('input[type="range"]').forEach(fill);
}

export function mountSettings(dialog, opener) {
  opener.addEventListener('click', () => {
    fillBody(dialog);
    dialog.showModal();
  });
  dialog.addEventListener('click', e => {
    if (e.target === dialog) dialog.close(); // click on the backdrop
  });
  dialog.addEventListener('input', e => {
    const el = e.target;
    const key = el.dataset.key;
    if (!key) return;
    let value = el.type === 'checkbox' ? el.checked : el.value;
    if (key === 'frets' || key === 'tempo') value = Number(value);
    if (key === 'tempo') {
      el.closest('label').querySelector('output').textContent = t('set.bpm', { n: value });
      fill(el);
    }
    set({ [key]: value });
    // A new language relabels the dialog itself (and may bring other default note names).
    if (key === 'lang') {
      fillBody(dialog);
      dialog.querySelector('[data-key="lang"]').focus();
    }
  });
}
