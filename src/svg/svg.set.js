Svg.Set = function(parent, params) {
	return Svg.Element.call(this, parent, params);
};

Svg.Set.prototype = Object.create(Svg.Element.prototype);

Svg.Set.prototype.name = 'set';