<p align="center"><img src="logo.svg" width="320" alt="Scalear"></p>

A client-only PWA for players of fretted and bowed string instruments. It shows scales, chords and intervals on the neck and in staff notation, and it works offline once loaded.

The name is a pun: *scalare* is the angelfish in the logo, and the app is about scales.

## Features

- **Instruments**: guitar (6, 7 and 8-string), bass (4, 5 and 6-string), ukulele, baritone ukulele, mandolin, Irish bouzouki, 5-string banjo, tenor banjo, violin, viola, cello and double bass.
  - Each has its common tunings, plus a **custom** tuning you set string by string.
  - Re-entrant tunings (high-G ukulele), the banjo's short drone string and fretless necks are drawn as they really are.
- **Instruments page**: instrument and tuning are chosen once, so they have their own page next to the Catalog, with every tuning's notes and the custom tuning editor. Explore just shows what's in use; tap it to change.
- **Choosing what to show**: scales, chords and intervals are picked in the Catalog. In Explore, the display (fixed width) opens the Catalog and `[` `]` step through the list. Beside it, on top, are the root keys (natural notes in white, sharps and flats grey) and the accidentals (automatic, ♯ or ♭), with the notes, the instrument and Play under them. Labels sit under the neck, which gets the full width.
- **Finder** (a chord finder): tap one note per string, as in a chord shape, and it names the chord. Inversions are written as slash chords (C/E), and so is a chord over a bass note that isn't part of it (D9/G, F/G). Shapes that leave out a tone players often drop are still found (C⁷ no 5, C¹³ no 5, 9). A shape with no name in the catalogue is written as its bass and the intervals above it, C (1 ♭5 7). Every played note is shown with its degree (E G♯ D F𝄪 · 1 3 ♭7 ♯9). It also gives the interval between two notes and the chords and scales that contain the notes, each a link into Explore. Strings left unplayed are marked ×. The shape is kept in the URL (`#/finder?n=1:3,2:2,3:0`, string:fret from the lowest string).
- **Languages**: English, Czech, German, Spanish, French, Italian, Brazilian Portuguese and Chinese, as in [dots](../dots). The interface, catalogue and instrument names are all translated, and the language follows the browser unless you pick one.
- **Note names**: C D E F G A **B**, C D E F G A **H** (German and Central European: H is B natural, B is B♭) or solfège (Do Re Mi…). Each language starts with its usual style.
- **Left-handed**: one switch (on the Instruments page and in Settings) mirrors the neck, the chord diagrams and the tab labels, horizontally or vertically.
- **Fretboard**: the whole neck, or one position at a time with the rest dimmed. Roots are drawn as squares, other notes as dots. Label notes by name, by interval, or not at all, and optionally colour them by degree. Tap any fret to hear it.
- **Sound**: a sampled archtop jazz guitar ([Shinyguitar](https://github.com/sfzinstruments/karoryfer.shinyguitar) by Karoryfer Samples, CC0), 17 notes a minor third apart, repitched for the notes between. A plucked-string synth stands in until they load.
- **Positions (boxes)**: every shape wherever it fits on the neck, numbered from the nut up, so C major starts in open position rather than at the 7th fret.
  - *CAGED*: five positions built from the scale's pentatonic boxes, with the remaining tones filled in (called "5 positions" outside the guitar family).
  - *2, 3 or 4 notes per string*. Instruments tuned in fifths (mandolin, violin family) default to 4 per string.
- **Chords**: every chord tone across the neck, plus playable voicings as chord diagrams (tap one to hear it).
- **Favorites**: star any scale, chord or interval on the Explore display or on its Catalog card. Starred items are listed first in each Catalog tab, in whatever root is chosen, and are kept in this browser. On linear tunings the root is in the bass; re-entrant tunings have no real bass string, so that rule is dropped there.
- **Intervals**: every place an interval occurs, with semitones, inversion, quality and an ear-training song.
- **Note wheel**: the twelve notes round a circle, chromatic or in fifths, lit like the fretboard.
- **Notation**: treble, alto (viola) or bass clef, with the octave transposition of guitar, bass and banjo. Spelling is correct (B♯ in C♯ harmonic minor, double accidentals, courtesy naturals). The staff always shows what **Play** plays.
- **Catalog**: 85 scales (including the modes of major, melodic minor, harmonic minor, harmonic major and double harmonic, jazz pentatonics and Indian thaats), 52 chords (up to 13ths, altered dominants and 7alt) and 22 intervals, searchable, with notes spelled from the current root. Chord cards lead with the symbol.
- **Chord search**: type a chord the way it's written on a chart, in either style, and it opens in that root: `Am7`, `C-7`, `F#^7`, `Bbø7` or `Bbh7`, `Eb7#9`, `G7alt`, `Co7`, `C+7`; with German note names `Fis-7` or `B7` (B♭7), with solfège `Re-7`. Keyboard stand-ins: `-` for −, `^` for Δ, `h` for ø, `o` for °.
- **Cross-links**: a scale lists its diatonic triads and 7ths with roman numerals, plus the modes that share its notes. A chord lists the scales that fit it.
- **Shareable state**: the current view is kept in the URL hash, for example `#/explore?k=scale&id=dorian&r=D&v=boxes&b=2`. Position numbers count from the nut, so links made before positions covered the whole neck may open a different box.
- **Keyboard**: `←` `→` change position or voicing, `[` `]` change item, `p` plays.

- **Chord symbols**: extensions are written as an index (Amin⁷, Cmaj⁷♯⁵). Settings switches between standard (Cmin⁷, Cmaj⁷, Cdim⁷, Cmin⁷♭⁵) and jazz symbols (C−⁷, CΔ⁷, C°⁷, Cø⁷, C−Δ⁷, C°Δ⁷, C+⁷).

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
| [src/audio.js](src/audio.js) | Sampled jazz guitar, with a Karplus–Strong plucked string as the stand-in |
| [src/store.js](src/store.js) | State, localStorage, URL hash |
| [src/explore.js](src/explore.js), [src/catalogView.js](src/catalogView.js), [src/finder.js](src/finder.js), [src/instrumentsView.js](src/instrumentsView.js), [src/settings.js](src/settings.js) | Views |
| [src/main.js](src/main.js) | Shell, routing, service worker, install prompt |
| [sw.js](sw.js) | Service worker: offline cache, one per deploy |
| [src/version.js](src/version.js) | Release shown in Settings (`dev` locally, stamped on deploy) |
| [logo.svg](logo.svg), `icons/` | Logo and app icons (the icons use the logo's fish) |
| `screenshots/` | Shown in the install dialog (wide 1280×800, narrow 390×844 at 2×); published but not cached offline |
| [src/i18n.js](src/i18n.js), `src/lang/` | Translations (same mechanism as dots); English UI strings in `en.js`, other languages also translate catalogue names by id |
| `fonts/` | [Silkscreen](https://github.com/googlefonts/silkscreen), self-hosted for offline use, plus `ScalearPixelCE.ttf` with the Czech letters and arrows Silkscreen lacks (both SIL OFL, see `fonts/OFL.txt`) |
| [src/easter.js](src/easter.js) | Easter eggs: the Hendrix chord (any 7♯9) and the Hard Day's Night chord (G7sus4) greet whoever finds them in the Finder, with pixel pictures |
| [src/roots.js](src/roots.js) | The root picker and accidentals switch, shared by Explore and the Catalog |
| [tools/pixel-ce-font.py](tools/pixel-ce-font.py) | Rebuilds `ScalearPixelCE.ttf` (Python, no dependencies) |
| `audio/guitar/` | The jazz guitar samples, one MP3 per sampled note, named by MIDI number (612 KB, cached offline) |
| [tools/guitar-samples.sh](tools/guitar-samples.sh) | Rebuilds `audio/guitar/` from Shinyguitar (needs curl and ffmpeg) |

To add a scale or chord, add an entry to [src/catalog.js](src/catalog.js). A formula is a list of interval ids such as `1 b3 4 #4 5 b7`. Spelling, boxes, voicings, notation and catalog cards all derive from it. A chord's `symbol` is written in the standard style with `m` for minor; the jazz style and the chord search derive from it.

To add a language, copy [src/lang/cs.js](src/lang/cs.js), translate it, and list it in `LANGS` in [src/i18n.js](src/i18n.js), in the imports of [src/main.js](src/main.js) and in `FILES` in [sw.js](sw.js). Missing strings fall back to English.

To add an instrument or tuning, add it to [src/instruments.js](src/instruments.js). Strings are listed in physical order as note names (`G4 C4 E4 A4`). Append `:5` to a string that starts at the 5th fret, like the banjo's drone (`G4:5`).
