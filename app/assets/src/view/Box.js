import View from '../View.js';

import { scales } from '../enums/scales.js';
import { notes, notesWithBs } from '../enums/notes.js';
import { intervals } from '../enums/intervals.js';

import SvgGroup from '../svg/element/Group.js';
import SvgText from '../svg/element/Text.js';
import SvgPolyline from '../svg/element/Polyline.js';

export default class Box extends View {
    #parentEl;
    #mainGroup;

    constructor(svgParent, model) {
        super();
        this.#parentEl = svgParent;
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

        if (this.#mainGroup) {
            this.#mainGroup.remove();
        }

        const scale = scales[scaleId].notes.slice().map((item) => {
            return (item + rootNote) % notes.length;
        });

        this.#mainGroup = new SvgGroup(this.#parentEl, {
            id: 'scale-box',
            transform:
                'translate(' + (250 - (-50 + scale.length * width) / 2) + ',0)'
        });

        scale.forEach((item, index) => {
            if (index < scale.length - 1) {
                new SvgText(this.#mainGroup.el, {
                    x: 10 + width / 2 + width * index,
                    y: 10,
                    className: 'interval',
                    textContent:
                        intervals[
                            scales[scaleId].notes[index + 1] -
                                scales[scaleId].notes[index]
                        ]
                });

                new SvgPolyline(this.#mainGroup.el, {
                    points: [
                        [16 + width * index, 10],
                        [16 + width * index, 7],
                        [16 + horizonWidth + width * index, 7]
                    ]
                });

                new SvgPolyline(this.#mainGroup.el, {
                    points: [
                        [16 + width - horizonWidth + width * index, 7],
                        [16 + width + width * index, 7],
                        [16 + width + width * index, 10]
                    ]
                });
            }
            const hasSharps = [0, 2, 4, 7, 9, 11].includes(rootNote);
            const content = hasSharps ? notes[item] : notesWithBs[item];
            const hasSharp = content.length > 1;
            const noteName = new SvgText(this.#mainGroup.el, {
                x: 10 + width * index,
                y: 25,
                note: item,
                className: index === 0 ? 'root' : undefined,
                textContent: content.charAt(0)
            });
            if (content.length > 1) {
                new SvgText(this.#mainGroup.el, {
                    x: 20 + width * index,
                    y: 20,
                    note: item,
                    className:
                        'sharpflat ' + (index === 0 ? 'root' : undefined),
                    textContent: content.charAt(1)
                });
            }

            //  if (this.model.highlighted !== undefined && this.model.highlighted === item) {
            //    noteName.addClass('highlighted');
            //  }

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
            new SvgText(this.#mainGroup.el, {
                x: 13 + width * index,
                y: 35,
                className: 'interval',
                textContent: intervals[scales[scaleId].notes[index]]
            });
        });
    }
}
