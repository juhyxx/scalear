import View from '../View.js';

import { SCALES } from '../enums/scales.js';
import { INSTRUMENTS } from '../enums/instruments.js';
import { NOTES_SHARP, NOTES_BS } from '../enums/notes.js';
import SvgGroup from '../svg/element/Group.js';
import SvgCircle from '../svg/element/Circle.js';
import SvgRectangle from '../svg/element/Rectangle.js';
import SvgLine from '../svg/element/Line.js';
import SvgText from '../svg/element/Text.js';
import { INTERVALS } from '../enums/intervals.js';

export default class Neck extends View {
    #parentEl;
    #mainGroup;
    #fingers;
    #labels;
    #notesMap;
    #labelsMap;

    get stringDistance() {
        return 20;
    }
    get neckWidth() {
        return this.stringDistance * this.model.stringsCount || 130;
    }
    get fretWidth() {
        return Math.round(this.neckHeight / this.model.fretCount);
    }
    get neckHeight() {
        return 500;
    }

    constructor(svgParent, model) {
        super();
        this.#parentEl = svgParent;
        this.model = model;
        this.modelUpdate(this.model, 'init');
    }

    modelUpdate(model, changeName) {
        switch (changeName) {
            case 'rootNote':
            case 'scale':
                this.showScale();
                break;
            case 'names':
                this.labels.el.setAttribute('class', model.names.toLowerCase());
                break;
            case 'init':
            case 'neckType':
            case 'fretCount':
            case 'instrument':
                if (this.#mainGroup && this.#mainGroup.remove) {
                    this.#mainGroup.remove();
                }
                this.render();
                this.showScale(model.scale);
                break;
        }
    }

