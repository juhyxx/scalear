export class RangeSelector extends HTMLElement {
    #value = 12;
    #min = 8;
    #max = 25;

    set min(value) {
        this.#min = parseInt(value);
    }
    get min() {
        return this.#min;
    }

    set max(value) {
        this.#max = parseInt(value);
    }
    get max() {
        return this.#max;
    }

    set value(value) {
        if (isNaN(value)) {
            value = this.min;
        }
        if (value < this.min) {
            value = this.min;
        }
        if (value > this.max) {
            value = this.max;
        }
        this.#value = value;
        this.checkDisabled();
        this.number.value = this.value;
        this.range.value = this.value;
        this.dispatchEvent(new CustomEvent('change', { detail: { value } }));
    }

    get value() {
        return this.#value;
    }

    checkDisabled() {
        const up = this.querySelector('input[value="▲"]');
        const down = this.querySelector('input[value="▼"]');
        up.disabled = this.value >= this.max;
        down.disabled = this.value <= this.min;
    }

    connectedCallback() {
        this.innerHTML = `
        <input  
            type="range" 
            list="frets" 
            min="${this.min}" 
            max="${this.max}" value="${this.value}">
        <input  
            type="number"  
            min="${this.min}" 
            max="${this.max}" 
            value="${this.getAttribute('value')}" 
            step="1" 
            tabindex="${this.getAttribute('tabindex')}"
        />
        <datalist id="frets">
            ${Array.from({ length: this.max - this.min + 1 }, (_, i) => i + this.min)
                .map((value) => `<option>${value}</option>`)
                .join('')}
        </datalist>
        <div class="buttons">
            <input type="button" value="▲"></input>
            <input type="button" value="▼"></input>
        </div>`;

        this.range = this.querySelector('input[type="range"]');
        this.number = this.querySelector('input[type="number"]');
        this.up = this.querySelector('input[value="▲"]');
        this.down = this.querySelector('input[value="▼"]');
        this.checkDisabled();

        this.range.addEventListener('input', (e) => {
            this.value = e.target.value;
            e.stopPropagation();
        });
        this.range.addEventListener(
            'wheel',
            (e) => {
                this.value = parseInt(this.value) + (e.deltaY < 0 ? -1 : 1);
            },
            { passive: true }
        );
        this.number.addEventListener('change', (e) => {
            this.value = e.target.value;
            e.stopPropagation();
        });

        this.up.addEventListener('click', () => (this.value = parseInt(this.value) + 1));
        this.down.addEventListener('click', () => (this.value = parseInt(this.value) - 1));
    }
}
