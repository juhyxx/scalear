Svg.Tspan = function(parent, params) {
	return Svg.Element.call(this, parent, params);
};

Svg.Tspan.prototype = new Svg.Element();

Svg.Tspan.prototype.name = 'tspan';