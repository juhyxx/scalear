
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


let scales = [
{
	name: 'Chromatic',
	notes: [C, Cis, D, Dis, E, F, Fis, G, Gis, A, Ais, B],
	group: 'scales'
},{
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
	group: 'dim-chords'
}, {
	name: 'Dim 7 chord',
	notes: [C, Dis, Fis, A],
	group: 'dim-chords'
}, {
	name: 'Whole tone',
	notes: [C, D, E, Fis, Gis, Ais],
	group: 'scales'
},  {
	name: 'Maj Min Hybrid Pentatonic',
	notes: [C, D, Dis, E, F, G, A, Ais],
	group: 'pentatonic'
}, {
	name: 'Bebop dominant',
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

scales.forEach((item, index) => {
	item.id = index;
});

let scalesGrouped = [{
	name: 'Diatonic Scales',
	group: 'dia-scales',
	options: function() {
		return scales.filter(function(item) {
			return item.group === 'dia-scales' ? item : undefined;
		});
	}()
}, {
	name: 'Other Scales',
	group: 'scales',
	options: function() {
		return scales.filter(function(item) {
			return item.group === 'scales' ? item : undefined;
		});
	}()
}, {
	name: 'Pentatonic scales',
	group: 'pentatonic',
	options: function() {
		return scales.filter(function(item) {
			return item.group === 'pentatonic' ? item : undefined;
		});
	}()
}, {
	name: 'Major Chords',
	group: 'major-chords',
	options: function() {
		return scales.filter(function(item) {
			return item.group === 'major-chords' ? item : undefined;
		});
	}()
}, {
	name: 'Minor Chords',
	group: 'minor-chords',
	options: function() {
		return scales.filter(function(item) {
			return item.group === 'minor-chords' ? item : undefined;
		});
	}()
}, {
	name: 'Dminished Chords',
	group: 'dim-chords',
	options: function() {
		return scales.filter(function(item) {
			return item.group === 'dim-chords' ? item : undefined;
		});
	}()
}, {
	name: 'Intervals',
	group: 'intervals',
	options: function() {
		return scales.filter(function(item) {
			return item.group === 'intervals' ? item : undefined;
		});
	}()
}
];

export  {scales, scalesGrouped};
