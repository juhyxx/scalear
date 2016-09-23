let Scalear = {
	version: '0.5.1',
	defaults: {
		highlighted: undefined,
		fretCount: 12,
		rootNote: 0,
		scale: 0,
		namesVisible: true,
		instrument: 0,
		neckType: 'gibson'
	},
	notes: [
		'C', //0
		'C♯', //1
		'D', //2
		'D♯', //3
		'E', //4
		'F', //5
		'F♯', //6
		'G', //7
		'G♯', //8
		'A', //9
		'A♯', //10
		'B' //11
	],

	intervals: [
		'1', //0
		'2♭', //1
		'2♯', //2
		'3♭', //3
		'3♯', //4
		'4', //5
		'5♭', //6
		'5', //7
		'6♭', //8
		'6♯', //9
		'7♭', //10
		'7♯', //11
		'8', //12,
		'9♭', //13,
		'9♯', //14,
		'10♭', //15,
		'10♯', //16
		'11' //17
	]

};


const C = 0;
const Cis = 1;
const D = 2;
const Dis = 3;
const E = 4;
const F = 5;
const Fis = 6;
const G = 7;
const Gis = 8;
const A = 9;
const Ais = 10;
const B = 11;


Scalear.scales = [{
	name: 'Minor second (m2)',
	notes: [C, Cis],
	group: 'intervals'
}, {
	name: 'Major second (M2)',
	notes: [C, D],
	group: 'intervals'
}, {
	name: 'Minor  Third (m3)',
	notes: [C, Dis],
	group: 'intervals'
}, {
	name: 'Major Third (M3)',
	notes: [C, E],
	group: 'intervals'
}, {
	name: 'Perfect fourth (P4)',
	notes: [C, F],
	group: 'intervals'
}, {
	name: 'Tritone (d5)',
	notes: [C, Fis],
	group: 'intervals'
}, {
	name: 'Perfect fifth (P5)',
	notes: [C, G],
	group: 'intervals'
}, {
	name: 'Minor sixth (m6)',
	notes: [C, Gis],
	group: 'intervals'
}, {
	name: 'Major sixth (M6)',
	notes: [C, A],
	group: 'intervals'
}, {
	name: 'Minor seventh (m7)',
	notes: [C, Ais],
	group: 'intervals'
}, {
	name: 'Major seventh (M7)',
	notes: [C, B],
	group: 'intervals'
}, {
	name: 'Octave',
	notes: [C, 12],
	group: 'intervals'
}, {
	name: 'Ionian (I)',
	notes: [C, D, E, F, G, A, B],
	group: 'dia-scales'
}, {
	name: 'Dorian (II)',
	notes: [C, D, Dis, F, G, A, Ais],
	group: 'dia-scales'
}, {
	name: 'Phrygian (III)',
	notes: [C, Cis, Dis, F, G, Gis, Ais],
	group: 'dia-scales'
}, {
	name: 'Lydian (IV)',
	notes: [C, D, E, Fis, G, A, B],
	group: 'dia-scales'
}, {
	name: 'Myxolidian (V)',
	notes: [C, D, E, F, G, A, Ais],
	group: 'dia-scales'
}, {
	name: 'Aeolian (VI)',
	notes: [C, D, Dis, F, G, Gis, Ais],
	group: 'dia-scales'
}, {
	name: 'Locrian (VII)',
	notes: [C, Cis, Dis, F, Fis, Gis, Ais],
	group: 'dia-scales'
}, {
	name: 'Melodic minor',
	notes: [C, D, Dis, F, G, A, B],
	group: 'scales'
}, {
	name: 'Harmonic minor',
	notes: [C, D, Dis, F, G, Gis, B],
	group: 'scales'
}, {
	name: 'Pentatonic major',
	notes: [C, D, E, G, A],
	group: 'pentatonic'
}, {
	name: 'Pentatonic minor',
	notes: [C, Dis, F, G, Dis],
	group: 'pentatonic'
}, {
	name: 'Pentatonic blues',
	notes: [C, Dis, F, Fis, G, Ais],
	group: 'pentatonic'
}, {
	name: 'Major chord',
	notes: [C, E, G],
	group: 'major-chords'
}, {
	name: 'Major 7th chord',
	notes: [C, E, G, B],
	group: 'major-chords'
}, {
	name: 'Major 9th chord',
	notes: [C, E, G, B, 14],
	group: 'major-chords'
}, {
	name: 'Major 11th chord',
	notes: [C, E, G, B, 14, 17],
	group: 'major-chords'
}, {
	name: 'Major 13th chord',
	notes: [C, E, G, B, 14, 17, 21],
	group: 'major-chords'
}, {
	name: 'Minor chord',
	notes: [C, Dis, G],
	group: 'minor-chords'
}, {
	name: 'Minor 7th chord',
	notes: [C, Dis, G, B],
	group: 'minor-chords'
}, {
	name: 'Minor 9th chord',
	notes: [C, Dis, G, B, 14],
	group: 'minor-chords'
}, {
	name: 'Minor 11th chord',
	notes: [C, Dis, G, B, 14, 17],
	group: 'minor-chords'
}, {
	name: 'Minor 13th chord',
	notes: [C, Dis, G, B, 14, 17, 21],
	group: 'minor-chords'
}, {
	name: 'Dim chord',
	notes: [C, Dis, Fis],
	group: 'chords'
}, {
	name: 'Dim 7 chord',
	notes: [C, Dis, Fis, A],
	group: 'chords'
}, {
	name: 'Whole tone',
	notes: [C, D, E, Fis, Gis, Ais],
	group: 'scales'
}, {
	name: 'Chromatic',
	notes: [C, Cis, D, Dis, E, F, Fis, G, Gis, A, Ais, B],
	group: 'scales'
}, {
	name: 'Maj Min Hybrid Pentatonic',
	notes: [C, D, Dis, E, F, G, A, Ais],
	group: 'pentatonic'
}, {
	name: 'Bebop dominant ',
	notes: [C, D, E, F, G, A, Ais, B],
	group: 'scales'
}, {
	name: 'Spanish gypsy scale',
	notes: [C, Cis, E, F, G, Gis, Ais],
	group: 'scales'
}, {
	name: 'Hungarian gypsy scale',
	notes: [C, D, Dis, Fis, G, Gis, Ais],
	group: 'scales'
}];

