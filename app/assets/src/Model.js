import {scales} from './enums/scales.js';
import {notes} from './enums/notes.js';
import {instruments} from './enums/instruments.js';

export default class Model {
  get rootNote() {
    return this._rootNote || 0;
  }
  get rootNoteName() {
    return notes[this.rootNote];
  }
  set rootNote(rootNote) {
    if (this.rootNote !== rootNote) {
      this._rootNote = parseInt(rootNote, 10);
      this.onUpdate('rootNote');
    }
  }

  get instrument() {
    return this._instrument || 0;
  }
  set instrument(instrument) {
    if (this.instrument !== instrument) {
      this._instrument = parseInt(instrument, 10);
      this.onUpdate('instrument');
    }
  }

  get scale() {
    return this._scale || 0;
  }
  get scaleName() {
    return scales[this.scale].name;
  }
  set scale(scale) {
    if (this.scale !== scale) {
      this._scale = parseInt(scale, 10);
      this.onUpdate('scale');
    }
  }

  get fretCount() {
    return this._fretCount || 12;
  }
  set fretCount(fretCount) {
    fretCount = parseInt(fretCount, 10);
    fretCount = isNaN(fretCount) ? 12 : fretCount;
    fretCount = Math.min(fretCount, 25);
    fretCount = Math.max(fretCount, 10);
    this._fretCount = fretCount;
    this.onUpdate('fretCount');
  }

  get namesVisible() {
    return !!this._namesVisible;
  }
  set namesVisible(namesVisible) {
    this._namesVisible = !!namesVisible;
    this.onUpdate('namesVisible');
  }

  get neckType() {
    return this._neckType || 'gibson';
  }
  set neckType(neckType) {
    this._neckType = neckType;
    this.onUpdate('neckType');
  }

  get tunning() {
    return instruments[this.instrument].tunning;
  }
  set tunning(tunning) {
    return this._tunning = tunning;
  }

  get stringsCount() {
    return this.tunning && this.tunning.length || 6;
  }
  get stringDistance() {
    return 20;
  }
  get neckWidth() {
    return this.stringDistance * this.stringsCount || 130;
  }
  get fretWidth() {
    return Math.round(this.neckHeight / this.fretCount);
  }
  get neckHeight() {
    return 500;
  }

  get highlighted() {
    return this._higlighted;
  }

  set highlighted(highlighted) {
    this._higlighted = highlighted;
    this.onUpdate('highlighted');
  }

  constructor() {
    this.namesVisible = true;
  }

  onUpdate(change) {
    this._updateHandlers = this._updateHandlers || [];
    this._updateHandlers.forEach((handler) => {
      handler.fn.call(handler.scope, this, change);
    });
  }

  addUpdateHandler(fn, scope) {
    this._updateHandlers = this._updateHandlers || [];
    this._updateHandlers.push({fn: fn, scope: scope});
  }

  toJSON() {
    return JSON.stringify({
      rootNote: this.rootNote,
      namesVisible: this.namesVisible,
      instrument: this.instrument,
      scale: this.scale,
      fretsCount: this.fretCount,
      neckType: this.neckType,
    });
  }
}
