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
	this.onRouteChange(this.route);
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
	this.neckSelect = new Scalear.Switch('#necktype .two-values-switch', this.model.neckType);
};

Scalear.Application.prototype.setDefaults = function() {
	q('#name').innerHTML = Scalear.scales[this.model.scale].name;
	q('#root').innerHTML = Scalear.notes[this.model.rootNote];
	q('#frets-count').value = this.model.fretCount;
	q('footer').className = '';
	q('header').className = '';
	q('svg').setAttribute('class', '');
	document.body.classList[this.model.neckType === 'fender' ? 'add' : 'remove']('dark');
	document.title = Scalear.notes[this.model.rootNote] + ' ' + Scalear.scales[this.model.scale].name + ' (' + this.name + ')';
	if (this.model.namesVisible) {
		q('#note-names').setAttribute('checked', 'checked');
	}
};

Scalear.Application.prototype.setModels = function() {
	this.neckSelect.model = this.model;
	this.neckView.model = this.model;
	this.scaleBox.model = this.model;
	this.rootSelect.model = Scalear.notes;
	this.scaleSelect.model = Scalear.scalesGrouped;
	this.instrumentSelect.model = Scalear.instrumentsGrouped;
};

Scalear.Application.prototype.registerHandlers = function() {
	var self = this;

	this.neckSelect.on('change', function() {
		self.model.neckType = this.value;
	});
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
	q('#info').addEventListener('click', function(e) {
		this.hideFullScreen();
	}.bind(this));
	q('#fullscreen').addEventListener('click', function(e) {
		this.showFullScreen();
	}.bind(this));
	q('#print').addEventListener('click', function(e) {
		window.print();
	}.bind(this));
};

Scalear.Application.prototype.modelUpdate = function(model, changes) {
	changes.forEach(function(change) {
		switch (change.name) {
			case 'rootNote':
				q('#root').innerHTML = Scalear.notes[change.object.rootNote];
				document.title = Scalear.notes[this.model.rootNote] + ' ' + Scalear.scales[this.model.scale].name + ' (' + this.name + ')';
				break;
			case 'scale':
				q('#name').innerHTML = Scalear.scales[change.object.scale].name;
				document.title = Scalear.notes[this.model.rootNote] + ' ' + Scalear.scales[this.model.scale].name + ' (' + this.name + ')';
				break;

			case 'neckType':
				document.body.classList[this.model.neckType === 'fender' ? 'add' : 'remove']('dark');
				break;
		}
	}.bind(this));
	this.route = this._prepareHashString(['',
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

	if (params.length > 0) {
		if (params[2]) {
			for (note = 0; note < Scalear.notes.length; note++) {
				item = Scalear.notes[note];
				if (this._prepareHashString(item) === params[2]) {
					break;
				}
			}
			this.model.rootNote = note;
		}
		if (params[0]) {
			this.model.instrument = Scalear.instruments.filter(function(item) {
				return this._prepareHashString(item.name) === params[0];
			}.bind(this))[0].id;
		}
		if (params[1]) {
			this.model.scale = scale = Scalear.scales.filter(function(item) {
				return this._prepareHashString(item.name) === params[1];
			}.bind(this))[0].id;
		}
	}
};