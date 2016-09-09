Svg.Group = function(parent, params) {
	return Svg.Element.call(this, parent, params);
};

Svg.Group.prototype = Object.create(Svg.Element.prototype);

Svg.Group.prototype.name = 'g';