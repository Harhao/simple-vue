class Svue {
    constructor(options) {
        this.$options = options;
        this.$data = this.getData(options.data)
        this.$el = options.el && this.getElement(options.el)
        new Observer(this, this.$data);
        this.$el && new Compiler(this, this.$el, this.$data);
        proxyData(this, options)
    }
    getData(data) {
        if (data && typeof data === 'function') {
            return data.call(this);
        }
        return data;
    }
    getElement(el) {
       return el.nodeType === 1 ? el : document.querySelector(el);
    }
}