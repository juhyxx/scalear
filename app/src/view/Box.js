import log from '../logger.js';
import View from '../View.js';

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
			scale = Scalear.scales[scaleId].notes.slice().map(function(item) {
				return (item + rootNote) % Scalear.notes.length;
			});

		this._mainGroup = new Svg.Group(this._parentEl, {
			id: 'scale-box',
			transform: 'translate(' + (250 - (-50 + scale.length * 28) / 2) + ',120)'
		});

		scale.forEach(function(item, index) {
			if (index < scale.length - 1) {
				new Svg.Text(self._mainGroup.el, {
					x: 26 + 30 * index,
					y: 50,
					className: 'interval',
					textContent: Scalear.intervals[Scalear.scales[scaleId].notes[index + 1] - Scalear.scales[scaleId].notes[index]]
				});

				new Svg.Line(self._mainGroup.el, {
					x1: 25 + 30 * index,
					x2: 35 + 30 * index,
					y1: 59,
					y2: 59
				});
				new Svg.PolyLine(self._mainGroup.el, {
					points: [
						[16 + 30 * index, 52],
						[16 + 30 * index, 47],
						[23 + 30 * index, 47]
					]
				});

				new Svg.PolyLine(self._mainGroup.el, {
					points: [
						[37 + 30 * index, 47],
						[44 + 30 * index, 47],
						[44 + 30 * index, 52]
					]
				});
			}

			var content = Scalear.notes[item],
				hasSharp = content.length > 1,
				noteName = new Svg.Text(self._mainGroup.el, {
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
			new Svg.Text(self._mainGroup.el, {
				x: 13 + 30 * index,
				y: 75,
				className: 'interval',
				textContent: Scalear.intervals[Scalear.scales[scaleId].notes[index]]
			});
		}.bind(this));
	}


}
