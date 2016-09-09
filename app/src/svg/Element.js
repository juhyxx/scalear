import log from '../logger.js';
import Svg from './Svg.js';

export default class Element extends Svg {

	constructor(parent, params) {
		super(...arguments);
		console.debug('Element: constructor', parent, params);
		var self = this;

		if (parent) {
			params = params || {};
			this.parent = parent;
			params.class = params.className;
			delete params.className;
			Object.keys(params).forEach(function(key) {
				self[key] = params[key];
			});
			this.params = params;
			this.render();
		}
	}

	get className() {
		return this._el.getAttribute('class') || '';
	}
	set className(name) {
		return this._el.setAttribute('class', name);
	}

	get el() {
		return this._el;
	}

	remove() {
		this.el.parentNode.removeChild(this.el);
	}

	show() {
		this._el.style.display = 'block';
		return this;
	}

	hide() {
		this._el.style.display = 'none';
		return this;
	}

	addClass(className) {
		this.className = this.className + ' ' + className;
		return this;
	}

	hasClass(className) {
		return this.className.indexOf(className) > -1;
	}

	removeClass(className) {
		this.className = this.className.replace(className);
	}

	showWithOpacity() {
		this._el.style.opacity = 1;
	}

	hideWithOpacity() {
		this._el.style.opacity = 0;
	}

	render() {
		console.log('Element:render');
		var self = this,
			element = document.createElementNS(this.NS, this.name);

		console.log(this.params);

		Object.keys(this.params).map(function(key) {
			switch (key) {
				case 'id':
				case 'textContent':
					element[key] = self[key];
					break;
				case 'children':
					/*self.children.forEach(function(child) {
						var name = child.name.charAt(0).toUpperCase() + child.name.slice(1);
						new Svg[name](element, child);
					});*/
					break;
				default:
					if (self[key] !== undefined) {
						element.setAttribute(key, self[key]);
					}
			}
		});

		this.parent.appendChild(element);
		this._el = element;

		return this;
	}
}
