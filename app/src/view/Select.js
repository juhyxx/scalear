import View from '../View.js';
import { q } from '../shortcuts.js';

export default class Select extends View {

	constructor(selector, defaultValue, propertyName, model) {
		super();
		this._selector = selector;
		this._defaultValue = defaultValue;
		this._propertyName = propertyName;
		this._el = q(this._selector);
		this.model = model;

	}

	set model(model) {
		this._model = model;
		this.modelUpdate(model);
	}

	modelUpdate(model) {
		model.forEach((option, id) => {
			if (!q(this._selector + ' option[value="' + id + '"]')) {
				let element = document.createElement('option');

				element.value = id;
				element.innerHTML = this._propertyName ? option[this._propertyName] : option;
				if (id === this._defaultValue) {
					element.setAttribute('selected', 'selected');
				}
				this._el.appendChild(element);
			}
		});
	};


}
