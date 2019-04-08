import { alias } from '../utils/descriptors';
import { createMixer, createThunkAttributeDescriptor } from '../utils/helpers';

export default class Event {
  static isEvent = function (obj) {
    return obj &&
      (
        obj instanceof Event
        || obj.__cartons_event
      )
  }

  __cartons_event = true;

  _events = {};

  @alias('trigger')
  emit (name, data) {
    let events = this._events[name];
    if (events) {
      events.forEach((callback) => {
        callback(data);
      })
    }
  }

  @alias('on')
  addListener (name, callback) {
    let events = this._events[name];
    if (!events) events = this._events[name] = [];
    events.push(callback);
    let removeListener = () => {
      this.removeListener(name, callback);
    }
    return removeListener;
  }

  @alias('off')
  removeListener (name, callback) {
    let events = this._events[name];
    if (events) {
      let index = events.findIndex((fn) => (fn === callback));
      if (index > -1) {
        events.splice(index, 1);
        return callback;
      }
    }
  }
}

export const mixEvent = createMixer(Event);

export const emitter = createThunkAttributeDescriptor(function (value, eventName) {
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
