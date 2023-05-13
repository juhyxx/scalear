import View from '../View.js';
import { scales } from '../enums/scales.js';
import { notes, notesWithBs } from '../enums/notes.js';
import SvgGroup from '../svg/element/Group.js';
import SvgCircle from '../svg/element/Circle.js';
import SvgRectangle from '../svg/element/Rectangle.js';
import SvgText from '../svg/element/Text.js';
import { instruments } from '../enums/instruments.js';


export default class Piano extends View {
  constructor(svgParent, model) {
    super();
    this._parentEl = svgParent;
    this.model = model;
    this.modelUpdate(this.model, "init");
  }

  modelUpdate(model, changeName) {
    //console.debug("PIANO:", changeName)
    switch (changeName) {
      case 'highlighted':
        this.highlightNotes(model.highlighted);
        break;
      case 'namesVisible':
        this.labels[model.namesVisible ? 'showWithOpacity' : 'hideWithOpacity']();
        break;

      case 'rootNote':
      case 'scale':
        this.showScale();
        break;

      case "neckType":
      case "fretCount":
      case "instrument":
        if (instruments[model.instrument].group !== "piano") {
          if (this._mainGroup) {
            this._mainGroup.remove();
            this._mainGroup = undefined
          }
          break
        }
      default:
        if (this._mainGroup) {
          this._mainGroup.remove();
        }
        this.render();
        this.showScale(model.scale);
        this.labels[model.namesVisible ? 'showWithOpacity' : 'hideWithOpacity']();
        this.highlightNotes(model.highlighted);
        break;
    }
  }

  render() {
    this._mainGroup = new SvgGroup(this._parentEl, {
      id: 'piano'
    });
    new SvgRectangle(this._mainGroup.el, {
      className: 'piano',
      x: 0,
      y: 0,
      width: "90%",
      height: this.model.neckWidth,
    });

    this.keyCount = 20;
    this.keyWidth = this.model.neckHeight / this.keyCount;
    this.blackKeyWidth = Math.round(this.keyWidth * 2 / 3);

    this.renderGroups(this._mainGroup.el);
    this.mapNotes();
  }

