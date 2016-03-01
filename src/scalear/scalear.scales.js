Scalear.scales = [{
	id: 0,
	name: 'Ionian',
	notes: [0, 2, 4, 5, 7, 9, 11],
	group: 'scales'
}, {
	id: 1,
	name: 'Dorian',
	notes: [0, 2, 3, 5, 7, 9, 10],
	group: 'scales'
}, {
	id: 2,
	name: 'Myxolidian',
	notes: [0, 2, 4, 5, 7, 9, 10],
	group: 'scales'
}, {
	name: 'Aeolian',
	id: 3,
	notes: [0, 2, 3, 5, 7, 8, 10],
	group: 'scales'
}, {
	id: 4,
	name: 'Melodic minor',
	notes: [0, 2, 3, 5, 7, 9, 11],
	group: 'scales'
}, {
	id: 5,
	name: 'Harmonic minor',
	notes: [0, 2, 3, 5, 7, 8, 11],
	group: 'scales'
}, {
	id: 6,
	name: 'Pentatonic major',
	notes: [0, 2, 4, 7, 9],
	group: 'pentatonic'
}, {
	id: 7,
	name: 'Pentatonic minor',
	notes: [0, 3, 5, 7, 10],
	group: 'pentatonic'
}, {
	id: 8,
	name: 'Pentatonic blues',
	notes: [0, 3, 5, 6, 7, 10],
	group: 'pentatonic'
}, {
	id: 9,
	name: 'Major chord',
	notes: [0, 4, 7],
	group: 'major-chords'
}, {
	id: 10,
	name: 'Major 7th chord',
	notes: [0, 4, 7, 11],
	group: 'major-chords'
}, {
	id: 11,
	name: 'Major 9th chord',
	notes: [0, 4, 7, 11, 14],
	group: 'major-chords'
}, {
	id: 12,
	name: 'Major 11th chord',
	notes: [0, 4, 7, 11, 14, 17],
	group: 'major-chords'
}, {
	id: 13,
	name: 'Major 13th chord',
	notes: [0, 4, 7, 11, 14, 17, 21],
	group: 'major-chords'
}, {
	id: 14,
	name: 'Minor chord',
	notes: [0, 3, 7],
	group: 'minor-chords'
}, {
	id: 15,
	name: 'Minor 7th chord',
	notes: [0, 3, 7, 11],
	group: 'minor-chords'
}, {
	id: 16,
	name: 'Minor 9th chord',
	notes: [0, 3, 7, 11, 14],
	group: 'minor-chords'
}, {
	id: 17,
	name: 'Minor 11th chord',
	notes: [0, 3, 7, 11, 14, 17],
	group: 'minor-chords'
}, {
	id: 18,
	name: 'Minor 13th chord',
	notes: [0, 3, 7, 11, 14, 17, 21],
	group: 'minor-chords'
}, {
	id: 19,
	name: 'Dim chord',
	notes: [0, 3, 6],
	group: 'chords'
}, {
	id: 20,
	name: 'Dim 7 chord',
	notes: [0, 3, 6, 9],
	group: 'chords'
}, {
	id: 21,
	name: 'Whole tone',
	notes: [0, 2, 4, 6, 8, 10],
	group: 'scales'
}, {
	id: 22,
	name: 'Chromatic',
	notes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
	group: 'scales'
}, {
	id: 23,
	name: 'Maj Min Hybrid Pentatonic',
	notes: [0, 2, 3, 4, 5, 7, 9, 10],
	group: 'pentatonic'
}];

Scalear.scalesGrouped = [{
		name: 'Scales',
		group: 'scales',
		options: function() {
			return Scalear.scales.filter(function(item) {
				return item.group === 'scales' ? item : undefined;
			});
		}()
	},

	{
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
	}
];
