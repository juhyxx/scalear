import View from '../View.js';
import { q } from '../shortcuts.js';

export default class StateToggle extends View {

  get el() {
    return this._el;
  }
  set el(selector) {
    this._el = q(selector);
  }

  constructor({ selector, propertyName, model, data, watchOption }) {
    super();
    this.el = selector;
    this.el.dataset.names = model.names;
    this.el.addEventListener('click', () => {
      const event = new CustomEvent('change');
      this.el.dispatchEvent(event);
    });
    this.model = model;
  }

  modelUpdate(model, changeName) {
    if (changeName === 'names') {
      this.el.dataset.names = model.names;
      this.el.querySelector('.toggle-box div').innerHTML = model.names
    }
  }
}
