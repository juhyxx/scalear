import Application from './Application.js';
import CONST from './const.js';
import { q } from './shortcuts.js';
import log from './logger.js';
import Svg from './svg/Svg.js';
import Neck from './view/Neck.js';
import Box from './view/Box.js';
import Select from './view/Select.js';
import SelectTwoLevel from './view/SelectTwoLevel.js';
import Switch from './view/Switch.js';

export default class Scalear extends Application {

	constructor() {
		super();
		console.debug('Scalear: constructor');
	}

	onBoot() {
		var defaults = JSON.parse(localStorage.defaults || '{}');

		Object.keys(CONST.defaults).forEach(key => {
			if (defaults[key] === undefined) {
				defaults[key] = CONST.defaults[key];
			}
		});
		this.model = defaults;
		this.onRouteChange(this.route);
		this.createUi();
		this.setDefaults();
		this.setModels();
		this.registerHandlers();
	}

	createUi() {
		this.neckView = new Neck(Svg.get('svg'));
		this.scaleBox = new Box(Svg.get('svg'));
		this.scaleSelect = new SelectTwoLevel('#scale-selector', this.model.scale, 'name');
		this.rootSelect = new Select('#root-selector', this.model.rootNote);
		this.instrumentSelect = new SelectTwoLevel('#instrument-selector', this.model.instrument, 'name');
		this.neckSelect = new Switch('#necktype .two-values-switch', this.model.neckType);
	}

	setDefaults() {
		console.debug('Scalear: setDefaults');
		q('#name').innerHTML = CONST.scales[this.model.scale].name;
		q('#root').innerHTML = CONST.notes[this.model.rootNote];
		q('#frets-count').value = this.model.fretCount;
		q('footer').className = '';
		q('header').className = '';
		q('svg').setAttribute('class', '');
		document.body.classList[this.model.neckType === 'fender' ? 'add' : 'remove']('dark');
		document.title = CONST.notes[this.model.rootNote] + ' ' + CONST.scales[this.model.scale].name + ' (' + this.name + ')';
		if (this.model.namesVisible) {
			q('#note-names').setAttribute('checked', 'checked');
		}
	}

	setModels() {
		this.neckSelect.model = this.model;
		this.neckView.model = this.model;
		this.scaleBox.model = this.model;
		this.rootSelect.model = CONST.notes;
		this.scaleSelect.model = CONST.scalesGrouped;
		this.instrumentSelect.model = CONST.instrumentsGrouped;
	}

	registerHandlers() {
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
		q('#note-names').addEventListener('keydown', function(e) {
			if (e.keyCode === 13) {
				self.model.namesVisible = !self.model.namesVisible;
				this.checked = self.model.namesVisible;
			}
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
		q('#fullscreen').addEventListener('keydown', function(e) {
			if (e.keyCode === 13) {
				this.showFullScreen();
			}
		}.bind(this));

		q('#print').addEventListener('click', function(e) {
			window.print();
		}.bind(this));
		q('#print').addEventListener('keydown', function(e) {
			if (e.keyCode === 13) {
				window.print();
			}
		}.bind(this));

		applicationCache.addEventListener('updateready', function() {
			q('#version-info').style.display = 'block';
		}, false);
	}

	modelUpdate(model, changes) {
		changes.forEach(function(change) {
			switch (change.name) {
				case 'rootNote':
					q('#root').innerHTML = CONST.notes[change.object.rootNote];
					document.title = CONST.notes[this.model.rootNote] + ' ' + CONST.scales[this.model.scale].name + ' (' + this.name + ')';
					break;
				case 'scale':
					q('#name').innerHTML = CONST.scales[change.object.scale].name;
					document.title = CONST.notes[this.model.rootNote] + ' ' + CONST.scales[this.model.scale].name + ' (' + this.name + ')';
					break;

				case 'neckType':
					document.body.classList[this.model.neckType === 'fender' ? 'add' : 'remove']('dark');
					break;
			}
		}.bind(this));
		this.route = this._prepareHashString(['',
			CONST.instruments[model.instrument].name,
			CONST.scales[model.scale].name,
			CONST.notes[model.rootNote],
			''
		].join('/'));

		localStorage.defaults = JSON.stringify(this.model);
	}

	_prepareHashString(text) {
		return text.toLowerCase().replace(/ /g, '-').replace(/[ \(\)]/g, '').replace(/♯/g, '#');
	}

	onRouteChange(params) {
		var item,
			note;

		if (params.length > 0) {
			if (params[2]) {
				for (note = 0; note < CONST.notes.length; note++) {
					item = CONST.notes[note];
					if (this._prepareHashString(item) === params[2]) {
						break;
					}
				}
				this.model.rootNote = note;
			}
			if (params[0]) {
				this.model.instrument = CONST.instruments.filter(function(item) {
					return this._prepareHashString(item.name) === params[0];
				}.bind(this))[0].id;
			}
			if (params[1]) {
				this.model.scale = scale = CONST.scales.filter(function(item) {
					return this._prepareHashString(item.name) === params[1];
				}.bind(this))[0].id;
			}
		}
	}



}
