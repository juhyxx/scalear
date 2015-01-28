Scalear.SelectTwoLevel = function(selector, defaultValue, propertyName) {
	return Scalear.Select.apply(this, arguments);
};

Scalear.SelectTwoLevel.prototype = Object.create(Scalear.Select.prototype);

Scalear.SelectTwoLevel.prototype.modelUpdate = function(model) {
	var element, optgroupElement, self = this, id;

	model.forEach(function(optgroup) {
		optgroupElement = document.createElement('optgroup');
		optgroupElement.label = optgroup.name;
		self._el.appendChild(optgroupElement);

		optgroup.options.forEach(function(option) {
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
};
