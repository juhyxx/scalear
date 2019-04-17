import { C, Cis, D, Dis, E, F, Fis, G, Gis, A, Ais, B } from '../enums/notes.js';

const sharp = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const flat = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];

const keys = {
	major: {
		[C]: sharp,
		[G]: sharp,
		[D]: sharp,
		[E]: sharp,
		[A]: sharp,
		[B]: sharp,
		[Fis]: sharp,

		[F]: flat,
		[Ais]: flat,
		[Dis]: flat,
		[Gis]: flat,
		[Cis]: flat,
	},
	minor: {
		[A]: sharp,
		[E]: sharp,
		[B]: sharp,
		[Fis]: sharp,
		[Cis]: sharp,
		[Gis]: sharp,
		[Dis]: sharp,

		[D]: flat,
		[G]: flat,
		[C]: flat,
		[F]: flat,
		[Ais]: flat,
		[Dis]: flat,
	},
};

export { keys };