  renderGroups(el) {
    const keys = new SvgGroup(el, { className: 'keys' });
    const fingers = new SvgGroup(el, { className: 'fingers' });

    this.labels = new SvgGroup(el, { className: 'labels' });
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
        {
          class: SvgRectangle,
          x: i * this.keyWidth,
          y: 0,
          width: Math.round(this.keyWidth - 2),
          height: this.model.neckWidth,
        }
      );
      if ([0, 1, 3, 4, 5].includes(i % 7)) {
        blackKeys.push(
          {
            class: SvgRectangle,
            x: Math.round((i * this.keyWidth) + (this.blackKeyWidth) - 1),
            y: 0,
            width: this.blackKeyWidth,
            height: Math.round(this.model.neckWidth * 2 / 3),
            index: i
          }
        );
        reflection.push({
          class: SvgRectangle,
          className: 'reflection',
          x: Math.round((i * this.keyWidth) + (this.blackKeyWidth) + this.blackKeyWidth - 4),
          y: 0,
          width: this.blackKeyWidth / 10,
          height: Math.round(this.model.neckWidth * 2 / 3) - 6,
          index: i
        })
        reflection.push({
          class: SvgRectangle,
          className: 'reflection',
          x: Math.round((i * this.keyWidth) + (this.blackKeyWidth)),
          y: 0,
          width: this.blackKeyWidth / 10,
          height: Math.round(this.model.neckWidth * 2 / 3) - 6,
          index: i
        })
      }
    }

    new SvgGroup(el, {
      children: keys,
      className: "white"
    });
    new SvgGroup(el, {
      children: [...blackKeys, ...reflection],
      className: "black"
    });
  }


  mapNotes() {
    const notesMap = new Map();
    const labelsMap = new Map();
    let notesMapItem = [];

    this._fingers.forEach((finger, index) => {
      let note = index % 12;
      notesMapItem = notesMap.has(note) ? notesMap.get(note) : [];
      notesMapItem.push(finger);
      notesMap.set(note, notesMapItem);
      labelsMap.set(finger, this._labels[index]);
    });
    this._notesMap = notesMap;
    this._labelsMap = labelsMap;
  }


  renderFingers(parentEl) {
    const fingers = [];
    for (let i = 0; i <= this.keyCount; i++) {
      const radius = this.model.stringDistance / 3;
      let x = i * this.keyWidth + this.keyWidth / 2
      let y = this.model.neckWidth - 3 * radius

      fingers.push(new SvgGroup(parentEl, {
        children: [
          {
            class: SvgCircle,
            x: x,
            y: y,
            radius: radius,
          },
          {
            class: SvgRectangle,
            x: x - radius,
            y: y - radius,
            width: radius * 2,
            height: radius * 2,
          }
        ]
      }));

      if ([0, 1, 3, 4, 5].includes(i % 7)) {
        y = 50
        x = x + this.keyWidth / 2
        fingers.push(new SvgGroup(parentEl, {
          children: [
            {
              class: SvgCircle,
              x: x,
              y: y,
              radius: radius,
            },
            {
              class: SvgRectangle,
              x: x - radius,
              y: y - radius,
              width: radius * 2,
              height: radius * 2,
            }
          ]
        }));
      }
    }
    this._fingers = fingers;
  }

  renderLabels(parentEl) {
    let labels = [];
    let offset = 0;

    for (let i = 0; i <= this.keyCount + ((Math.round(this.keyCount / 7)) * 5); i++) {
      let noteNumber = i % 12;
      let content = notes[noteNumber];
      let correction = content.length > 1 ? 1 : 0;
      let hasSharp = content.length > 1;

      if ([0, 2, 4, 5, 7, 9, 11].includes(noteNumber)) {
        let y = 103;
        const x = i * this.keyWidth / 2 + this.keyWidth / 2 + offset - 3;
        labels.push(
          new SvgGroup(parentEl, {
            id: 'label',
            children: [
              {
                class: SvgText,
                x, y,
                textContent: content,
              }
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
        }

        labels.push(
          new SvgGroup(parentEl, {
            id: 'label',
            children: [
              {
                class: SvgText,
                x: x,
                y: y,
                textContent: content.sharp.charAt(0),
                className: "sharp"
              },
              {
                class: SvgText,
                className: 'index sharp',
                x: x,
                y: y,
                textContent: content.sharp.charAt(1),
              },
              {
                class: SvgText,
                x: x,
                y: y,
                textContent: content.flat.charAt(0),
                className: "flat"
              },
              {
                class: SvgText,
                className: 'index flat',
                x: x,
                y: y,
                textContent: content.flat.charAt(1),
              }
            ]
          })
        )
      }
      if ([4, 11].includes(noteNumber)) {
        offset = offset + this.keyWidth / 2
      }
    }
    this._labels = labels
  }

  showAllNotes(note) {
    const hasSharps = [0, 2, 4, 7, 9, 11].includes(this.model.rootNote)

    this._notesMap.get(note).forEach((item) => {
      item.show();
      this._labelsMap.get(item).show();
      this._labelsMap.get(item).el.querySelectorAll(hasSharps ? '.flat' : ".sharp").forEach(item => item.classList.add('hide'));
      this._labelsMap.get(item).el.querySelectorAll(!hasSharps ? '.flat' : ".sharp").forEach(item => item.classList.remove('hide'));

      if (note === this.model.rootNote) {
        item.el.querySelector('rect').classList.add('visible');
        item.el.querySelector('circle').classList.remove('visible');
        this._labelsMap.get(item).className = 'root';
      } else {
        this._labelsMap.get(item).className = '';
        item.el.querySelector('rect').classList.remove('visible');
        item.el.querySelector('circle').classList.add('visible');
      }
    });
  }

  showScale(scale) {
    this.clear();
    (scales[scale || this.model.scale].notes).slice().map((item) => (item + this.model.rootNote) % notes.length).forEach((note) => this.showAllNotes(note));
  }

  clear() {
    this._fingers = this._fingers || [];
    this._fingers.forEach((finger, i) => {
      finger.hide().className = '';
      this._labelsMap.get(finger).hide();
    });
  }

  highlightNotes(note) {
    this._fingers.forEach((finger) => finger.removeClass('highlighted'));
    if (note !== undefined) {
      this._notesMap.get(note).forEach((item) => item.addClass('highlighted'));
    }
  }
}
