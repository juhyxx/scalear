<p align="center"><img src="logo.svg" width="320" alt="Scalear"></p>

A client-only PWA for players of fretted and bowed string instruments. It shows scales, chords and intervals on the neck and in staff notation, and it works offline once loaded.

The name is a pun: *scalare* is the angelfish in the logo, and the app is about scales.

## Features

- **Instruments**: guitar (6, 7 and 8-string), bass (4, 5 and 6-string), ukulele, baritone ukulele, mandolin, Irish bouzouki, 5-string banjo, tenor banjo, violin, viola, cello and double bass.
  - Each has its common tunings, plus a **custom** tuning you set string by string.
  - Re-entrant tunings (high-G ukulele), the banjo's short drone string and fretless necks are drawn as they really are.
- **Instruments page**: instrument and tuning are chosen once, so they have their own page next to the Catalog, with every tuning's notes and the custom tuning editor. Explore just shows what's in use; tap it to change.
- **Choosing what to show**: scales, chords and intervals are picked in the Catalog. In Explore, the title opens the Catalog and ‹ › step through the list. The root, labels and instrument sit above the neck, which gets the full width.
- **Languages**: English, Czech, German, Spanish, French, Italian, Brazilian Portuguese and Chinese, as in [dots](../dots). The interface, catalogue and instrument names are all translated, and the language follows the browser unless you pick one.
- **Note names**: C D E F G A **B**, C D E F G A **H** (German and Central European: H is B natural, B is B♭) or solfège (Do Re Mi…). Each language starts with its usual style.
- **Left-handed**: one switch (on the Instruments page and in Settings) mirrors the neck, the chord diagrams and the tab labels, horizontally or vertically.
- **Fretboard**: the whole neck, or one position at a time with the rest dimmed. Roots are drawn as squares, other notes as dots. Label notes by name, by interval, or not at all, and optionally colour them by degree. Tap any fret to hear it.
- **Positions (boxes)**:
  - *CAGED*: five positions built from the scale's pentatonic boxes, with the remaining tones filled in (called "5 positions" outside the guitar family).
  - *2, 3 or 4 notes per string*. Instruments tuned in fifths (mandolin, violin family) default to 4 per string.
- **Chords**: every chord tone across the neck, plus playable voicings as chord diagrams. On linear tunings the root is in the bass; re-entrant tunings have no real bass string, so that rule is dropped there.
- **Intervals**: every place an interval occurs, with semitones, inversion, quality and an ear-training song.
- **Note wheel**: the twelve notes round a circle, chromatic or in fifths, lit like the fretboard.
- **Notation**: treble, alto (viola) or bass clef, with the octave transposition of guitar, bass and banjo. Spelling is correct (B♯ in C♯ harmonic minor, double accidentals, courtesy naturals). The staff always shows what **Play** plays.
- **Catalog**: 76 scales (including the modes of major, melodic minor, harmonic minor, harmonic major and double harmonic), 35 chords and 22 intervals, searchable, with notes spelled from the current root.
- **Cross-links**: a scale lists its diatonic triads and 7ths with roman numerals, plus the modes that share its notes. A chord lists the scales that fit it.
- **Shareable state**: the current view is kept in the URL hash, for example `#/explore?k=scale&id=dorian&r=D&v=boxes&b=2`.
- **Keyboard**: `←` `→` change position or voicing, `[` `]` change item, `p` plays.

- **Chord symbols**: extensions are written as an index (Amin⁷, Cmaj⁷♯⁵). Settings switches between standard (Cmin⁷, Cmaj⁷, Cdim⁷) and jazz symbols (C−⁷, CΔ⁷, C°⁷, Cø⁷).

The look is shared with [pitcher](../pitcher): a dark hardware panel, the Silkscreen pixel font, recessed screens and LEDs, here in the logo's orange. The font has no lowercase, so standard symbols spell minor as `min` and diminished as `dim`; the jazz glyphs are drawn in a serif face.

There are no dependencies and no build step: just ES modules, SVG and Web Audio.

## Run locally

Any static file server works. Modules and the service worker need `http://`, not `file://`.

```sh
python3 -m http.server 5173
# open http://localhost:5173
```

Locally the version is `dev`, and the service worker fetches from the network first, so edits show up on a normal reload.

