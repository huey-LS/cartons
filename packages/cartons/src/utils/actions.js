import {
  createThunkAttributeDescriptor,
  isModel
} from './helpers';

export const bindAction = createThunkAttributeDescriptor(function (attribute, filter) {
  const _self = this;
  if (typeof attribute === 'function') {
    return function (...args) {
      let addons;
      if (typeof filter === 'function') {
        addons = filter.call(_self, _self);
      } else {
        addons = filter;
      }

      return attribute.call(this, ...args)(addons)
    }
  } else {
    return attribute;
  }
})

export const bindActions = createThunkAttributeDescriptor(function (
  model, actions,
  { actionsAttributeName = 'actions'} = {}
) {
  if (actions && isModel(model)) {
    model[actionsAttributeName] = Object.keys(actions)
      .reduce((current, key) => {
        current[key] = function (...args) {
          return actions[key].call(model, ...args)(model);
        }
        return current;
      }, {})
  }

  return model;
})

export const createActions = createThunkAttributeDescriptor(function (
  actions
) {
  const model = this;
  if (actions && isModel(model)) {
    return Object.keys(actions)
      .reduce((current, key) => {
        current[key] = function (...args) {
          return actions[key].call(model, ...args)(model);
        }
        return current;
      }, {})
  }

  return actions;
})
