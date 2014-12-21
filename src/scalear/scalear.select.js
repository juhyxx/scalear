Scalear.Select = function(selector, defaultValue, propertyName) {
	this._selector = selector;
	this._defaultValue = defaultValue;
	this._propertyName = propertyName;
	this._el = document.querySelector(this._selector);

	return Mvc.View.call(this);
};

Scalear.Select.prototype = new Mvc.View();

Scalear.Select.prototype.modelUpdate = function(model) {
	var element, self = this;

	model.forEach(function(option, id) {
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
