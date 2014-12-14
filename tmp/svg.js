var Svg = {
	NS: 'http://www.w3.org/2000/svg',
	get: function(selector) {
		return document.querySelector(selector);
	}
};
Svg.Element = {
	name: '',

	get className() {
		return this._className;
	},
	set className(name) {
		this._className = name;
		if (this._el) {
			this._el.setAttribute('class', name);
		}
	},

	get el() {
		return this._el;
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

		Object.keys(this).map(function(key) {
			if (key === 'content') {
				element.innerHTML = self[key];
			} else if (key === '_className') {
				if (self[key] !== undefined) {
					element.setAttribute('class', self[key]);
				}
			} else if (key !== 'parent' && key !== '_rendered') {
				element.setAttribute(key, self[key]);
			}
		});

		this.parent.appendChild(element);
		this._el = element;
		this._rendered = true;

		return this;
	}
};
Svg.Circle = function(parent, coords) {
	this.parent = parent;
	this.cx = coords.x;
	this.cy = coords.y;
	this.r = coords.radius;
	this.render();

	return this;
};
Svg.Circle.prototype = Object.create(Svg.Element, {
	name: {
		value: 'circle'
	},
	parent: {
		value: null,
		writable: true
	},
	cx: {
		value: 0,
		writable: true
	},
	cy: {
		value: 0,
		writable: true
	},
	r: {
		value: 0,
		writable: true
	}
});
Svg.Group = function(parent, params) {
	this.parent = parent;
	this.className = params.className;
	this.render();
	return this;
};
Svg.Group.prototype = Object.create(Svg.Element, {
	name: {
		value: 'g'
	}
});
Svg.Line = function(parent, params) {
	this.parent = parent;
	this.x1 = params.x1;
	this.x2 = params.x2;
	this.y1 = params.y1;
	this.y2 = params.y2;
	this.className = params.className;
	this.render();
	return this;
};
Svg.Line.prototype = Object.create(Svg.Element, {
	name: {
		value: 'line'
	},
	parent: {
		value: null,
		writable: true
	},
	x1: {
		value: 0,
		writable: true
	},
	y1: {
		value: 0,
		writable: true
	},
	x2: {
		value: 0,
		writable: true
	},
	y2: {
		value: 0,
		writable: true
	}
});
Svg.Rectangle = function(parent, params) {
	this.parent = parent;
	this.x = params.x;
	this.y = params.y;
	this.className = params.className;
	this.width = params.width;
	this.height = params.height;
	this.render();

	return this;
};
Svg.Rectangle.prototype = Object.create(Svg.Element, {
	name: {
		value: 'rect'
	},
	parent: {
		value: null,
		writable: true
	},
	x: {
		value: 0,
		writable: true
	},
	y: {
		value: 0,
		writable: true
	},
	height: {
		value: 0,
		writable: true
	},
	width: {
		value: 0,
		writable: true
	}
});
Svg.Text = function(parent, params) {
	this.parent = parent;
	this.x = params.x;
	this.y = params.y;
	this.content = params.content;
	this.render();

	return this;
};
Svg.Text.prototype = Object.create(Svg.Element, {
	name: {
		value: 'text'
	},
	parent: {
		value: null,
		writable: true
	},
	x: {
		value: 0,
		writable: true
	},
	y: {
		value: 0,
		writable: true
	},
	content: {
		value: 0,
		writable: true
	}
});