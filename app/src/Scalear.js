import Application from './Application.js';
import CONST from './const.js';
import { q } from './shortcuts.js';
import Svg from './svg/Svg.js';
import Neck from './view/Neck.js';
import Box from './view/Box.js';
import Select from './view/Select.js';
import SelectTwoLevel from './view/SelectTwoLevel.js';
import Switch from './view/Switch.js';
import Model from './Model.js';

export default class Scalear extends Application {

	get name() {
		return 'Scalear ' + CONST.version;
	}

	onBoot() {
		this.model = new Model();
		this.prepareUI();
		Object.assign(this.model, JSON.parse(localStorage.defaults || '{}'));
		this.setDefaults();
		this.onRouteChange(this.route);
	}

	setDefaults() {
		q('#name').innerHTML = this.model.scaleName;
		q('#root').innerHTML = this.model.rootNoteName;
		q('#frets-count').value = this.model.fretCount;
		q('nav').className = '';
		q('svg').setAttribute('class', '');
		document.title = this.model.rootNoteName + ' ' + this.model.scaleName + ' (' + this.name + ')';
		if (this.model.namesVisible) {
			q('#note-names').setAttribute('checked', 'checked');
		}
	}

	prepareUI() {
		let neckSelect = new Switch('#necktype .two-values-switch', this.model),
			rootSelect = new Select({
				selector: '#root-selector',
				model: this.model,
				data: CONST.notes,
				watchOption: 'rootNote'
			}),
			scaleSelect = new SelectTwoLevel({
				selector: '#scale-selector',
				propertyName: 'name',
				model: this.model,
				data: CONST.scalesGrouped,
				watchOption: 'scale'
			}),
			instrumentSelect = new SelectTwoLevel({
				selector: '#instrument-selector',
				propertyName: 'name',
				model: this.model,
				data: CONST.instrumentsGrouped,
				watchOption: 'instrument'
			}),
			scaleBox = new Box(Svg.get('svg'), this.model),
			neckView = new Neck(Svg.get('svg'), this.model);

		neckSelect.on('change', e => this.model.neckType = e.target.value);
		scaleSelect.on('change', e => this.model.scale = e.target.value);
		rootSelect.on('change', e => this.model.rootNote = e.target.value);
		instrumentSelect.on('change', e => this.model.instrument = e.target.value);
		q('#note-names').addEventListener('change', e => this.model.namesVisible = e.target.checked);
		q('#frets-count').addEventListener('input', e => this.model.fretCount = e.target.value);
		q('#print').addEventListener('click', e => window.print());
	}

	modelUpdate(model, changeName) {
		switch (changeName) {
			case 'rootNote':
				q('#root').innerHTML = model.rootNoteName;
				document.title = model.rootNoteName + ' ' + model.scaleName + ' (' + this.name + ')';
				break;
			case 'scale':
				q('#name').innerHTML = model.scaleName;
				document.title = model.rootNoteName + ' ' + model.scaleName + ' (' + this.name + ')';
				break;
			case 'neckType':
				document.body.classList[model.neckType === 'fender' ? 'add' : 'remove']('dark');
				break;
		}
		this.route = Application.prepareHashString([
			'', CONST.instruments[model.instrument].name, model.scaleName, model.rootNoteName, ''
		].join('/'));
		localStorage.defaults = model.toJSON();
	}

	onRouteChange(params) {
		let note;

		if (params.length > 0) {
			if (params[2]) {
				for (note = 0; note < CONST.notes.length; note++) {
					let item = CONST.notes[note];
					if (Application.prepareHashString(item) === params[2]) {
						break;
					}
				}
				this.model.rootNote = note;
			}
			if (params[0]) {
				let instrument = CONST.instruments.filter(item => {
					return Application.prepareHashString(item.name) === params[0];
				})[0].id;
				this.model.instrument = instrument;
			}
			if (params[1]) {
				this.model.scale = CONST.scales.filter(item => {
					return Application.prepareHashString(item.name) === params[1];
				})[0].id;
			}
		}
	}
}
