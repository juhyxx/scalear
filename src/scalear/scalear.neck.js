Scalear.Neck = function(svgParent) {
	this._parentEl = svgParent;
	return Mvc.View.call(this);
};

Scalear.Neck.prototype = Object.create(Mvc.View.prototype, {
	tunning: {
		get: function() {
			return Scalear.instruments[this.instrument].tunning;
		}
	},
	stringsCount: {
		get: function() {
			return this.tunning.length;
		}
	},
	neckWidth: {
		get: function() {
			return this.stringDistance * this.stringsCount;
		}
	},
	fretWidth: {
		get: function() {
			return Math.round(this.neckHeight / this.fretCount);
		}
	},
	stringDistance: {
		value: 20
	},
	neckHeight: {
		value: 500,
		writable: true
	},
	fretCount: {
		value: 12,
		writable: true
	},
	neckType: {
		value: 'gibson',
		writable: true
	},
	namesVisible: {
		value: false,
		writable: true
	},
	rootNote: {
		value: 0,
		writable: true
	},
	scale: {
		value: 0,
		writable: true
	},
	instrument: {
		value: 0,
		writable: true
	}

});

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
			this.rootNote = model.rootNote;
			this.scale = Scalear.scales[model.scale].notes.slice();
			this._showScale();
			break;

		default:
			if (this._mainGroup) {
				this._mainGroup.remove();
			}

			this.fretCount = model.fretCount;
			this.neckType = model.neckType;
			this.namesVisible = model.namesVisible;
			this.rootNote = model.rootNote;
			this.scale = Scalear.scales[model.scale].notes.slice();
			this.instrument = model.instrument;

			this._render();
			this._showScale();
			this.labels[model.namesVisible ? 'showWithOpacity' : 'hideWithOpacity']();
			this._highlightNotes(model.highlighted);

			break;
	}
};

