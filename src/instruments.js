// Instruments and tunings. Strings are listed in physical order, starting with the string nearest
// the ceiling when playing: the lowest on most instruments, the re-entrant high G on a ukulele.
// A token like "G4:5" is a short string that starts at fret 5 (the 5-string banjo's drone).
import { parseNote, noteName, sharpNote, flatNote } from './theory.js';
import { t, tr } from './i18n.js';

export const INSTRUMENTS = [
  { id: 'guitar', name: 'Guitar', group: 'Guitars', clef: 'treble', transpose: 12, frets: 15, tunings: [
    { id: 'standard', name: 'Standard', notes: 'E2 A2 D3 G3 B3 E4' },
    { id: 'drop-d', name: 'Drop D', notes: 'D2 A2 D3 G3 B3 E4' },
    { id: 'half-down', name: 'Half step down', notes: 'Eb2 Ab2 Db3 Gb3 Bb3 Eb4' },
    { id: 'whole-down', name: 'Whole step down', notes: 'D2 G2 C3 F3 A3 D4' },
    { id: 'drop-c', name: 'Drop C', notes: 'C2 G2 C3 F3 A3 D4' },
    { id: 'dadgad', name: 'DADGAD', notes: 'D2 A2 D3 G3 A3 D4' },
    { id: 'dadgde', name: 'DADGDE', notes: 'D2 A2 D3 G3 D4 E4' },
    { id: 'open-g', name: 'Open G', notes: 'D2 G2 D3 G3 B3 D4' },
    { id: 'open-d', name: 'Open D', notes: 'D2 A2 D3 F#3 A3 D4' },
    { id: 'open-e', name: 'Open E', notes: 'E2 B2 E3 G#3 B3 E4' },
    { id: 'open-c', name: 'Open C', notes: 'C2 G2 C3 G3 C4 E4' },
    { id: 'all-fourths', name: 'All fourths', notes: 'E2 A2 D3 G3 C4 F4' },
  ] },
  { id: 'guitar7', group: 'Guitars', name: '7-string guitar', clef: 'treble', transpose: 12, frets: 15, tunings: [
    { id: 'standard', name: 'Standard', notes: 'B1 E2 A2 D3 G3 B3 E4' },
    { id: 'drop-a', name: 'Drop A', notes: 'A1 E2 A2 D3 G3 B3 E4' },
  ] },
  { id: 'guitar8', group: 'Guitars', name: '8-string guitar', clef: 'treble', transpose: 12, frets: 15, tunings: [
    { id: 'standard', name: 'Standard', notes: 'F#1 B1 E2 A2 D3 G3 B3 E4' },
    { id: 'drop-e', name: 'Drop E', notes: 'E1 B1 E2 A2 D3 G3 B3 E4' },
  ] },
  { id: 'bass4', group: 'Basses', name: 'Bass (4-string)', clef: 'bass', transpose: 12, frets: 15, tunings: [
    { id: 'standard', name: 'Standard', notes: 'E1 A1 D2 G2' },
    { id: 'drop-d', name: 'Drop D', notes: 'D1 A1 D2 G2' },
    { id: 'half-down', name: 'Half step down', notes: 'Eb1 Ab1 Db2 Gb2' },
    { id: 'bead', name: 'BEAD', notes: 'B0 E1 A1 D2' },
  ] },
  { id: 'bass5', group: 'Basses', name: 'Bass (5-string)', clef: 'bass', transpose: 12, frets: 15, tunings: [
    { id: 'standard', name: 'Standard', notes: 'B0 E1 A1 D2 G2' },
    { id: 'high-c', name: 'High C', notes: 'E1 A1 D2 G2 C3' },
  ] },
  { id: 'bass6', group: 'Basses', name: 'Bass (6-string)', clef: 'bass', transpose: 12, frets: 15, tunings: [
    { id: 'standard', name: 'Standard', notes: 'B0 E1 A1 D2 G2 C3' },
  ] },
  { id: 'ukulele', group: 'Ukuleles', name: 'Ukulele', clef: 'treble', transpose: 0, frets: 12, tunings: [
    { id: 'standard', name: 'Standard (high G)', notes: 'G4 C4 E4 A4' },
    { id: 'low-g', name: 'Low G', notes: 'G3 C4 E4 A4' },
    { id: 'd-tuning', name: 'D tuning', notes: 'A4 D4 F#4 B4' },
  ] },
  { id: 'baritone-uke', group: 'Ukuleles', name: 'Baritone ukulele', clef: 'treble', transpose: 12, frets: 15, tunings: [
    { id: 'standard', name: 'Standard', notes: 'D3 G3 B3 E4' },
  ] },
  { id: 'mandolin', group: 'Folk', name: 'Mandolin', clef: 'treble', transpose: 0, frets: 15, tunings: [
    { id: 'standard', name: 'Standard', notes: 'G3 D4 A4 E5' },
    { id: 'cross-a', name: 'Cross A', notes: 'A3 E4 A4 E5' },
  ] },
  { id: 'bouzouki', group: 'Folk', name: 'Irish bouzouki', clef: 'treble', transpose: 12, frets: 15, tunings: [
    { id: 'gdad', name: 'GDAD', notes: 'G2 D3 A3 D4' },
    { id: 'gdae', name: 'GDAE', notes: 'G2 D3 A3 E4' },
    { id: 'adad', name: 'ADAD', notes: 'A2 D3 A3 D4' },
  ] },
  { id: 'banjo', group: 'Folk', name: 'Banjo (5-string)', clef: 'treble', transpose: 12, frets: 15, tunings: [
    { id: 'open-g', name: 'Open G', notes: 'G4:5 D3 G3 B3 D4' },
    { id: 'double-c', name: 'Double C', notes: 'G4:5 C3 G3 C4 D4' },
    { id: 'open-d', name: 'Open D', notes: 'F#4:5 D3 F#3 A3 D4' },
    { id: 'g-modal', name: 'G modal (sawmill)', notes: 'G4:5 D3 G3 C4 D4' },
  ] },
  { id: 'tenor-banjo', group: 'Folk', name: 'Tenor banjo', clef: 'treble', transpose: 12, frets: 15, tunings: [
    { id: 'standard', name: 'Standard (CGDA)', notes: 'C3 G3 D4 A4' },
    { id: 'irish', name: 'Irish (GDAE)', notes: 'G2 D3 A3 E4' },
  ] },
  { id: 'violin', group: 'Bowed', name: 'Violin', clef: 'treble', transpose: 0, frets: 12, fretless: true, tunings: [
    { id: 'standard', name: 'Standard', notes: 'G3 D4 A4 E5' },
  ] },
  { id: 'viola', group: 'Bowed', name: 'Viola', clef: 'alto', transpose: 0, frets: 12, fretless: true, tunings: [
    { id: 'standard', name: 'Standard', notes: 'C3 G3 D4 A4' },
  ] },
  { id: 'cello', group: 'Bowed', name: 'Cello', clef: 'bass', transpose: 0, frets: 12, fretless: true, tunings: [
    { id: 'standard', name: 'Standard', notes: 'C2 G2 D3 A3' },
  ] },
  { id: 'double-bass', group: 'Bowed', name: 'Double bass', clef: 'bass', transpose: 12, frets: 12, fretless: true, tunings: [
    { id: 'standard', name: 'Standard', notes: 'E1 A1 D2 G2' },
    { id: 'solo', name: 'Solo', notes: 'F#1 B1 E2 A2' },
  ] },
];

