import View from '../View.js';

import { scales } from '../enums/scales.js';
import { notes } from '../enums/notes.js';
import { intervals } from '../enums/intervals.js';

import SvgGroup from '../svg/element/Group.js';
import SvgCircle from '../svg/element/Circle.js';
import SvgRectangle from '../svg/element/Rectangle.js';
import SvgLine from '../svg/element/Line.js';
import SvgText from '../svg/element/Text.js';
import SvgPolyline from '../svg/element/Polyline.js';

export default class Box extends View {

	constructor(svgParent, model) {
		super();
		this._parentEl = svgParent;
		this.model = model;
		this.modelUpdate(this.model);
	}

	modelUpdate(model, changeName) {
		switch (changeName) {
			case 'highlighted':
			case 'rootNote':
			case 'scale':
				this.showScale(model.scale, model.rootNote);
				break;
		}
	}

	showScale(scaleId, rootNote) {
		if (this._mainGroup) {
			this._mainGroup.remove();
		}

		let scale = scales[scaleId].notes.slice().map(item => {
			return (item + rootNote) % notes.length;
		});

		this._mainGroup = new SvgGroup(this._parentEl, {
			id: 'scale-box',
			transform: 'translate(' + (250 - (-50 + scale.length * 28) / 2) + ',120)'
		});

		scale.forEach((item, index) => {
			if (index < scale.length - 1) {
				new SvgText(this._mainGroup.el, {
					x: 26 + 30 * index,
					y: 50,
					className: 'interval',
					textContent: intervals[scales[scaleId].notes[index + 1] - scales[scaleId].notes[index]]
				});

				new SvgLine(this._mainGroup.el, {
					x1: 25 + 30 * index,
					x2: 35 + 30 * index,
					y1: 59,
					y2: 59
				});
				new SvgPolyline(this._mainGroup.el, {
					points: [
						[16 + 30 * index, 52],
						[16 + 30 * index, 47],
						[23 + 30 * index, 47]
					]
				});

				new SvgPolyline(this._mainGroup.el, {
					points: [
						[37 + 30 * index, 47],
						[44 + 30 * index, 47],
						[44 + 30 * index, 52]
					]
				});
			}

			let content = notes[item],
				hasSharp = content.length > 1,
				noteName = new SvgText(this._mainGroup.el, {
					x: 10 + 30 * index,
					y: 65,
					note: item,
					className: index === 0 ? 'root' : undefined,
					textContent: content

				});

			if (this.model.highlighted !== undefined && this.model.highlighted === item) {
				noteName.addClass('highlighted');
			}

			noteName.el.addEventListener('click', () => {
				if (noteName.hasClass('highlighted')) {
					noteName.removeClass('highlighted');
					this.model.highlighted = undefined;
				} else {
					let items = document.querySelectorAll('#scale-box text.highlighted');

					for (let i = 0, item = items[i]; i < items.length; i++) {
						item.setAttribute('class', item.getAttribute('class').replace('highlighted', '') || '');
					}
					noteName.addClass('highlighted');
					this.model.highlighted = parseInt(noteName.el.getAttribute('note'), 10);
				}
			}, false);
			new SvgText(this._mainGroup.el, {
				x: 13 + 30 * index,
				y: 75,
				className: 'interval',
				textContent: intervals[scales[scaleId].notes[index]]
			});
		});
	}


}
