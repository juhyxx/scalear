// Service worker: precache the whole app so it runs offline.
//
// On deploy, VERSION becomes the commit hash, and every src/ URL below (and in index.html and
// the modules' imports) gets the same ?v=<hash>. See .github/workflows/pages.yml. So each deploy
// changes this file: the browser installs the new worker, which downloads that version's files
// into a fresh cache, and the page offers to reload. Locally (VERSION 'dev') files change without
// a new version, so there everything comes from the network first and the cache is only for offline.
const VERSION = 'dev';
const CACHE = 'scalear-' + VERSION;

// Every file the site publishes. The deploy fails if one is missing here.
const FILES = [
  './',
  'index.html',
  'manifest.webmanifest',
  'src/styles.css',
  'src/main.js',
  'src/version.js',
  'src/store.js',
  'src/theory.js',
  'src/catalog.js',
  'src/boxes.js',
  'src/voicings.js',
  'src/fretboard.js',
  'src/staff.js',
  'src/diagram.js',
  'src/audio.js',
  'src/dom.js',
  'src/explore.js',
  'src/catalogView.js',
  'src/instrumentsView.js',
  'src/settings.js',
  'src/instruments.js',
  'src/i18n.js',
  'src/lang/en.js',
  'src/lang/cs.js',
  'src/lang/de.js',
  'src/lang/es.js',
  'src/lang/fr.js',
  'src/lang/it.js',
  'src/lang/pt-BR.js',
  'src/lang/zh.js',
  'fonts/Silkscreen-Regular.woff2',
  'fonts/ScalearPixelCE.ttf',
  'logo.svg',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/maskable-512.png',
  'icons/apple-touch-icon.png',
];

// cache: 'reload' skips the HTTP cache, so no stale copy ends up in the new cache.
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))));
});

// Other apps on the same origin (juhyxx.github.io) have their own caches; only ours are removed.
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('scalear-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', e => {
  if (e.data === 'skip-waiting') self.skipWaiting();
});

// Unversioned (local) files: the network wins so edits show up on reload; deployed, the cache wins.
const DEV = VERSION === 'dev';

// Only this version's cache, so an old page never gets a newer file (or the other way round).
const cached = (req, options) => caches.open(CACHE).then(c => c.match(req, options));

function fromNetwork(req) {
  return fetch(req).then(res => {
    if (res.ok) {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy));
    }
    return res;
  });
}

// Navigations fall back to the cached shell so deep links work offline.
const offline = req => cached(req, { ignoreSearch: true })
  .then(hit => hit || (req.mode === 'navigate' ? cached('index.html') : Response.error()));

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (DEV) {
    e.respondWith(fromNetwork(req).catch(() => offline(req)));
    return;
  }
  e.respondWith(
    cached(req, { ignoreSearch: true }).then(hit => hit || fromNetwork(req).catch(() => offline(req))),
  );
});
