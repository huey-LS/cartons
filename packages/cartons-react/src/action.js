export function bound (attributeFilter) {
  return function (target, key, descriptor) {
    const oldInitializer = descriptor.initializer;
    descriptor.initializer = function () {
      const _this = this;
      const oldValue = oldInitializer.call(_this);
      return function (...args) {
        let addons;
        if (typeof attributeFilter === 'function') {
          addons = attributeFilter.call(_this, _this);
        } else {
          addons = attributeFilter;
        }

        return oldValue.call(this, addons, ...args)
      }
    }
    return descriptor;
  }
}
