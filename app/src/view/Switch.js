import View from '../View.js';
import { q } from '../shortcuts.js';

export default class Switch extends View {

	get el() {
		return this._el;
	}
	set el(selector) {
		this._el = q(selector);
	}

	constructor(selector, model) {
		super();
		this.el = selector;
		this.el.addEventListener('click', () => {
			let event = new CustomEvent('change');
			this.el.value = this.el.querySelector('[selected]').id === 'fender' ? 'gibson' : 'fender';
			this.el.dispatchEvent(event);
		});
		this.model = model;
	}

	modelUpdate(model, changeName) {
		if (changeName === 'neckType') {
			this.el.querySelector('[selected]').removeAttribute('selected');
			this.el.querySelector(' #' + model.neckType).setAttribute('selected', 'selected');
		}
	}

}
