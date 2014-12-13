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