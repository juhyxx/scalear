Scalear.Neck = function(svgParent) {
	this._parentEl = svgParent;
	this._neck = {
		width: 130,
		height: 500
	};
	Mvc.View.call(this);
};

Scalear.Neck.prototype.modelUpdate = function(model, changes) {
	this._fretCount = model.fretCount;
	this._namesVisible = model.namesVisible;
	this._rootNote = model.rootNote;
	this._scale = Scalear.scales[model.scale].notes.slice();
	this._tunning = Scalear.instruments[model.instrument].tunning;

	this._stringsCount = this._tunning.length;
	this._stringDistance = Math.round(this._neck.width / this._stringsCount);
	this._neck.width = this._stringDistance * this._stringsCount;
	this._fretWidth = Math.round(this._neck.height / this._fretCount);
	if (changes) {
		this._mainGroup.remove();
	}
	this._render();
	this._showScale();
	this.labels[this._namesVisible ? 'show' : 'hide']();
};

Scalear.Neck.prototype._render = function() {
	this._mainGroup = new Svg.Group(this._parentEl, {
		id: 'neck'
	});

	new Svg.Rectangle(this._mainGroup.el, {
		className: 'neck',
		x: this._fretWidth,
		y: 0,
		width: this._fretCount * this._fretWidth,
		height: this._neck.width,
		fill: 'url(#gradient)',
		filter: 'url(#f1)'
	});
	this._renderGroups(this._mainGroup.el);
	this._mapNotes();
};

Scalear.Neck.prototype._renderGroups = function(el) {
	var shading = new Svg.Group(el, {
			className: 'shading'
		}),
		frets = new Svg.Group(el, {
			className: 'frets'
		}),
		marks = new Svg.Group(el, {
			className: 'marks'
		}),
		strings = new Svg.Group(el, {
			className: 'strings'
		}),
		fingers = new Svg.Group(el, {
			className: 'fingers'
		});

	this.labels = new Svg.Group(el, {
		className: 'labels'
	});

	this._renderShading(shading.el);
	this._renderMarks(marks.el);
	this._renderFrets(frets.el);
	this._renderStrings(strings.el);
	this._renderFingers(fingers.el);
	this._renderLabels(this.labels.el);
};

Scalear.Neck.prototype._renderShading = function(el) {
	for (var i = 0; i < this._fretCount; i++) {
		new Svg.Rectangle(el, {
			x: i * this._fretWidth + this._fretWidth,
			y: 0,
			width: this._fretWidth,
			height: this._neck.width,
			fill: 'url(#shading)'
		});
	}
};
Scalear.Neck.prototype._renderMarks = function(el) {
	var self = this;
	[3, 5, 7, 9, 12, 3 + 12, 5 + 12, 7 + 12, 9 + 12, 12 + 12].map(function(i) {
		if (i <= self._fretCount) {
			new Svg.Rectangle(el, {
				x: (i - 1) * self._fretWidth + 5 + self._fretWidth,
				y: 4 * 5,
				height: self._neck.width - 8 * 5,
				width: self._fretWidth - 2 * 5
			});

		}
	});
};

Scalear.Neck.prototype._renderFrets = function(el) {
	for (var i = 0; i <= this._fretCount; i++) {
		new Svg.Line(el, {
			x1: i * this._fretWidth + this._fretWidth,
			x2: i * this._fretWidth + this._fretWidth,
			y1: 0,
			y2: this._neck.width
		});
		new Svg.Text(el, {
			x: i * this._fretWidth - this._fretWidth + 2 * this._fretWidth - 2,
			y: this._neck.width + 10,
			content: i
		});
	}
	new Svg.Line(el, {
		className: 'zero',
		x1: this._fretWidth - 2,
		x2: this._fretWidth - 2,
		y1: 0,
		y2: this._neck.width + 0.6
	});
};

Scalear.Neck.prototype._mapNotes = function(el) {
	var fret, string, note,
		notesMap = [],
		labelsMap = [];

	for (string = 0; string < this._tunning.length; string++) {
		note = this._tunning[string];
		for (fret = 0; fret <= this._fretCount; fret++) {
			notesMap[note] = notesMap[note] || [];
			labelsMap[note] = labelsMap[note] || [];
			notesMap[note].push(this._fingers[string][fret]);
			labelsMap[note].push(this._labels[string][fret]);
			note++;
			note = note % Scalear.notes.length;
		}
	}
	this._notesMap = notesMap;
	this._labelsMap = labelsMap;
};

Scalear.Neck.prototype._renderStrings = function(el) {
	for (var i = 0; i < this._stringsCount; i++) {
		new Svg.Line(el, {
			x1: 0,
			x2: this._fretWidth + this._fretCount * this._fretWidth,
			y1: i * this._stringDistance + this._stringDistance / 2,
			y2: i * this._stringDistance + this._stringDistance / 2
		});
	}
};

Scalear.Neck.prototype._renderFingers = function(parentEl) {
	var string, i;

	this._fingers = [];

	for (string = 0; string < this._stringsCount; string++) {
		this._fingers.push([]);

		for (i = 0; i <= this._fretCount; i++) {
			this._fingers[string].push(new Svg.Circle(parentEl, {
				x: i * this._fretWidth + this._fretWidth / 2,
				y: (this._stringDistance * string) + this._stringDistance / 2,
				radius: this._stringDistance / 3,
				filter: 'url(#finger)'
			}));
		}
	}
};

Scalear.Neck.prototype._renderLabels = function(parentEl) {
	var string, noteNumber;

	this._labels = [];

	for (string = 0; string < this._stringsCount; string++) {
		noteNumber = this._tunning[string];
		this._labels.push([]);
		for (var i = 0; i <= this._fretCount; i++) {
			var content = Scalear.notes[(noteNumber + i) % Scalear.notes.length],
				correction = content.length > 1 ? 2 : 0;
			this._labels[string].push(
				new Svg.Text(parentEl, {
					x: i * this._fretWidth + (this._fretWidth / 2) - 2 - correction,
					y: this._stringDistance * string + (this._stringDistance / 2) + 3,
					content: content
				})
			);
		}
	}
};

Scalear.Neck.prototype.showAllNotes = function(note) {
	var self = this;

	this._notesMap[note].forEach(function(item) {
		item.show();
		if (note === self._rootNote) {
			item.className = 'root';
		}
	});
	this._labelsMap[note].forEach(function(item) {
		item.show();
	});
};

Scalear.Neck.prototype._showScale = function(scale) {
	var i, self = this;

	this._clear();
	scale = scale || this._scale;
	scale = scale.slice();
	for (i = 0; i < scale.length; i++) {
		scale[i] = (scale[i] + this._rootNote) % Scalear.notes.length;
	}
	scale.forEach(function(note) {
		self.showAllNotes(note);
	});
	this._scale = scale;
};

Scalear.Neck.prototype._clear = function() {
	var i, j, finger;

	for (i = 0; i < this._stringsCount; i++) {
		for (j = 0; j < this._fingers[i].length; j++) {
			finger = this._fingers[i][j];
			finger.className = '';
			finger.hide();
			this._labels[i][j].hide();
		}
	}
};