class Observer {
    constructor(vm, data) {
        this.vm = vm;
        this.data = data;
        this.observe(this.data)
    }
    observe(data) {
        if (data && typeof data === 'object') {
            Object.keys(data).forEach(key => {
                this.defineReactive(data, key, data[key]);
            })
        }
    }
    defineReactive(obj, key, value) {
        if(typeof value === 'object') {
            this.observe(value);
        }
        const dep = new Dep()
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() {
                Dep.target && dep.addSub(Dep.target)
                return value;
            },
            set(newVal) {
                if(newVal !== value) {
                    value = newVal;
                }
                dep.notify()
            }
        })
    }
}