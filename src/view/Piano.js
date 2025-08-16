import View from '../View.js';
import { scales } from '../enums/scales.js';
import { notes, notesWithBs } from '../enums/notes.js';
import SvgGroup from '../svg/element/Group.js';
import SvgCircle from '../svg/element/Circle.js';
import SvgRectangle from '../svg/element/Rectangle.js';
import SvgText from '../svg/element/Text.js';
import { instruments } from '../enums/instruments.js';
import { intervals } from '../enums/intervals.js';


export default class Piano extends View {
  #labelsMap;
  #mainGroup;
  #parentEl;
  #fingers;
  #labels;
  #notesMap;

  get keyCount() {
    return this.model.keyCount
  }
  get keyWidth() {
    return this.model.neckHeight / this.keyCount;
  }

  get blackKeyWidth() {
    return Math.round(this.keyWidth * 2 / 3);
  }

  constructor(svgParent, model) {
    super();
    this.#parentEl = svgParent;
    this.model = model;
    this.modelUpdate(this.model, "init");
  }

  modelUpdate(model, changeName) {
    //console.debug("PIANO:", changeName)
    switch (changeName) {
      case 'highlighted':
        this.highlightNotes(model.highlighted);
        break;
      case 'rootNote':
      case 'scale':
        this.showScale();
        break;
      case "names":
        this.labels.el.setAttribute("class", model.names.toLowerCase());
        break;
      case "neckType":
      case "fretCount":
      case "instrument":
        if (instruments[model.instrument].group !== "piano") {
          if (this.#mainGroup) {
            this.#mainGroup.remove();
            this.#mainGroup = undefined
          }
          break
        }
      default:
        if (this.#mainGroup) {
          this.#mainGroup.remove();
        }
        this.render();
        this.showScale(model.scale);
        this.highlightNotes(model.highlighted);
        break;
    }
  }

