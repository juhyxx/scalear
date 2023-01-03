import View from '../View.js';

import { scales } from '../enums/scales.js';
import { notes, notesWithBs } from '../enums/notes.js';
import { intervals } from '../enums/intervals.js';

import SvgGroup from '../svg/element/Group.js';
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
      case 'instrument':
      case 'scale':
        this.showScale(model.scale, model.rootNote, model.stringsCount);
        break;
    }
  }

  showScale(scaleId, rootNote, stringCount) {
    const width = 35;
    const horizonWidth = 8;

    if (this._mainGroup) {
      this._mainGroup.remove();
    }

    const scale = scales[scaleId].notes.slice().map((item) => {
      return (item + rootNote) % notes.length;
    });

    this._mainGroup = new SvgGroup(this._parentEl, {
      id: 'scale-box',
      transform: 'translate(' + (250 - (-50 + scale.length * width) / 2) + ',' + stringCount * 17 + ')',
    });


    scale.forEach((item, index) => {

      if (index < scale.length - 1) {
        new SvgText(this._mainGroup.el, {
          x: 10 + width / 2 + width * index,
          y: 50,
          className: 'interval',
          textContent: intervals[scales[scaleId].notes[index + 1] - scales[scaleId].notes[index]],
        });

        new SvgPolyline(this._mainGroup.el, {
          points: [
            [16 + width * index, 52],
            [16 + width * index, 47],
            [16 + horizonWidth + width * index, 47],
          ],
        });

        new SvgPolyline(this._mainGroup.el, {
          points: [
            [16 + width - horizonWidth + width * index, 47],
            [16 + width + width * index, 47],
            [16 + width + width * index, 52],
          ],
        });
      }
      const hasSharps = [0, 2, 4,  7, 9, 11].includes(rootNote)
      const content = hasSharps ?  notes[item] : notesWithBs[item];
      const hasSharp = content.length > 1;
      const noteName = new SvgText(this._mainGroup.el, {
        x: 10 + width * index,
        y: 65,
        note: item,
        className: index === 0 ? 'root' : undefined,
        textContent: content,

      });

      if (this.model.highlighted !== undefined && this.model.highlighted === item) {
        noteName.addClass('highlighted');
      }

      // noteName.el.addEventListener('click', () => {
      //   if (noteName.hasClass('highlighted')) {
      //     noteName.removeClass('highlighted');
      //     this.model.highlighted = undefined;
      //   } else {
      //     const items = document.querySelectorAll('#scale-box text.highlighted');

      //     for (let i = 0, item = items[i]; i < items.length; i++) {
      //       item.setAttribute('class', item.getAttribute('class').replace('highlighted', '') || '');
      //     }
      //     noteName.addClass('highlighted');
      //     this.model.highlighted = parseInt(noteName.el.getAttribute('note'), 10);
      //   }
      // }, false);
      new SvgText(this._mainGroup.el, {
        x: 13 + width * index,
        y: 75,
        className: 'interval',
        textContent: intervals[scales[scaleId].notes[index]],
      });
    });
  }
}
