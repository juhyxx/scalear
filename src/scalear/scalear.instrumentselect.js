Scalear.InstrumentSelect = function() {
	this._el = document.querySelector('#instrument-selector');
};
Scalear.InstrumentSelect.prototype = new Mvc.View();
Scalear.InstrumentSelect.prototype.modelUpdate = function(model) {
	var i, element;
	
	for (i = 0; i < model.length; i++) {
		if (!document.querySelector('#instrument-selector option[value="' + i + '"]')) {
			element = document.createElement('option');
			element.value = i;
			element.innerHTML = model[i].name;
			this._el.appendChild(element);
		}
	}
};