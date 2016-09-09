import log from '../logger.js';
import View from '../View.js';
import CONST from '../const.js';
import SvgGroup from '../svg/element/Group.js';
import SvgCircle from '../svg/element/Circle.js';
import SvgRectangle from '../svg/element/Rectangle.js';
import SvgLine from '../svg/element/Line.js';
import SvgText from '../svg/element/Text.js';

export default class Neck extends View {

	get instrument() {
		return this._instrument || 0;
	}
	set instrument(instrument) {
		this._instrument = instrument;
	}
	get tunning() {
		return CONST.instruments[this.instrument.value].tunning;
	}
	set tunning(tunning) {
		return this._tunning = tunning;
	}
	get stringsCount() {
		return this.tunning.length;
	}
	get neckWidth() {
		return this.stringDistance.value * this.stringsCount;
	}
	get fretWidth() {

		return Math.round(this.neckHeight.value / this.fretCount);
	}
	get stringDistance() {
		return {value: 20};
	}
	get neckHeight() {
		return {value: 500,writable: true};
	}
	get fretCount() {
		return this._fretCount || {value: 12,writable: true};
	}
	set fretCount(fretCount) {
		return this._fretCount = fretCount;
	}
	get neckType() {
		return this._neckType || {value: 'gibson',writable: true};
	}
	set neckType(neckType) {
		return this._neckType = neckType;
	}
	get namesVisible() {
		return this._namesVisible || {value: false,writable: true};
	}
	set namesVisible(namesVisible) {
		return this._namesVisible = namesVisible;
	}
	get rootNote() {
		return this._rootNote || {value: 0,writable: true};
	}
	set rootNote(rootNote) {
		return this._rootNote = rootNote;
	}
	get scale() {
		return this._scale || {value: 0,writable: true};
	}
	set scale(scale) {
		return this._scale = scale;
	}
	get instrument() {
		return {value: 0,writable: true};
	}

	static get(selector) {
		return document.querySelector(selector);
	}

	constructor(svgParent) {
		console.debug('Neck: constructor', svgParent);
		super();
		this._parentEl = svgParent;
	}


