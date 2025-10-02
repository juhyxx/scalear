import { INSTRUMENTS } from '../enums/instruments.js';
import { NOTES_SHARP, NOTES_BS } from '../enums/notes.js';
import SvgGroup from '../svg/element/Group.js';
import SvgCircle from '../svg/element/Circle.js';
import SvgRectangle from '../svg/element/Rectangle.js';
import SvgLine from '../svg/element/Line.js';
import SvgText from '../svg/element/Text.js';
import { INTERVALS } from '../enums/intervals.js';
import { SCALES } from '../enums/scales.js';

export class NeckView extends HTMLElement {
    #elMain;
    #elMainGroup;
    #elFingers;
    #elLabels;
    #fretCount = 12;
    #neckType = 'dark';
    #instrument = INSTRUMENTS[0];
    #notePerString = 3;
    #elFrets;

    #elMarks = [];
    #elShading = [];
    #elBg;
    #strings = [];
    #notes = 'names';
    #rootNote = 0;
    #scale = 0;

    static observedAttributes = [
        'neck-type',
        'fret-count',
        'strings-count',
        'note-per-string',
        'tunning',
        'notes',
        'scale',
        'root-note',
        'instrument'
    ];

    get stringDistance() {
        return 20;
    }
    get neckWidth() {
        return this.stringDistance * this.stringsCount || 130;
    }
    get fretWidth() {
        return this.neckHeight / (this.fretCount + 1);
    }
    get neckHeight() {
        return 540;
    }

    get tunning() {
        return this.#instrument.tunning;
    }

    get instrument() {
        return this.#instrument;
    }
    set instrument(value) {
        this.#instrument = INSTRUMENTS[value];
        this.render();
    }
    set notes(notes) {
        this.#notes = notes;
    }
    get notes() {
        return this.#notes;
    }

    get neckType() {
        return this.#neckType;
    }
    set neckType(neckType) {
        this.#neckType = neckType;
    }

