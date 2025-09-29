import Scalear from './Scalear.js';
import { ToggleButton, ToggleItem } from './components/ToggleButton.js';
import { RangeSelector } from './components/RangeSeletor.js';
import { TwoLevelCombo } from './components/TwoLevelCombo.js';
import { NeckView } from './components/NeckView.js';

customElements.define('toggle-button', ToggleButton);
customElements.define('toggle-item', ToggleItem);
customElements.define('range-selector', RangeSelector);
customElements.define('two-level-combo', TwoLevelCombo);
customElements.define('neck-view', NeckView);

document.addEventListener('DOMContentLoaded', function () {
    let app = new Scalear();
    app.run();

    window.scalear = app;
});
