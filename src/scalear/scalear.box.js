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
		id: 'scale-box',
		transform: 'translate(' + (250 - (-50 + scale.length * 28) / 2) + ',120)'
	});

	scale.forEach(function(item, index) {
		if (index < scale.length - 1) {
			new Svg.Text(self._mainGroup.el, {
				x: 26 + 30 * index,
				y: 50,
				className: 'interval',
				content: Scalear.intervals[Scalear.scales[scaleId].notes[index + 1] - Scalear.scales[scaleId].notes[index]]
			});

			new Svg.Line(self._mainGroup.el, {
				x1: 25 + 30 * index,
				x2: 35 + 30 * index,
				y1: 59,
				y2: 59
			});
			new Svg.PolyLine(self._mainGroup.el, {
				points: [
					[16 + 30 * index, 52],
					[16 + 30 * index, 47],
					[23 + 30 * index, 47]
				]
			});

			new Svg.PolyLine(self._mainGroup.el, {
				points: [
					[37 + 30 * index, 47],
					[44 + 30 * index, 47],
					[44 + 30 * index, 52],
				]
			});
		}
		new Svg.Text(self._mainGroup.el, {
			x: 10 + 30 * index,
			y: 65,
			className: index === 0 ? 'root' : undefined,
			content: Scalear.notes[item]
		});
		new Svg.Text(self._mainGroup.el, {
			x: 13 + 30 * index,
			y: 75,
			className: 'interval',
			content: Scalear.intervals[Scalear.scales[scaleId].notes[index]]
		});
	});

};