  render() {
    this.#mainGroup = new SvgGroup(this.#parentEl, {
      id: 'piano', children: [{
        class: SvgRectangle, className: 'piano', x: 0, y: 0, width: "90%", height: this.model.neckWidth
      }]
    });
    this.renderGroups(this.#mainGroup.el);
    this.labels.el.setAttribute("class", this.model.names.toLowerCase())
    this.mapNotes();
  }

  renderGroups(el) {
    const keys = new SvgGroup(el, { className: 'keys' });
    const fingers = new SvgGroup(el, { className: 'fingers' });
    this.labels = new SvgGroup(el, { id: 'labels' });

    this.renderKeys(keys.el)
    this.renderFingers(fingers.el);
    this.renderLabels(this.labels.el);
  }

  renderKeys(el) {
    let keys = [];
    let blackKeys = [];
    let reflection = []

    for (let i = 0; i <= this.keyCount; i++) {
      keys.push(
        { class: SvgRectangle, x: i * this.keyWidth, y: 0, width: Math.round(this.keyWidth - 2), height: this.model.neckWidth }
      );
      if ([0, 1, 3, 4, 5].includes(i % 7)) {
        blackKeys.push({ class: SvgRectangle, x: Math.round((i * this.keyWidth) + (this.blackKeyWidth) - 1), y: 0, width: this.blackKeyWidth, height: Math.round(this.model.neckWidth * 2 / 3), index: i });
        reflection.push({
          class: SvgRectangle, className: 'reflection', x: Math.round((i * this.keyWidth) + (this.blackKeyWidth) + this.blackKeyWidth - 4), y: 0, width: this.blackKeyWidth / 10, height: Math.round(this.model.neckWidth * 2 / 3) - 6, index: i
        }, {
          class: SvgRectangle, className: 'reflection', x: Math.round((i * this.keyWidth) + (this.blackKeyWidth)), y: 0, width: this.blackKeyWidth / 10, height: Math.round(this.model.neckWidth * 2 / 3) - 6, index: i
        })
      }
    }
    new SvgGroup(el, { children: keys, className: "white" });
    new SvgGroup(el, { children: [...blackKeys, ...reflection], className: "black" });
  }

  mapNotes() {
    const notesMap = new Map();
    const labelsMap = new Map();
    let notesMapItem = [];

    this.#fingers.forEach((finger, index) => {
      let note = index % 12;
      notesMapItem = notesMap.has(note) ? notesMap.get(note) : [];
      notesMapItem.push(finger);
      notesMap.set(note, notesMapItem);
      labelsMap.set(finger, this.#labels[index]);
    });
    this.#notesMap = notesMap;
    this.#labelsMap = labelsMap;
  }

  renderFingers(parentEl) {
    const fingers = [];
    for (let i = 0; i <= this.keyCount; i++) {
      const radius = this.model.stringDistance / 3;
      let x = i * this.keyWidth + this.keyWidth / 2
      let y = this.model.neckWidth - 3 * radius

      fingers.push(new SvgGroup(parentEl, {
        children: [
          { class: SvgCircle, x: x, y: y, radius: radius },
          { class: SvgRectangle, x: x - radius, y: y - radius, width: radius * 2, height: radius * 2 }
        ]
      }));

      if ([0, 1, 3, 4, 5].includes(i % 7)) {
        y = 50
        x = x + this.keyWidth / 2
        fingers.push(new SvgGroup(parentEl, {
          children: [
            { class: SvgCircle, x: x, y: y, radius: radius },
            { class: SvgRectangle, x: x - radius, y: y - radius, width: radius * 2, height: radius * 2 }
          ]
        }));
      }
    }
    this.#fingers = fingers;
  }

  renderLabels(parentEl) {
    let labels = [];
    let offset = 0;

    for (let i = 0; i <= this.keyCount + ((Math.round(this.keyCount / 7)) * 5); i++) {
      let noteNumber = i % 12;
      let content = notes[noteNumber];

      if ([0, 2, 4, 5, 7, 9, 11].includes(noteNumber)) {
        let y = 103;
        const x = i * this.keyWidth / 2 + this.keyWidth / 2 + offset - 3;
        labels.push(
          new SvgGroup(parentEl, {
            id: 'label',
            children: [
              { class: SvgText, x, y, textContent: content },
              { class: SvgText, x: x, y: y, textContent: "", className: "interval" },
              { class: SvgText, className: 'interval-sign', x: x, y: y, textContent: "" }
            ]
          })
        )
      }
      if ([1, 3, 6, 8, 10].includes(noteNumber)) {
        let y = 53;
        const x = i * this.keyWidth / 2 + this.keyWidth / 2 - 4 + offset;
        let content = {
          "sharp": notes[noteNumber],
          "flat": notesWithBs[noteNumber],
        };

        labels.push(
          new SvgGroup(parentEl, {
            id: 'label',
            children: [
              { class: SvgText, x: x, y: y, textContent: content.sharp.charAt(0), className: "sharp" },
              { class: SvgText, className: 'index sharp', x: x, y: y, textContent: content.sharp.charAt(1) },
              { class: SvgText, x: x, y: y, textContent: content.flat.charAt(0), className: "flat" },
              { class: SvgText, className: 'index flat', x: x, y: y, textContent: content.flat.charAt(1) },
              { class: SvgText, x: x, y: y, textContent: "", className: "interval" },
              { class: SvgText, className: 'interval-sign', x: x, y: y, textContent: "" }
            ]
          })
        )
      }
      if ([4, 11].includes(noteNumber)) {
        offset = offset + this.keyWidth / 2
      }
    }
    this.#labels = labels
  }

  showAllNotes(note) {
    const hasSharps = [0, 2, 4, 7, 9, 11].includes(this.model.rootNote)

    this.#notesMap.get(note).forEach((item) => {
      item.show();
      const labelItem = this.#labelsMap.get(item);
      labelItem.show();
      labelItem.el.querySelectorAll(hasSharps ? '.flat' : ".sharp").forEach(item => item.classList.add('hide'));
      labelItem.el.querySelectorAll(!hasSharps ? '.flat' : ".sharp").forEach(item => item.classList.remove('hide'));

      if (note === this.model.rootNote) {
        item.el.querySelector('rect').classList.add('visible');
        item.el.querySelector('circle').classList.remove('visible');
        labelItem.className = 'root';
      } else {
        labelItem.className = '';
        item.el.querySelector('rect').classList.remove('visible');
        item.el.querySelector('circle').classList.add('visible');
      }
      let interval = intervals[(12 + note - this.model.rootNote) % 12];

      labelItem.el.querySelector(".interval").textContent = interval[0];
      labelItem.el.querySelector(".interval-sign").textContent = interval[1];
    });
  }

  showScale(scale) {
    this.clear();
    (scales[scale || this.model.scale].notes).slice().map((item) => (item + this.model.rootNote) % notes.length).forEach((note) => this.showAllNotes(note));
  }

  clear() {
    this.#fingers = this.#fingers || [];
    this.#fingers.forEach((finger, i) => {
      finger.hide().className = '';
      this.#labelsMap.get(finger).hide();
    });
  }

  highlightNotes(note) {
    this.#fingers.forEach((finger) => finger.removeClass('highlighted'));
    if (note !== undefined) {
      this.#notesMap.get(note).forEach((item) => item.addClass('highlighted'));
    }
  }
}
