import Model from 'cartons/model';

export default function observe () {
  return function (target, key, descriptor) {
    if (Model.isModel(descriptor.value)) {
      let value = descriptor.value;
      createObserveForComponent(value, target);
    } else if (descriptor.initializer){
      const oldInitializer = descriptor.initializer;

      descriptor.initializer = function () {
        const _this = this;
        const oldValue = oldInitializer.call(_this);
        if (Model.isModel(oldValue)) {
          createObserveForComponent(oldValue, _this);
        }
        return oldValue;
      }
    }
    return descriptor;
  }
}
function createObserveForComponent (model, component) {
  let removeListener = model.on('update', () => {
    component.forceUpdate();
  })

  let oldComponentWillUnmount = component.componentWillUnmount;
  component.componentWillUnmount = function (...args) {
    removeListener();
    if (typeof oldComponentWillUnmount === 'function') {
      oldComponentWillUnmount.call(this, ...args);
    }
  }
}