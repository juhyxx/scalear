import Select from './Select.js';
import {q} from '../shortcuts.js';

export default class SelectTwoLevel extends Select {
  render(data) {
    data.forEach((optgroup) => {
      const optgroupElement = document.createElement('optgroup');

      optgroupElement.label = optgroup.name;
      this.el.appendChild(optgroupElement);
      optgroup.options.forEach((option) => {
        this.renderOption(optgroupElement, option, option.id);
      });
    });
  }
}
