export default class Application {

	get model() {
		return this._model;
	}
	set model(model) {
		this._model = model;
		Object.observe(this._model, changes => {
			this.modelUpdate(this._model, changes);
		});
	}
	get route() {
		let params = (location.hash.slice(1) || '/').split('/');

		params.shift();
		params.pop();
		return params || [];
	}
	set route(route) {
		window.location.hash = route;
	}

	run() {
		window.addEventListener('load', () => {
			window.removeEventListener('load', onload, false);
			this.onBoot.call(this);
		});
		window.addEventListener('hashchange', () => {
			this.onRouteChange(this.route);
		});
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
