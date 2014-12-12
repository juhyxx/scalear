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