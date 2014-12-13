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