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