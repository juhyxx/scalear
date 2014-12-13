Scalear.RootSelect = function() {
	this._el = document.querySelector('#root-selector');
};
Scalear.RootSelect.prototype = new Mvc.View();
Scalear.RootSelect.prototype.modelUpdate = function(model) {
	for (var i = 0; i < model.length; i++) {
		if (!document.querySelector('#root-selector option[value="' + i + '"]')) {
			element = document.createElement('option');
			element.value = i;
			element.innerHTML = model[i];
			this._el.appendChild(element);
		}
	}
};