export const CUSTOM = 'custom';

export const findInstrument = id => INSTRUMENTS.find(i => i.id === id) || INSTRUMENTS[0];

// Display names; a translation may be specific to one instrument ("tuning.ukulele.standard").
export const instrumentName = inst => tr(`instrument.${inst.id}`, inst.name);
export const instrumentGroup = group => tr(`instgroup.${group}`, group);
export const tuningName = (inst, tuning) =>
  tuning.id === CUSTOM ? t('tuning.custom') : tr(`tuning.${inst.id}.${tuning.id}`, tr(`tuning.${tuning.id}`, tuning.name));

export const findTuning = (inst, id) => inst.tunings.find(t => t.id === id) || inst.tunings[0];

function parseStrings(notes) {
  return notes.split(' ').map(tok => {
    const [n, from] = tok.split(':');
    const p = parseNote(n);
    return { open: p.midi, from: Number(from || 0), name: noteName(p.note) };
  });
}

/**
 * Everything the views need to know about the current instrument.
 * strings: [{ open, from, name }] in physical order; shape: the open pitches with re-entrant strings
 * moved by octaves so they climb in physical order (used to compute box shapes).
 */
export function makeNeck(instrumentId, tuningId, custom) {
  const instrument = findInstrument(instrumentId);
  const base = findTuning(instrument, tuningId === CUSTOM ? null : tuningId);
  let strings = parseStrings(base.notes);
  const isCustom = tuningId === CUSTOM && Array.isArray(custom) && custom.length === strings.length;
  if (isCustom) {
    strings = strings.map((s, i) => ({ ...s, open: custom[i], name: noteName(sharpNote(custom[i] % 12)) }));
  }
  const shape = [];
  strings.forEach((s, i) => {
    let p = s.open;
    const prev = shape[i - 1];
    if (prev !== undefined) {
      while (p <= prev) p += 12;
      while (p - 12 > prev) p -= 12;
    }
    shape.push(p);
  });
  // Tunings mostly in fifths (mandolin, violin family) want different box systems than guitar-like ones.
  const steps = shape.slice(1).map((p, i) => p - shape[i]).sort((a, b) => a - b);
  const fifths = steps.length > 0 && steps[Math.floor(steps.length / 2)] >= 7;
  return {
    instrument,
    tuning: isCustom ? { id: CUSTOM, name: 'Custom', notes: '' } : base,
    strings,
    shape,
    fifths,
    reentrant: strings.some((s, i) => shape[i] !== s.open),
    fretless: Boolean(instrument.fretless),
    clef: instrument.clef,
    transpose: instrument.transpose,
  };
}

// Sounding pitch at neck fret f, or null where a short string doesn't reach.
export const pitchAt = (string, f) => (f < string.from ? null : string.open + f - string.from);

export const openStringName = (midi, flats) => noteName((flats ? flatNote : sharpNote)(((midi % 12) + 12) % 12));
