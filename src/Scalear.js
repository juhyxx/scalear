import Application from './Application.js';
import { APP } from './enums/app.js';
import { scalesGrouped, scales } from './enums/scales.js';
import { instrumentsGrouped, instruments } from './enums/instruments.js';
import { notes, notesWithBs } from './enums/notes.js';
import Svg from './svg/Svg.js';
import Neck from './view/Neck.js';
import Select from './view/Select.js';
import SelectTwoLevel from './view/SelectTwoLevel.js';
import Model from './Model.js';

export default class Scalear extends Application {
    #scaleSelect;
    #rootSelect;
    #instrumentSelect;

    get name() {
        return 'Scalear ' + APP.version;
    }

    onBoot() {
        this.model = new Model();
        this.init();
        Object.assign(this.model, JSON.parse(localStorage.defaults || '{}'));

        this.onRouteChange(this.route);
        this.setDefaults();
    }

    setDefaults() {
        document.querySelector('#name').innerHTML = this.model.scaleName;
        document.querySelector('#root').innerHTML = this.model.rootNoteName;
        document.querySelector('#frets-count').value = this.model.fretCount;
        document.querySelector('nav').className = '';
        document.querySelector('svg').setAttribute('class', '');
        document.title = `${this.model.rootNoteName} ${this.model.scaleName} (${this.name})`;
    }

    init() {
        const rootSelect = new Select({
            selector: '#root-selector',
            model: this.model,
            data: notesWithBs,
            watchOption: 'rootNote'
        });
        const scaleSelect = new SelectTwoLevel({
            selector: '#scale-selector',
            propertyName: 'name',
            model: this.model,
            data: scalesGrouped,
            watchOption: 'scale'
        });
        const instrumentSelect = new SelectTwoLevel({
            selector: '#instrument-selector',
            propertyName: 'name',
            model: this.model,
            data: instrumentsGrouped,
            watchOption: 'instrument'
        });

        const notes = document.querySelector('#notes');
        const fretBoardSelect = document.querySelector('#fretboard');
        const neckView = new Neck(Svg.get('svg#board'), this.model);

        notes.addEventListener('change', (e) => {
            this.model.names = e.detail.value;
        });
        fretBoardSelect.addEventListener('change', (e) => {
            this.model.neckType = e.detail.value;
        });

        scaleSelect.on('change', (e) => (this.model.scale = e.target.value));
        rootSelect.on('change', (e) => (this.model.rootNote = e.target.value));
        instrumentSelect.on('change', (e) => (this.model.instrument = e.target.value));

        document
            .querySelector('#frets-count')
            .addEventListener('input', (e) => (this.model.fretCount = e.target.value));
        document.querySelector('#print').addEventListener('click', (e) => window.print());

        this.#scaleSelect = scaleSelect;
        this.#rootSelect = rootSelect;
        this.#instrumentSelect = instrumentSelect;
    }

    modelUpdate(model, changeName) {
        switch (changeName) {
            case 'rootNote':
                document.querySelector('#root').innerHTML = model.rootNoteName;
                document.title = `${model.rootNoteName} ${model.scaleName} (${this.name})`;
                break;
            case 'scale':
                document.querySelector('#name').innerHTML = model.scaleName;
                document.title = `${model.rootNoteName} ${model.scaleName} (${this.name})`;
                break;
            case 'neckType':
                document.body.classList[model.neckType === 'fender' ? 'add' : 'remove']('dark');
                break;
            case 'instrument':
                document.querySelector('#frets-count').disabled = instruments[model.instrument].group === 'piano';
        }
        this.route = Application.prepareHashString(
            ['', instruments[model.instrument].name, model.scaleName, model.rootNoteName, ''].join('/')
        );
        localStorage.defaults = model.toJSON();
    }

    onRouteChange(params) {
        let note;

        if (params.length > 0) {
            if (params[2]) {
                for (note = 0; note < notes.length; note++) {
                    const item = notes[note];
                    if (Application.prepareHashString(item) === params[2]) {
                        break;
                    }
                }
                this.model.rootNote = note < 12 ? note : 0;
            }
            if (params[0]) {
                try {
                    this.model.instrument = instruments.filter(
                        (item) => Application.prepareHashString(item.name) === params[0]
                    )[0].id;
                } catch (e) {
                    this.model.instrument = 0;
                }
            }
            if (params[1]) {
                try {
                    this.model.scale = scales.filter(
                        (item) => Application.prepareHashString(item.name) === params[1]
                    )[0].id;
                } catch (e) {
                    this.model.scale = 0;
                }
            }
        } else {
            this.model.scale = this.#scaleSelect.value;
            this.model.rootNote = this.#rootSelect.value;
            this.model.instrument = this.#instrumentSelect.value;
        }
    }
}
