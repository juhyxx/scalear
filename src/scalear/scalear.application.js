Scalear.Application = function() {
	this.run();
	return Mvc.Application.call(this);
};

Scalear.Application.prototype = new Mvc.Application();

Scalear.Application.prototype.name = 'Scalear ' + Scalear.version;

Scalear.Application.prototype.onBoot = function() {
	var defaults = JSON.parse(localStorage.defaults || '{}');

	Object.keys(Scalear.defaults).forEach(function(key) {
		if (defaults[key] === undefined) {
			defaults[key] = Scalear.defaults[key];
		}
	});
	this.model = defaults;
	this.createUi();
	this.setDefaults();
	this.setModels();
	this.registerHandlers();
};

Scalear.Application.prototype.createUi = function() {
	this.neckView = new Scalear.Neck(Svg.get('svg'));
	this.scaleBox = new Scalear.Box(Svg.get('svg'));
	this.scaleSelect = new Scalear.SelectTwoLevel('#scale-selector', this.model.scale, 'name');
	this.rootSelect = new Scalear.Select('#root-selector', this.model.rootNote);
	this.instrumentSelect = new Scalear.SelectTwoLevel('#instrument-selector', this.model.instrument, 'name');
};
Scalear.Application.prototype.setDefaults = function() {
	q('#name').innerHTML = Scalear.scales[this.model.scale].name;
	q('#root').innerHTML = Scalear.notes[this.model.rootNote];
	q('#frets-count').value = this.model.fretCount;
	q('footer').className = '';
	q('header').className = '';
	q('svg').setAttribute('class', '');
	document.title = Scalear.scales[this.model.scale].name + ' (' + this.name + ')';
	if (this.model.namesVisible) {
		q('#note-names').setAttribute('checked', 'checked');
	}
};

Scalear.Application.prototype.setModels = function() {
	this.neckView.model = this.model;
	this.scaleBox.model = this.model;
	this.rootSelect.model = Scalear.notes;
	this.scaleSelect.model = Scalear.scalesGrouped;
	this.instrumentSelect.model = Scalear.instrumentsGrouped;
};

Scalear.Application.prototype.registerHandlers = function() {
	var self = this;

	this.scaleSelect.on('change', function() {
		self.model.scale = parseInt(this.value, 10);
	});
	this.rootSelect.on('change', function() {
		self.model.rootNote = parseInt(this.value, 10);
	});
	this.instrumentSelect.on('change', function() {
		self.model.instrument = parseInt(this.value, 10);
	});
	q('#note-names').addEventListener('change', function() {
		self.model.namesVisible = this.checked;
	});
	q('#frets-count').addEventListener('change', function() {
		var fretCount = parseInt(this.value, 10) || 12;

		fretCount = Math.min(fretCount, 25);
		fretCount = Math.max(fretCount, 10);
		if (fretCount !== this.value) {
			this.value = fretCount;
		}
		self.model.fretCount = fretCount;
	});
};

Scalear.Application.prototype.modelUpdate = function(model, changes) {
	changes.forEach(function(change) {
		switch (change.name) {
			case 'rootNote':
				q('#root').innerHTML = Scalear.notes[change.object.rootNote];
				break;
			case 'scale':
				q('#name').innerHTML = Scalear.scales[change.object.scale].name;
				document.title = Scalear.scales[change.object.scale].name + ' (' + this.name + ')';
				break;
		}
	}.bind(this));
	window.location.hash = this._prepareHashString(['',
		Scalear.instruments[model.instrument].name,
		Scalear.scales[model.scale].name,
		Scalear.notes[model.rootNote],
		''
	].join('/'));

	localStorage.defaults = JSON.stringify(this.model);
};

Scalear.Application.prototype._prepareHashString = function(text) {
	return text.toLowerCase().replace(/ /g, '-').replace(/[ \(\)]/g, '').replace(/♯/g, '#');
};

Scalear.Application.prototype.onRouteChange = function(params) {
	var item, note;

	for (note = 0; note < Scalear.notes.length; note++) {
		item = Scalear.notes[note];
		if (this._prepareHashString(item) === params[2]) {
			break;
		}
	}
	this.model.instrument = Scalear.instruments.filter(function(item) {
		return this._prepareHashString(item.name) === params[0];
	}.bind(this))[0].id;

	this.model.scale = scale = Scalear.scales.filter(function(item) {
		return this._prepareHashString(item.name) === params[1];
	}.bind(this))[0].id;

	this.model.rootNote = note;
};