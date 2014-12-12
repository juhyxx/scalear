Scalear = {
	notes: [
		'C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'Bb', 'H'
	]
};
Scalear.Observable = {
	_registredEvents: [],

	fire: function(eventName) {
		var args = Array.apply(null, arguments);
		args.shift();

		if (this._registredEvents[eventName]) {
			this._registredEvents[eventName].map(function(ev) {
				ev.handler.apply(ev.scope, args);
			});
		}
	},

	on: function(eventName, fn, scope) {
		this._registredEvents[eventName] = this._registredEvents[eventName] || [];

		this._registredEvents[eventName].push({
			handler: fn,
			scope: scope
		});
	}
};

Scalear.Model = function() {
	return this;
};
Scalear.Model.prototype = Scalear.Observable;
Scalear.Model.prototype.setData = function(data) {
	this._data = data;
	this.fire('update', data);
};
/***/
Scalear.View = function() {

};
Scalear.View.prototype = Scalear.Observable;
Scalear.View.prototype.render = function() {
	console.warn('virtual method "render", has to be implemented');
};

/***/
Scalear.Neck = function(tunning, fretCount, stringsCount) {
	var noteNumber, notesMap = {};
	this._tunning = tunning;
	this.fretCount = fretCount;
	this.fretWidth = Math.round(500 / fretCount);
	this.neck = {
		width: 100,
		height: this.fretWidth * this.fretCount
	};
	this.stringDistance = Math.round(this.neck.width / 7);
	this.stringsCount = stringsCount;
	return this;
};
Scalear.Neck.prototype = new Scalear.View();
Scalear.Neck.prototype.render = function(svgParent) {
	var i;

	new Svg.Rectangle(svgParent, {
		className: 'neck',
		x: this.fretWidth,
		y: 0,
		width: this.neck.height,
		height: this.neck.width
	});

	frets = new Svg.Group(svgParent, {
		className: 'frets'
	});

	marks = new Svg.Group(svgParent, {
		className: 'marks'
	});

	strings = new Svg.Group(svgParent, {
		className: 'strings'
	});
	fingers = new Svg.Group(svgParent, {
		className: 'fingers'
	});

	this._renderMarks(marks.el);
	this._renderFrets(frets.el);
	this._renderStrings(strings.el);
	this._renderFingers(fingers.el);
	this._mapNotes();
};
Scalear.Neck.prototype._renderMarks = function(el) {
	var self = this;
	[3, 5, 7, 9, 12].map(function(i) {
		new Svg.Rectangle(el, {
			x: (i - 1) * self.fretWidth + 5 + self.fretWidth,
			y: 5,
			height: self.neck.width - 2 * 5,
			width: self.fretWidth - 2 * 5
		});
	});
};
Scalear.Neck.prototype._renderFrets = function(el) {
	for (i = 0; i <= this.fretCount; i++) {
		new Svg.Line(el, {
			x1: i * this.fretWidth + this.fretWidth,
			x2: i * this.fretWidth + this.fretWidth,
			y1: 0,
			y2: this.neck.width
		});
		new Svg.Text(el, {
			x: i * this.fretWidth - ((this.fretWidth + 7) / 2) + this.fretWidth,
			y: 115,
			content: i
		});
	}
	new Svg.Line(el, {
		className: 'zero',
		x1: this.fretWidth,
		x2: this.fretWidth,
		y1: 0,
		y2: this.neck.width
	});
};

Scalear.Neck.prototype._mapNotes = function(el) {
	var notesMap = [];

	for (i = 0; i < this._tunning.length; i++) {
		noteNumber = this._tunning[i];
		for (var fret = 0; fret <= this.fretCount; fret++) {
			notesMap[noteNumber] = notesMap[noteNumber] || [];
			notesMap[noteNumber].push(this.getFinger(i + 1, fret));
			noteNumber++;
			noteNumber = noteNumber % Scalear.notes.length;
		}
	}
	this._notesMap = notesMap;
};

Scalear.Neck.prototype._renderStrings = function(el) {
	for (i = 1; i <= this.stringsCount; i++) {
		new Svg.Line(el, {
			x1: 0,
			x2: this.neck.height + this.fretWidth,
			y1: i * this.stringDistance,
			y2: i * this.stringDistance
		});
	}
};

Scalear.Neck.prototype._renderFingers = function(svgParent) {
	this.fingers = [];

	for (var string = 1; string <= this.stringsCount; string++) {
		this.fingers.push([]);

		for (var i = 0; i <= this.fretCount; i++) {
			this.fingers[string - 1].push(new Svg.Circle(svgParent, {
				x: i * this.fretWidth + this.fretWidth / 2,
				y: this.stringDistance * string,
				radius: this.stringDistance / 2.5
			}));
		}
	}
};

Scalear.Neck.prototype.getFinger = function(string, fret) {
	return this.fingers[string - 1][fret];
};

Scalear.Neck.prototype.setRootFinger = function(string, fret) {
	this.getFinger(string, fret).addClass('root');
};

Scalear.Neck.prototype.showAllNotes = function(note) {
	for (var i = 0; i < this._notesMap[note].length; i++) {
		this._notesMap[note][i].show();
	}
};

Scalear.Neck.prototype.showScale = function(scale) {
	this._clear();
	for (var j = 0; j < scale.length; j++) {
		this.showAllNotes(scale[j]);
	}
};

Scalear.Neck.prototype._clear = function() {
	for (var i = 0; i < this.stringsCount; i++) {
		for (var j = 0; j < this.fingers[i].length; j++) {
			this.fingers[i][j].hide();
		}
	}
};

onload = function() {
	var stringCount = 6,
		fretCount = 12,
		tunning = [4, 11, 7, 2, 9, 4],
		scales = [{
			name: "Aeolioan",
			notes: [0, 2, 4, 5, 7, 9, 11]
		}, {
			name: "Dorian",
			notes: [2, 4, 5, 7, 9, 11, 0]
		}, {
			name: "Pentat",
			notes: [0, 2, 4, 7, 9]
		}],
		neckView = new Scalear.Neck(tunning, fretCount, stringCount),
		model = new Scalear.Model();

	neckView.on('update', function(data) {
		neckView.showScale(data);
	}, this);
	neckView.render(Svg.get('svg'));
	model.setData(scales[1].notes);

	document.querySelector('select').addEventListener('change', function() {
		var id = parseInt(document.querySelector('select').value, 10);
		model.setData(scales[id].notes);
	});
};