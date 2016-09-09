import log from '../logger.js';
import Select from './Select.js';

export default class SelectTwoLevel extends Select {

	constructor(selector, defaultValue, propertyName) {
		console.debug('SelectTwoLevel: constructor');
		super();

	}

	modelUpdate(model) {
		var element,
			optgroupElement,
			self = this,
			id;

		model.forEach(function(optgroup) {
			optgroupElement = document.createElement('optgroup');
			optgroupElement.label = optgroup.name;
			self._el.appendChild(optgroupElement);

			optgroup.options.forEach((option) => {
				id = option.id;
				if (!document.querySelector(self._selector + ' option[value="' + id + '"]')) {
					element = document.createElement('option');
					element.value = id;
					element.innerHTML = self._propertyName ? option[self._propertyName] : option;
					if (id === self._defaultValue) {
						element.setAttribute('selected', 'selected');
					}
					optgroupElement.appendChild(element);
				}
			});
		});
	}

}
