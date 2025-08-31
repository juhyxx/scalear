export default class SVG {
    get NS() {
        return 'http://www.w3.org/2000/svg';
    }

    static get(selector) {
        return document.querySelector(selector);
    }
}
