Svg.Group = function(parent, params) {
	return Svg.Element.call(this, parent, params);
};
Svg.Group.prototype = new Svg.Element();

Svg.Group.prototype.name = 'g';