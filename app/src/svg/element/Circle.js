import SvgElement from '../Element.js';

export default class Circle extends SvgElement {

	constructor(parent, params) {
		super(...arguments);
		params.r = params.radius;
		params.cx = params.x;
		params.cy = params.y;

		delete params.radius;
		delete params.x;
		delete params.y;
	}


	get name() {
		return 'circle';
	}
}
