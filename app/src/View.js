export default class View {

	get model() {
		return this._model;
	}

	set model(model) {
		this._model = model;
		this._model.addUpdateHandler(this.modelUpdate, this);
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

	createDomElement(parent, config) {
		let element = document.createElement(config.name);

		element.value = config.value;
		element.innerHTML = config.innerHTML;
		parent.appendChild(element);
	}
}
