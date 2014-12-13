Mvc.View = function() {};
Mvc.View.prototype = new Object;
Mvc.View.prototype.render = function() {
	console.warn('Virtual method "render", has to be implemented.');
};
Mvc.View.prototype.setModel = function(model) {
	var self = this;

	this._model = model;
	Object.observe(model, function(changes) {
		self.modelUpdate(self._model);
	});
	this.modelUpdate(self._model);
};
Mvc.View.prototype.modelUpdate = function() {
	console.warn('Virtual method "modelUpdate", has to be implemented.');
};