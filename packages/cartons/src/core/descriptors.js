import {
  createThunkAttributeDescriptor,
  isModel
} from '../utils/helpers';

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

export const alias = createThunkAttributeDescriptor(function (
  target, value, aliasName, key, descriptor
) {
  let aliasNames;
  if (!Array.isArray(aliasName)) {
    aliasNames = [aliasName];
  }

  aliasNames.forEach((aliasName) => {
    if (descriptor) {
      Object.defineProperty(target, aliasName, descriptor);
    } else {
      target[aliasName] = value;
    }
  })

  return target;
});

export const connectModel = createThunkAttributeDescriptor(function (
  target, model, options = {}
) {
  const { autoEmitUpdate = true } = options;
  if (isModel(model)) {
    model.on('update', () => {
      if (typeof options.modelDidUpdate === 'function') {
        options.modelDidUpdate.call(target);
      }

      if (autoEmitUpdate && isModel(target)) {
        target.emit('update');
      }
    })
  }
  return target;
});

export const bindActions = createThunkAttributeDescriptor(function (
  target, actions, options = {}
) {
  const { actionsAttributeName = 'actions' } = options;
  target[actionsAttributeName] = Object.keys(actions)
    .reduce((current, key) => {
      current[key] = function (...args) {
        return actions[key].call(target, ...args)(target);
      }
      return current;
    }, {})

  return target;
})
