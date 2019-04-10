import Attributes from './attributes';
import Event, { emitter } from './event';
import { respond } from './spread';
import { alias } from '../utils/descriptors';
import { incrementCreator } from '../utils/key-creators';

const defaultKeyCreator = incrementCreator();

export default class Model extends Event {
  static isModel = function (obj) {
    return obj &&
      (
        obj instanceof Model
        || obj.__cartons_model
      )
  }

  __cartons_model = true;

  constructor (attributes = {}) {
    super();

    let initialAttributes = this.constructor.initialAttributes;
    if (typeof initialAttributes === 'function') {
      initialAttributes = initialAttributes();
    }
    this._attributes = new Attributes(Object.assign({}, initialAttributes, attributes));
    var keyCreator = this.constructor.key || defaultKeyCreator;
    if (typeof keyCreator === 'function') {
      this.key = keyCreator();
    } else if (typeof keyCreator === 'string') {
      // use attribute
      Object.defineProperty(this, 'key', {
        get: function () {
          return this.get(keyCreator);
        }
      })
    }

    this.on('update', () => {
      this._changed = true;
    })
  }

  get changed () {
    let changed = this._changed;
    // only get once
    this._changed = false;
    return changed;
  }

  set changed (value) {
    this._changed = value;
  }

  modelWillUpdate () {}
  modelDidUpdate () {}

  @alias('update')
  @emitter('update')
  set (
    key,
    newValue
  ) {
    let prevAttributes = this._attributes;
    let nextAttributes;
    if (typeof key === 'string') {
      nextAttributes = this._attributes.set(key, newValue)
    } else {
      nextAttributes = this._attributes.merge(key);
    }
    respond('modelWillUpdate', this, [prevAttributes, nextAttributes])
    this._attributes = nextAttributes;
    respond('modelDidUpdate', this, [prevAttributes, nextAttributes])
    return this;
  }

  get (attributeName) {
    return this._attributes.get(attributeName);
  }

  @emitter('update')
  remove (attributeName) {
    this._attributes = this._attributes.remove(attributeName);
    return this;
  }

  toJSON () {
    return this._attributes.toJSON();
  }

  toJSONStringify () {
    return JSON.stringify(this.toJSON());
  }
}