	modelUpdate(model, changes) {
		console.debug('Neck: modelUpdate');
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
				this.scale = CONST.scales[model.scale].notes.slice();
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
				this.scale = CONST.scales[model.scale].notes.slice();
				this.instrument = model.instrument;

				this._render();
				this._showScale();
				this.labels[model.namesVisible ? 'showWithOpacity' : 'hideWithOpacity']();
				this._highlightNotes(model.highlighted);

				break;
		}
	}

	_render() {
		this._mainGroup = new SvgGroup(this._parentEl, {
			id: 'neck',
			className: this.neckType
		});debugger
		new SvgRectangle(this._mainGroup.el, {
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
	}

	_renderGroups(el) {
		var shading = new SvgGroup(el, {className: 'shading'}),
			frets = new SvgGroup(el, {className: 'frets'}),
			marks = new SvgGroup(el, {className: 'marks'}),
			strings = new SvgGroup(el, {className: 'strings'}),
			fingers = new SvgGroup(el, {className: 'fingers'});

		this.labels = new SvgGroup(el, {
			className: 'labels',
			children: [{
				name: 'animate',
				id: 'fadein',
				attributeType: 'CSS',
				attributeName: 'opacity',
				from: '0',
				to: '1',
				dur: '1s',
				fill: 'freeze',
				begin: 'indefinite'
			}, {
				name: 'animate',
				id: 'fadeout',
				attributeType: 'CSS',
				attributeName: 'opacity',
				from: '1',
				to: '0',
				dur: '1s',
				fill: 'freeze',
				begin: 'indefinite'

			}]
		});
		if (this.instrument !== 6 && this.instrument !== 12) {
			this._renderShading(shading.el);
		}
		this._renderMarks(marks.el);
		if (this.instrument !== 6 && this.instrument !== 12) {
			this._renderFrets(frets.el);
		}
		this._renderStrings(strings.el);
		this._renderFingers(fingers.el);
		this._renderLabels(this.labels.el);
	}

	_renderShading(el) {
		for (var i = 0; i < this.fretCount; i++) {
			new SvgRectangle(el, {
				x: i * this.fretWidth + this.fretWidth,
				y: 0,
				width: this.fretWidth,
				height: this.neckWidth,
				fill: 'url(#shading)'
			});
		}
	}
	_renderMarks(el) {
		[3, 5, 7, 9, 12, 3 + 12, 5 + 12, 7 + 12, 9 + 12, 12 + 12].map((i) => {
			if (i <= this.fretCount) {
				if (this.neckType === 'fender') {
					new SvgCircle(el, {
						x: (i - 1) * this.fretWidth + 1.5 * this.fretWidth,
						y: this.neckWidth / 2,
						radius: this.fretWidth / 8
					});
				} else {
					new SvgRectangle(el, {
						x: (i - 1) * this.fretWidth + 5 + this.fretWidth,
						y: 4 * 5,
						height: this.neckWidth - 8 * 5,
						width: this.fretWidth - 2 * 5
					});
				}
			}
		}, this);
	}

	_renderFrets(el) {
		for (var i = 0; i <= this.fretCount; i++) {
			new SvgLine(el, {
				x1: i * this.fretWidth + this.fretWidth,
				x2: i * this.fretWidth + this.fretWidth,
				y1: 0,
				y2: this.neckWidth
			});
			new SvgText(el, {
				x: i * this.fretWidth - this.fretWidth + 2 * this.fretWidth - 2,
				y: this.neckWidth + 10,
				textContent: i
			});
		}
		new SvgLine(el, {
			className: 'zero',
			x1: this.fretWidth - 2,
			x2: this.fretWidth - 2,
			y1: 0,
			y2: this.neckWidth + 0.6
		});
	}

	_mapNotes(el) {
		var fret,
			string,
			note,
			notesMap = new Map(),
			labelsMap = new Map(),
			notesMapItem = [];

		this.tunning.forEach((note, string) => {
			for (fret = 0; fret <= this.fretCount; fret++) {
				notesMapItem = notesMap.has(note) ? notesMap.get(note) : [];
				notesMapItem.push(this._fingers[string][fret]);
				notesMap.set(note, notesMapItem);

				labelsMap.set(this._fingers[string][fret], this._labels[string][fret]);

				note++;
				note = note % CONST.notes.length;
			}
		});
		this._notesMap = notesMap;
		this._labelsMap = labelsMap;
	}

	_renderStrings(el) {
		this.tunning.forEach((item, i) => {
			new SvgLine(el, {
				x1: 0,
				x2: this.fretWidth + this.fretCount * this.fretWidth,
				y1: i * this.stringDistance + this.stringDistance / 2,
				y2: i * this.stringDistance + this.stringDistance / 2
			});
		}, this);
	}

	_renderFingers(parentEl) {
		var string,
			i,
			fingers = [];

		for (string = 0; string < this.stringsCount; string++) {
			fingers.push([]);

			for (i = 0; i <= this.fretCount; i++) {
				fingers[string].push(new SvgCircle(parentEl, {
					x: i * this.fretWidth + this.fretWidth / 2,
					y: (this.stringDistance * string) + this.stringDistance / 2,
					radius: this.stringDistance / 3,
					filter: this.instrument === 6 || this.instrument === 12 ? 'url(#fretless)' : 'url(#finger)'
				}));
			}
		}
		this._fingers = fingers;
	}

	_renderLabels(parentEl) {
		var string,
			noteNumber,
			content,
			correction,
			fretArray,
			hasSharp = false;

		this._labels = this.tunning.slice().map((noteNumber, string) => {
			fretArray = new Array(this.fretCount + 2).join('0').split('');
			return fretArray.map((item, i) => {
				content = CONST.notes[(noteNumber + i) % CONST.notes.length];
				correction = content.length > 1 ? 1 : 0;
				hasSharp = content.length > 1;

				return new SvgText(parentEl, {
					x: i * this.fretWidth + (this.fretWidth / 2) - 2 - correction,
					y: this.stringDistance * string + (this.stringDistance / 2) + 3,
					textContent: content.replace('♯', ''),
					children: [{
						name: 'tspan',
						dy: -2,
						textContent: hasSharp ? '♯' : ''
					}]
				});
			});
		});
	}

	showAllNotes(note) {
		this._notesMap.get(note).forEach((item) => {
			item.show();
			this._labelsMap.get(item).show();
			if (note === this.rootNote) {
				item.className = 'root';
			}
		});
	}

	_showScale(scale) {
		this._clear();
		this.scale = (scale || this.scale).slice().map((item) => {
			return (item + this.rootNote) % CONST.notes.length;
		});
		this.scale.forEach((note) => {
			this.showAllNotes(note);
		});
	}

	_clear() {
		this._fingers.forEach((item, i) => {
			item.map((finger, j) => {
				finger.hide().className = '';
				this._labelsMap.get(finger).hide();
			});
		});
	}

	_highlightNotes(note) {
		this._fingers.forEach((item, i) => {
			item.map((finger, j) => {
				finger.removeClass('highlighted');
			});
		});
		if (note !== undefined) {
			this._notesMap.get(note).forEach((item) => {
				item.addClass('highlighted');
			});
		}
	}

}
