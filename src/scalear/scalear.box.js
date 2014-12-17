Scalear.Box = function(svgParent) {
	this._parentEl = svgParent;
	Mvc.View.call(this);
};

Scalear.Box.prototype.modelUpdate = function(model, changes) {
	this.showScale(model.scale, model.rootNote);
};
Scalear.Box.prototype.showScale = function(scaleId, rootNote) {
	if (this._mainGroup) {
		this._mainGroup.remove();

	}

	var self = this,
		scale = Scalear.scales[scaleId].notes.slice().map(function(item) {
			return (item + rootNote) % Scalear.notes.length;
		});

	this._mainGroup = new Svg.Group(this._parentEl, {
		id: 'scale-box'
	});

	scale.forEach(function(item, index) {
		new Svg.Text(self._mainGroup.el, {
			x: 10 + 30 * index,
			y: 165,
			className: index === 0 ? 'root' : undefined,
			content: Scalear.notes[item]
		});
		new Svg.Text(self._mainGroup.el, {
			x: 13 + 30 * index,
			y: 180,
			className: 'interval',
			content: Scalear.intervals[item]
		});
		new Svg.Text(self._mainGroup.el, {
			x: 25 + 30 * index,
			y: 150,
			className: 'interval',
			content: Scalear.intervals[scale[index + 1] - item]
		});
	});

};