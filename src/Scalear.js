import { APP } from './enums/app.js';
import { scalesGrouped } from './enums/scales.js';
import { INSTRUMENT_GROUPS, INSTRUMENTS } from './enums/instruments.js';

import Model from './Model.js';

export default class Scalear {
    #model;

    get model() {
        return this.#model;
    }

    set model(model) {
        this.#model = model;
        //  this.#model.addUpdateHandler(this.modelUpdate, this);
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
        document.querySelector('nav').className = '';
        document.title = `${this.model.rootNoteName} ${this.model.scaleName} (${this.name})`;
    }

    init() {
        const instrumentCombo = document.querySelector('two-level-combo#instrument-selector');
        const scaleCombo = document.querySelector('two-level-combo#scale-selector');
        const notes = document.querySelector('#notes');
        const fretBoardSelect = document.querySelector('#fretboard');
        const notesPerString = document.querySelector('#notes-per-string');
        const fretsCount = document.querySelector('#frets-count');
        const rootSelector = document.querySelector('#root-select');
        const neckView = document.querySelector('neck-view');

        instrumentCombo.addData(INSTRUMENT_GROUPS, 'name');
        scaleCombo.addData(scalesGrouped, 'name');

        document.querySelector('#print').addEventListener('click', (e) => window.print());

        fretBoardSelect.addEventListener('change', (e) => neckView.setAttribute('neck-type', e.detail.value));
        fretsCount.addEventListener('change', (e) => neckView.setAttribute('fret-count', e.detail.value));
        notesPerString.addEventListener('change', (e) => neckView.setAttribute('note-per-string', e.detail.value));
        rootSelector.addEventListener('change', (e) => neckView.setAttribute('root-note', e.detail.value));
        notes.addEventListener('change', (e) => neckView.setAttribute('notes', e.detail.value));
        instrumentCombo.addEventListener('select', (e) => neckView.setAttribute('instrument', e.detail.value));
        scaleCombo.addEventListener('select', (e) => neckView.setAttribute('scale', e.detail.value));
    }

    // modelUpdate(model, changeName) {
    //     switch (changeName) {
    //         case 'rootNote':
    //             document.querySelector('#root').innerHTML = model.rootNoteName;
    //             document.title = `${model.rootNoteName} ${model.scaleName} (${this.name})`;
    //             break;
    //         case 'scale':
    //             document.querySelector('#name').innerHTML = model.scaleName;
    //             document.title = `${model.rootNoteName} ${model.scaleName} (${this.name})`;
    //             break;
    //     }
    //     this.route = Scalear.prepareHashString(
    //         ['', INSTRUMENTS[model.instrument].name, model.scaleName, model.rootNoteName, ''].join('/')
    //     );
    //     localStorage.defaults = model.toJSON();
    // }

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
