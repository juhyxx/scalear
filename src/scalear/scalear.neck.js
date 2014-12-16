Scalear.Neck = function(tunning, fretCount, stringsCount, rootNote) {
	this._tunning = tunning;
	this._fretCount = fretCount;
	this._neck = {
		width: 130,
		height: 500
	};
	this._stringDistance = Math.round(this._neck.width / stringsCount);
	this._neck.width = this._stringDistance * stringsCount;
	this._fretWidth = Math.round(this._neck.height / fretCount);
	this._rootNote = rootNote;
	this._stringsCount = stringsCount;

	Mvc.View.call(this);
};
Scalear.Neck.prototype = new Mvc.View();

Object.defineProperty(Scalear.Neck.prototype, 'fretCount', {
	get: function() {
		return this._fretCount;
	},
	set: function(fretCount) {
		this._fretCount = fretCount;
		this._updateFretCount();
	}
});

Object.defineProperty(Scalear.Neck.prototype, 'rootNote', {
	get: function() {
		return this._RootNote;
	},
	set: function(rootNote) {
		var i, scale = this._model.data.notes.slice();

		for (i = 0; i < scale.length; i++) {
			scale[i] = (scale[i] + rootNote) % Scalear.notes.length;
		}
		this._rootNote = rootNote;
		this.showScale(scale);
	}
});

Scalear.Neck.prototype.render = function(svgParent) {
	this._svgParent = svgParent;
	this._mainGroup = new Svg.Group(svgParent, {
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

	var shading = new Svg.Group(this._mainGroup.el, {
			className: 'shading'
		}),
		frets = new Svg.Group(this._mainGroup.el, {
			className: 'frets'
		}),
		marks = new Svg.Group(this._mainGroup.el, {
			className: 'marks'
		}),

		strings = new Svg.Group(this._mainGroup.el, {
			className: 'strings'
		}),
		fingers = new Svg.Group(this._mainGroup.el, {
			className: 'fingers'
		});

	this.labels = new Svg.Group(this._mainGroup.el, {
		className: 'labels'
	});

	this._renderShading(shading.el);
	this._renderMarks(marks.el);
	this._renderFrets(frets.el);
	this._renderStrings(strings.el);
	this._renderFingers(fingers.el);
	this._renderLabels(this.labels.el);
	this._mapNotes();
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
	var noteNumber, notesMap = [];

	for (var i = 0; i < this._tunning.length; i++) {
		noteNumber = this._tunning[i];
		for (var fret = 0; fret <= this._fretCount; fret++) {
			notesMap[noteNumber] = notesMap[noteNumber] || [];
			notesMap[noteNumber].push(this.getFinger(i + 1, fret));
			noteNumber++;
			noteNumber = noteNumber % Scalear.notes.length;
		}
	}
	this._notesMap = notesMap;
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

Scalear.Neck.prototype._renderFingers = function(svgParent) {
	this._fingers = [];

	for (var string = 1; string <= this._stringsCount; string++) {
		this._fingers.push([]);

		for (var i = 0; i <= this._fretCount; i++) {
			this._fingers[string - 1].push(new Svg.Circle(svgParent, {
				x: i * this._fretWidth + this._fretWidth / 2,
				y: (this._stringDistance * string) - this._stringDistance / 2,
				radius: this._stringDistance / 3,
				filter: 'url(#finger)'
			}));
		}
	}
};

Scalear.Neck.prototype._renderLabels = function(svgParent) {
	var string, noteNumber;

	this._labels = [];

	for (string = 0; string < this._stringsCount; string++) {
		noteNumber = this._tunning[string];
		for (var i = 0; i <= this._fretCount; i++) {
			var content = Scalear.notes[(noteNumber + i) % Scalear.notes.length],
				correction = content.length > 1 ? 2 : 0;

			new Svg.Text(svgParent, {
				x: i * this._fretWidth + (this._fretWidth / 2) - 2 - correction,
				y: this._stringDistance * string + (this._stringDistance / 2) + 3,
				content: content
			});
		}
	}
};

Scalear.Neck.prototype.getFinger = function(string, fret) {
	return this._fingers[string - 1][fret];
};

Scalear.Neck.prototype.showAllNotes = function(note) {
	var self = this;
	this._notesMap[note].forEach(function(item) {
		item.show();
		if (note === self._rootNote) {
			item.className = 'root';
		}
	});
};

Scalear.Neck.prototype.showScale = function(scale) {
	var self = this;
	this._clear();

	scale = scale || this._displayedScale;
	this._displayedScale = scale;

	scale.forEach(function(scale) {
		self.showAllNotes(scale);
	});
};

Scalear.Neck.prototype._clear = function() {
	for (var i = 0; i < this._stringsCount; i++) {
		for (var j = 0; j < this._fingers[i].length; j++) {
			this._fingers[i][j].className = '';
			this._fingers[i][j].hide();
		}
	}
};

Scalear.Neck.prototype.modelUpdate = function(model) {
	this._model = model;
	this.rootNote = this._rootNote;

};
Scalear.Neck.prototype.setNoteNamesVisibility = function(visible) {
	this.labels[visible ? 'show' : 'hide']();
};

Scalear.Neck.prototype.updateFretCount = function(fretCount) {
	this._fretCount = fretCount;
	this._mainGroup.remove();

	this._fretWidth = Math.round(this._neck.height / fretCount);
	this.render(this._svgParent);
	this._rootNote = this._rootNote;
	this.showScale();
};