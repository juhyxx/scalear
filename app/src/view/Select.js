import log from '../logger.js';
import View from '../View.js';

export default class Select extends View {

	constructor(selector, defaultValue, propertyName) {
		console.debug('Select: constructor');
		super();
		this._selector = selector;
		this._defaultValue = defaultValue;
		this._propertyName = propertyName;
		this._el = document.querySelector(this._selector);
	}


	modelUpdate(model) {
		var element,
			self = this;

		model.forEach((option, id) => {
			if (!document.querySelector(self._selector + ' option[value="' + id + '"]')) {
				element = document.createElement('option');
				element.value = id;
				element.innerHTML = self._propertyName ? option[self._propertyName] : option;
				if (id === self._defaultValue) {
					element.setAttribute('selected', 'selected');
				}
				self._el.appendChild(element);
			}
		});
	};


}
