Scalear = {};
Scalear.Observable = {
	_registredEvents: [],

	fire: function(eventName) {
		if (this._registredEvents[eventName]) {
			this._registredEvents[eventName].map(function(ev) {
				ev.handler.call(ev.scope);
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
Scalear.Model.prototype.update = function() {
	this.fire('update');
};
/***/
Scalear.View = function() {
	return this;
};
Scalear.View.prototype = Scalear.Observable;
Scalear.View.prototype.render = function() {
	console.warn('virtual method "render", has to be implemented');
};

/***/
Scalear.Neck = function() {

};
Scalear.Neck.prototype = new Scalear.View();
Scalear.Neck.prototype.render = function(svgParent, fretCount, stringsCount) {
	var fretWidth = Math.round(500 / fretCount),
		neck = {
			width: 100,
			height: fretWidth * fretCount
		},
		stringDistance = Math.round(neck.width / 7),
		i;
	this.fretWidth = fretWidth;
	this.stringDistance = stringDistance;
	this.fretCount = fretCount;
	this.stringsCount = stringsCount;

	this.neck = {
		width: 100,
		height: this.fretWidth * this.fretCount
	};

	frets = new Svg.Rectangle(svgParent, {
		className: 'neck',
		x: fretWidth,
		y: 0,
		width: neck.height,
		height: neck.width
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

	for (i = 0; i <= fretCount; i++) {
		new Svg.Line(frets.el, {
			x1: i * fretWidth + fretWidth,
			x2: i * fretWidth + fretWidth,
			y1: 0,
			y2: neck.width
		});
		new Svg.Text(frets.el, {
			x: i * fretWidth - ((fretWidth + 7) / 2) + fretWidth,
			y: 115,
			content: i
		});
	}
	new Svg.Line(frets.el, {
		className: 'zero',
		x1: fretWidth,
		x2: fretWidth,
		y1: 0,
		y2: neck.width
	});
	this._renderMarks(marks.el);
	this._renderStrings(strings.el);
	this._renderFingers(fingers.el);
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

onload = function() {
	var stringCount = 6,
		fretCount = 12,
		neckView = new Scalear.Neck(),
		tunning = [4, 11, 7, 2, 9, 4],
		notesMap = {};

	neckView.render(Svg.get('svg'), fretCount, stringCount);

	var notes = [
		'C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'Bb', 'H'
	];

	for (var i = 0; i < tunning.length; i++) {
		noteNumber = tunning[i];
		for (var fret = 0; fret <= fretCount; fret++) {
			notesMap[noteNumber] = notesMap[noteNumber] || [];
			notesMap[noteNumber].push(neckView.getFinger(i + 1, fret));
			noteNumber++;
			noteNumber = noteNumber % notes.length;
		}
	}

	function showAllNotes(note) {
		for (i = 0; i < notesMap[note].length; i++) {
			notesMap[note][i].show();
		}
	}

	function showScale(scale) {
		for (j = 0; j < scale.notes.length; j++) {
			showAllNotes(scale.notes[j]);
		}
	}

	var scales = [{
		name: "aeolioan",
		notes: [0, 2, 4, 5, 7, 9, 11]
	}, {
		name: "dorian",
		notes: [2, 4, 5, 7, 9, 11, 0]
	}, {
		name: "pentat",
		notes: [0, 2, 4, 7, 9]
	}];

	showScale(scales[0]);

};