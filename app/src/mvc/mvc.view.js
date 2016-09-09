
Mvc.View = function() {
	return this;
};

Mvc.View.prototype = {};

Object.defineProperty(Mvc.View.prototype, 'model', {
	get: function() {
		return this._model;
	},
	set: function(model) {
		var self = this;

		this._model = model;
		Object.observe(this._model, function(changes) {
			self.modelUpdate(self._model, changes);
		});
		this.modelUpdate(self._model);
	}
});

Mvc.View.prototype.on = function(eventName, fn) {
	this._el.addEventListener(eventName, fn);
};

Mvc.View.prototype.render = function() {
	console.warn('Virtual method "render", has to be implemented.');
};

Mvc.View.prototype.modelUpdate = function() {
	console.warn('Virtual method "modelUpdate", has to be implemented.');
};
