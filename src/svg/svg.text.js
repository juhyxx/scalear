Svg.Text = function(parent, params) {
	return Svg.Element.call(this, parent, params);
};

Svg.Text.prototype = Object.create(Svg.Element.prototype);

Svg.Text.prototype.name = 'text';