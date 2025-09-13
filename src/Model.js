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
    #keyCount = 20;

    get keyCount() {
        return this.#keyCount;
    }

    set keyCount(count) {
        this.#keyCount = count;
        this.onUpdate('keyCount');
    }

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

    onUpdate(change) {
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
