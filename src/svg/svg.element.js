Svg.Element = function(parent, params) {
	var self = this;

	if (parent) {
		params = params || {};
		this.parent = parent;
		params['class'] = params.className;
		delete params.className;
		Object.keys(params).forEach(function(key) {
			self[key] = params[key];
		});
		this.params = params;
		this.render();
	}
	return this;
};

Svg.Element.prototype = {
	get className() {
		return this._el;
	},
	set className(name) {
		return this._el.setAttribute('class', name);
	},

	get el() {
		return this._el;
	},

	remove: function() {
		this._el.remove();
	},

	show: function() {
		this._el.style.display = 'block';
	},

	hide: function() {
		this._el.style.display = 'none';
	},

	render: function() {
		var self = this,
			element = document.createElementNS(Svg.NS, this.name);

		Object.keys(this.params).map(function(key) {
			if (key === 'content') {
				element.textContent = self[key];
			} else {
				if (self[key]) {
					element.setAttribute(key, self[key]);
				}
			}
		});

		this.parent.appendChild(element);
		this._el = element;

		return this;
	}
};