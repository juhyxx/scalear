import log from '../logger.js';

export default class SVG {

	constructor() {
		this.NS = 'http://www.w3.org/2000/svg';
	}

	static get(selector) {
		return document.querySelector(selector);
	}
}
