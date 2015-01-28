Scalear.Switch = function(selector, defaultValue) {
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

	return Mvc.View.call(this);
};

Scalear.Switch.prototype = Object.create(Mvc.View.prototype);

Scalear.Switch.prototype.modelUpdate = function(model, changes) {
	changes = changes || [{
		name: 'neckType'
	}];

	if (changes[0].name === 'neckType') {
		var element, self = this;

		document.querySelector(self._selector + ' [selected="selected"]').removeAttribute('selected');

		if (model.neckType === 'fender') {
			document.querySelector(this._selector + ' #fender').setAttribute('selected', 'selected');
		} else {
			document.querySelector(this._selector + ' #gibson').setAttribute('selected', 'selected');
		}
	}
};