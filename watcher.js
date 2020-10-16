class Watcher {
    constructor(vm, expr, cb) {
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;
        this.oldValue = this.getOldValue()
    }
    getOldValue() {
        Dep.target = this
        const value = this.getValue(this.expr)
        Dep.target = null;
        return value;
    }
    // 通知订阅更新数据
    update() {
        const newValue = this.getValue(this.expr)
        if(newValue !== this.oldValue) {
            this.cb(newValue)
        }
    }
    getValue(expr) {
        const exprList = expr.split('.');
        let value = JSON.parse(JSON.stringify(this.vm.$data))
        let index = 0;
        while (index < exprList.length) {
            value = value[exprList[index]]
            index++
        }
        return value
    }
}