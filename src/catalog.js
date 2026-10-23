// Catalog data. Formulas are interval ids relative to the root (see theory.parseInterval).
// Names and descriptions are English; translations override them by id (see the helpers at the end).
import { t, tr } from './i18n.js';

export const SCALES = [
  // Diatonic modes
  { id: 'major', name: 'Major', aliases: ['Ionian', 'Diatonic'], group: 'Diatonic modes', formula: '1 2 3 4 5 6 7',
    desc: 'The reference scale of Western harmony. Bright and resolved; every other formula is described relative to it.' },
  { id: 'dorian', name: 'Dorian', group: 'Diatonic modes', formula: '1 2 b3 4 5 6 b7',
    desc: 'Minor with a natural 6th. The sound of minor funk, soul and modal jazz: minor, but with a lift.' },
  { id: 'phrygian', name: 'Phrygian', group: 'Diatonic modes', formula: '1 b2 b3 4 5 b6 b7',
    desc: 'Minor with a flat 2nd right above the root. Dark and tense; common in metal and Spanish-flavoured music.' },
  { id: 'lydian', name: 'Lydian', group: 'Diatonic modes', formula: '1 2 3 #4 5 6 7',
    desc: 'Major with a raised 4th. Floating and dreamy; a favourite of film composers. Fits maj7♯11 chords.' },
  { id: 'mixolydian', name: 'Mixolydian', group: 'Diatonic modes', formula: '1 2 3 4 5 6 b7',
    desc: 'Major with a flat 7th. The dominant-7th sound of blues-rock, country and folk.' },
  { id: 'aeolian', name: 'Natural minor', aliases: ['Aeolian'], group: 'Diatonic modes', formula: '1 2 b3 4 5 b6 b7',
    desc: 'The relative minor of the major scale. The default minor sound in rock and pop.' },
  { id: 'locrian', name: 'Locrian', group: 'Diatonic modes', formula: '1 b2 b3 4 b5 b6 b7',
    desc: 'The only diatonic mode with a diminished 5th, so its tonic chord is unstable. Mostly used over m7♭5 chords.' },

  // Pentatonic & blues
  { id: 'major-pentatonic', name: 'Major pentatonic', group: 'Pentatonic & blues', formula: '1 2 3 5 6',
    desc: 'The major scale without its 4th and 7th. No half steps, so nothing clashes. Country, pop and major-key soloing.' },
  { id: 'minor-pentatonic', name: 'Minor pentatonic', group: 'Pentatonic & blues', formula: '1 b3 4 5 b7',
    desc: 'The workhorse of rock and blues soloing. Same notes as the major pentatonic a minor 3rd higher.' },
  { id: 'blues', name: 'Blues', aliases: ['Minor blues', 'Hexatonic blues'], group: 'Pentatonic & blues', formula: '1 b3 4 b5 5 b7',
    desc: 'Minor pentatonic plus the ♭5 "blue note", usually played as a passing tone between the 4th and 5th.' },
  { id: 'major-blues', name: 'Major blues', group: 'Pentatonic & blues', formula: '1 2 b3 3 5 6',
    desc: 'Major pentatonic plus the ♭3, typically used to slide or bend into the major 3rd.' },
  { id: 'suspended-pentatonic', name: 'Suspended pentatonic', aliases: ['Egyptian'], group: 'Pentatonic & blues', formula: '1 2 4 5 b7',
    desc: 'A pentatonic with no 3rd, so it is neither major nor minor. Works over sus chords.' },
  { id: 'dominant-pentatonic', name: 'Dominant pentatonic', group: 'Pentatonic & blues', formula: '1 2 3 5 b7',
    desc: 'Outlines a dominant 9 chord. A compact way to play Mixolydian over 7th chords.' },
  { id: 'hirajoshi', name: 'Hirajoshi', group: 'Pentatonic & blues', formula: '1 2 b3 5 b6',
    desc: 'Japanese pentatonic with a dark, koto-like colour.' },
  { id: 'in-sen', name: 'In Sen', group: 'Pentatonic & blues', formula: '1 b2 4 5 b7',
    desc: 'Japanese pentatonic associated with the shakuhachi. Sparse and haunting.' },
  { id: 'iwato', name: 'Iwato', group: 'Pentatonic & blues', formula: '1 b2 4 b5 b7',
    desc: 'Japanese pentatonic with both a ♭2 and a ♭5. Very dark.' },
  { id: 'kumoi', name: 'Kumoi', group: 'Pentatonic & blues', formula: '1 2 b3 5 6',
    desc: 'Melodic minor without its 4th and 7th.' },
  { id: 'minor-6-pentatonic', name: 'Minor 6th pentatonic', group: 'Pentatonic & blues', formula: '1 b3 4 5 6',
    desc: 'Minor pentatonic with a natural 6th instead of the ♭7: the Dorian sound in five notes.' },
  { id: 'yo', name: 'Yo', group: 'Pentatonic & blues', formula: '1 2 4 5 6',
    desc: 'Japanese pentatonic used in folk songs; bright, with no 3rd.' },
  { id: 'ryukyu', name: 'Ryukyu', aliases: ['Okinawan'], group: 'Pentatonic & blues', formula: '1 3 4 5 7',
    desc: 'Okinawan pentatonic: a major scale without its 2nd and 6th.' },
  { id: 'pelog', name: 'Balinese pelog', group: 'Pentatonic & blues', formula: '1 b2 b3 5 b6',
    desc: 'A Western approximation of the gamelan pelog tuning.' },
  { id: 'chinese', name: 'Chinese', aliases: ['Lydian pentatonic'], group: 'Pentatonic & blues', formula: '1 3 #4 5 7',
    desc: 'A Lydian-flavoured pentatonic with a raised 4th.' },
  { id: 'major-hexatonic', name: 'Major hexatonic', group: 'Pentatonic & blues', formula: '1 2 3 4 5 6',
    desc: 'The major scale without its 7th: major pentatonic plus the 4th. Common in folk and rock melodies.' },
  { id: 'minor-hexatonic', name: 'Minor hexatonic', group: 'Pentatonic & blues', formula: '1 2 b3 4 5 b7',
    desc: 'Natural minor without its 6th: minor pentatonic plus the 2nd. Fits both Dorian and Aeolian.' },

  // Melodic minor modes
  { id: 'melodic-minor', name: 'Melodic minor', aliases: ['Jazz minor'], group: 'Melodic minor modes', formula: '1 2 b3 4 5 6 7',
    desc: 'Minor with a natural 6th and 7th (the ascending form, used both ways in jazz). Fits m(maj7) and m6 chords.' },
  { id: 'dorian-b2', name: 'Dorian ♭2', aliases: ['Phrygian ♮6'], group: 'Melodic minor modes', formula: '1 b2 b3 4 5 6 b7',
    desc: 'Mode 2 of melodic minor. Used over sus4♭9 chords.' },
  { id: 'lydian-augmented', name: 'Lydian augmented', group: 'Melodic minor modes', formula: '1 2 3 #4 #5 6 7',
    desc: 'Mode 3 of melodic minor. Fits maj7♯5 chords.' },
  { id: 'lydian-dominant', name: 'Lydian dominant', aliases: ['Overtone', 'Acoustic'], group: 'Melodic minor modes', formula: '1 2 3 #4 5 6 b7',
    desc: 'Mode 4 of melodic minor: Mixolydian with a ♯4. The standard choice over 7♯11 chords.' },
  { id: 'mixolydian-b6', name: 'Mixolydian ♭6', aliases: ['Aeolian dominant'], group: 'Melodic minor modes', formula: '1 2 3 4 5 b6 b7',
    desc: 'Mode 5 of melodic minor: a major 3rd with a minor-key upper half.' },
  { id: 'locrian-n2', name: 'Locrian ♮2', aliases: ['Half-diminished'], group: 'Melodic minor modes', formula: '1 2 b3 4 b5 b6 b7',
    desc: 'Mode 6 of melodic minor. A smoother alternative to Locrian over m7♭5 chords.' },
  { id: 'altered', name: 'Altered', aliases: ['Super Locrian'], group: 'Melodic minor modes', formula: '1 b2 #2 3 b5 #5 b7',
    desc: 'Mode 7 of melodic minor. Contains every altered tension for a dominant chord: ♭9, ♯9, ♭5 and ♯5. Spelled here as chord tones.' },

  // Harmonic minor modes
  { id: 'harmonic-minor', name: 'Harmonic minor', group: 'Harmonic minor modes', formula: '1 2 b3 4 5 b6 7',
    desc: 'Natural minor with a raised 7th, giving a leading tone and the characteristic augmented 2nd between ♭6 and 7.' },
  { id: 'locrian-n6', name: 'Locrian ♮6', group: 'Harmonic minor modes', formula: '1 b2 b3 4 b5 6 b7',
    desc: 'Mode 2 of harmonic minor.' },
  { id: 'ionian-sharp5', name: 'Ionian ♯5', aliases: ['Ionian augmented'], group: 'Harmonic minor modes', formula: '1 2 3 4 #5 6 7',
    desc: 'Mode 3 of harmonic minor: major with an augmented 5th.' },
  { id: 'dorian-sharp4', name: 'Dorian ♯4', aliases: ['Ukrainian Dorian', 'Romanian minor', 'Nikriz'], group: 'Harmonic minor modes', formula: '1 2 b3 #4 5 6 b7',
    desc: 'Mode 4 of harmonic minor. Common in Eastern European folk music and klezmer.' },
  { id: 'phrygian-dominant', name: 'Phrygian dominant', aliases: ['Spanish Phrygian', 'Spanish gypsy', 'Freygish', 'Hijaz', 'Ahava Raba'], group: 'Harmonic minor modes', formula: '1 b2 3 4 5 b6 b7',
    desc: 'Mode 5 of harmonic minor. Heard in flamenco, klezmer and Middle Eastern music; also fits V7♭9 in minor keys.' },
  { id: 'lydian-sharp2', name: 'Lydian ♯2', group: 'Harmonic minor modes', formula: '1 #2 3 #4 5 6 7',
    desc: 'Mode 6 of harmonic minor.' },
  { id: 'ultralocrian', name: 'Ultralocrian', aliases: ['Altered ♭♭7'], group: 'Harmonic minor modes', formula: '1 b2 b3 b4 b5 b6 bb7',
    desc: 'Mode 7 of harmonic minor. Fits diminished 7th chords.' },

  // Harmonic major modes
  { id: 'harmonic-major', name: 'Harmonic major', group: 'Harmonic major modes', formula: '1 2 3 4 5 b6 7',
    desc: 'Major with a lowered 6th: a bright scale with a dark turn.' },
  { id: 'dorian-b5', name: 'Dorian ♭5', group: 'Harmonic major modes', formula: '1 2 b3 4 b5 6 b7',
    desc: 'Mode 2 of harmonic major. Fits m7♭5 chords with a natural 6th.' },
  { id: 'phrygian-b4', name: 'Phrygian ♭4', group: 'Harmonic major modes', formula: '1 b2 b3 b4 5 b6 b7',
    desc: 'Mode 3 of harmonic major. Its ♭4 sounds as a major 3rd above a minor one.' },
  { id: 'lydian-b3', name: 'Lydian ♭3', aliases: ['Lydian diminished'], group: 'Harmonic major modes', formula: '1 2 b3 #4 5 6 7',
    desc: 'Mode 4 of harmonic major: minor with a raised 4th and major 7th.' },
  { id: 'mixolydian-b2', name: 'Mixolydian ♭2', group: 'Harmonic major modes', formula: '1 b2 3 4 5 6 b7',
    desc: 'Mode 5 of harmonic major. Fits 7♭9 chords with a natural 13th.' },
  { id: 'lydian-augmented-s2', name: 'Lydian augmented ♯2', group: 'Harmonic major modes', formula: '1 #2 3 #4 #5 6 7',
    desc: 'Mode 6 of harmonic major.' },
  { id: 'locrian-bb7', name: 'Locrian ♭♭7', group: 'Harmonic major modes', formula: '1 b2 b3 4 b5 b6 bb7',
    desc: 'Mode 7 of harmonic major. Fits diminished 7th chords.' },

  // Double harmonic modes
  { id: 'double-harmonic', name: 'Double harmonic major', aliases: ['Byzantine', 'Arabic', 'Gypsy major'], group: 'Double harmonic modes', formula: '1 b2 3 4 5 b6 7',
    desc: 'Two augmented 2nds give it a strongly Middle Eastern sound.' },
  { id: 'lydian-s2-s6', name: 'Lydian ♯2 ♯6', group: 'Double harmonic modes', formula: '1 #2 3 #4 5 #6 7',
    desc: 'Mode 2 of double harmonic major.' },
  { id: 'ultraphrygian', name: 'Ultraphrygian', group: 'Double harmonic modes', formula: '1 b2 b3 b4 5 b6 bb7',
    desc: 'Mode 3 of double harmonic major. Very dark; fits diminished 7th chords.' },
  { id: 'hungarian-minor', name: 'Hungarian minor', aliases: ['Gypsy minor', 'Double harmonic minor'], group: 'Double harmonic modes', formula: '1 2 b3 #4 5 b6 7',
    desc: 'Mode 4 of double harmonic major: harmonic minor with a raised 4th, so it has two augmented 2nds.' },
  { id: 'oriental', name: 'Oriental', group: 'Double harmonic modes', formula: '1 b2 3 4 b5 6 b7',
    desc: 'Mode 5 of double harmonic major. A dominant sound with ♭2 and ♭5.' },
  { id: 'ionian-s2-s5', name: 'Ionian ♯2 ♯5', group: 'Double harmonic modes', formula: '1 #2 3 4 #5 6 7',
    desc: 'Mode 6 of double harmonic major.' },
  { id: 'locrian-bb3-bb7', name: 'Locrian ♭♭3 ♭♭7', group: 'Double harmonic modes', formula: '1 b2 bb3 4 b5 b6 bb7',
    desc: 'Mode 7 of double harmonic major.' },

  // Other scales
  { id: 'hungarian-major', name: 'Hungarian major', group: 'Other scales', formula: '1 #2 3 #4 5 6 b7',
    desc: 'Lydian dominant with a raised 2nd.' },
  { id: 'neapolitan-minor', name: 'Neapolitan minor', group: 'Other scales', formula: '1 b2 b3 4 5 b6 7',
    desc: 'Harmonic minor with a lowered 2nd.' },
  { id: 'neapolitan-major', name: 'Neapolitan major', group: 'Other scales', formula: '1 b2 b3 4 5 6 7',
    desc: 'Melodic minor with a lowered 2nd.' },
  { id: 'persian', name: 'Persian', group: 'Other scales', formula: '1 b2 3 4 b5 b6 7',
    desc: 'Double harmonic major with a lowered 5th.' },
  { id: 'enigmatic', name: 'Enigmatic', group: 'Other scales', formula: '1 b2 3 #4 #5 #6 7',
    desc: 'Verdi’s “scala enigmatica”. Unusual and unstable.' },
  { id: 'major-locrian', name: 'Major Locrian', group: 'Other scales', formula: '1 2 3 4 b5 b6 b7',
    desc: 'Major lower half with a Locrian upper half. Fits 7♭5 and 7♯5 chords.' },
  { id: 'leading-whole-tone', name: 'Leading whole tone', group: 'Other scales', formula: '1 2 3 #4 #5 #6 7',
    desc: 'The whole-tone scale plus a leading tone below the octave.' },
  { id: 'romanian-major', name: 'Romanian major', group: 'Other scales', formula: '1 b2 3 #4 5 6 b7',
    desc: 'Lydian dominant with a lowered 2nd. Heard in Romanian and Balkan folk music.' },
  { id: 'hungarian-gypsy', name: 'Hungarian gypsy', group: 'Other scales', formula: '1 2 b3 #4 5 b6 b7',
    desc: 'Hungarian minor with a ♭7 instead of the major 7th. Heard in Roma and Central European folk music.' },
  { id: 'spanish-8', name: 'Spanish 8-tone', group: 'Other scales', formula: '1 b2 #2 3 4 b5 b6 b7',
    desc: 'Phrygian with both a minor and a major 3rd. Used in flamenco.' },

  // Symmetric
  { id: 'whole-tone', name: 'Whole tone', group: 'Symmetric', formula: '1 2 3 #4 #5 b7',
    desc: 'Six notes, each a whole step apart. Ambiguous and dreamlike; fits 7♯5 and 9♯5 chords.' },
  { id: 'diminished-wh', name: 'Diminished (whole–half)', group: 'Symmetric', formula: '1 2 b3 4 b5 b6 6 7',
    desc: 'Alternating whole and half steps. Fits diminished 7th chords.' },
  { id: 'diminished-hw', name: 'Diminished (half–whole)', aliases: ['Dominant diminished'], group: 'Symmetric', formula: '1 b2 #2 3 #4 5 6 b7',
    desc: 'Alternating half and whole steps. Fits 13♭9 and 7♭9 dominant chords.' },
  { id: 'augmented', name: 'Augmented', group: 'Symmetric', formula: '1 #2 3 5 #5 7',
    desc: 'Alternating minor 3rds and half steps: two augmented triads a minor 3rd apart.' },
  { id: 'prometheus', name: 'Prometheus', group: 'Symmetric', formula: '1 2 3 #4 6 b7',
    desc: 'Hexatonic scale built from Scriabin’s “mystic chord”.' },
  { id: 'tritone', name: 'Tritone', group: 'Symmetric', formula: '1 b2 3 b5 5 b7',
    desc: 'Two major triads a tritone apart (C and G♭ in C). Fits 7♭9♯11 chords.' },
  { id: 'six-tone-symmetrical', name: 'Six-tone symmetrical', group: 'Symmetric', formula: '1 b2 3 4 #5 6',
    desc: 'Two augmented triads a half step apart.' },
  { id: 'two-semitone-tritone', name: 'Two-semitone tritone', group: 'Symmetric', formula: '1 b2 2 #4 5 b6',
    desc: 'Two clusters of three semitones a tritone apart (C D♭ D and F♯ G A♭).' },
  { id: 'chromatic', name: 'Chromatic', group: 'Symmetric', formula: '1 b2 2 b3 3 4 b5 5 b6 6 b7 7',
    desc: 'All twelve notes.' },

  // Bebop
  { id: 'bebop-dominant', name: 'Bebop dominant', group: 'Bebop', formula: '1 2 3 4 5 6 b7 7',
    desc: 'Mixolydian with an added major 7th passing tone, so chord tones fall on the beat in eighth-note lines.' },
  { id: 'bebop-major', name: 'Bebop major', group: 'Bebop', formula: '1 2 3 4 5 #5 6 7',
    desc: 'Major with an added ♯5 passing tone.' },
  { id: 'bebop-dorian', name: 'Bebop dorian', aliases: ['Major–minor hybrid pentatonic'], group: 'Bebop', formula: '1 2 b3 3 4 5 6 b7',
    desc: 'Dorian with an added major 3rd passing tone.' },
  { id: 'bebop-melodic-minor', name: 'Bebop melodic minor', group: 'Bebop', formula: '1 2 b3 4 5 #5 6 7',
    desc: 'Melodic minor with an added ♯5 passing tone.' },
  { id: 'bebop-harmonic-minor', name: 'Bebop harmonic minor', group: 'Bebop', formula: '1 2 b3 4 5 b6 b7 7',
    desc: 'Harmonic minor with an added ♭7 passing tone.' },
];

