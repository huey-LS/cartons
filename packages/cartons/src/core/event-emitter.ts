import { clone } from '../shared/utils';
import { respond } from '../shared/spread';

import {
  WILL_DESTROY,
  DID_DESTROY
} from '../constants/life-cycle';

export class Event {
  data: any;
  target: any;
  type: string;
  currentTarget: any;

  constructor (
    options: {
      data: any,
      target: any,
      currentTarget?: any,
      type: string
    }
  ) {
    const { data, target, type, currentTarget } = options;
    this.data = data;
    this.target = target;
    this.currentTarget = currentTarget || target;
    this.type = type;

    return this;
  }
}

export interface TypedEventCallback<TypedEvent extends Event = Event> {
  (event: TypedEvent): void;
}

export interface CommonEventConfig {
  [WILL_DESTROY]: TypedEventCallback,
  [DID_DESTROY]: TypedEventCallback
}

interface EventCallbacksByType {
  [type: string]: TypedEventCallback[];
}

export default class EventEmitter<EventsConfig extends CommonEventConfig = CommonEventConfig> {
  static isEvent = function (obj: any): obj is EventEmitter {
    return obj &&
      (
        obj instanceof Event
        || obj.__cartons_event
      )
  }

  readonly __cartons_event = true;
  _events: EventCallbacksByType;
  _destroyed: boolean;

  constructor () {
    this._events = {};
    this._destroyed = false;
  }

  emit (name: Event|keyof EventsConfig, data: any) {
    let event: Event;
    if (EventEmitter.isEvent(name)) {
      event = data;
    } else {
      event = new Event({
        target: this,
        data,
        type: name as string
      });
    }

    let type = event.type;
    let events = this._events[type];
    if (events) {
      events.forEach((callback) => {
        callback(event);
      })
    }
  }


  addListener<K extends keyof EventsConfig>(name: K, callback: EventsConfig[K]) {
    let removeListener = () => {};
    if (this._destroyed) return removeListener;
    if (callback) {
      let events = this._events[name as string];
      if (!events) events = this._events[name as string] = [];
      events.push(callback as any);
    }
    if (callback) {
      removeListener = () => {
        this.removeListener(callback as any);
      }
    }
    return removeListener;
  }

  removeListener (callback: TypedEventCallback) {
    if (this._destroyed) return false;
    let events = this._events;
    Object.keys(events).forEach((key) => {
      this._remove(events[key], callback);
    })

    return callback;
  }

  _remove (events: TypedEventCallback[], callback: TypedEventCallback) {
    let index = events.findIndex((fn) => (fn === callback));
    if (index > -1) {
      events.splice(index, 1);
      return callback;
    }
  }

  destroy () {
    respond(WILL_DESTROY, this);
    this._events = {};
    this._destroyed = true;
    respond(DID_DESTROY, this);
  }

  clone () {
    const newThis = clone(this);
    const events = this._events;
    newThis._events = Object.keys(events).reduce((newEvents, key) => {
      newEvents[key] = [ ...events[key] ];
      return newEvents
    }, {} as EventCallbacksByType);
    return newThis;
  }
}
