Svg.Circle = function(parent, params) {
	params.r = params.radius;
	params.cx = params.x;
	params.cy = params.y;

	delete params.radius;
	delete params.x;
	delete params.y;

	return Svg.Element.call(this, parent, params);
};

Svg.Circle.prototype = Object.create(Svg.Element.prototype);

Svg.Circle.prototype.name = 'circle';