// `optional` tones may be left out of voicings. In chords of four or more notes the 5th is optional too.
export const CHORDS = [
  { id: 'maj', symbol: '', name: 'Major', group: 'Triads', formula: '1 3 5',
    desc: 'Root, major 3rd and perfect 5th. Stable and bright.' },
  { id: 'min', symbol: 'm', name: 'Minor', group: 'Triads', formula: '1 b3 5',
    desc: 'Root, minor 3rd and perfect 5th.' },
  { id: 'dim', symbol: '°', name: 'Diminished', group: 'Triads', formula: '1 b3 b5',
    desc: 'Two stacked minor 3rds. Tense; wants to resolve.' },
  { id: 'aug', symbol: '+', name: 'Augmented', group: 'Triads', formula: '1 3 #5',
    desc: 'Two stacked major 3rds. Symmetric, so any note can act as the root.' },
  { id: 'sus2', symbol: 'sus2', name: 'Suspended 2nd', group: 'Triads', formula: '1 2 5',
    desc: 'The 3rd replaced by a major 2nd. Open and ambiguous.' },
  { id: 'sus4', symbol: 'sus4', name: 'Suspended 4th', group: 'Triads', formula: '1 4 5',
    desc: 'The 3rd replaced by a perfect 4th, which traditionally resolves down to the 3rd.' },
  { id: 'power', symbol: '5', name: 'Power chord', group: 'Triads', formula: '1 5', maxStrings: 3,
    desc: 'Root and 5th only. Neither major nor minor; the backbone of rock rhythm guitar.' },

  { id: '6', symbol: '6', name: 'Major 6th', group: 'Sixths & added', formula: '1 3 5 6',
    desc: 'Major triad plus a major 6th. A sweet, vintage tonic sound.' },
  { id: 'm6', symbol: 'm6', name: 'Minor 6th', group: 'Sixths & added', formula: '1 b3 5 6',
    desc: 'Minor triad plus a major 6th. Pairs with the melodic minor and Dorian scales.' },
  { id: '69', symbol: '6/9', name: 'Six-nine', group: 'Sixths & added', formula: '1 3 5 6 9',
    desc: 'Major 6th plus a 9th: a rich, unresolved major tonic.' },
  { id: 'add9', symbol: 'add9', name: 'Added 9th', group: 'Sixths & added', formula: '1 3 5 9',
    desc: 'Major triad plus a 9th, without a 7th.' },
  { id: 'madd9', symbol: 'm(add9)', name: 'Minor added 9th', group: 'Sixths & added', formula: '1 b3 5 9',
    desc: 'Minor triad plus a 9th, without a 7th.' },

  { id: 'maj7', symbol: 'maj7', name: 'Major 7th', group: 'Sevenths', formula: '1 3 5 7',
    desc: 'Major triad plus a major 7th. Smooth and lush; the I and IV chords in jazz.' },
  { id: '7', symbol: '7', name: 'Dominant 7th', group: 'Sevenths', formula: '1 3 5 b7',
    desc: 'Major triad plus a minor 7th. Its tritone (3rd–♭7) pulls toward the tonic; also the basic blues chord.' },
  { id: 'm7', symbol: 'm7', name: 'Minor 7th', group: 'Sevenths', formula: '1 b3 5 b7',
    desc: 'Minor triad plus a minor 7th. The ii chord in a ii–V–I.' },
  { id: 'mmaj7', symbol: 'm(maj7)', name: 'Minor-major 7th', group: 'Sevenths', formula: '1 b3 5 7',
    desc: 'Minor triad plus a major 7th. A dark, cinematic tonic.' },
  { id: 'm7b5', symbol: 'm7♭5', name: 'Half-diminished', aliases: ['ø7'], group: 'Sevenths', formula: '1 b3 b5 b7',
    desc: 'Diminished triad plus a minor 7th. The ii chord in a minor ii–V–i.' },
  { id: 'dim7', symbol: '°7', name: 'Diminished 7th', group: 'Sevenths', formula: '1 b3 b5 bb7',
    desc: 'Stacked minor 3rds. Symmetric: the same shape repeats every three frets.' },
  { id: '7sus4', symbol: '7sus4', name: 'Dominant 7th sus4', group: 'Sevenths', formula: '1 4 5 b7',
    desc: 'Dominant 7th with the 3rd replaced by a 4th.' },
  { id: 'maj7s5', symbol: 'maj7♯5', name: 'Augmented major 7th', group: 'Sevenths', formula: '1 3 #5 7',
    desc: 'Augmented triad plus a major 7th. Pairs with Lydian augmented.' },
  { id: '7s5', symbol: '7♯5', name: 'Augmented 7th', aliases: ['aug7', '+7'], group: 'Sevenths', formula: '1 3 #5 b7',
    desc: 'Dominant 7th with a raised 5th. Pairs with the whole-tone scale.' },
  { id: '7b5', symbol: '7♭5', name: 'Dominant 7th flat 5', group: 'Sevenths', formula: '1 3 b5 b7',
    desc: 'Dominant 7th with a lowered 5th. Symmetric under a tritone.' },

  { id: 'maj9', symbol: 'maj9', name: 'Major 9th', group: 'Extended', formula: '1 3 5 7 9',
    desc: 'Major 7th plus a 9th.' },
  { id: '9', symbol: '9', name: 'Dominant 9th', group: 'Extended', formula: '1 3 5 b7 9',
    desc: 'Dominant 7th plus a 9th. A funk and soul staple.' },
  { id: 'm9', symbol: 'm9', name: 'Minor 9th', group: 'Extended', formula: '1 b3 5 b7 9',
    desc: 'Minor 7th plus a 9th.' },
  { id: '9sus4', symbol: '9sus4', name: 'Dominant 9th sus4', group: 'Extended', formula: '1 4 5 b7 9',
    desc: 'Dominant 9th with a 4th instead of a 3rd.' },
  { id: '11', symbol: '11', name: 'Dominant 11th', group: 'Extended', formula: '1 5 b7 9 11', optional: ['5', '9'],
    desc: 'Usually voiced without the 3rd, which clashes with the 11th; close to a 9sus4.' },
  { id: 'm11', symbol: 'm11', name: 'Minor 11th', group: 'Extended', formula: '1 b3 5 b7 9 11', optional: ['5', '9'],
    desc: 'Minor 9th plus an 11th. Wide and airy.' },
  { id: 'maj11', symbol: 'maj11', name: 'Major 11th', group: 'Extended', formula: '1 3 5 7 9 11', optional: ['5', '9'],
    desc: 'Major 9th plus an 11th. The 11th clashes with the major 3rd, so players often raise it (maj7♯11) or leave the 3rd out.' },
  { id: 'maj13', symbol: 'maj13', name: 'Major 13th', group: 'Extended', formula: '1 3 5 7 9 13', optional: ['5', '9'],
    desc: 'Major 9th plus a 13th; the 11th is omitted.' },
  { id: '13', symbol: '13', name: 'Dominant 13th', group: 'Extended', formula: '1 3 5 b7 9 13', optional: ['5', '9'],
    desc: 'Dominant 9th plus a 13th; the 11th is omitted. Root, 3rd, ♭7 and 13 carry the sound.' },
  { id: 'm13', symbol: 'm13', name: 'Minor 13th', group: 'Extended', formula: '1 b3 5 b7 9 13', optional: ['5', '9'],
    desc: 'Minor 9th plus a 13th. The Dorian chord.' },

  { id: '7b9', symbol: '7♭9', name: 'Dominant 7th flat 9', group: 'Altered', formula: '1 3 5 b7 b9',
    desc: 'Dominant 7th with a ♭9. Resolves strongly, especially to minor.' },
  { id: '7s9', symbol: '7♯9', name: 'Dominant 7th sharp 9', group: 'Altered', formula: '1 3 5 b7 #9',
    desc: 'Dominant 7th with a ♯9 (heard as a minor 3rd over a major 3rd). A bluesy, aggressive sound.' },
  { id: '7s11', symbol: '7♯11', name: 'Dominant 7th sharp 11', group: 'Altered', formula: '1 3 5 b7 #11',
    desc: 'Dominant 7th with a ♯11. Pairs with Lydian dominant.' },
];

