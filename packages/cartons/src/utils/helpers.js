export function clone (obj) {
  let newModel = Object.assign({}, obj);
  newModel.__proto__ = obj.__proto__;
  return newModel;
}

export function createThunkAttributeDescriptor (callback) {
  return function (options) {
    return function (target, key, descriptor) {
      if (descriptor.initializer) {
        const oldInitializer = descriptor.initializer;
        descriptor.initializer = function () {
          const _self = this;
          const value = oldInitializer.call(_self);
          return callback.call(_self, value, options);
        }
      } else if (typeof descriptor.value !== 'undefined') {
        descriptor.value = callback.call(target, descriptor.value, options)
      }
      return descriptor;
    }
  }
}

export function isModel (obj) {
  return obj &&
    (
      obj.__cartons_model
    )
}

export function isContainer (obj) {
  return obj &&
    (
      obj.__cartons_container
    )
}

export function isCollection (obj) {
  return obj &&
    (
      obj.__cartons_collection
    )
}

