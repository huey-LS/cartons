import {
  createThunkAttributeDescriptor,
  isModel
} from '../shared/utils';

export const alias = createThunkAttributeDescriptor(function (
  target,
  value,
  aliasName,
  key,
  descriptor
) {
  let aliasNames;
  if (!Array.isArray(aliasName)) {
    aliasNames = [aliasName];
  } else {
    aliasNames = aliasName;
  }

  aliasNames.forEach((aliasName) => {
    if (descriptor) {
      Object.defineProperty(target, aliasName, descriptor);
    } else {
      target[aliasName] = value;
    }
  })

  return value;
});

export const serialized = createThunkAttributeDescriptor(function (
  target,
  value,
  options,
  key,
  descriptor
) {
  let name, type;
  if (typeof options === 'string') {
    name = options;
  } else {
    name = options.name;
    type = options.type;
  }

  if (descriptor) {
    descriptor.enumerable = true;
    descriptor.get = function () {
      let value = this.get(name);
      if (type) {
        value = type(value);
      }
      return value;
    }

    delete descriptor.writable;

    delete descriptor.initializer;
  }
});

export const connectModel = createThunkAttributeDescriptor(function (
  target,
  model,
  options = {}
) {
  const { autoEmitUpdate = true } = options;
  if (isModel(model)) {
    model.addListener('update', () => {
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
  target,
  actions,
  options = {},
  actionsAttributeName
) {
  actionsAttributeName = actionsAttributeName || options.actionsAttributeName || 'actions';
  let newActions = Object.keys(actions)
    .reduce((current, key) => {
      current[key] = function (...args) {
        return actions[key].call(target, ...args)(target);
      }
      return current;
    }, {})

  return newActions;
})
