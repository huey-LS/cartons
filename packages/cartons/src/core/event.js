import { alias } from './descriptors';
import { createMixer, createThunkAttributeDescriptor, clone } from '../shared/utils';

export class Event {
  data;
  target;
  type;


  constructor (
    options
  ) {
    const { data, target, type } = options;
    this.data = data;
    this.target = target;
    this.type = type;

    return this;
  }
}

export default class EventEmitter {
  static isEvent = function (obj) {
    return obj &&
      (
        obj instanceof Event
        || obj.__cartons_event
      )
  }

  __cartons_event = true;

  _events = {};
  _all_events = [];
  _destroyed = false;

  emit (name, data) {
    let events = this._events[name];
    let event;
    if (data instanceof Event) {
      event = data;
    } else {
      event = new Event({
        target: this,
        data,
        type: name
      });
    }
    if (events) {
      events.forEach((callback) => {
        callback(event);
      })
    }
    this._all_events.forEach((callback) => {
      callback(event);
    })
  }

  @alias('on')
  addListener (name, callback) {
    if (this._destroyed) return false;
    if (!callback && typeof name === 'function') {
      callback = name;
      // name = null;
      this._all_events.push(callback);
    } else {
      let events = this._events[name];
      if (!events) events = this._events[name] = [];
      events.push(callback);
    }
    let removeListener = () => {
      this.removeListener(name, callback);
    }
    return removeListener;
  }

  @alias('off')
  removeListener (name, callback) {
    if (this._destroyed) return false;
    if (!callback && typeof name === 'function') {
      callback = name;
      this._remove(this._all_events, callback);
      let events = this._events;
      Object.keys(events).forEach((key) => {
        this._remove(events[key], callback);
      })
    } else {
      let events = this._events[name];
      if (events) {
        this._remove(events, callback);
      }
    }

    return callback;
  }

  _remove (events, callback) {
    let index = events.findIndex((fn) => (fn === callback));
    if (index > -1) {
      events.splice(index, 1);
      return callback;
    }
  }

  destroy () {
    this._events = {};
    this._all_events = [];
    this._destroyed = true;
  }

  clone () {
    const newThis = clone(this);
    const events = this._events;
    newThis._events = Object.keys(events).reduce((newEvents, key) => {
      newEvents[key] = [ ...events[key] ];
      return newEvents
    }, {});
    newThis._all_events = [ ...newThis._all_events ];
    return newThis;
  }
}

export const mixEvent = createMixer(Event);
