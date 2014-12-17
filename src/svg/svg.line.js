Svg.Line = function(parent, params) {
	return Svg.Element.call(this, parent, params);
};

Svg.Line.prototype = new Svg.Element();

Svg.Line.prototype.name = 'line';