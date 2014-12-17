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
		'B' //1
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
		name: 'Standard',
		tunning: [4, 11, 7, 2, 9, 4]
	}, {
		id: 1,
		name: 'Open D',
		tunning: [2, 9, 2, 6, 9, 2]
	}, {
		id: 2,
		name: 'Open C',
		tunning: [0, 4, 7, 0, 4, 7]
	}, {
		id: 3,
		name: 'Open G',
		tunning: [2, 7, 2, 7, 11, 2]
	}, {
		id: 4,
		name: 'Standard',
		tunning: [7, 2, 9, 4]
	}, {
		id: 5,
		name: '5-string',
		tunning: [7, 2, 9, 4, 11]
	}, {
		id: 6,
		name: '6-string',
		tunning: [0, 7, 2, 9, 4, 11]
	}, {
		id: 7,
		name: 'Ukulele GCEA',
		tunning: [4, 9, 0, 7]
	}, {
		id: 8,
		name: 'Violin',
		tunning: [4, 9, 2, 7]
	}],
	scales: [{
		name: "Ionian",
		notes: [0, 2, 4, 5, 7, 9, 11]
	}, {
		name: "Dorian",
		notes: [0, 2, 3, 5, 7, 9, 10]
	}, {
		name: "Aeolian",
		notes: [0, 2, 3, 5, 7, 8, 10]
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
		name: "Dim chord",
		notes: [0, 3, 6]
	}, {
		name: "Dim 7 chord",
		notes: [0, 3, 6, 9]
	}, {
		name: "Whole tone",
		notes: [0, 2, 4, 6, 8, 10]
	}, {
		name: "Chromatic",
		notes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
	}]
};

Scalear.instrumentsGrouped = [{
		name: "Guitar",
		options: [
			Scalear.instruments[0],
			Scalear.instruments[1],
			Scalear.instruments[2],
			Scalear.instruments[3]
		]
	}, {
		name: "Bass",
		options: [
			Scalear.instruments[4],
			Scalear.instruments[5],
			Scalear.instruments[6]
		]
	}, {
		name: "Other",
		options: [
			Scalear.instruments[7],
			Scalear.instruments[8]
		]
	}

];