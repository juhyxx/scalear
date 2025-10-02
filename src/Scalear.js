import { scalesGrouped } from './enums/scales.js';
import { INSTRUMENT_GROUPS } from './enums/instruments.js';
import { ToggleButton, ToggleItem } from './components/ToggleButton.js';
import { RangeSelector } from './components/RangeSeletor.js';
import { TwoLevelCombo } from './components/TwoLevelCombo.js';
import { NeckView } from './components/NeckView.js';
import { SCALES } from './enums/scales.js';
import { NOTES_BS } from './enums/notes.js';

customElements.define('toggle-button', ToggleButton);
customElements.define('toggle-item', ToggleItem);
customElements.define('range-selector', RangeSelector);
customElements.define('two-level-combo', TwoLevelCombo);
customElements.define('neck-view', NeckView);

export default class Scalear {
    #rootNote = 0;
    #scale = 13;

    get rootNote() {
        return this.#rootNote;
    }
    set rootNote(value) {
        this.#rootNote = value;
        this.setTitle();
    }

    get scale() {
        return this.#scale;
    }
    set scale(value) {
        this.#scale = value;
        this.setTitle();
    }

    setTitle() {
        document.title = `${NOTES_BS[this.rootNote]} ${SCALES.find((scale) => scale.id === this.scale).name} (Scalear)`;
    }

    constructor() {
        const instrumentCombo = document.querySelector('two-level-combo#instrument-selector');
        const scaleCombo = document.querySelector('two-level-combo#scale-selector');
        const notes = document.querySelector('#notes');
        const fretBoardSelect = document.querySelector('#fretboard');
        const notesPerString = document.querySelector('#notes-per-string');
        const fretsCount = document.querySelector('#frets-count');
        const rootSelector = document.querySelector('#root-select');
        const neckView = document.querySelector('neck-view');

        //document.querySelector('#print').addEventListener('click', (e) => window.print());

        instrumentCombo.addData(INSTRUMENT_GROUPS, 'name');
        scaleCombo.addData(scalesGrouped, 'name');

        fretBoardSelect.addEventListener('change', (e) => {
            neckView.setAttribute('neck-type', e.detail.value);
            document.body.classList.toggle('bw', e.detail.value === 'bw');
        });
        fretsCount.addEventListener('change', (e) => {
            if (e.detail) {
                neckView.setAttribute('fret-count', e.detail.value);
            }
        });
        notesPerString.addEventListener('change', (e) => neckView.setAttribute('note-per-string', e.detail.value));
        rootSelector.addEventListener('change', (e) => {
            this.rootNote = e.detail.value;
            neckView.setAttribute('root-note', this.rootNote);
        });
        notes.addEventListener('change', (e) => neckView.setAttribute('notes', e.detail.value));
        instrumentCombo.addEventListener('select', (e) => neckView.setAttribute('instrument', e.detail.value));
        scaleCombo.addEventListener('select', (e) => {
            this.scale = e.detail.value;
            neckView.setAttribute('scale', this.scale);
        });

        neckView.setAttribute('scale', 13);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    new Scalear();
});
