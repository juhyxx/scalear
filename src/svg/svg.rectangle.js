Svg.Rectangle = function(parent, params) {
	return Svg.Element.call(this, parent, params);
};

Svg.Rectangle.prototype = new Svg.Element();

Svg.Rectangle.prototype.name = 'rect';