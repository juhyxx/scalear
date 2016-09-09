export default class View {

	get model() {
		return this._model;
	}

	set model(model) {
		this._model = model;
		Object.observe(this._model, changes => {
			this.modelUpdate(this._model, changes);
		});
		this.modelUpdate(this._model);
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
