import log from './logger.js';

export default class View {

	constructor() {
		console.debug('View:constructor');
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
	}

	on(eventName, fn) {
		this._el.addEventListener(eventName, fn);
	}

	render() {
		console.warn('Virtual method "render", has to be implemented.');
	}

	modelUpdate() {
		console.warn('Virtual method "modelUpdate", has to be implemented.');
	}
}
