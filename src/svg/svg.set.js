Svg.Set = function(parent, params) {
	return Svg.Element.call(this, parent, params);
};

Svg.Set.prototype = new Svg.Element();

Svg.Set.prototype.name = 'set';