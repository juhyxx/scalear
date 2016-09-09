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
