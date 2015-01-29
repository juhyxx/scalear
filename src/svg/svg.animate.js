Svg.Animate = function(parent, params) {
	return Svg.Element.call(this, parent, params);
};

Svg.Animate.prototype = Object.create(Svg.Element.prototype);

Svg.Animate.prototype.name = 'animate';