import Application from './Application.js';
import CONST from './const.js';
import { q } from './shortcuts.js';
import Svg from './svg/Svg.js';
import Neck from './view/Neck.js';
import Box from './view/Box.js';
import Select from './view/Select.js';
import SelectTwoLevel from './view/SelectTwoLevel.js';
import Switch from './view/Switch.js';

export default class Scalear extends Application {

	get name() {
		return 'Scalear ' + CONST.version;
	}
	get neckView() {
		return this._neckView || new Neck(Svg.get('svg'));
	}
	get scaleBox() {
		return this._scaleBox || new Box(Svg.get('svg'));
	}
	get scaleSelect() {
		return this._scaleSelect || new SelectTwoLevel('#scale-selector', this.model.scale, 'name');
	}
	get rootSelect() {
		return this._rootSelect || new Select('#root-selector', this.model.rootNote);
	}
	get instrumentSelect() {
		return this._instrumentSelect || new SelectTwoLevel('#instrument-selector', this.model.instrument, 'name');
	}
	get neckSelect() {
		return this._neckSelect || new Switch('#necktype .two-values-switch', this.model.neckType);
	}

	onBoot() {
		let defaults = JSON.parse(localStorage.defaults || '{}');

		Object.keys(CONST.defaults).forEach(key => {
			if (defaults[key] === undefined) {
				defaults[key] = CONST.defaults[key];
			}
		});
		this.model = defaults;
		this.onRouteChange(this.route);
		this.setDefaults();
		this.setModels();
		this.registerHandlers();
	}

	setDefaults() {
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
		this.neckSelect.on('change', e => {
			this.model.neckType = e.target.value;
		});
		this.scaleSelect.on('change', e => {
			this.model.scale = parseInt(e.target.value, 10);
		});
		this.rootSelect.on('change', e => {
			this.model.rootNote = parseInt(e.target.value, 10);
		});
		this.instrumentSelect.on('change', e => {
			this.model.instrument = parseInt(e.target.value, 10);
		});
		q('#note-names').addEventListener('change', e => {
			this.model.namesVisible = e.target.checked;
		});

		q('#frets-count').addEventListener('change', e => {
			let fretCount = parseInt(e.target.value, 10) || 12;

			fretCount = Math.min(fretCount, 25);
			fretCount = Math.max(fretCount, 10);
			if (fretCount !== this.value) {
				this.value = fretCount;
			}
			this.model.fretCount = fretCount;
		});
		q('#info').addEventListener('click', e => {
			this.hideFullScreen();
		});
		q('#fullscreen').addEventListener('click', e => {
			this.showFullScreen();
		});
		q('#print').addEventListener('click', e => {
			window.print();
		});
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
		let item,
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
				this.model.instrument = CONST.instruments.filter(item => {
					return this._prepareHashString(item.name) === params[0];
				})[0].id;
			}
			if (params[1]) {
				this.model.scale = CONST.scales.filter(item => {
					return this._prepareHashString(item.name) === params[1];
				})[0].id;
			}
		}
	}
}
