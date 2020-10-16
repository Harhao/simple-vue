function proxyData(vm, options) {
  ['data','methods'].forEach(key => {
      Object.keys(vm['$options'][key]).forEach(variable => {
          Object.defineProperty(vm, variable, {
              configurable: true,
              enumerable: true,
              get() {
                  return vm['$options'][key][variable]
              },
              set(val) {
                vm['$options'][key][variable] = val
              }
          })
      })
  })
}