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
		return this._el.getAttribute('class') || '';
	},
	set className(name) {
		return this._el.setAttribute('class', name);
	},

	get el() {
		return this._el;
	},

	remove: function() {
		this.el.parentNode.removeChild(this.el);
	},

	show: function() {
		this._el.style.display = 'block';
	},

	hide: function() {
		this._el.style.display = 'none';
	},

	addClass: function(className) {
		this.className = this.className + ' ' + className;
	},

	hasClass: function(className) {
		return this.className.indexOf(className) > -1;
	},

	removeClass: function(className) {
		this.className = this.className.replace(className);
	},

	showWithOpacity: function() {
		this._el.style.opacity = 1;
	},

	hideWithOpacity: function() {
		this._el.style.opacity = 0;
	},

	render: function() {
		var self = this,
			element = document.createElementNS(Svg.NS, this.name);

		Object.keys(this.params).map(function(key) {
			switch (key) {
				case 'id':
				case 'textContent':
					element[key] = self[key];
					break;
				case 'children':
					self.children.forEach(function(child) {
						var name = child.name.charAt(0).toUpperCase() + child.name.slice(1);
						new Svg[name](element, child);
					});
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
};