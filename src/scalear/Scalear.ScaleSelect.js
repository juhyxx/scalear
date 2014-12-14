Scalear.ScaleSelect = function() {
	this._el = document.querySelector('#scale-selector');
};
Scalear.ScaleSelect.prototype = new Mvc.View();
Scalear.ScaleSelect.prototype.modelUpdate = function(model) {
	var i, element;
	
	for (i = 0; i < model.length; i++) {
		if (!document.querySelector('#scale-selector option[value="' + i + '"]')) {
			element = document.createElement('option');
			element.value = i;
			element.innerHTML = model[i].name;
			this._el.appendChild(element);
		}
	}
};