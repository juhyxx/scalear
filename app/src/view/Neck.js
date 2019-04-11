import View from '../View.js';

import { scales } from '../enums/scales.js';
import { instruments } from '../enums/instruments.js';
import { notes } from '../enums/notes.js';
import SvgGroup from '../svg/element/Group.js';
import SvgCircle from '../svg/element/Circle.js';
import SvgRectangle from '../svg/element/Rectangle.js';
import SvgLine from '../svg/element/Line.js';
import SvgText from '../svg/element/Text.js';
import { q } from '../shortcuts.js';
import { keys } from '../enums/keys.js';

export default class Neck extends View {

	constructor(svgParent, model) {
		super();
		this._parentEl = svgParent;
		this.model = model;
		this.modelUpdate(this.model);
	}

	modelUpdate(model, changeName) {
		switch (changeName) {
			case 'highlighted':
				this.highlightNotes(model.highlighted);
				break;
			case 'namesVisible':
				this.labels[model.namesVisible ? 'showWithOpacity' : 'hideWithOpacity']();
				break;
			case 'rootNote':
			case 'scale':
				this.showScale();
				break;
			default:
				if (this._mainGroup) {
					this._mainGroup.remove();
				}
				this.render();
				this.showScale(model.scale);
				this.labels[model.namesVisible ? 'showWithOpacity' : 'hideWithOpacity']();
				this.highlightNotes(model.highlighted);
				break;
		}
	}

	render() {
		this._mainGroup = new SvgGroup(this._parentEl, {
			id: 'neck',
			className: this.model.neckType
		});
		new SvgRectangle(this._mainGroup.el, {
			className: 'neck',
			x: this.model.fretWidth,
			y: 0,
			width: this.model.fretCount * this.model.fretWidth,
			height: this.model.neckWidth,
			fill: this.model.neckType === 'fender' ? 'url(#gradientfender)' : 'url(#gradient)',
			filter: 'url(#neckshadow)'
		});

		this.renderGroups(this._mainGroup.el);
		this.mapNotes();
	}

	renderGroups(el) {
		let shading = new SvgGroup(el, {className: 'shading'}),
			frets = new SvgGroup(el, {className: 'frets'}),
			marks = new SvgGroup(el, {className: 'marks'}),
			strings = new SvgGroup(el, {className: 'strings'}),
			fingers = new SvgGroup(el, {className: 'fingers'});

		this.labels = new SvgGroup(el, {className: 'labels'});
		if (!instruments[this.model.instrument].fretless) {
			this.renderShading(shading.el);
		}
		this.renderMarks(marks.el);
		if (!instruments[this.model.instrument].fretless) {
			this.renderFrets(frets.el);
		}
		this.renderStrings(strings.el);
		this.renderFingers(fingers.el);
		this.renderLabels(this.labels.el);
	}

	renderShading(el) {
		for (let i = 0; i < this.model.fretCount; i++) {
			new SvgRectangle(el, {
				x: i * this.model.fretWidth + this.model.fretWidth,
				y: 0,
				width: this.model.fretWidth,
				height: this.model.neckWidth,
				fill: 'url(#shading)'
			});
		}
	}
	renderMarks(el) {
		[3, 5, 7, 9, 12, 3 + 12, 5 + 12, 7 + 12, 9 + 12, 12 + 12].map(i => {
			if (i <= this.model.fretCount) {
				if (i % 12 === 0) {
					new SvgCircle(el, {
						x: (i - 1) * this.model.fretWidth + 1.5 * this.model.fretWidth - 3,
						y: this.model.neckWidth + 8,
						radius: 2,
						className: 'border'
					});
					new SvgCircle(el, {
						x: (i - 1) * this.model.fretWidth + 1.5 * this.model.fretWidth + 3,
						y: this.model.neckWidth + 8,
						radius: 2,
						className: 'border'
					});
					if (this.model.neckType === 'fender') {
						new SvgCircle(el, {
							x: (i - 1) * this.model.fretWidth + 1.5 * this.model.fretWidth,
							y: this.model.stringDistance + this.model.neckWidth / 2,
							radius: this.model.fretWidth / 8
						});
						new SvgCircle(el, {
							x: (i - 1) * this.model.fretWidth + 1.5 * this.model.fretWidth,
							y: -this.model.stringDistance + this.model.neckWidth / 2,
							radius: this.model.fretWidth / 8
						});
					} else {
						new SvgRectangle(el, {
							x: (i - 1) * this.model.fretWidth + 5 + this.model.fretWidth,
							y: (5) + (this.model.neckWidth) / 2,
							height: (this.model.neckWidth - 10 * 5) / 2,
							width: this.model.fretWidth - 2 * 5
						});
						new SvgRectangle(el, {
							x: (i - 1) * this.model.fretWidth + 5 + this.model.fretWidth,
							y: 4 * 5,
							height: (this.model.neckWidth - 10 * 5) / 2,
							width: this.model.fretWidth - 2 * 5
						});
					}

				} else {
					new SvgCircle(el, {
						x: ((i - 1) * this.model.fretWidth) + 1.5 * this.model.fretWidth,
						y: this.model.neckWidth + 8,
						radius: 2,
						className: 'border'
					});
					if (this.model.neckType === 'fender') {
						new SvgCircle(el, {
							x: (i - 1) * this.model.fretWidth + 1.5 * this.model.fretWidth,
							y: this.model.neckWidth / 2,
							radius: this.model.fretWidth / 8
						});
					} else {
						new SvgRectangle(el, {
							x: (i - 1) * this.model.fretWidth + 5 + this.model.fretWidth,
							y: 4 * 5,
							height: this.model.neckWidth - 8 * 5,
							width: this.model.fretWidth - 2 * 5
						});
					}
				}
			}
		}, this);
	}

