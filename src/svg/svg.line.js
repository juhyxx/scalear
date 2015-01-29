Svg.Line = function(parent, params) {
	return Svg.Element.call(this, parent, params);
};

Svg.Line.prototype = Object.create(Svg.Element.prototype);

Svg.Line.prototype.name = 'line';