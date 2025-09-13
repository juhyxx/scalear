import { SCALES } from './enums/scales.js';
import { NOTES_SHARP } from './enums/notes.js';
import { INSTRUMENTS } from './enums/instruments.js';

export default class Model {
    #nameState = 'fender';
    #rootNote = 0;
    #instrument = 0;
    #scale = 0;
    #fretCount = 12;
    #neckType = 'gibson';
    #updateHandlers = [];
    #tunning = [];
    #notePerString = 3;
    #notePerStringOff = true;

    get rootNote() {
        return this.#rootNote || 0;
    }
    get rootNoteName() {
        return NOTES_SHARP[this.rootNote];
    }
    set rootNote(rootNote) {
        if (this.rootNote !== rootNote) {
            this.#rootNote = parseInt(rootNote, 10);
            this.onUpdate('rootNote');
        }
    }

    get instrument() {
        return this.#instrument || 0;
    }
    set instrument(instrument) {
        if (this.instrument !== instrument) {
            this.#instrument = parseInt(instrument, 10);
            this.onUpdate('instrument');
        }
    }

    get scale() {
        return this.#scale || 0;
    }
    get scaleName() {
        return SCALES[this.scale].name;
    }
    set scale(scale) {
        if (this.scale !== scale) {
            this.#scale = parseInt(scale, 10);
            this.onUpdate('scale');
        }
    }

    get fretCount() {
        return this.#fretCount || 12;
    }
    set fretCount(fretCount) {
        fretCount = parseInt(fretCount, 10);
        fretCount = isNaN(fretCount) ? 12 : fretCount;
        fretCount = Math.min(fretCount, 25);
        fretCount = Math.max(fretCount, 10);
        this.#fretCount = fretCount;
        this.onUpdate('fretCount');
    }

    get names() {
        return this.#nameState;
    }

    set names(state) {
        this.#nameState = state;
        this.onUpdate('names');
    }

    get neckType() {
        return this.#neckType || 'gibson';
    }
    set neckType(neckType) {
        this.#neckType = neckType;

        this.onUpdate('neckType');
    }

    get tunning() {
        return INSTRUMENTS[this.instrument].tunning;
    }
    set tunning(tunning) {
        return (this.#tunning = tunning);
    }

    get stringsCount() {
        return (this.tunning && this.tunning.length) || 6;
    }

    get notePerString() {
        return this.#notePerString;
    }
    get notePerStringOff() {
        return this.#notePerStringOff;
    }
    set notePerString(value) {
        value = parseInt(value, 10);
        if (isNaN(value)) {
            this.#notePerStringOff = true;
        } else {
            this.#notePerString = value;
            this.#notePerStringOff = false;
        }

        this.onUpdate('notePerString');
    }

    get data() {
        const selectedScale = SCALES[this.scale].notes.map((note) => (note + this.rootNote) % 12);
        const data = Array.from({ length: this.stringsCount }, (_, index) => {
            return Array.from({ length: this.#fretCount + 1 }, (_, fretIndex) => {
                const note = (this.tunning[index] + fretIndex) % 12;
                if (selectedScale.indexOf(note) >= 0) {
                    return { id: note, name: NOTES_SHARP[note], isRoot: note === this.rootNote, box: false };
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

    onUpdate(change) {
        const _ = this.data;

        this.#updateHandlers = this.#updateHandlers || [];
        this.#updateHandlers.forEach((handler) => {
            handler.fn.call(handler.scope, this, change);
        });
    }

    addUpdateHandler(fn, scope) {
        this.#updateHandlers = this.#updateHandlers || [];
        this.#updateHandlers.push({ fn: fn, scope: scope });
    }

    toJSON() {
        return JSON.stringify({
            rootNote: this.rootNote,
            namesVisible: this.namesVisible,
            instrument: this.instrument,
            scale: this.scale,
            fretsCount: this.fretCount,
            neckType: this.neckType
        });
    }
}