	renderFrets(el) {
		for (let i = 0; i <= this.model.fretCount; i++) {
			new SvgLine(el, {
				x1: i * this.model.fretWidth + this.model.fretWidth,
				x2: i * this.model.fretWidth + this.model.fretWidth,
				y1: 0,
				y2: this.model.neckWidth
			});
			new SvgText(el, {
				x: i * this.model.fretWidth - this.model.fretWidth + 2 * this.model.fretWidth - 2,
				y: this.model.neckWidth + 10,
				textContent: i
			});
		}
		new SvgLine(el, {
			className: 'zero',
			x1: this.model.fretWidth - 2,
			x2: this.model.fretWidth - 2,
			y1: 0,
			y2: this.model.neckWidth + 0.6
		});
	}

	mapNotes(el) {
		let fret,
			notesMap = new Map(),
			labelsMap = new Map(),
			notesMapItem = [];

		this.model.tunning.forEach((note, string) => {
			for (fret = 0; fret <= this.model.fretCount; fret++) {
				notesMapItem = notesMap.has(note) ? notesMap.get(note) : [];
				notesMapItem.push(this._fingers[string][fret]);
				notesMap.set(note, notesMapItem);
				labelsMap.set(this._fingers[string][fret], this._labels[string][fret]);
				note++;
				note = note % notes.length;
			}
		});
		this._notesMap = notesMap;
		this._labelsMap = labelsMap;
	}

	renderStrings(el) {
		this.model.tunning.forEach((item, i) => {
			new SvgLine(el, {
				x1: 0,
				x2: this.model.fretWidth + this.model.fretCount * this.model.fretWidth,
				y1: i * this.model.stringDistance + this.model.stringDistance / 2,
				y2: i * this.model.stringDistance + this.model.stringDistance / 2
			});
		}, this);
	}

	renderFingers(parentEl) {
		let string,
			i,
			fingers = [];

		for (string = 0; string < this.model.stringsCount; string++) {
			fingers.push([]);

			for (i = 0; i <= this.model.fretCount; i++) {
				fingers[string].push(new SvgCircle(parentEl, {
					x: i * this.model.fretWidth + this.model.fretWidth / 2,
					y: (this.model.stringDistance * string) + this.model.stringDistance / 2,
					radius: this.model.stringDistance / 3
				}));
			}
		}
		this._fingers = fingers;
	}

	renderLabels(parentEl) {
		let string,
			noteNumber,
			content,
			correction,
			fretArray,
			hasSharp = false;

		this._labels = this.model.tunning.slice().map((noteNumber, string) => {
			fretArray = new Array(this.model.fretCount + 2).join('0').split('');
			return fretArray.map((item, i) => {
				content = keys.flat[(noteNumber + i) % notes.length];
				correction = content.length > 1 ? 1 : 0;
				hasSharp = content.length > 1;
				console.log(content);

				return new SvgText(parentEl, {
					x: i * this.model.fretWidth + (this.model.fretWidth / 2) - 2 - correction,
					y: this.model.stringDistance * string + (this.model.stringDistance / 2) + 3,
					textContent: content
				});
			});
		});
	}

	showAllNotes(note) {
		this._notesMap.get(note).forEach((item) => {
			item.show();
			this._labelsMap.get(item).show();
			if (note === this.model.rootNote) {
				item.className = 'root';
				this._labelsMap.get(item).className = 'root';
			} else {
				this._labelsMap.get(item).className = '';
			}
		});
	}

	showScale(scale) {
		this.clear();
		(scales[scale || this.model.scale].notes).slice().map(item => (item + this.model.rootNote) % notes.length).forEach((note) => this.showAllNotes(note));
	}

	clear() {
		this._fingers = this._fingers || [];
		this._fingers.forEach((item, i) => {
			item.map((finger, j) => {
				finger.hide().className = '';
				this._labelsMap.get(finger).hide();
			});
		});
	}

	highlightNotes(note) {
		this._fingers.forEach(item => item.map(finger => finger.removeClass('highlighted')));
		if (note !== undefined) {
			this._notesMap.get(note).forEach(item => item.addClass('highlighted'));
		}
	}
}
