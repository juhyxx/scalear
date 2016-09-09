import View from '../View.js';

export default class Select extends View {

	constructor(selector, defaultValue, propertyName) {
		super();
		this._selector = selector;
		this._defaultValue = defaultValue;
		this._propertyName = propertyName;
		this._el = document.querySelector(this._selector);
	}


	modelUpdate(model) {
		model.forEach((option, id) => {
			if (!document.querySelector(this._selector + ' option[value="' + id + '"]')) {
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