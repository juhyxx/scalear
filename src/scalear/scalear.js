var Scalear = {
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
	defaults: {
		fretCount: 12,
		rootNote: 0,
		scale: 0,
		namesVisible: true,
		instrument: 0
	},
	intervals: [
		'1', //0
		'2♭', //1
		'2♯', //2
		'3♭', //3
		'3♯', //4
		'4', //5
		'4♯', //6
		'5', //7
		'6♭', //8
		'6♯', //9
		'7♭', //10
		'7♯', //11
		'8', //12
	],
	instruments: [{
		id: 0,
		name: 'Standard (Guitar)',
		group: 'guitar',
		tunning: [4, 11, 7, 2, 9, 4]
	}, {
		id: 1,
		name: 'Open D (Guitar)',
		group: 'guitar',
		tunning: [2, 9, 2, 6, 9, 2]
	}, {
		id: 2,
		name: 'Open C (Guitar)',
		group: 'guitar',
		tunning: [0, 4, 7, 0, 4, 7]
	}, {
		id: 3,
		name: 'Open G (Guitar)',
		group: 'guitar',
		tunning: [2, 7, 2, 7, 11, 2]
	}, {
		id: 4,
		group: 'bass',
		name: 'Standard  (Bass)',
		tunning: [7, 2, 9, 4]
	}, {
		id: 5,
		group: 'bass',
		name: '5-string (Bass)',
		tunning: [7, 2, 9, 4, 11]
	}, {
		id: 6,
		group: 'bass',
		name: '6-string (Bass)',
		tunning: [0, 7, 2, 9, 4, 11]
	}, {
		id: 7,
		group: 'other',
		name: 'Ukulele GCEA',
		tunning: [4, 9, 0, 7]
	}, {
		id: 8,
		group: 'other',
		name: 'Violin',
		tunning: [4, 9, 2, 7]
	}],
	scales: [{
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
		name: 'Aeolian',
		id: 2,
		notes: [0, 2, 3, 5, 7, 8, 10],
		group: 'scales'
	}, {
		id: 3,
		name: 'Harmonic minor',
		notes: [0, 2, 3, 5, 7, 8, 11],
		group: 'scales'
	}, {
		id: 4,
		name: 'Pentatonic major',
		notes: [0, 2, 4, 7, 9],
		group: 'scales'
	}, {
		id: 5,
		name: 'Pentatonic minor',
		notes: [0, 3, 5, 7, 10],
		group: 'scales'
	}, {
		id: 6,
		name: 'Pentatonic blues',
		notes: [0, 3, 5, 6, 7, 10],
		group: 'scales'
	}, {
		id: 7,
		name: 'Major chord',
		notes: [0, 4, 7],
		group: 'chords'
	}, {
		id: 8,
		name: 'Major 7th chord',
		notes: [0, 4, 7, 11],
		group: 'chords'
	}, {
		id: 9,
		name: 'Minor chord',
		notes: [0, 3, 7],
		group: 'chords'
	}, {
		id: 10,
		name: 'Dim chord',
		notes: [0, 3, 6],
		group: 'chords'
	}, {
		id: 11,
		name: 'Dim 7 chord',
		notes: [0, 3, 6, 9],
		group: 'chords'
	}, {
		id: 12,
		name: 'Whole tone',
		notes: [0, 2, 4, 6, 8, 10],
		group: 'scales'
	}, {
		id: 13,
		name: 'Chromatic',
		notes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
		group: 'scales'
	}],

};

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
	name: 'Other',
	group: 'other',
	options: function() {
		return Scalear.instruments.filter(function(item) {
			return item.group === 'other' ? item : undefined;
		});

	}()
}];

Scalear.scalesGrouped = [{
	name: 'Scales',
	group: 'scales',
	options: function() {
		return Scalear.scales.filter(function(item) {
			return item.group === 'scales' ? item : undefined;
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
}];