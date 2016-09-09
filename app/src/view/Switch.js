import View from '../View.js';

export default class Switch extends View {

	constructor(selector, defaultValue) {
		super();
		this._selector = selector;
		this._defaultValue = defaultValue;
		this._el = document.querySelector(this._selector);
		this._el.addEventListener('click', () => {
			this._el.value = document.querySelector(this._selector + ' [selected="selected"]').id === 'fender' ? 'gibson' : 'fender';
			let event = new CustomEvent('change');

			this._el.dispatchEvent(event);
		});
	}

	modelUpdate(model, changes) {
		changes = changes || [{name: 'neckType'}];

		if (changes[0].name === 'neckType') {
			document.querySelector(this._selector + ' [selected="selected"]').removeAttribute('selected');
			document.querySelector(this._selector + ' #' + model.neckType).setAttribute('selected', 'selected');
		}
	}

}
