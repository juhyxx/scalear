import SvgElement from '../Element.js';

export default class extends SvgElement {

	constructor(parent, params) {
		super(...arguments);
	}

	get name() {
		return 'animate';
	}

}