Scalear.Neck.prototype._render = function() {
	this._mainGroup = new Svg.Group(this._parentEl, {
		id: 'neck',
		className: this.neckType,
	});
	new Svg.Rectangle(this._mainGroup.el, {
		className: 'neck',
		x: this.fretWidth,
		y: 0,
		width: this.fretCount * this.fretWidth,
		height: this.neckWidth,
		fill: this.neckType === 'fender' ? 'url(#gradientfender)' : 'url(#gradient)',
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
	if (this.instrument !== 6) {
		this._renderShading(shading.el);
	}
	this._renderMarks(marks.el);
	if (this.instrument !== 6) {
		this._renderFrets(frets.el);
	}
	this._renderStrings(strings.el);
	this._renderFingers(fingers.el);
	this._renderLabels(this.labels.el);
};

Scalear.Neck.prototype._renderShading = function(el) {
	for (var i = 0; i < this.fretCount; i++) {
		new Svg.Rectangle(el, {
			x: i * this.fretWidth + this.fretWidth,
			y: 0,
			width: this.fretWidth,
			height: this.neckWidth,
			fill: 'url(#shading)'
		});
	}
};
Scalear.Neck.prototype._renderMarks = function(el) {
	[3, 5, 7, 9, 12, 3 + 12, 5 + 12, 7 + 12, 9 + 12, 12 + 12].map(function(i) {
		if (i <= this.fretCount) {
			if (this.neckType === 'fender') {
				new Svg.Circle(el, {
					x: (i - 1) * this.fretWidth + 1.5 * this.fretWidth,
					y: this.neckWidth / 2,
					radius: this.fretWidth / 8
				});
			} else {
				new Svg.Rectangle(el, {
					x: (i - 1) * this.fretWidth + 5 + this.fretWidth,
					y: 4 * 5,
					height: this.neckWidth - 8 * 5,
					width: this.fretWidth - 2 * 5
				});
			}
		}
	}, this);
};

Scalear.Neck.prototype._renderFrets = function(el) {
	for (var i = 0; i <= this.fretCount; i++) {
		new Svg.Line(el, {
			x1: i * this.fretWidth + this.fretWidth,
			x2: i * this.fretWidth + this.fretWidth,
			y1: 0,
			y2: this.neckWidth
		});
		new Svg.Text(el, {
			x: i * this.fretWidth - this.fretWidth + 2 * this.fretWidth - 2,
			y: this.neckWidth + 10,
			textContent: i
		});
	}
	new Svg.Line(el, {
		className: 'zero',
		x1: this.fretWidth - 2,
		x2: this.fretWidth - 2,
		y1: 0,
		y2: this.neckWidth + 0.6
	});
};

Scalear.Neck.prototype._mapNotes = function(el) {
	var fret, string, note,
		notesMap = new Map(),
		labelsMap = new Map(),
		notesMapItem = [];

	this.tunning.forEach(function(note, string) {
		for (fret = 0; fret <= this.fretCount; fret++) {

			notesMapItem = notesMap.has(note) ? notesMap.get(note) : [];
			notesMapItem.push(this._fingers[string][fret]);
			notesMap.set(note, notesMapItem);

			labelsMap.set(this._fingers[string][fret], this._labels[string][fret]);

			note++;
			note = note % Scalear.notes.length;
		}
	}, this);
	this._notesMap = notesMap;
	this._labelsMap = labelsMap;
};

Scalear.Neck.prototype._renderStrings = function(el) {
	this.tunning.forEach(function(item, i) {
		new Svg.Line(el, {
			x1: 0,
			x2: this.fretWidth + this.fretCount * this.fretWidth,
			y1: i * this.stringDistance + this.stringDistance / 2,
			y2: i * this.stringDistance + this.stringDistance / 2
		});
	}, this);
};

Scalear.Neck.prototype._renderFingers = function(parentEl) {
	var string, i,
		fingers = [];

	for (string = 0; string < this.stringsCount; string++) {
		fingers.push([]);

		for (i = 0; i <= this.fretCount; i++) {
			fingers[string].push(new Svg.Circle(parentEl, {
				x: i * this.fretWidth + this.fretWidth / 2,
				y: (this.stringDistance * string) + this.stringDistance / 2,
				radius: this.stringDistance / 3,
				filter: this.instrument === 6 ? 'url(#fretless)' : 'url(#finger)'
			}));
		}
	}
	this._fingers = fingers;
};

Scalear.Neck.prototype._renderLabels = function(parentEl) {
	var string, noteNumber, content, correction, fretArray,
		hasSharp = false;

	this._labels = this.tunning.slice().map(function(noteNumber, string) {
		fretArray = new Array(this.fretCount + 2).join('0').split('');
		return fretArray.map(function(item, i) {
			content = Scalear.notes[(noteNumber + i) % Scalear.notes.length];
			correction = content.length > 1 ? 1 : 0;
			hasSharp = content.length > 1;

			return new Svg.Text(parentEl, {
				x: i * this.fretWidth + (this.fretWidth / 2) - 2 - correction,
				y: this.stringDistance * string + (this.stringDistance / 2) + 3,
				textContent: content.replace('♯', ''),
				children: [{
					name: 'tspan',
					dy: -2,
					textContent: hasSharp ? '♯' : ''
				}]
			});
		}, this);
	}, this);
};

Scalear.Neck.prototype.showAllNotes = function(note) {
	this._notesMap.get(note).forEach(function(item) {
		item.show();
		this._labelsMap.get(item).show();
		if (note === this.rootNote) {
			item.className = 'root';
		}
	}, this);
};

Scalear.Neck.prototype._showScale = function(scale) {
	this._clear();
	this.scale = (scale || this.scale).slice().map(function(item) {
		return (item + this.rootNote) % Scalear.notes.length;
	}, this);
	this.scale.forEach(function(note) {
		this.showAllNotes(note);
	}, this);
};

Scalear.Neck.prototype._clear = function() {
	this._fingers.forEach(function(item, i) {
		item.map(function(finger, j) {
			finger.hide().className = '';
			this._labelsMap.get(finger).hide();
		}, this);
	}, this);
};

Scalear.Neck.prototype._highlightNotes = function(note) {
	this._fingers.forEach(function(item, i) {
		item.map(function(finger, j) {
			finger.removeClass('highlighted');
		});
	});
	if (note !== undefined) {
		this._notesMap.get(note).forEach(function(item) {
			item.addClass('highlighted');
		});
	}
};