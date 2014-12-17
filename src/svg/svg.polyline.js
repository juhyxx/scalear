Svg.PolyLine = function(parent, params) {
	var points = params.points.map(function(point) {
		return point.join(',');
	});
	params.points = points.join(' ');
	return Svg.Element.call(this, parent, params);
};

Svg.PolyLine.prototype = new Svg.Element();

Svg.PolyLine.prototype.name = 'polyline';