Svg.Rectangle = function(parent, params) {
	return Svg.Element.call(this, parent, params);
};

Svg.Rectangle.prototype = Object.create(Svg.Element.prototype);

Svg.Rectangle.prototype.name = 'rect';