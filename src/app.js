import Scalear from './Scalear.js';
import { ToggleButton, ToggleItem } from './components/ToggleButton.js';

let app = new Scalear();
app.run();

window.scalear = app;

customElements.define('toggle-button', ToggleButton);
customElements.define('toggle-item', ToggleItem);
