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
        this.addEventListener('click', () => {
            this.selectItem(this.getNextSelected());
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
        }, 800);
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
