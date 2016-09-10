import View from '../View.js';
import { q } from '../shortcuts.js';

export default class Switch extends View {

	constructor(selector, defaultValue) {
		super();
		this._selector = selector;
		this._defaultValue = defaultValue;
		this._el = q(this._selector);
		this._el.addEventListener('click', () => {
			let event = new CustomEvent('change');

			this._el.value = q(this._selector + ' [selected]').id === 'fender' ? 'gibson' : 'fender';
			this._el.dispatchEvent(event);
		});
	}

	modelUpdate(model, changes) {
		changes = changes || [{name: 'neckType'}];

		if (changes[0].name === 'neckType') {
			q(this._selector + ' [selected]').removeAttribute('selected');
			q(this._selector + ' #' + model.neckType).setAttribute('selected', 'selected');
		}
	}

}