    render() {
        this.#mainGroup = new SvgGroup(this.#parentEl, {
            id: 'neck',
            className: this.model.neckType,
            transform: 'translate(0,2.5) '
        });
        new SvgRectangle(this.#mainGroup.el, {
            className: 'neck',
            x: this.fretWidth,
            y: 0,
            width: this.model.fretCount * this.fretWidth,
            height: this.neckWidth,
            fill: this.model.neckType === 'fender' ? 'url(#gradientfender)' : 'url(#gradient)'
        });

        this.renderGroups(this.#mainGroup.el);
        this.labels.el.setAttribute('class', this.model.names.toLowerCase());
        this.mapNotes();
    }

    renderGroups(el) {
        const shading = new SvgGroup(el, { className: 'shading' });
        const frets = new SvgGroup(el, { className: 'frets' });
        const marks = new SvgGroup(el, { className: 'marks' });
        this.renderStrings(el);
        const fingers = new SvgGroup(el, { className: 'fingers' });

        this.labels = new SvgGroup(el, { id: 'labels' });
        if (!INSTRUMENTS[this.model.instrument].fretless) {
            this.renderShading(shading.el);
        }
        this.renderMarks(marks.el);
        if (!INSTRUMENTS[this.model.instrument].fretless) {
            this.renderFrets(frets.el);
        }

        this.renderFingers(fingers.el);
        this.renderLabels(this.labels.el);
    }

    renderShading(el) {
        for (let i = 0; i < this.model.fretCount; i++) {
            new SvgRectangle(el, {
                x: i * this.fretWidth + this.fretWidth,
                y: 0,
                width: this.fretWidth,
                height: this.neckWidth
            });
        }
    }
    renderMarks(el) {
        [3, 5, 7, 9, 12, 3 + 12, 5 + 12, 7 + 12, 9 + 12, 12 + 12].map((i) => {
            if (i <= this.model.fretCount) {
                if (i % 12 === 0) {
                    new SvgCircle(el, {
                        x: (i - 1) * this.fretWidth + 1.5 * this.fretWidth - 3,
                        y: this.neckWidth + 8,
                        radius: 2,
                        className: 'border'
                    });
                    new SvgCircle(el, {
                        x: (i - 1) * this.fretWidth + 1.5 * this.fretWidth + 3,
                        y: this.neckWidth + 8,
                        radius: 2,
                        className: 'border'
                    });
                    if (this.model.neckType === 'fender') {
                        new SvgCircle(el, {
                            x: (i - 1) * this.fretWidth + 1.5 * this.fretWidth,
                            y: this.stringDistance + this.neckWidth / 2,
                            radius: this.fretWidth / 6
                        });
                        new SvgCircle(el, {
                            x: (i - 1) * this.fretWidth + 1.5 * this.fretWidth,
                            y: -this.stringDistance + this.neckWidth / 2,
                            radius: this.fretWidth / 6
                        });
                    } else {
                        new SvgRectangle(el, {
                            x: (i - 1) * this.fretWidth + 5 + this.fretWidth,
                            y: 5 + this.neckWidth / 2,
                            height: (this.neckWidth - 10 * 5) / 2,
                            width: this.fretWidth - 2 * 5
                        });
                        new SvgRectangle(el, {
                            x: (i - 1) * this.fretWidth + 5 + this.fretWidth,
                            y: 4 * 5,
                            height: (this.neckWidth - 10 * 5) / 2,
                            width: this.fretWidth - 2 * 5
                        });
                    }
                } else {
                    new SvgCircle(el, {
                        x: (i - 1) * this.fretWidth + 1.5 * this.fretWidth,
                        y: this.neckWidth + 8,
                        radius: 2,
                        className: 'border'
                    });
                    if (this.model.neckType === 'fender') {
                        new SvgCircle(el, {
                            x: (i - 1) * this.fretWidth + 1.5 * this.fretWidth,
                            y: this.neckWidth / 2,
                            radius: this.fretWidth / 6
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
            }
        }, this);
    }

    renderFrets(el) {
        for (let i = 0; i <= this.model.fretCount; i++) {
            new SvgLine(el, {
                x1: i * this.fretWidth + this.fretWidth + 1,
                x2: i * this.fretWidth + this.fretWidth + 1,
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
            y1: -0.5,
            y2: this.neckWidth
        });
    }

    mapNotes(el) {
        let fret;
        const notesMap = new Map();
        const labelsMap = new Map();
        let notesMapItem = [];

        this.model.tunning.forEach((note, string) => {
            for (fret = 0; fret <= this.model.fretCount; fret++) {
                notesMapItem = notesMap.has(note) ? notesMap.get(note) : [];
                notesMapItem.push(this.#fingers[string][fret]);
                notesMap.set(note, notesMapItem);
                labelsMap.set(this.#fingers[string][fret], this.#labels[string][fret]);
                note++;
                note = note % NOTES_SHARP.length;
            }
        });

        this.#notesMap = notesMap;
        this.#labelsMap = labelsMap;
    }

    renderStrings(el) {
        let strings = this.model.tunning.map((item, i) => ({
            class: SvgLine,
            x1: 0,
            x2: this.fretWidth + this.model.fretCount * this.fretWidth,
            y1: i * this.stringDistance + this.stringDistance / 2,
            y2: i * this.stringDistance + this.stringDistance / 2
        }));
        new SvgGroup(el, { className: 'strings', children: strings });
    }

    renderFingers(parentEl) {
        const fingers = [];

        for (let string = 0; string < this.model.stringsCount; string++) {
            fingers.push([]);

            for (let i = 0; i <= this.model.fretCount; i++) {
                const radius = this.stringDistance / 3;
                const group = new SvgGroup(parentEl, {
                    attribute: {
                        'data-string': string,
                        'data-fret': i
                    },
                    children: [
                        {
                            class: SvgCircle,
                            x: i * this.fretWidth + this.fretWidth / 2,
                            y: this.stringDistance * string + this.stringDistance / 2,
                            radius: radius
                        },
                        {
                            class: SvgRectangle,
                            x: i * this.fretWidth + this.fretWidth / 2 - radius,
                            y: this.stringDistance * string + this.stringDistance / 2 - radius,
                            width: radius * 2,
                            height: radius * 2
                        }
                    ]
                });
                fingers[string].push(group);
            }
        }
        this.#fingers = fingers;
    }

    renderLabels(parentEl) {
        let fretArray;

        this.#labels = this.model.tunning.slice().map((noteNumber, string) => {
            fretArray = new Array(this.model.fretCount + 2).join('0').split('');
            return fretArray.map((item, i) => {
                let content = {
                    sharp: NOTES_SHARP[(noteNumber + i) % NOTES_SHARP.length],
                    flat: NOTES_BS[(noteNumber + i) % NOTES_SHARP.length]
                };
                let correction = content.length > 1 ? 1 : 0;
                let hasSharp = content.length > 1;

                return new SvgGroup(parentEl, {
                    id: 'label',
                    children: [
                        {
                            class: SvgText,
                            x: i * this.fretWidth + this.fretWidth / 2 - 2 - correction,
                            y: this.stringDistance * string + this.stringDistance / 2 + 3,
                            textContent: content.sharp.charAt(0),
                            className: 'sharp'
                        },
                        {
                            class: SvgText,
                            className: 'index sharp',
                            x: i * this.fretWidth + this.fretWidth / 2 - 2 - correction,
                            y: this.stringDistance * string + this.stringDistance / 2 + 3,
                            textContent: content.sharp.charAt(1)
                        },
                        {
                            class: SvgText,
                            x: i * this.fretWidth + this.fretWidth / 2 - 2 - correction,
                            y: this.stringDistance * string + this.stringDistance / 2 + 3,
                            textContent: content.flat.charAt(0),
                            className: 'flat'
                        },
                        {
                            class: SvgText,
                            className: 'index flat',
                            x: i * this.fretWidth + this.fretWidth / 2 - 2 - correction,
                            y: this.stringDistance * string + this.stringDistance / 2 + 3,
                            textContent: content.flat.charAt(1)
                        },
                        {
                            class: SvgText,
                            className: 'interval',
                            x: i * this.fretWidth + this.fretWidth / 2 - 2 - correction,
                            y: this.stringDistance * string + this.stringDistance / 2 + 3,
                            textContent: ''
                        },
                        {
                            class: SvgText,
                            className: 'interval-sign',
                            x: i * this.fretWidth + this.fretWidth / 2 - 2 - correction,
                            y: this.stringDistance * string + this.stringDistance / 2 + 3,
                            textContent: ''
                        }
                    ]
                });
            });
        });
    }

    showAllNotes(note) {
        const hasSharps = [0, 2, 4, 7, 9, 11].includes(this.model.rootNote);

        this.#notesMap.get(note).forEach((item) => {
            item.show();
            this.#labelsMap.get(item).show();
            this.#labelsMap
                .get(item)
                .el.querySelectorAll(hasSharps ? '.flat' : '.sharp')
                .forEach((item) => item.classList.add('hide'));
            this.#labelsMap
                .get(item)
                .el.querySelectorAll(!hasSharps ? '.flat' : '.sharp')
                .forEach((item) => item.classList.remove('hide'));

            if (note === this.model.rootNote) {
                item.el.querySelector('rect').classList.add('visible');
                item.el.querySelector('circle').classList.remove('visible');
                this.#labelsMap.get(item).className = 'root';
            } else {
                this.#labelsMap.get(item).className = '';
                item.el.querySelector('rect').classList.remove('visible');
                item.el.querySelector('circle').classList.add('visible');
            }

            let interval = INTERVALS[(12 + note - this.model.rootNote) % 12];

            this.#labelsMap.get(item).el.querySelector('.interval').textContent = interval[0];
            this.#labelsMap.get(item).el.querySelector('.interval-sign').textContent = interval[1];
        });
    }

    showScale(scale) {
        this.clear();
        SCALES[scale || this.model.scale].notes
            .slice()
            .map((item) => (item + this.model.rootNote) % NOTES_SHARP.length)
            .forEach((note) => this.showAllNotes(note));
    }

    clear() {
        this.#fingers = this.#fingers || [];
        this.#fingers.forEach((item, i) => {
            item.map((finger, j) => {
                finger.hide().className = '';
                this.#labelsMap.get(finger).hide();
            });
        });
    }
}
