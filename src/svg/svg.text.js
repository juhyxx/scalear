Svg.Text = function(parent, params) {
	return Svg.Element.call(this, parent, params);
};

Svg.Text.prototype = new Svg.Element();

Svg.Text.prototype.name = 'text';