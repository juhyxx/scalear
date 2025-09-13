import { APP } from './enums/app.js';
import { scalesGrouped, SCALES } from './enums/scales.js';
import { INSTRUMENT_GROUPS, INSTRUMENTS } from './enums/instruments.js';
import { NOTES_SHARP, NOTES_BS } from './enums/notes.js';
import Svg from './svg/Svg.js';
import Neck from './view/Neck.js';
import Select from './view/Select.js';
import SelectTwoLevel from './view/SelectTwoLevel.js';
import Model from './Model.js';

export default class Scalear {
    #scaleSelect;
    #rootSelect;
    #instrumentSelect;
    #model;

    get model() {
        return this.#model;
    }

    set model(model) {
        this.#model = model;
        this.#model.addUpdateHandler(this.modelUpdate, this);
    }

    get route() {
        const params = (location.hash.slice(1) || '/').split('/');

        params.shift();
        params.pop();
        return params || [];
    }
    set route(route) {
        window.location.hash = route;
    }

    static run() {
        return new this().run();
    }

    run() {
        this.onBoot.call(this);
        window.addEventListener('hashchange', () => this.onRouteChange(this.route));
    }

    static prepareHashString(text) {
        return text
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[ \(\)]/g, '')
            .replace(/♯/g, '#');
    }

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
            data: NOTES_BS,
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
            data: INSTRUMENT_GROUPS,
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
                document.querySelector('#frets-count').disabled = INSTRUMENTS[model.instrument].group === 'piano';
        }
        this.route = Scalear.prepareHashString(
            ['', INSTRUMENTS[model.instrument].name, model.scaleName, model.rootNoteName, ''].join('/')
        );
        localStorage.defaults = model.toJSON();
    }

    onRouteChange(params) {
        let note;

        // if (params.length > 0) {
        //     if (params[2]) {
        //         for (note = 0; note < Notes.length; note++) {
        //             const item = Notes[note];
        //             if (Scalear.prepareHashString(item) === params[2]) {
        //                 break;
        //             }
        //         }
        //         this.model.rootNote = note < 12 ? note : 0;
        //     }
        //     if (params[0]) {
        //         try {
        //             this.model.instrument = Instruments.filter(
        //                 (item) => Scalear.prepareHashString(item.name) === params[0]
        //             )[0].id;
        //         } catch (e) {
        //             this.model.instrument = 0;
        //         }
        //     }
        //     if (params[1]) {
        //         try {
        //             this.model.scale = scales.filter(
        //                 (item) => Scalear.prepareHashString(item.name) === params[1]
        //             )[0].id;
        //         } catch (e) {
        //             this.model.scale = 0;
        //         }
        //     }
        // } else {
        //     this.model.scale = this.#scaleSelect.value;
        //     this.model.rootNote = this.#rootSelect.value;
        //     this.model.instrument = this.#instrumentSelect.value;
        // }
    }
}
