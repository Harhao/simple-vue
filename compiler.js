class Compiler {
    constructor(vm, el, data) {
        this.vm = vm;
        this.el = el;
        this.data = data;
        const fragment = this.getFragment(this.el);
        this.compile(fragment)

    }
    getFragment(el) {
        const f = document.createDocumentFragment();
        let child = el.firstChild;
        while (child) {
            f.appendChild(child)
            child = el.firstChild
        }
        return f
    }
    compile(f) {
        const self = this;
        let childNodes = Array.from(f.childNodes)
        childNodes.forEach(child => {
            // 如果是元素节点
            if (child.nodeType === 1) {
                self.compileElement(child)
            } else {
                this.compileText(child)
            }
        })
        this.el.appendChild(f)
    }
    compileElement(node) {
        const attributes = Array.from(node.attributes);
        attributes.forEach((attribute) => {
            if (attribute.nodeName.indexOf('v-') > -1) {
                let [_, directive] = attribute.nodeName.split('-')
                this.compileDirective(directive, attribute.nodeValue, node)
                node.removeAttribute('v-' + directive)
            } else if (attribute.nodeName.indexOf('@') > -1) {
                const directive = attribute.nodeName.replace(/@(.+?)$/g, (...args) => {
                    return args[1];
                })
                this.compileDirective('on:' + directive, attribute.nodeValue, node)
                node.removeAttribute('@' + directive)
            }
        })
        if (node.childNodes.length > 0) {
            this.compile(node)
        }
    }
    compileText(node) {
        const textContent = node.textContent
        if (/\{\{(.+?)\}\}/.test(textContent)) {
            const exrp = textContent.replace(/\{\{(.+?)\}\}/g, (...args) => { return args[1] });
            new Watcher(this.vm, exrp , (newVal) => {
                node.textContent = newVal
            })
            node.textContent = this.getValue(exrp)
        }
    }
    compileDirective(directive, expr, node) {
        const directArr = directive.split(':')
        directive = directArr[0]
        switch (directive) {
            case 'model':
                new Watcher(this.vm, expr, (newVal) => {
                    node.value = this.getValue(expr)
                })
                node.addEventListener('input', (e) => {
                    this.setValue(this.data, expr, e.target.value)
                }, false)
                node.value = this.getValue(expr);
                break;
            case 'text':
                new Watcher(this.vm, expr, (newVal) => {
                    node.textContent = this.getValue(expr)
                })
                node.textContent = this.getValue(expr);
                break;
            case 'html':
                new Watcher(this.vm, expr, (newVal) => {
                    node.innerHTML = this.getValue(expr)
                })
                node.innerHTML = this.getValue(expr);
                break;
            case 'on':
                node.addEventListener(directArr[1], this.vm.$options.methods[expr].bind(this.vm), false);
                break;

        }
    }

    setValue(data, expr, newVal) {
        const exprList = expr.split('.');
        let value = data
        let index = 0;
        while (index < exprList.length) {
            if (index === exprList.length - 1) {
                value[exprList[index]] = newVal
                return
            }
            value = value[exprList[index]]
            index++
        }
    }
    getValue(expr) {
        const exprList = expr.split('.');
        let value = JSON.parse(JSON.stringify(this.data))
        let index = 0;
        while (index < exprList.length) {
            value = value[exprList[index]]
            index++
        }
        return value
    }
}