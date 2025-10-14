export class ToggleButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    #items = null;
    #selected = 0;

    set selected(value) {
        this.#selected = value;
    }

    get value() {
        return this.#items[this.#selected].getAttribute('value');
    }
    getNextSelected() {
        this.#selected = (this.#selected + 1) % this.#items.length;
        return this.#selected;
    }
    connectedCallback() {
        this.shadowRoot.innerHTML = `<label part="label">
            <div part=wrapper>
                <div part="container">
                    <slot></slot>
                </div>
            </div>
        </label>`;
        this.#items = [...this.querySelectorAll('toggle-item')];

        this.selectItem(this.#selected);
        this.addEventListener('click', (e) => {
            e.preventDefault();

            e.stopPropagation();
            this.selectItem(this.getNextSelected());
        });
        this.addEventListener('dblclick', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
        this.addEventListener('wheel', (e) => {
            e.preventDefault();

            this.selected =
                e.deltaY > 0
                    ? (this.#selected + 1) % this.#items.length
                    : (this.#selected - 1 + this.#items.length) % this.#items.length;
            this.selectItem(this.#selected);
        });
    }

    selectItem(index) {
        this.shadowRoot.querySelector('[part=container]').style.left = `${-index * 6}rem`;
        setTimeout(() => {
            this.dispatchEvent(
                new CustomEvent('change', {
                    detail: {
                        value: this.#items[index].getAttribute('value')
                    },
                    bubbles: true,
                    composed: true
                })
            );
        }, 500);
    }
}

export class ToggleItem extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `<div  data-value="${this.getAttribute('value')}">${this.innerText} </div>`;
    }
}
