Svg.Tspan = function(parent, params) {
	return Svg.Element.call(this, parent, params);
};

Svg.Tspan.prototype = Object.create(Svg.Element.prototype);

Svg.Tspan.prototype.name = 'tspan';