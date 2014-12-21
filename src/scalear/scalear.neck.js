Scalear.Neck = function(svgParent) {
	this._parentEl = svgParent;
	this._neck = {
		width: 130,
		height: 500
	};
	return Mvc.View.call(this);
};

Scalear.Neck.prototype.modelUpdate = function(model, changes) {

	var changeName = changes ? changes[0].name : 'instrument';

	switch (changeName) {

		case 'highlighted':
			this._highlightNotes(model.highlighted);
			break;

		case 'namesVisible':
			this.labels[model.namesVisible ? 'showWithOpacity' : 'hideWithOpacity']();
			var element = q('svg .labels animate#' + (model.namesVisible ? 'fadein' : 'fadeout'));
			if (element.beginElement) {
				element.beginElement();
			}
			break;

		case 'rootNote':
		case 'scale':
			this._rootNote = model.rootNote;
			this._scale = Scalear.scales[model.scale].notes.slice();
			this._showScale();
			break;

		default:
			if (this._mainGroup) {
				this._mainGroup.remove();
			}

			this._fretCount = model.fretCount;
			this._neckType = model.neckType;
			this._namesVisible = model.namesVisible;
			this._rootNote = model.rootNote;
			this._scale = Scalear.scales[model.scale].notes.slice();
			this._instrument = model.instrument;
			this._tunning = Scalear.instruments[model.instrument].tunning;
			this._stringsCount = this._tunning.length;
			this._stringDistance = Math.round(this._neck.width / this._stringsCount);
			this._neck.width = this._stringDistance * this._stringsCount;
			this._fretWidth = Math.round(this._neck.height / this._fretCount);
			this._render();
			this._showScale();
			this.labels[model.namesVisible ? 'showWithOpacity' : 'hideWithOpacity']();

			break;
	}
};

Scalear.Neck.prototype._render = function() {
	this._mainGroup = new Svg.Group(this._parentEl, {
		id: 'neck',
		className: this._neckType,
	});
	new Svg.Rectangle(this._mainGroup.el, {
		class: 'neck',
		x: this._fretWidth,
		y: 0,
		width: this._fretCount * this._fretWidth,
		height: this._neck.width,
		fill: this._neckType === 'fender' ? 'url(#gradientfender)' : 'url(#gradient)',
		filter: 'url(#neckshadow)'
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
		className: 'labels',
		children: [{
			name: 'animate',
			id: 'fadein',
			attributeType: 'CSS',
			attributeName: 'opacity',
			from: '0',
			to: '1',
			dur: '1s',
			fill: "freeze",
			begin: 'indefinite'
		}, {
			name: 'animate',
			id: 'fadeout',
			attributeType: 'CSS',
			attributeName: 'opacity',
			from: '1',
			to: '0',
			dur: '1s',
			fill: "freeze",
			begin: 'indefinite'

		}]
	});
	if (this._instrument !== 6) {
		this._renderShading(shading.el);
	}
	this._renderMarks(marks.el);
	if (this._instrument !== 6) {
		this._renderFrets(frets.el);
	}
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
			if (self._neckType === 'fender') {
				new Svg.Circle(el, {
					x: (i - 1) * self._fretWidth + 1.5 * self._fretWidth,
					y: self._neck.width / 2,
					radius: self._fretWidth / 8
				});
			} else {
				new Svg.Rectangle(el, {
					x: (i - 1) * self._fretWidth + 5 + self._fretWidth,
					y: 4 * 5,
					height: self._neck.width - 8 * 5,
					width: self._fretWidth - 2 * 5
				});
			}

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
			textContent: i
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
		self = this,
		notesMap = [],
		labelsMap = [];

	this._tunning.forEach(function(note, string) {
		for (fret = 0; fret <= self._fretCount; fret++) {
			notesMap[note] = notesMap[note] || [];
			labelsMap[note] = labelsMap[note] || [];
			notesMap[note].push(self._fingers[string][fret]);
			labelsMap[note].push(self._labels[string][fret]);
			note++;
			note = note % Scalear.notes.length;
		}
	});
	this._notesMap = notesMap;
	this._labelsMap = labelsMap;
};

Scalear.Neck.prototype._renderStrings = function(el) {
	var self = this;

	this._tunning.forEach(function(item, i) {
		new Svg.Line(el, {
			x1: 0,
			x2: self._fretWidth + self._fretCount * self._fretWidth,
			y1: i * self._stringDistance + self._stringDistance / 2,
			y2: i * self._stringDistance + self._stringDistance / 2
		});
	});
};

Scalear.Neck.prototype._renderFingers = function(parentEl) {
	var string, i,
		fingers = [];

	for (string = 0; string < this._stringsCount; string++) {
		fingers.push([]);

		for (i = 0; i <= this._fretCount; i++) {
			fingers[string].push(new Svg.Circle(parentEl, {
				x: i * this._fretWidth + this._fretWidth / 2,
				y: (this._stringDistance * string) + this._stringDistance / 2,
				radius: this._stringDistance / 3,
				filter: this._instrument === 6 ? 'url(#fretless)' : 'url(#finger)'
			}));
		}
	}
	this._fingers = fingers;
};

Scalear.Neck.prototype._renderLabels = function(parentEl) {
	var string, noteNumber, content, correction, fretArray,
		stringLabels,
		self = this,
		labels = [];

	labels = this._tunning.slice().map(function(noteNumber, string) {
		fretArray = new Array(self._fretCount + 2).join('0').split('');
		return fretArray.map(function(item, i) {
			content = Scalear.notes[(noteNumber + i) % Scalear.notes.length];
			correction = content.length > 1 ? 1 : 0;

			var hasSharp = content.length > 1;

			return new Svg.Text(parentEl, {
				x: i * self._fretWidth + (self._fretWidth / 2) - 2 - correction,
				y: self._stringDistance * string + (self._stringDistance / 2) + 3,
				textContent: content.replace('♯', ''),
				children: [{
					name: 'tspan',
					dy: -2,
					textContent: hasSharp ? '♯' : ''
				}]
			});
		});
	});

	this._labels = labels;
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
	var self = this;

	this._clear();
	this._scale = (scale || this._scale).slice().map(function(item) {
		return (item + self._rootNote) % Scalear.notes.length;
	});
	this._scale.forEach(function(note) {
		self.showAllNotes(note);
	});
};

Scalear.Neck.prototype._clear = function() {
	var i, j, self = this;

	this._fingers.forEach(function(item, i) {
		item.map(function(finger, j) {
			finger.className = '';
			finger.hide();
			self._labels[i][j].hide();
		});
	});
};

Scalear.Neck.prototype._highlightNotes = function(note) {
	this._fingers.forEach(function(item, i) {
		item.map(function(finger, j) {
			finger.removeClass('highlighted');
		});
	});
	if (note) {
		this._notesMap[note].forEach(function(item) {
			item.addClass('highlighted');
		});
	}
};