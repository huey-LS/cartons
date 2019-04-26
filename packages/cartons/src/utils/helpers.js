export function clone (obj) {
  let newModel = Object.assign({}, obj);
  newModel.__proto__ = obj.__proto__;
  return newModel;
}

export function createThunkAttributeDescriptor (callback) {
  return function (options) {
    return function (target, key, descriptor) {
      if (key) {
        // 有 key 表示是 descriptor 的用法
        return mixinDescriptor(target, key, descriptor);
      } else {
        // 没有 key 表示是普通thunk
        return mixinThunkFunction({}, target, options)
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
        descriptor = createInitializerDescriptor(target, key);
      }

      if (descriptor.initializer) {
        const oldInitializer = descriptor.initializer;
        descriptor.initializer = function () {
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
      } else if (typeof descriptor.value !== 'undefined') {
        descriptor.value = callback.call(
          target,
          target,
          descriptor.value,
          options,
          key,
          descriptor
        )
      }
      return descriptor;
    }
  }
}

export function createInitializerDescriptor (target, key, descriptor) {
  if (!descriptor) {
    const initializerKey = `__initializer_${key}`;
    descriptor = {
      enumerable: true,
      get: function () {
        let initializer = this[initializerKey];
        return initializer && initializer.value;
      },
      set: function (value) {
        if (!this[initializerKey]) this[initializerKey] = {};
        let initializer = this[initializerKey];
        if (initializer.initialized) {
          initializer.value = value;
        } else {
          initializer.originValue = value;
          initializer.value = descriptor.initializer.call(this);
          initializer.initialized = true;
          this[initializerKey] = initializer;
        }
      },
      initializer: function () {
        let initializer = this[initializerKey];
        return initializer && initializer.originValue;
      }
    };
  }

  return descriptor;
}

export function createMixer (TargetClass) {
  return (SuperClass) => {
    const MixinClass = class extends SuperClass {
      constructor (...args) {
        super(...args);
      }
    }

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

