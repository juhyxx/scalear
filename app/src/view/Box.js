import log from '../logger.js';
import View from '../View.js';
import CONST from '../const.js';
import SvgGroup from '../svg/element/Group.js';
import SvgCircle from '../svg/element/Circle.js';
import SvgRectangle from '../svg/element/Rectangle.js';
import SvgLine from '../svg/element/Line.js';
import SvgText from '../svg/element/Text.js';
import SvgPolyline from '../svg/element/Polyline.js';

export default class Box extends View {

	constructor(svgParent) {
		super();
		this._parentEl = svgParent;
	}

	modelUpdate(model, changes) {
		var changeName = changes ? changes[0].name : 'scale';

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

		var self = this,
			scale = CONST.scales[scaleId].notes.slice().map(function(item) {
				return (item + rootNote) % CONST.notes.length;
			});

		this._mainGroup = new SvgGroup(this._parentEl, {
			id: 'scale-box',
			transform: 'translate(' + (250 - (-50 + scale.length * 28) / 2) + ',120)'
		});

		scale.forEach(function(item, index) {
			if (index < scale.length - 1) {
				new SvgText(self._mainGroup.el, {
					x: 26 + 30 * index,
					y: 50,
					className: 'interval',
					textContent: CONST.intervals[CONST.scales[scaleId].notes[index + 1] - CONST.scales[scaleId].notes[index]]
				});

				new SvgLine(self._mainGroup.el, {
					x1: 25 + 30 * index,
					x2: 35 + 30 * index,
					y1: 59,
					y2: 59
				});
				new SvgPolyline(self._mainGroup.el, {
					points: [
						[16 + 30 * index, 52],
						[16 + 30 * index, 47],
						[23 + 30 * index, 47]
					]
				});

				new SvgPolyline(self._mainGroup.el, {
					points: [
						[37 + 30 * index, 47],
						[44 + 30 * index, 47],
						[44 + 30 * index, 52]
					]
				});
			}

			var content = CONST.notes[item],
				hasSharp = content.length > 1,
				noteName = new SvgText(self._mainGroup.el, {
					x: 10 + 30 * index,
					y: 65,
					note: item,
					className: index === 0 ? 'root' : undefined,
					textContent: content.replace('♯', ''),
					children: [{
						name: 'tspan',
						dy: -7,
						textContent: hasSharp ? '♯' : ''
					}]
				});

			if (this.model.highlighted !== undefined && this.model.highlighted === item) {
				noteName.addClass('highlighted');
			}

			noteName.el.addEventListener('click', function() {
				if (noteName.hasClass('highlighted')) {
					noteName.removeClass('highlighted');
					this.model.highlighted = undefined;
				} else {
					var items = document.querySelectorAll('#scale-box text.highlighted');

					for (var i = 0; i < items.length; i++) {
						var item = items[i];

						item.setAttribute('class', item.getAttribute('class').replace('highlighted', '') || '');
					}
					noteName.addClass('highlighted');
					this.model.highlighted = parseInt(noteName.el.getAttribute('note'), 10);
				}
			}.bind(this), false);
			new SvgText(self._mainGroup.el, {
				x: 13 + 30 * index,
				y: 75,
				className: 'interval',
				textContent: CONST.intervals[CONST.scales[scaleId].notes[index]]
			});
		}.bind(this));
	}


}