Scalear.scales.forEach((item, index) => {
	item.id = index;
});

Scalear.scalesGrouped = [{
	name: 'Diatonic Scales',
	group: 'dia-scales',
	options: function() {
		return Scalear.scales.filter(function(item) {
			return item.group === 'dia-scales' ? item : undefined;
		});
	}()
}, {
	name: 'Other Scales',
	group: 'scales',
	options: function() {
		return Scalear.scales.filter(function(item) {
			return item.group === 'scales' ? item : undefined;
		});
	}()
}, {
	name: 'Pentatonic scales',
	group: 'pentatonic',
	options: function() {
		return Scalear.scales.filter(function(item) {
			return item.group === 'pentatonic' ? item : undefined;
		});
	}()
}, {
	name: 'Major Chords',
	group: 'major-chords',
	options: function() {
		return Scalear.scales.filter(function(item) {
			return item.group === 'major-chords' ? item : undefined;
		});
	}()
}, {
	name: 'Minor Chords',
	group: 'minor-chords',
	options: function() {
		return Scalear.scales.filter(function(item) {
			return item.group === 'minor-chords' ? item : undefined;
		});
	}()
}, {
	name: 'Chords',
	group: 'chords',
	options: function() {
		return Scalear.scales.filter(function(item) {
			return item.group === 'chords' ? item : undefined;
		});
	}()
}, {
	name: 'Intervals',
	group: 'intervals',
	options: function() {
		return Scalear.scales.filter(function(item) {
			return item.group === 'intervals' ? item : undefined;
		});
	}()
}
];

Scalear.instruments = [{
	name: 'Guitar Standard',
	group: 'guitar',
	tunning: [E, B, G, D, A, E]
}, {
	name: 'Guitar 7-string',
	group: 'guitar',
	tunning: [E, B, G, D, A, E, B]
}, {
	name: 'Guitar Open D',
	group: 'guitar',
	tunning: [D, A, D, Fis, A, D]
}, {
	name: 'Guitar Open C',
	group: 'guitar',
	tunning: [C, E, G, C, E, G]
}, {
	name: 'Guitar Open G',
	group: 'guitar',
	tunning: [D, G, D, G, B, D]
}, {
	group: 'bass',
	name: 'Bass Standard',
	tunning: [G, D, A, E]
}, {
	group: 'bass',
	name: 'Bass Fretless',
	tunning: [G, D, A, E]
}, {
	group: 'bass',
	name: 'Bass 5-string',
	tunning: [G, D, A, E, B]
}, {
	group: 'bass',
	name: 'Bass 6-string',
	tunning: [C, G, D, A, E, B]
}, {
	group: 'ukulele',
	name: 'Ukulele GCEA',
	tunning: [A, E, C, G]
}, {
	group: 'ukulele',
	name: 'Ukulele DGBE',
	tunning: [E, B, G, Cis]
}, {
	group: 'ukulele',
	name: 'Ukulele ADG♭B',
	tunning: [B, Fis, D, A]
}, {
	group: 'other',
	name: 'Violin',
	tunning: [E, A, D, G]
}, {
	group: 'other',
	name: 'Cello',
	tunning: [A, D, G, C]
}, {
	group: 'other',
	name: 'Mandolin GDAE',
	tunning: [E, A, D, G]
}];

Scalear.instruments.forEach((item, index) => {
	item.id = index;
});

Scalear.instrumentsGrouped = [{
	name: 'Guitar',
	group: 'guitar',
	options: function() {
		return Scalear.instruments.filter(function(item) {
			return item.group === 'guitar' ? item : undefined;
		});
	}()
}, {
	name: 'Bass',
	group: 'bass',
	options: function() {
		return Scalear.instruments.filter(function(item) {
			return item.group === 'bass' ? item : undefined;
		});
	}()
}, {
	name: 'Ukulele',
	group: 'ukulele',
	options: function() {
		return Scalear.instruments.filter(function(item) {
			return item.group === 'ukulele' ? item : undefined;
		});
	}()
}, {
	name: 'Other',
	group: 'other',
	options: function() {
		return Scalear.instruments.filter(function(item) {
			return item.group === 'other' ? item : undefined;
		});
	}()
}];

export default Scalear;