export const INTERVALS = [
  { id: 'm2', short: 'm2', name: 'Minor second', group: 'Simple', formula: '1 b2', inversion: 'M7', quality: 'Dissonance',
    mnemonic: 'Jaws theme', desc: 'One semitone, the smallest interval in Western music.' },
  { id: 'M2', short: 'M2', name: 'Major second', group: 'Simple', formula: '1 2', inversion: 'm7', quality: 'Dissonance',
    mnemonic: 'Happy Birthday', desc: 'A whole step: two frets on one string.' },
  { id: 'm3', short: 'm3', name: 'Minor third', group: 'Simple', formula: '1 b3', inversion: 'M6', quality: 'Imperfect consonance',
    mnemonic: 'Greensleeves', desc: 'Defines minor chords and scales.' },
  { id: 'M3', short: 'M3', name: 'Major third', group: 'Simple', formula: '1 3', inversion: 'm6', quality: 'Imperfect consonance',
    mnemonic: 'When the Saints Go Marching In', desc: 'Defines major chords and scales.' },
  { id: 'P4', short: 'P4', name: 'Perfect fourth', group: 'Simple', formula: '1 4', inversion: 'P5', quality: 'Perfect consonance (dissonant over the bass)',
    mnemonic: 'Here Comes the Bride', desc: 'The interval between most adjacent guitar strings.' },
  { id: 'A4', short: 'A4', name: 'Augmented fourth', aliases: ['Tritone'], group: 'Simple', formula: '1 #4', inversion: 'd5', quality: 'Dissonance',
    mnemonic: 'The Simpsons theme', desc: 'Three whole steps, exactly half an octave. The tension inside every dominant 7th chord.' },
  { id: 'd5', short: 'd5', name: 'Diminished fifth', aliases: ['Tritone'], group: 'Simple', formula: '1 b5', inversion: 'A4', quality: 'Dissonance',
    desc: 'Same pitch distance as the augmented 4th, spelled as a 5th: the ♭5 of diminished and half-diminished chords.' },
  { id: 'P5', short: 'P5', name: 'Perfect fifth', group: 'Simple', formula: '1 5', inversion: 'P4', quality: 'Perfect consonance',
    mnemonic: 'Twinkle Twinkle Little Star', desc: 'The most consonant interval after the octave. A power chord is a root and its 5th.' },
  { id: 'm6', short: 'm6', name: 'Minor sixth', group: 'Simple', formula: '1 b6', inversion: 'M3', quality: 'Imperfect consonance',
    mnemonic: 'The Entertainer (3rd to 4th note)', desc: 'Inverts to a major 3rd.' },
  { id: 'M6', short: 'M6', name: 'Major sixth', group: 'Simple', formula: '1 6', inversion: 'm3', quality: 'Imperfect consonance',
    mnemonic: 'My Bonnie Lies Over the Ocean', desc: 'Inverts to a minor 3rd.' },
  { id: 'm7', short: 'm7', name: 'Minor seventh', group: 'Simple', formula: '1 b7', inversion: 'M2', quality: 'Dissonance',
    mnemonic: 'Somewhere (West Side Story)', desc: 'The ♭7 of dominant and minor 7th chords.' },
  { id: 'M7', short: 'M7', name: 'Major seventh', group: 'Simple', formula: '1 7', inversion: 'm2', quality: 'Dissonance',
    desc: 'One semitone short of an octave. The 7th of maj7 chords and the leading tone of the major scale.' },
  { id: 'P8', short: 'P8', name: 'Octave', group: 'Simple', formula: '1 8', inversion: 'P1', quality: 'Perfect consonance',
    mnemonic: 'Somewhere Over the Rainbow', desc: 'Same note name, double the frequency.' },

  { id: 'm9', short: 'm9', name: 'Minor ninth', group: 'Compound', formula: '1 b9', inversion: 'M7', quality: 'Dissonance',
    desc: 'An octave plus a minor 2nd. The ♭9 of altered dominant chords.' },
  { id: 'M9', short: 'M9', name: 'Major ninth', group: 'Compound', formula: '1 9', inversion: 'm7', quality: 'Dissonance (mild)',
    desc: 'An octave plus a major 2nd. The 9th of add9 and 9 chords.' },
  { id: 'm10', short: 'm10', name: 'Minor tenth', group: 'Compound', formula: '1 b10', inversion: 'M6', quality: 'Imperfect consonance',
    desc: 'An octave plus a minor 3rd.' },
  { id: 'M10', short: 'M10', name: 'Major tenth', group: 'Compound', formula: '1 10', inversion: 'm6', quality: 'Imperfect consonance',
    desc: 'An octave plus a major 3rd. A warm, wide sound used in chord-melody playing.' },
  { id: 'P11', short: 'P11', name: 'Perfect eleventh', group: 'Compound', formula: '1 11', inversion: 'P5', quality: 'Perfect consonance',
    desc: 'An octave plus a perfect 4th. The 11th of m11 and sus chords.' },
  { id: 'A11', short: 'A11', name: 'Augmented eleventh', group: 'Compound', formula: '1 #11', inversion: 'd5', quality: 'Dissonance',
    desc: 'An octave plus a tritone. The ♯11 of Lydian chords.' },
  { id: 'P12', short: 'P12', name: 'Perfect twelfth', group: 'Compound', formula: '1 12', inversion: 'P4', quality: 'Perfect consonance',
    desc: 'An octave plus a perfect 5th.' },
  { id: 'm13', short: 'm13', name: 'Minor thirteenth', group: 'Compound', formula: '1 b13', inversion: 'M3', quality: 'Imperfect consonance',
    desc: 'An octave plus a minor 6th. The ♭13 of altered dominants.' },
  { id: 'M13', short: 'M13', name: 'Major thirteenth', group: 'Compound', formula: '1 13', inversion: 'm3', quality: 'Imperfect consonance',
    desc: 'An octave plus a major 6th. The 13th of 13 chords.' },
];

