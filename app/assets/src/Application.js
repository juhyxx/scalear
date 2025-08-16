export default class Application {
    #model;

    get model() {
        return this.#model;
    }

    set model(model) {
        this.#model = model;
        this.#model.addUpdateHandler(this.modelUpdate, this);
    }

    get route() {
        const params = (location.hash.slice(1) || '/').split('/');

        params.shift();
        params.pop();
        return params || [];
    }
    set route(route) {
        window.location.hash = route;
    }

    static run() {
        return new this().run();
    }

    run() {
        this.onBoot.call(this);
        window.addEventListener('hashchange', () =>
            this.onRouteChange(this.route)
        );
    }

    onRouteChange() {
        console.warn('Virtual method "boot", has to be implemented.');
    }

    onBoot() {
        console.warn('Virtual method "boot", has to be implemented.');
    }

    modelUpdate() {
        console.warn('Virtual method "modelUpdate", has to be implemented.');
    }

    static prepareHashString(text) {
        return text
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[ \(\)]/g, '')
            .replace(/♯/g, '#');
    }
}
