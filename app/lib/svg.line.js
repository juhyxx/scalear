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