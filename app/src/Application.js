import log from './logger.js';

export default class Application {

	constructor() {
		console.debug('Application:constructor');
		this.model = {
			get: () => {
				return this._model;
			},
			set: (model) => {
				var self = this;

				this._model = model;
				Object.observe(this._model, function(changes) {
					self.modelUpdate(self._model, changes);
				});
			}
		};
		this.route = {
			get: function() {
				var params = (location.hash.slice(1) || '/').split('/');

				params.shift();
				params.pop();
				return params || [];
			},
			set: function(route) {
				window.location.hash = route;
			}
		};
	}

	run() {
		window.addEventListener('load', function onload() {
			window.removeEventListener('load', onload, false);
			this.onBoot.call(this);
		}.bind(this));

		window.addEventListener('hashchange', function() {
			this.onRouteChange(this.route);
		}.bind(this));

		document.addEventListener('fullscreenchange', function(event) {
			document.documentElement.classList[document.fullscreenEnabled ? 'add' : 'remove']('fullscreen');
		});
	}

	showFullScreen() {
		document.documentElement.requestFullscreen();
	}

	hideFullScreen() {
		document.exitFullscreen();
	}

	static run() {
		console.debug('Application:run');
		return new Application();
	}

	onRouteChange() {
		console.warn('Virtual method "boot", has to be implemented.');
	}

	onBoot() {
		console.warn('Virtual method "boot", has to be implemented.');
	}

	modelUpdate() {
		console.warn('Virtual method "modelUpdate", has to be implemented.');
	}
}
