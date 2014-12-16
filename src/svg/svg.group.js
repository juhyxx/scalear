Svg.Group = function(parent, params) {
	this.parent = parent;
	this.className = params.className;
	if (params.id) {
		this.id = params.id;
	}
	this.render();
	return this;
};
Svg.Group.prototype = Object.create(Svg.Element, {
	name: {
		value: 'g'
	}
});