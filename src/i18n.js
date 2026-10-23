// Translations, as in ../dots: picks the language, looks strings up and fills the data-i18n attributes.
// Each language registers itself from src/lang/<code>.js; a missing string falls back to English.

// each language is listed under its own name (no flags: a flag is a country, not a language)
export const LANGS = {
  en: 'English',
  cs: 'Čeština',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
  it: 'Italiano',
  'pt-BR': 'Português (Brasil)',
  zh: '简体中文',
};
// the note names people learn with: letters with B, letters with H, or fixed-do solfège
const NAMING = { en: 'B', cs: 'H', de: 'H', es: 'S', fr: 'S', it: 'S', 'pt-BR': 'S', zh: 'B' };

const dicts = {};
let lang = 'en';
let plurals = new Intl.PluralRules('en');

export function add(code, strings) {
  dicts[code] = strings;
}

// the first of the browser's languages we have, matched exactly or by base language (pt-PT -> pt-BR, zh-TW -> zh)
export function detect() {
  const codes = Object.keys(LANGS);
  const prefs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
  for (const p of prefs) {
    const want = p.toLowerCase();
    const hit = codes.find(c => c.toLowerCase() === want) || codes.find(c => c.split('-')[0] === want.split('-')[0]);
    if (hit) return hit;
  }
  return 'en';
}

// code: a key of LANGS, or anything else (e.g. 'auto') to detect
export function use(code) {
  lang = Object.hasOwn(LANGS, code) ? code : detect();
  plurals = new Intl.PluralRules(lang);
  document.documentElement.lang = lang;
  return lang;
}

// {name} inserts vars.name. {n, plural, one {# note} other {# notes}} picks the form for vars.n
// (# = the number, =0 matches exactly); plural branches can't hold other {placeholders}.
function format(s, vars = {}) {
  return s
    .replace(/\{(\w+), plural,((?:\s*=?\w+\s*\{[^{}]*\})+)\s*\}/g, (m, k, forms) => {
      const n = vars[k];
      const map = {};
      forms.replace(/(=?\w+)\s*\{([^{}]*)\}/g, (_, cat, text) => (map[cat] = text));
      return (map['=' + n] ?? map[plurals.select(n)] ?? map.other ?? '').replace(/#/g, n);
    })
    .replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
}

export function t(key, vars) {
  const s = dicts[lang]?.[key] ?? dicts.en?.[key] ?? key;
  return format(s, vars);
}

// Catalogue text (names, descriptions) is written in English in the data; a translation overrides it.
export function tr(key, fallback) {
  return dicts[lang]?.[key] ?? fallback;
}

// data-i18n: text, data-i18n-html: markup, data-i18n-label: aria-label
export function apply(root = document) {
  root.querySelectorAll('[data-i18n]').forEach(e => (e.textContent = t(e.dataset.i18n)));
  root.querySelectorAll('[data-i18n-html]').forEach(e => (e.innerHTML = t(e.dataset.i18nHtml)));
  root.querySelectorAll('[data-i18n-label]').forEach(e => e.setAttribute('aria-label', t(e.dataset.i18nLabel)));
}

export const naming = () => NAMING[lang];
export const current = () => lang;
