export function clone (obj) {
  let newModel = Object.assign({}, obj);
  newModel.__proto__ = obj.__proto__;
  return newModel;
}

export const mixinFunctionFromTransform = (
  map,
  transform
) => (target) => {
  if (Array.isArray(map) && 'function' === typeof transform) {
    map.forEach((key) => {
      if('function' === typeof Array.prototype[key]) {
        Object.defineProperty(target.prototype, key, {
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

export function createThunkAttributeDescriptor (
  callback
) {
  return function (options) {
    return function (target, key, descriptor) {
      if (key) {
        // 有 key 表示是 descriptor 的用法
        return mixinDescriptor(target, key, descriptor);
      } else {
        // 没有 key 表示是普通thunk
        return mixinThunkFunction(Object.create(null), target, options)
      }
    }

    function mixinThunkFunction (target, value, options) {
      return callback.call(
        target,
        target,
        value,
        options,
      );
    }

    function mixinDescriptor (target, key, descriptor) {
      if (!descriptor) {
        descriptor = createInitializerDescriptor(key);
      }

      if ((descriptor).initializer) {
        const oldInitializer = (descriptor).initializer;
        (descriptor).initializer = function () {
          const _self = this;
          const value = oldInitializer.call(_self);
          return callback.call(
            _self,
            _self,
            value,
            options,
            key,
            descriptor
          );
        }
      } else {
        const newValue = callback.call(
          target,
          target,
          descriptor.value,
          options,
          key,
          descriptor
        )

        if (typeof newValue !== 'undefined') {
          descriptor.value = newValue;
        }
      }
      return descriptor;
    }
  }
}

export function createInitializerDescriptor (
  key
) {
  const initializerKey = `__initializer_${key}`;
  const descriptor = {
    enumerable: true,
    get: function () {
      let initializer = this[initializerKey];
      return initializer && initializer.value;
    },
    set: function (value) {
      const _this = this;
      if (!_this[initializerKey]) _this[initializerKey] = {};
      let initializer = _this[initializerKey];
      if (initializer.initialized) {
        initializer.value = value;
      } else {
        initializer.originValue = value;
        initializer.value = descriptor.initializer();
        initializer.initialized = true;
        _this[initializerKey] = initializer;
      }
    },
    initializer () {
      const _this = this;
      let initializer = _this[initializerKey];
      return initializer && initializer.originValue;
    }
  };

  return descriptor;
}

export function createMixer (TargetClass) {
  return (SuperClass) => {
    const MixinClass = class extends SuperClass {}

    MixinClass.prototype = Object.create(
      MixinClass.prototype,
      Object.getOwnPropertyDescriptors(TargetClass.prototype)
    )
    return MixinClass;
  }
}

export function mixin (SuperClass) {
  return (MixinSuperClass, ...otherMixinSuperClasses) => {
    if (MixinSuperClass) {
      return mixin(
        createMixer(MixinSuperClass)(SuperClass)
      )(...otherMixinSuperClasses)
    } else {
      return SuperClass;
    }
  }
}

export function isModel (obj) {
  return obj &&
    (
      obj.__cartons_model
    )
}

export function isCollection (obj) {
  return obj &&
    (
      obj.__cartons_collection
    )
}

