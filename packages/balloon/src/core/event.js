import { alias } from '../utils/descriptors';

export default class Event {
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
  }

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