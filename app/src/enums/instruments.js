import {  C, Cis, D, Dis, E, F, Fis, G, Gis, A, Ais, B } from '../enums/notes.js';


let instruments = [{
	name: 'Guitar Standard',
	group: 'guitar',
	tunning: [E, B, G, D, A, E]
}, {
	name: 'Guitar 7-string',
	group: 'guitar',
	tunning: [E, B, G, D, A, E, B]
}, {
	name: 'Guitar Open D',
	group: 'guitar',
	tunning: [D, A, D, Fis, A, D]
}, {
	name: 'Guitar Open C',
	group: 'guitar',
	tunning: [C, E, G, C, E, G]
}, {
	name: 'Guitar Open G',
	group: 'guitar',
	tunning: [D, G, D, G, B, D]
}, {
	group: 'bass',
	name: 'Bass Standard',
	tunning: [G, D, A, E]
}, {
	group: 'bass',
	name: 'Bass 5-string',
	tunning: [G, D, A, E, B]
}, {
	group: 'bass',
	name: 'Bass 6-string',
	tunning: [C, G, D, A, E, B]
}, {
	group: 'ukulele',
	name: 'Ukulele GCEA',
	tunning: [A, E, C, G]
}, {
	group: 'ukulele',
	name: 'Ukulele DGBE',
	tunning: [E, B, G, Cis]
}, {
	group: 'ukulele',
	name: 'Ukulele ADG♭B',
	tunning: [B, Fis, D, A]
}, {
	group: 'other',
	name: 'Violin',
	tunning: [E, A, D, G],
	fretless: true
}, {
	group: 'other',
	name: 'Cello',
	tunning: [A, D, G, C],
	fretless: true
}, {
	group: 'other',
	name: 'Mandolin GDAE',
	tunning: [E, A, D, G]
}];

instruments.forEach((item, index) => {
	item.id = index;
});

let instrumentsGrouped = [{
	name: 'Guitar',
	group: 'guitar',
	options: function() {
		return instruments.filter(function(item) {
			return item.group === 'guitar' ? item : undefined;
		});
	}()
}, {
	name: 'Bass',
	group: 'bass',
	options: function() {
		return instruments.filter(function(item) {
			return item.group === 'bass' ? item : undefined;
		});
	}()
}, {
	name: 'Ukulele',
	group: 'ukulele',
	options: function() {
		return instruments.filter(function(item) {
			return item.group === 'ukulele' ? item : undefined;
		});
	}()
}, {
	name: 'Other',
	group: 'other',
	options: function() {
		return instruments.filter(function(item) {
			return item.group === 'other' ? item : undefined;
		});
	}()
}];

export  {instruments, instrumentsGrouped};
