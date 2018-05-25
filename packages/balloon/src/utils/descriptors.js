export function formatByMap (map, defaultMessage) {
  defaultMessage = defaultMessage || map['default'];
  return function (target, name, descriptor) {
    var oldGet = descriptor.get;
    descriptor.get = function () {
      let result = map[oldGet.call(this)];
      if (!result && defaultMessage) {
        result = defaultMessage;
      }
      return result;
    }
    return descriptor;
  }
}

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

export function clone (obj) {
  let newModel = Object.assign({}, obj);
  newModel.__proto__ = obj.__proto__;
  return newModel;
}

export function immutable (immutable) {
  return function (target, key, descriptor) {
    let oldValue = descriptor.value;
    descriptor.value = function (...args) {
      let currentClone = this.clone || (() => clone(this));
      let currentImmutable = 'undefined' === typeof immutable ? this._immutable : immutable;
      let currentTarget;
      if (currentImmutable) {
        currentTarget = currentClone.call(this)
      } else {
        currentTarget = this;
      }
      return oldValue.apply(currentTarget, args);
    }
    return descriptor;
  }
}

export function eventEmitter (eventName) {
  return function (target, key, descriptor) {
    let oldValue = descriptor.value;
    descriptor.value = function (...args) {
      let result = oldValue.apply(this, args);
      if (typeof this.emit === 'function') {
        this.emit(eventName)
      }
      return result;
    }
    return descriptor;
  }
}
