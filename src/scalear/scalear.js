var Scalear = {
	notes: [
		'C', 'C♯ ', 'D', 'D♯ ', 'E', 'F', 'F♯ ', 'G', 'G♯ ', 'A', 'A♯ ', 'B'
	],
	defaults: {
		stringCount: 6,
		fretCount: 12,
		tunning: [4, 11, 7, 2, 9, 4],
		rootNote: 0
	},
	scales: [{
		name: "Aeolioan",
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