import Svg from './Svg.js';

export default class Element extends Svg {
    #el;

    constructor(parent, params) {
        super(...arguments);

        if (parent) {
            params = params || {};
            this.parent = parent;
            params.class = params.className;
            delete params.className;
            Object.keys(params).forEach((key) => {
                this[key] = params[key];
            });
            this.params = params;
            this.render();
        }
    }

    get className() {
        return this.#el.getAttribute('class') || '';
    }
    set className(name) {
        return this.#el.setAttribute('class', name);
    }

    get el() {
        return this.#el;
    }
    set el(el) {
        return (this.#el = el);
    }

    remove() {
        this.el.parentNode.removeChild(this.el);
    }

    show() {
        this.#el.style.display = 'block';
        return this;
    }

    hide() {
        this.#el.style.display = 'none';
        return this;
    }

    addClass(className) {
        this.className = this.className + ' ' + className;
        return this;
    }

    hasClass(className) {
        return this.className.indexOf(className) > -1;
    }

    removeClass(className) {
        this.className = this.className.replace(className).trim();
    }

    showWithOpacity() {
        this.#el.style.opacity = 1;
    }

    hideWithOpacity() {
        this.#el.style.opacity = 0;
    }

    render() {
        this.el = document.createElementNS(this.NS, this.name);

        Object.keys(this.params).map((key) => {
            switch (key) {
                case 'id':
                    this.el[key] = this[key];
                case 'textContent':
                    this.el[key] = this[key];
                    break;
                case 'children':
                    this.children.forEach((child) => new child.class(this.el, child));
                    break;
                default:
                    if (this[key] !== undefined) {
                        this.el.setAttribute(key, this[key]);
                    }
            }
        });

        this.parent.appendChild(this.el);
        return this;
    }
}
