var Scalear = {
	notes: [
		'C', 'C♯ ', 'D', 'D♯ ', 'E', 'F', 'F♯ ', 'G', 'G♯ ', 'A', 'A♯ ', 'B'
	],
	defaults: {
		fretCount: 12,
		rootNote: 0,
		scale: 0,
		namesVisible: true,
		instrument: 0
	},
	instruments: [{
		name: 'Guitar',
		tunning: [4, 11, 7, 2, 9, 4]
	}, {
		name: 'Guitar Open D',
		tunning: [2, 9, 2, 6, 9, 2]
	}, {
		name: 'Guitar Open C',
		tunning: [0, 4, 7, 0, 4, 7]
	}, {
		name: 'Guitar Open G',
		tunning: [2, 7, 2, 7, 11, 2]
	}, {
		name: 'Bass Guitar',
		tunning: [7, 2, 9, 4]
	}, {
		name: 'Bass Guitar 5-string',
		tunning: [7, 2, 9, 4, 11]
	}, {
		name: 'Bass Guitar 6-string',
		tunning: [0, 7, 2, 9, 4, 11]
	}, {
		name: 'Ukulele GCEA',
		tunning: [4, 9, 0, 7]
	}, {
		name: 'Violin',
		tunning: [4, 9, 2, 7]
	}],
	scales: [{
		name: "Ionian",
		notes: [0, 2, 4, 5, 7, 9, 11]
	}, {
		name: "Harmonic minor",
		notes: [0, 2, 3, 5, 7, 8, 11]
	}, {
		name: "Pentatonic major",
		notes: [0, 2, 4, 7, 9]
	}, {
		name: "Pentatonic minor",
		notes: [0, 3, 5, 7, 10]
	}, {
		name: "Pentatonic blues",
		notes: [0, 3, 5, 6, 7, 10]
	}, {
		name: "Major chord",
		notes: [0, 4, 7]
	}, {
		name: "Major 7th chord",
		notes: [0, 4, 7, 11]
	}, {
		name: "Minor chord",
		notes: [0, 3, 7]
	}, {
		name: "Whole tone",
		notes: [0, 2, 4, 6, 8, 10]
	}, {
		name: "Chromatic",
		notes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
	}]
};