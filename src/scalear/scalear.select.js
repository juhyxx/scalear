Scalear.Select = function(selector, defaultValue, propertyName) {
	this._selector = selector;
	this._el = document.querySelector(this._selector);
	this._defaultValue = defaultValue;
	this._propertyName = propertyName;
};

Scalear.Select.prototype = new Mvc.View();

Scalear.Select.prototype.modelUpdate = function(model) {
	var i, element;

	for (i = 0; i < model.length; i++) {
		if (!document.querySelector(this._selector + ' option[value="' + i + '"]')) {
			element = document.createElement('option');
			element.value = i;
			element.innerHTML = this._propertyName ? model[i][this._propertyName] : model[i];
			if (i === this._defaultValue) {
				element.setAttribute('selected', 'selected');
			}
			this._el.appendChild(element);
		}
	}
};

Scalear.Select.prototype.on = function(eventName, fn) {
	this._el.addEventListener(eventName, fn);
};