export const KINDS = {
  scale: { list: SCALES },
  chord: { list: CHORDS },
  interval: { list: INTERVALS },
};

// ---------- display text, translated where a translation exists

export const kindLabel = kind => t(`kind.${kind}`);
export const kindOne = kind => t(`kind.${kind}.one`);
export const nameOf = (kind, def) => tr(`${kind}.${def.id}`, def.name);
export const descOf = (kind, def) => tr(`${kind}.${def.id}.desc`, def.desc);
export const groupName = group => tr(`group.${group}`, group);
export const qualityName = def => tr(`quality.${def.quality}`, def.quality);

export const findDef = (kind, id) => KINDS[kind].list.find(d => d.id === id) || KINDS[kind].list[0];

export function groupsOf(list) {
  const groups = new Map();
  for (const d of list) {
    if (!groups.has(d.group)) groups.set(d.group, []);
    groups.get(d.group).push(d);
  }
  return groups;
}

// Chord symbol for display, in one of two styles:
//  standard – the pixel font has no lowercase, so a bare "m" would read as major: minor is "min"
//             (Amin7) while "maj" stays, and its ° looks like an asterisk, so "dim" too;
//  jazz     – C−7, CΔ7, Cø7, C°7, C−Δ7.
export function chordSymbol(def, style = 'standard') {
  if (style === 'jazz') {
    return def.symbol
      .replace(/^m7♭5/, 'ø7')
      .replace(/^m\(maj7\)/, '−Δ7')
      .replace(/^maj/, 'Δ')
      .replace(/^m/, '−');
  }
  return def.symbol.replace(/^m(?!aj)/, 'min').replace(/^°/, 'dim');
}

