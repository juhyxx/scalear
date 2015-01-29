Svg.PolyLine = function(parent, params) {
	var points = params.points.map(function(point) {
		return point.join(',');
	});
	params.points = points.join(' ');
	return Svg.Element.call(this, parent, params);
};

Svg.PolyLine.prototype = Object.create(Svg.Element.prototype);

Svg.PolyLine.prototype.name = 'polyline';