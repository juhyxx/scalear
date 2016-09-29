import View from '../View.js';
import { q } from '../shortcuts.js';

export default class Select extends View {

	get el() {
		return this._el;
	}
	set el(selector) {
		this._el = q(selector);
	}

	constructor({selector, propertyName, model, data, watchOption}) {
		super();
		this.el = selector;
		this._propertyName = propertyName;
		this._watchOption = watchOption;
		this.model = model;
		this.render(data);
	}

	modelUpdate(model, changeName) {
		if (changeName == this._watchOption) {
			this.el.value = model[this._watchOption];
		}
	}

	render(data) {
		data.forEach((option, id) => {
			this.renderOption(this.el, option, id);
		});
	}

	renderOption(parent, option, id) {
		this.createDomElement(parent, {
			name: 'option',
			value: id,
			innerHTML: this._propertyName ? option[this._propertyName] : option
		});
	}
}
