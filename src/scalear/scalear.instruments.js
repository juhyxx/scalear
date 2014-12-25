Scalear.instruments = [{
	id: 0,
	name: 'Standard (Guitar)',
	group: 'guitar',
	tunning: [4, 11, 7, 2, 9, 4]
}, {
	id: 1,
	name: '7-string (Guitar)',
	group: 'guitar',
	tunning: [4, 11, 7, 2, 9, 4, 11]
}, {
	id: 2,
	name: 'Open D (Guitar)',
	group: 'guitar',
	tunning: [2, 9, 2, 6, 9, 2]
}, {
	id: 3,
	name: 'Open C (Guitar)',
	group: 'guitar',
	tunning: [0, 4, 7, 0, 4, 7]
}, {
	id: 4,
	name: 'Open G (Guitar)',
	group: 'guitar',
	tunning: [2, 7, 2, 7, 11, 2]
}, {
	id: 5,
	group: 'bass',
	name: 'Standard (Bass)',
	tunning: [7, 2, 9, 4]
}, {
	id: 6,
	group: 'bass',
	name: 'Fretless (Bass)',
	tunning: [7, 2, 9, 4]
}, {
	id: 7,
	group: 'bass',
	name: '5-string (Bass)',
	tunning: [7, 2, 9, 4, 11]
}, {
	id: 8,
	group: 'bass',
	name: '6-string (Bass)',
	tunning: [0, 7, 2, 9, 4, 11]
}, {
	id: 9,
	group: 'ukulele',
	name: 'Ukulele GCEA',
	tunning: [9, 4, 0, 7]
}, {
	id: 10,
	group: 'ukulele',
	name: 'Ukulele DGBE',
	tunning: [4, 11, 7, 2]
}, {
	id: 11,
	group: 'ukulele',
	name: 'Ukulele ADG♭B',
	tunning: [11, 6, 2, 9]
}, {
	id: 12,
	group: 'other',
	name: 'Violin',
	tunning: [4, 9, 2, 7]
}];

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