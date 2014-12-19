Scalear.Application = function() {
	this.run();
	return Mvc.Application.call(this);
};

Scalear.Application.prototype = new Mvc.Application();

Scalear.Application.prototype.name = 'Scalear 0.4.1';

Scalear.Application.prototype.onBoot = function() {
	var defaults = JSON.parse(localStorage.defaults);

	Object.keys(Scalear.defaults).forEach(function(key) {
		if (!defaults[key]) {
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
	q('#note-names').checked = this.model.namesVisible;
	q('#frets-count').value = this.model.fretCount;
	q('footer').className = '';
	q('header').className = '';
	q('svg').setAttribute('class', '');
	document.title = Scalear.scales[this.model.scale].name + ' (' + this.name + ')';
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
		self.model.fretCount = parseInt(this.value, 10) || 12;
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
	localStorage.defaults = JSON.stringify(this.model);
};