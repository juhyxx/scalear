Svg.Element = {
	name: '',

	get className() {
		return this._className;
	},
	set className(name) {
		this._className = name;
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
			NS = "http://www.w3.org/2000/svg",
			element = document.createElementNS(NS, this.name);

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

		this._el = element;

		this.parent.appendChild(element);
		this._rendered = true;

		return this;
	}
};