    get fretCount() {
        return parseInt(this.#fretCount) || 12;
    }

    set fretCount(fretCount) {
        this.#fretCount = fretCount;
        this.render();
    }

    get stringsCount() {
        return this.#instrument.tunning.length;
    }

    get rootNote() {
        return this.#rootNote || 0;
    }
    set rootNote(value) {
        this.#rootNote = parseInt(value) || 0;
        this.display();
    }

    get scale() {
        return SCALES[this.#scale];
    }
    set scale(value) {
        this.#scale = parseInt(value) || 0;
        this.display();
    }

    get hasSharps() {
        return [0, 2, 4, 7, 9, 11].includes(this.rootNote);
    }

    get notePerString() {
        return parseInt(this.#notePerString);
    }
    set notePerString(value) {
        this.#notePerString = parseInt(value);
        this.display();
    }
    get y() {
        return 10;
    }

    get data() {
        const selectedScale = this.scale.notes.map((note) => (note + this.rootNote) % 12);
        const data = Array.from({ length: this.stringsCount }, (_, index) => {
            return Array.from({ length: this.fretCount + 1 }, (_, fretIndex) => {
                const note = (this.tunning[index] + fretIndex) % 12;
                if (selectedScale.indexOf(note) >= 0) {
                    return {
                        id: note,
                        name: NOTES_SHARP[note],
                        isRoot: note === this.rootNote,
                        box: false,
                        interval:
                            INTERVALS[note - this.rootNote >= 0 ? note - this.rootNote : 12 + (note - this.rootNote)]
                    };
                }
                return null;
            });
        });

        let scaleIndex = 0;
        for (let string = this.stringsCount - 1; string >= 0; string--) {
            const subNotes = Array.from(
                { length: this.notePerString },
                (_, i) => selectedScale[(scaleIndex + i) % selectedScale.length]
            );
            data[string].filter((note) => note && subNotes.includes(note.id)).forEach((data) => (data.box = true));

            scaleIndex += this.notePerString;
            scaleIndex = scaleIndex % selectedScale.length;
        }
        return data;
    }

    connectedCallback() {
        this.innerHTML = `<svg id="board" version="1.0" encoding="UTF-8" width="100%" preserveAspectRatio="xMinYMin slice" viewBox="0 0 560 160">
        <defs>
            <filter id="main-neck-shadow" x="-1" y="-1" width="300%" height="300%">
                <feOffset result="offOut" in="SourceAlpha" dx="0" dy="0" />
                <feGaussianBlur result="blurOut" in="offOut" stdDeviation="2" />
                <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
            </filter>
            <filter id="neck-shadow" x="-1" y="-1" width="300%" height="300%">
                <feOffset result="offOut" in="SourceAlpha" dx="0" dy="1" />
                <feGaussianBlur result="blurOut" in="offOut" stdDeviation="1" />
                <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
            </filter>
            <filter id="fret" x="0" y="0" width="200%" height="200%">
                <feOffset result="offOut" in="SourceAlpha" dx="1" dy="0" />
                <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
            </filter>
            <linearGradient id="gradient-dark" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#3b2b2b" />
                <stop offset="40%" style="stop-color:#573a34;" />
                <stop offset="60%" style="stop-color:#573a34;" />
                <stop offset="100%" style="stop-color:#3b2b2b;" />
            </linearGradient>
            <linearGradient id="str" x1="0%" y1="0%" x2="0%" y2="5" gradientUnits="userSpaceOnUse">
                <stop offset="0%" style="stop-color:#736e27" />
                <stop offset="100%" style="stop-color:#c6c6c6;" />
            </linearGradient>
            <linearGradient id="str2"xlink:href="#str"spreadMethod="repeat" />
            <linearGradient id="gradient-light" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#e4cda7" />
                <stop offset="30%" style="stop-color:#d4bb90;" />
                <stop offset="60%" style="stop-color:#d4bb90;" />
                <stop offset="100%" style="stop-color:#e4cda7;" />
            </linearGradient>
            <linearGradient id="shading" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="5%" stop-opacity="0.5" style="stop-color:black" />
                <stop offset="5%" stop-opacity="0.2" style="stop-color:black" />
                <stop offset="20%" stop-opacity="0" style="stop-color:black" />
                <stop offset="80%" stop-opacity="0" style="stop-color:black" />
                <stop offset="95%" stop-opacity="0.2" style="stop-color:black" />
                <stop offset="100%" stop-opacity="0.5" style="stop-color:black" />
            </linearGradient>
        </defs>
    </svg>`;
        this.#elMain = this.querySelector('svg#board');
        this.#elMainGroup = new SvgGroup(this.#elMain, { id: 'neck' });
        this.#elBg = new SvgRectangle(this.#elMainGroup.el, {
            id: 'fret-board-bg',
            x: this.fretWidth,
            y: this.y,
            width: this.fretCount * this.fretWidth,
            height: this.neckWidth
        });
        this.#elShading = new SvgGroup(this.#elMain, { id: 'shading' });
        this.#elFrets = new SvgGroup(this.#elMain, { id: 'frets' });
        this.#elMarks = new SvgGroup(this.#elMain, { id: 'marks' });
        this.#strings = new SvgGroup(this.#elMain, { id: 'strings' });
        this.#elFingers = new SvgGroup(this.#elMain, { id: 'fingers' });
        this.#elLabels = new SvgGroup(this.#elMain, { id: 'labels' });

        this.render();
    }

    render() {
        this.#elFrets.el.innerHTML = '';
        this.#elShading.el.innerHTML = '';
        this.#elMarks.el.innerHTML = '';
        this.#strings.el.innerHTML = '';
        this.#elFingers.el.innerHTML = '';
        this.#elLabels.el.innerHTML = '';

        this.#elBg.el.setAttribute('width', Math.round(this.fretCount * this.fretWidth));
        this.#elBg.el.setAttribute('x', Math.round(this.fretWidth));
        this.#elBg.el.setAttribute('height', Math.round(this.neckWidth));
        this.renderShading(this.#elShading.el);
        this.renderFrets(this.#elFrets.el);
        this.renderMarks(this.#elMarks.el);
        this.renderStrings(this.#strings.el);
        this.renderFingers(this.#elFingers.el);
        this.renderLabels(this.#elLabels.el);

        this.display();
    }

    display() {
        this.data.forEach((strings, string) => {
            strings.forEach((note, fret) => {
                if (note) {
                    const finger = this.#elFingers?.el?.querySelector(
                        `g[data-string="${string}"][data-fret="${fret}"]`
                    );

                    finger?.classList.add('visible');
                    finger?.classList.toggle('root', note.isRoot);
                    finger?.classList.toggle('box', note.box);

                    const label = this.#elLabels?.el?.querySelector(`g[data-string="${string}"][data-fret="${fret}"]`);

                    label?.classList.add('visible');
                    label?.classList.toggle('root', note.isRoot);
                    label
                        ?.querySelectorAll(this.hasSharps ? '.flat' : '.sharp')
                        .forEach((item) => item.classList.remove('visible'));
                    label
                        ?.querySelectorAll(!this.hasSharps ? '.flat' : '.sharp')
                        .forEach((item) => item.classList.add('visible'));
                    if (label) {
                        label.querySelector('.interval').textContent = note.interval
                            ? note.interval.substring(0, 1)
                            : '';
                        label.querySelector('.interval-sign').textContent = note.interval
                            ? note.interval.substring(2, 1)
                            : '';
                    }
                    label?.querySelector('.interval').classList.toggle('root', note.isRoot);
                } else {
                    this.#elFingers?.el
                        .querySelector(`g[data-string="${string}"][data-fret="${fret}"]`)
                        .classList.remove('visible');
                    this.#elLabels?.el
                        .querySelector(`g[data-string="${string}"][data-fret="${fret}"]`)
                        .classList.remove('visible');
                }
            });
        });
    }

    renderShading(el) {
        for (let i = 0; i < this.fretCount; i++) {
            new SvgRectangle(el, {
                x: i * this.fretWidth + this.fretWidth,
                y: this.y,
                width: this.fretWidth,
                height: this.neckWidth
            });
        }
    }
    renderMarks(el) {
        const circles = [];
        const rectangles = [];
        const fretLabels = [];
        [3, 5, 7, 9, 12, 3 + 12, 5 + 12, 7 + 12, 9 + 12, 12 + 12].map((i) => {
            if (i <= this.fretCount) {
                if (i % 12 === 0) {
                    circles.push(
                        {
                            class: SvgCircle,
                            x: (i - 1) * this.fretWidth + 1.5 * this.fretWidth,
                            y: this.y + this.stringDistance + this.neckWidth / 2,
                            radius: this.fretWidth / 6
                        },
                        {
                            class: SvgCircle,
                            x: (i - 1) * this.fretWidth + 1.5 * this.fretWidth,
                            y: this.y + -this.stringDistance + this.neckWidth / 2,
                            radius: this.fretWidth / 6
                        }
                    );
                    fretLabels.push(
                        {
                            class: SvgCircle,
                            x: (i - 1) * this.fretWidth + 1.5 * this.fretWidth - 3,
                            y: this.y + this.neckWidth + 8,
                            radius: 2
                        },
                        {
                            class: SvgCircle,
                            x: (i - 1) * this.fretWidth + 1.5 * this.fretWidth + 3,
                            y: this.y + this.neckWidth + 8,
                            radius: 2
                        }
                    );

                    rectangles.push({
                        class: SvgRectangle,
                        x: (i - 1) * this.fretWidth + 5 + this.fretWidth,
                        y: this.y + 4 * 5,
                        height: this.neckWidth - 8 * 5,
                        width: this.fretWidth - 2 * 5
                    });
                } else {
                    rectangles.push(
                        {
                            class: SvgRectangle,
                            x: (i - 1) * this.fretWidth + 5 + this.fretWidth,
                            y: this.y + 5 + this.neckWidth / 2,
                            height: (this.neckWidth - 10 * 5) / 2,
                            width: this.fretWidth - 2 * 5
                        },
                        {
                            class: SvgRectangle,
                            x: (i - 1) * this.fretWidth + 5 + this.fretWidth,
                            y: this.y + 4 * 5,
                            height: (this.neckWidth - 10 * 5) / 2,
                            width: this.fretWidth - 2 * 5
                        }
                    );
                    circles.push({
                        class: SvgCircle,
                        x: (i - 1) * this.fretWidth + 1.5 * this.fretWidth,
                        y: this.y + this.neckWidth / 2,
                        radius: this.fretWidth / 6
                    });
                    fretLabels.push({
                        class: SvgCircle,
                        x: (i - 1) * this.fretWidth + 1.5 * this.fretWidth,
                        y: this.neckWidth + 8 + this.y,
                        radius: 2
                    });
                }
            }
        }, this);

        new SvgGroup(el, { id: 'circles', children: circles });
        new SvgGroup(el, { id: 'rectangles', children: rectangles });
        new SvgGroup(el, { id: 'fret-labels', children: fretLabels });
    }

    renderFrets(el) {
        for (let i = 0; i <= this.fretCount; i++) {
            new SvgLine(el, {
                x1: i * this.fretWidth + this.fretWidth + 1,
                x2: i * this.fretWidth + this.fretWidth + 1,
                y1: this.y,
                y2: this.neckWidth + this.y
            });
            new SvgText(el, {
                x: i * this.fretWidth - this.fretWidth + 2 * this.fretWidth - 2,
                y: this.neckWidth + 10 + this.y,
                textContent: i
            });
        }
        new SvgLine(el, {
            className: 'zero',
            x1: this.fretWidth - 2,
            x2: this.fretWidth - 2,
            y1: this.y,
            y2: this.neckWidth + this.y
        });
    }

    renderStrings(el) {
        this.tunning.map((item, i) => {
            const y = i * this.stringDistance + this.stringDistance / 2;
            new SvgLine(el, {
                x1: 0,
                x2: this.fretWidth + this.fretCount * this.fretWidth,
                y1: y + this.y,
                y2: y + this.y
            });
        });
    }

    renderFingers(parentEl) {
        const fingers = [];

        for (let string = 0; string < this.stringsCount; string++) {
            fingers.push([]);

            for (let i = 0; i <= this.fretCount; i++) {
                const radius = Math.round(this.stringDistance / 3);
                const group = new SvgGroup(parentEl, {
                    attribute: {
                        'data-string': string,
                        'data-fret': i
                    },
                    children: [
                        {
                            class: SvgCircle,
                            x: i * this.fretWidth + this.fretWidth / 2,
                            y: +this.y + this.stringDistance * string + this.stringDistance / 2,
                            radius: radius
                        },
                        {
                            class: SvgRectangle,
                            x: i * this.fretWidth + this.fretWidth / 2 - radius,
                            y: +this.y + this.stringDistance * string + this.stringDistance / 2 - radius,
                            width: radius * 2,
                            height: radius * 2
                        }
                    ]
                });
                fingers[string].push(group);
            }
        }
    }

    renderLabels(parentEl) {
        let fretArray;

        this.tunning.slice().map((noteNumber, string) => {
            fretArray = new Array(this.fretCount + 2).join('0').split('');
            return fretArray.map((item, i) => {
                let content = {
                    sharp: NOTES_SHARP[(noteNumber + i) % NOTES_SHARP.length],
                    flat: NOTES_BS[(noteNumber + i) % NOTES_SHARP.length]
                };
                let correction = content.length > 1 ? 1 : 0;

                return new SvgGroup(parentEl, {
                    attribute: {
                        'data-string': string,
                        'data-fret': i
                    },
                    children: [
                        {
                            class: SvgText,
                            x: i * this.fretWidth + this.fretWidth / 2 - 2 - correction,
                            y: this.y + this.stringDistance * string + this.stringDistance / 2 + 3,
                            textContent: content.sharp.charAt(0),
                            className: 'sharp'
                        },
                        {
                            class: SvgText,
                            className: 'index sharp',
                            x: i * this.fretWidth + this.fretWidth / 2 - 2 - correction,
                            y: this.y + this.stringDistance * string + this.stringDistance / 2 + 3,
                            textContent: content.sharp.charAt(1)
                        },
                        {
                            class: SvgText,
                            x: i * this.fretWidth + this.fretWidth / 2 - 2 - correction,
                            y: this.y + this.stringDistance * string + this.stringDistance / 2 + 3,
                            textContent: content.flat.charAt(0),
                            className: 'flat'
                        },
                        {
                            class: SvgText,
                            className: 'index flat',
                            x: i * this.fretWidth + this.fretWidth / 2 - 2 - correction,
                            y: this.y + this.stringDistance * string + this.stringDistance / 2 + 3,
                            textContent: content.flat.charAt(1)
                        },
                        {
                            class: SvgText,
                            className: 'interval',
                            x: i * this.fretWidth + this.fretWidth / 2 - 2 - correction,
                            y: this.y + this.stringDistance * string + this.stringDistance / 2 + 3,
                            textContent: ''
                        },
                        {
                            class: SvgText,
                            className: 'interval-sign',
                            x: i * this.fretWidth + this.fretWidth / 2 - 2 - correction,
                            y: this.y + this.stringDistance * string + this.stringDistance / 2 + 3,
                            textContent: ''
                        }
                    ]
                });
            });
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'neck-type':
                this.neckType = newValue;
                break;
            case 'fret-count':
                this.fretCount = newValue;
                break;
            case 'strings-count':
                this.stringsCount = newValue;
                break;
            case 'note-per-string':
                this.notePerString = newValue;
                break;
            case 'tunning':
                this.tunning = newValue;
                break;
            case 'notes':
                this.notes = newValue;
                break;
            case 'scale':
                this.scale = newValue;
                break;
            case 'root-note':
                this.rootNote = newValue;
                break;
            case 'instrument':
                this.instrument = newValue;
                break;
        }
    }
}
