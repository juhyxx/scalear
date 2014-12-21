Scalear.Switch = function(selector, defaultValue) {
	var self = this;
	this._selector = selector;
	this._defaultValue = defaultValue;
	this._el = document.querySelector(this._selector);

	this._el.addEventListener('click', function() {
		this.value = document.querySelector(self._selector + ' #gibson').style.display === 'block' ? 'gibson' : 'fender';
		var event = new CustomEvent('change');
		this.dispatchEvent(event);
	});

	return Mvc.View.call(this);
};

Scalear.Switch.prototype = new Mvc.View();

Scalear.Switch.prototype.modelUpdate = function(model, changes) {
	changes = changes || [{
		name: 'neckType'
	}];

	if (changes[0].name === 'neckType') {
		var element, self = this;

		if (model.neckType === 'gibson') {
			document.querySelector(this._selector + ' #gibson').style.display = 'none';
			document.querySelector(this._selector + ' #fender').style.display = 'block';
		} else {
			document.querySelector(this._selector + ' #gibson').style.display = 'block';
			document.querySelector(this._selector + ' #fender').style.display = 'none';
		}
	}
};