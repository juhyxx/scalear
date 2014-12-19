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
					element.id = self.id;
					break;
				case 'content':
					element.textContent = self[key];
					break;
				case 'animate':
					
					self.animate.forEach(function(anim) {
						new Svg.Animate(element, anim);
					});
					break;
				case 'set':
					new Svg.Set(element, self.set);
					break;
				default:
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