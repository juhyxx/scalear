import SvgElement from '../Element.js';

export default class Polyline extends SvgElement {

	constructor(parent, params) {
		super(...arguments);


		var points = params.points.map(function(point) {
			return point.join(',');
		});
		params.points = points.join(' ');
	}

	get name() {
		return 'polyline';
	}

}
