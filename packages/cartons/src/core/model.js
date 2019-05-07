import Attributes from './attributes';
import EventEmitter from './event';
import { MODEL } from '../constants/life-cycle';
import { respond } from '../shared/spread';
import { incrementCreator } from '../shared/key-creators';

const defaultKeyCreator = incrementCreator();

export default class Model extends EventEmitter {
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
  }

  [MODEL.WILL_UPDATE] () {}
  [MODEL.DID_UPDATE] () {}

  set (
    key,
    newValue
  ) {
    let prevAttributes = this._attributes;
    let nextAttributes;
    if (typeof newValue !== 'undefined') {
      nextAttributes = prevAttributes.set(key, newValue)
    } else {
      nextAttributes = prevAttributes.merge(key);
    }
    this.reset(nextAttributes)
    return this;
  }

  get (attributeName) {
    return this._attributes.get(attributeName);
  }

  remove (attributeName) {
    let nextAttributes = this._attributes.remove(attributeName);
    this.reset(nextAttributes)
    return this;
  }

  reset (nextAttributes) {
    let prevAttributes = this._attributes;
    respond(MODEL.WILL_UPDATE, this, [prevAttributes, nextAttributes])
    this._attributes = nextAttributes;
    respond(MODEL.DID_UPDATE, this, [prevAttributes, nextAttributes])
    return this;
  }

  toJSON () {
    return this._attributes.toJSON();
  }
}