## Deploy and versioning

Every push to `master` runs [.github/workflows/pages.yml](.github/workflows/pages.yml), which publishes to GitHub Pages like [pitcher](../pitcher) and [dots](../dots) do (they push a `gh-pages` branch; this one deploys the Pages artifact directly):

1. Copies the files the app needs to `_site/`.
2. Fails if [sw.js](sw.js) doesn't list every published file, or lists one that doesn't exist.
3. Stamps two versions:
   - The **release**, the latest `v*` tag as `git describe` gives it: `2.0.0` on the tagged commit, `2.0.0-3-gdc8ed7e` three commits later. It goes into [src/version.js](src/version.js), and Settings shows it.
   - The **build**, the short commit hash. It goes on the `src/` URLs in `index.html` and `sw.js` and on the modules' imports of each other as `?v=<hash>`, and into `VERSION` in `sw.js`, which names the cache.
4. Deploys `_site/`.

Because each deploy changes `sw.js`, browsers install the new worker, which caches that version's files in a fresh `scalear-<hash>` cache and deletes the old one (the other apps on `juhyxx.github.io` keep theirs). Open pages show a "new version" toast, and Reload switches to it.

To release, tag the commit and push the tag together with `master`:

```sh
git tag v2.1.0
git push --atomic origin master v2.1.0
```

If `master` is already pushed, push the tag and then run the workflow from the Actions tab (**Run workflow**), so the site picks up the new number.

When adding a file, list it in `FILES` in [sw.js](sw.js); the deploy fails otherwise.

## Structure

| File | Purpose |
| --- | --- |
| [src/theory.js](src/theory.js) | Spelled notes, intervals, enharmonic root choice |
| [src/catalog.js](src/catalog.js) | Scales, chords, intervals (data only) |
| [src/instruments.js](src/instruments.js) | Instruments, tunings, and the neck model (short strings, re-entrant shapes) |
| [src/boxes.js](src/boxes.js) | Position algorithms (N notes per string, CAGED) |
| [src/voicings.js](src/voicings.js) | Chord voicing search and ranking |
| [src/fretboard.js](src/fretboard.js), [src/staff.js](src/staff.js), [src/diagram.js](src/diagram.js) | SVG renderers |
| [src/audio.js](src/audio.js) | Karplus–Strong plucked-string synth |
| [src/store.js](src/store.js) | State, localStorage, URL hash |
| [src/explore.js](src/explore.js), [src/catalogView.js](src/catalogView.js), [src/instrumentsView.js](src/instrumentsView.js), [src/settings.js](src/settings.js) | Views |
| [src/main.js](src/main.js) | Shell, routing, service worker, install prompt |
| [sw.js](sw.js) | Service worker: offline cache, one per deploy |
| [src/version.js](src/version.js) | Release shown in Settings (`dev` locally, stamped on deploy) |
| [logo.svg](logo.svg), `icons/` | Logo and app icons (the icons use the logo's fish) |
| [src/i18n.js](src/i18n.js), `src/lang/` | Translations (same mechanism as dots); English UI strings in `en.js`, other languages also translate catalogue names by id |
| `fonts/` | [Silkscreen](https://github.com/googlefonts/silkscreen), self-hosted for offline use, plus `ScalearPixelCE.ttf` with the Czech letters and arrows Silkscreen lacks (both SIL OFL, see `fonts/OFL.txt`) |
| [tools/pixel-ce-font.py](tools/pixel-ce-font.py) | Rebuilds `ScalearPixelCE.ttf` (Python, no dependencies) |

To add a scale or chord, add an entry to [src/catalog.js](src/catalog.js). A formula is a list of interval ids such as `1 b3 4 #4 5 b7`. Spelling, boxes, voicings, notation and catalog cards all derive from it.

To add a language, copy [src/lang/cs.js](src/lang/cs.js), translate it, and list it in `LANGS` in [src/i18n.js](src/i18n.js), in the imports of [src/main.js](src/main.js) and in `FILES` in [sw.js](sw.js). Missing strings fall back to English.

To add an instrument or tuning, add it to [src/instruments.js](src/instruments.js). Strings are listed in physical order as note names (`G4 C4 E4 A4`). Append `:5` to a string that starts at the 5th fret, like the banjo's drone (`G4:5`).
