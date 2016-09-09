Scalear.scales = [{
	name: 'Ionian',
	notes: [0, 2, 4, 5, 7, 9, 11],
	group: 'scales'
}, {
	name: 'Dorian',
	notes: [0, 2, 3, 5, 7, 9, 10],
	group: 'scales'
}, {
	name: 'Myxolidian',
	notes: [0, 2, 4, 5, 7, 9, 10],
	group: 'scales'
}, {
	name: 'Aeolian',
	notes: [0, 2, 3, 5, 7, 8, 10],
	group: 'scales'
}, {
	name: 'Melodic minor',
	notes: [0, 2, 3, 5, 7, 9, 11],
	group: 'scales'
}, {
	name: 'Harmonic minor',
	notes: [0, 2, 3, 5, 7, 8, 11],
	group: 'scales'
}, {
	name: 'Pentatonic major',
	notes: [0, 2, 4, 7, 9],
	group: 'pentatonic'
}, {
	name: 'Pentatonic minor',
	notes: [0, 3, 5, 7, 10],
	group: 'pentatonic'
}, {
	name: 'Pentatonic blues',
	notes: [0, 3, 5, 6, 7, 10],
	group: 'pentatonic'
}, {
	name: 'Major chord',
	notes: [0, 4, 7],
	group: 'major-chords'
}, {
	name: 'Major 7th chord',
	notes: [0, 4, 7, 11],
	group: 'major-chords'
}, {
	name: 'Major 9th chord',
	notes: [0, 4, 7, 11, 14],
	group: 'major-chords'
}, {
	name: 'Major 11th chord',
	notes: [0, 4, 7, 11, 14, 17],
	group: 'major-chords'
}, {
	name: 'Major 13th chord',
	notes: [0, 4, 7, 11, 14, 17, 21],
	group: 'major-chords'
}, {
	name: 'Minor chord',
	notes: [0, 3, 7],
	group: 'minor-chords'
}, {
	name: 'Minor 7th chord',
	notes: [0, 3, 7, 11],
	group: 'minor-chords'
}, {
	name: 'Minor 9th chord',
	notes: [0, 3, 7, 11, 14],
	group: 'minor-chords'
}, {
	name: 'Minor 11th chord',
	notes: [0, 3, 7, 11, 14, 17],
	group: 'minor-chords'
}, {
	name: 'Minor 13th chord',
	notes: [0, 3, 7, 11, 14, 17, 21],
	group: 'minor-chords'
}, {
	name: 'Dim chord',
	notes: [0, 3, 6],
	group: 'chords'
}, {
	name: 'Dim 7 chord',
	notes: [0, 3, 6, 9],
	group: 'chords'
}, {
	name: 'Whole tone',
	notes: [0, 2, 4, 6, 8, 10],
	group: 'scales'
}, {
	name: 'Chromatic',
	notes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
	group: 'scales'
}, {
	name: 'Maj Min Hybrid Pentatonic',
	notes: [0, 2, 3, 4, 5, 7, 9, 10],
	group: 'pentatonic'
}];

Scalear.scales.forEach((item, index)=> {
	item.id = index;
});

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