// Jazz glyphs the pixel font lacks, wrapped so they can be drawn in another face.
export const jazzGlyphs = html => html.replace(/[−Δø°]+/g, g => `<span class="jz">${g}</span>`);

// Chord symbol as HTML with the extensions as an index (superscript): "min<sup>7♭5</sup>", "<sup>7</sup>".
export function chordSymbolHtml(def, style = 'standard') {
  const [, quality = '', ext] = /^(min|dim|maj|sus|add|\+|−Δ|[−Δø°])?(.*)$/.exec(chordSymbol(def, style));
  return jazzGlyphs(quality) + (ext ? `<sup class="ext">${ext}</sup>` : '');
}

// Full name for an interval's short name, e.g. "M6" → "Major sixth".
export function intervalName(short) {
  const def = INTERVALS.find(i => i.short === short);
  return def ? nameOf('interval', def) : short === 'P1' ? t('interval.unison') : short;
}

// Display name of an item, e.g. "A Minor pentatonic", "C♯min7", "Perfect fifth".
export function itemTitle(kind, item, style) {
  if (kind === 'scale') return `${item.name} ${nameOf(kind, item.def)}`;
  if (kind === 'chord') return item.name + chordSymbol(item.def, style);
  return nameOf(kind, item.def);
}

// The same as HTML, with chord extensions raised. Names come from our own data, so they need no escaping.
export const itemTitleHtml = (kind, item, style) =>
  (kind === 'chord' ? item.name + chordSymbolHtml(item.def, style) : itemTitle(kind, item, style));
