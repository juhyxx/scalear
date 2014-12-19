Svg.Animate = function(parent, params) {
	return Svg.Element.call(this, parent, params);
};

Svg.Animate.prototype = new Svg.Element();

Svg.Animate.prototype.name = 'animate';