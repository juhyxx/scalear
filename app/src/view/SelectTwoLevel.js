import Select from './Select.js';
import { q } from '../shortcuts.js';

export default class SelectTwoLevel extends Select {

	modelUpdate(model) {
		let element,
			optgroupElement,
			id;

		model.forEach((optgroup) => {
			optgroupElement = document.createElement('optgroup');
			optgroupElement.label = optgroup.name;
			this._el.appendChild(optgroupElement);

			optgroup.options.forEach((option) => {
				id = option.id;
				if (!q(this._selector + ' option[value="' + id + '"]')) {
					element = document.createElement('option');
					element.value = id;
					element.innerHTML = this._propertyName ? option[this._propertyName] : option;
					if (id === this._defaultValue) {
						element.setAttribute('selected', 'selected');
					}
					optgroupElement.appendChild(element);
				}
			});
		});
	}

}
