import {
  clone,
  createThunkAttributeDescriptor
} from './helpers';

export const mixinFunctionFromTransform = (
  map,
  transform
) => (target) => {
  if (Array.isArray(map) && 'function' === typeof transform) {
    map.forEach((key) => {
      if('function' === typeof Array.prototype[key]) {
        Object.defineProperty(Object.prototype, key, {
          value: function (...args) {
            let currentTarget = transform(this);
            return currentTarget && currentTarget[key] && currentTarget[key](...args)
          },
          writable: true,
          enumerable: false,
          configurable: true
        });
      }
    })
  }
  return target;
}

export function alias (aliasNames, ...args) {
  if ('string' === typeof aliasNames) {
    aliasNames = [aliasNames, ...args];
  }
  if(!Array.isArray(aliasNames) || aliasNames.length === 0) {
    throw new Error('aliasName not set')
  }

  return function (target, key, descriptor) {
    aliasNames.forEach((aliasName) => {
      Object.defineProperty(target, aliasName, descriptor);
    })
    return descriptor;
  }
}

export const immutable = createThunkAttributeDescriptor(function (value, immutable) {
  if (typeof value === 'function') {
    return function (...args) {
      let currentClone = this.clone || (() => clone(this));
      let currentImmutable = 'undefined' === typeof immutable ? this._immutable : immutable;
      let currentTarget;
      if (currentImmutable) {
        currentTarget = currentClone.call(this)
      } else {
        currentTarget = this;
      }
      return value.apply(currentTarget, args);
    }
  }
  return value;
})

export const eventEmitter = createThunkAttributeDescriptor(function (value, eventName) {
  if (typeof value === 'function') {
    return function (...args) {
      let result = value.apply(this, args);
      if (typeof this.emit === 'function') {
        this.emit(eventName)
      }
      return result;
    }
  }
  return value;
})
