Mvc.View = function() {
	Object.defineProperty(this, 'model', {
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
	return this;
};

Mvc.View.prototype = {};

Mvc.View.prototype.on = function(eventName, fn) {
	this._el.addEventListener(eventName, fn);
};

/* start-debug-only */ 
Mvc.View.prototype.render = function() {
	console.warn('Virtual method "render", has to be implemented.');
};

Mvc.View.prototype.modelUpdate = function() {
	console.warn('Virtual method "modelUpdate", has to be implemented.');
};
/* end-debug-only*/

