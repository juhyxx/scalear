import log from '../logger.js';
import View from '../View.js';

export default class Switch extends View {

	constructor(selector, defaultValue) {
		console.debug('Switch: constructor');
		super();
		var self = this;

		this._selector = selector;
		this._defaultValue = defaultValue;
		this._el = document.querySelector(this._selector);

		this._el.addEventListener('click', function() {
			this.value = document.querySelector(self._selector + ' [selected="selected"]').id === 'fender' ? 'gibson' : 'fender';
			var event = new CustomEvent('change');

			this.dispatchEvent(event);
		});

		this._el.addEventListener('keydown', function(e) {
			if (e.keyCode === 13 || e.keyCode === 32) {
				this.value = document.querySelector(self._selector + ' [selected="selected"]').id === 'fender' ? 'gibson' : 'fender';
				var event = new CustomEvent('change');

				this.dispatchEvent(event);
			}
		});
	}

	modelUpdate(model, changes) {
		changes = changes || [{name: 'neckType'}];

		if (changes[0].name === 'neckType') {
			var element,
				self = this;

			document.querySelector(self._selector + ' [selected="selected"]').removeAttribute('selected');

			if (model.neckType === 'fender') {
				document.querySelector(this._selector + ' #fender').setAttribute('selected', 'selected');
			} else {
				document.querySelector(this._selector + ' #gibson').setAttribute('selected', 'selected');
			}
		}
	}

}
