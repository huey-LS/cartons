import * as React from 'react';
import Model from 'balloon/model';

export default function observe (target, key, descriptor) {
  let value = descriptor.value;
  if (value instanceof Model) {
    let removeListener = value.on('update', () => {
      target.forceUpdate();
    })

    let oldComponentDidMount = target.componentDidMount;
    target.componentDidMount = function (...args) {
      removeListener();
      if (typeof oldComponentDidMount === 'function') {
        oldComponentDidMount.call(this, ...args);
      }
    }
  }
  return descriptor;
}