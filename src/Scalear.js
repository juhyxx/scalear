import { scalesGrouped } from './enums/scales.js';
import { INSTRUMENT_GROUPS } from './enums/instruments.js';
import { ToggleButton, ToggleItem } from './components/ToggleButton.js';
import { RangeSelector } from './components/RangeSeletor.js';
import { TwoLevelCombo } from './components/TwoLevelCombo.js';
import { NeckView } from './components/NeckView.js';
import { SCALES } from './enums/scales.js';
import { NOTES_BS } from './enums/notes.js';
import { MODE_NAMES } from './enums/scales.js';

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

    fillModes(combo, scale) {
        combo.innerHTML = '';
        const length = SCALES[scale].notes.length;
        for (let i = 1; i <= length; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = scale === 13 ? `${i}. ${MODE_NAMES[i - 1]}` : `Mode ${i}`;
            combo.appendChild(option);
        }
    }

    constructor() {
        const selectNext = (combo, direction) => {
            const currentIndex = combo.selectedIndex;
            let newIndex = currentIndex + direction;
            if (newIndex < 0) {
                newIndex = combo.options.length - 1;
            } else if (newIndex >= combo.options.length) {
                newIndex = 0;
            }
            combo.selectedIndex = newIndex;
            combo.dispatchEvent(new Event('change', { bubbles: true }));
        };
        const instrumentCombo = document.querySelector('two-level-combo#instrument-selector');
        const scaleCombo = document.querySelector('two-level-combo#scale-selector');
        const notes = document.querySelector('#notes');
        const fretBoardSelect = document.querySelector('#fretboard');
        const notesPerString = document.querySelector('#notes-per-string');
        const fretsCount = document.querySelector('#frets-count');
        const rootSelector = document.querySelector('#root-select');
        const modeSelector = document.querySelector('#mode-select');
        const showAll = document.querySelector('#mode-all');
        const mainContainer = document.querySelector('#main-container');

        instrumentCombo.addData(INSTRUMENT_GROUPS, 'name');
        scaleCombo.addData(scalesGrouped, 'name');

        showAll.addEventListener('change', (e) => {
            e.stopPropagation();
            modeSelector.disabled = e.target.checked;
            mainContainer.innerHTML = '';
            if (e.target.checked) {
                Array.from({ length: SCALES[this.scale].notes.length }).forEach((mode, index) => {
                    const view = document.createElement('neck-view');
                    view.setAttribute('scale', this.scale);
                    view.setAttribute('mode', index);
                    view.setAttribute('root-note', this.rootNote);
                    view.setAttribute('notes', notes.value);
                    view.setAttribute('neck-type', fretBoardSelect.value);
                    view.setAttribute('note-per-string', notesPerString.value);
                    view.setAttribute('fret-count', fretsCount.value);
                    view.setAttribute('instrument', instrumentCombo.value);
                    mainContainer.appendChild(view);
                });
            } else {
                const view = document.createElement('neck-view');
                view.setAttribute('scale', this.scale);
                view.setAttribute('mode', 0);
                view.setAttribute('root-note', this.rootNote);
                view.setAttribute('notes', notes.value);
                view.setAttribute('neck-type', fretBoardSelect.value);
                view.setAttribute('note-per-string', notesPerString.value);
                view.setAttribute('fret-count', fretsCount.value);
                view.setAttribute('instrument', instrumentCombo.value);
                mainContainer.appendChild(view);
            }
        });

        modeSelector.addEventListener('change', (e) => {
            document.querySelectorAll('neck-view')[0].setAttribute('mode', e.target.value - 1);
        });

        modeSelector.addEventListener('wheel', (e) => {
            if (modeSelector.disabled) return;
            e.preventDefault();
            selectNext(e.target, e.deltaY > 0 ? 1 : -1);
        });

        fretBoardSelect.addEventListener('change', (e) => {
            document.querySelectorAll('neck-view').forEach((view) => view.setAttribute('neck-type', e.detail.value));
            document.body.classList.toggle('bw', e.detail.value === 'bw');
        });
        fretsCount.addEventListener('change', (e) => {
            if (e.detail) {
                document
                    .querySelectorAll('neck-view')
                    .forEach((view) => view.setAttribute('fret-count', e.detail.value));
            }
        });
        notesPerString.addEventListener('change', (e) =>
            document
                .querySelectorAll('neck-view')
                .forEach((view) => view.setAttribute('note-per-string', e.detail.value))
        );
        rootSelector.addEventListener('change', (e) => {
            this.rootNote = e.detail.value;
            document.querySelectorAll('neck-view').forEach((view) => view.setAttribute('root-note', this.rootNote));
        });
        notes.addEventListener('change', (e) =>
            document.querySelectorAll('neck-view').forEach((view) => view.setAttribute('notes', e.detail.value))
        );
        instrumentCombo.addEventListener('select', (e) =>
            document.querySelectorAll('neck-view').forEach((view) => view.setAttribute('instrument', e.detail.value))
        );
        instrumentCombo.addEventListener('wheel', (e) => {
            e.preventDefault();
            selectNext(e.target, e.deltaY > 0 ? 1 : -1);
        });
        scaleCombo.addEventListener('select', (e) => {
            this.scale = e.detail.value;
            document.querySelectorAll('neck-view').forEach((view) => view.setAttribute('scale', this.scale));
            if (['scales', 'pentatonic', 'hexatonic', 'dia-scales'].includes(SCALES[this.scale].group)) {
                modeSelector.disabled = false;
                showAll.disabled = false;
            } else {
                if (showAll.checked) {
                    showAll.click();
                }
                modeSelector.disabled = true;
                showAll.disabled = true;
            }

            this.fillModes(modeSelector, this.scale);
        });
        scaleCombo.addEventListener('wheel', (e) => {
            e.preventDefault();
            selectNext(e.target, e.deltaY > 0 ? 1 : -1);
        });

        document.querySelectorAll('neck-view').forEach((view) => view.setAttribute('scale', 13));

        document.body.addEventListener('dblclick', (e) => {
            document.body.classList.add('ui-hidden');
            document.body.querySelector('nav').classList.add('hidden');
            document.body.querySelector('footer').classList.add('hidden');
            e.stopPropagation();
        });
        document.body.addEventListener('click', (e) => {
            document.body.classList.remove('ui-hidden');
            document.body.querySelector('nav').classList.remove('hidden');
            document.body.querySelector('footer').classList.remove('hidden');
            e.stopPropagation();
        });
        setTimeout(() => {
            document.body.classList.remove('ui-hidden');
            document.body.querySelector('nav').classList.remove('hidden');
            document.body.querySelector('footer').classList.remove('hidden');
        }, 1000);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    new Scalear();
});
