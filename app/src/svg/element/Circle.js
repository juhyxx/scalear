import SvgElement from '../Element.js';

export default class Circle extends SvgElement {

	constructor(parent, params) {
		params.r = params.radius;
		params.cx = params.x;
		params.cy = params.y;

		delete params.radius;
		delete params.x;
		delete params.y;
		super(parent, params);
	}


	get name() {
		return 'circle';
	}
}
