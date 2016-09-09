let Scalear = {
	version: '0.4.12',
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

Scalear.scales.forEach((item, index) => {
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

Scalear.instruments = [{
	name: 'Standard (Guitar)',
	group: 'guitar',
	tunning: [4, 11, 7, 2, 9, 4]
}, {
	name: '7-string (Guitar)',
	group: 'guitar',
	tunning: [4, 11, 7, 2, 9, 4, 11]
}, {
	name: 'Open D (Guitar)',
	group: 'guitar',
	tunning: [2, 9, 2, 6, 9, 2]
}, {
	name: 'Open C (Guitar)',
	group: 'guitar',
	tunning: [0, 4, 7, 0, 4, 7]
}, {
	name: 'Open G (Guitar)',
	group: 'guitar',
	tunning: [2, 7, 2, 7, 11, 2]
}, {
	group: 'bass',
	name: 'Standard (Bass)',
	tunning: [7, 2, 9, 4]
}, {
	group: 'bass',
	name: 'Fretless (Bass)',
	tunning: [7, 2, 9, 4]
}, {
	group: 'bass',
	name: '5-string (Bass)',
	tunning: [7, 2, 9, 4, 11]
}, {
	group: 'bass',
	name: '6-string (Bass)',
	tunning: [0, 7, 2, 9, 4, 11]
}, {
	group: 'ukulele',
	name: 'Ukulele GCEA',
	tunning: [9, 4, 0, 7]
}, {
	group: 'ukulele',
	name: 'Ukulele DGBE',
	tunning: [4, 11, 7, 2]
}, {
	group: 'ukulele',
	name: 'Ukulele ADG♭B',
	tunning: [11, 6, 2, 9]
}, {
	group: 'other',
	name: 'Violin',
	tunning: [4, 9, 2, 7]
}, {
	group: 'other',
	name: 'Cello',
	tunning: [9, 2, 7, 0]
}, {
	group: 'other',
	name: 'Mandolin GDAE',
	tunning: [4, 9, 2, 7]
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
