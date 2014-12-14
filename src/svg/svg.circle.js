Svg.Circle = function(parent, coords) {
	this.parent = parent;
	this.cx = coords.x;
	this.cy = coords.y;
	this.r = coords.radius;
	this.filter = coords.filter;
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