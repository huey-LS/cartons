import Attributes from './attributes';
import { respond } from '../shared/spread';
import { clone } from '../shared/utils';
import { alias } from './descriptors';
import { incrementCreator } from '../shared/key-creators';

const defaultKeyCreator = incrementCreator();

export default class Model {
  static isModel = function (obj) {
    return obj &&
      (
        obj instanceof Model
        || obj.__cartons_model
      )
  }

  __cartons_model = true;

  constructor (attributes = {}) {
    // super();

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

  modelWillUpdate () {}
  modelDidUpdate () {}

  set (
    key,
    newValue
  ) {
    let prevAttributes = this._attributes;
    let nextAttributes;
    if (typeof key === 'string') {
      nextAttributes = prevAttributes.set(key, newValue)
    } else {
      nextAttributes = prevAttributes.merge(key);
    }
    respond('modelWillUpdate', this, [prevAttributes, nextAttributes])
    this._attributes = nextAttributes;
    respond('modelDidUpdate', this, [prevAttributes, nextAttributes])
    return this;
  }

  get (attributeName) {
    return this._attributes.get(attributeName);
  }

  remove (attributeName) {
    let prevAttributes = this._attributes;
    let nextAttributes = this._attributes.remove(attributeName);
    respond('modelWillUpdate', this, [prevAttributes, nextAttributes])
    this._attributes = nextAttributes;
    respond('modelDidUpdate', this, [prevAttributes, nextAttributes])
    return this;
  }

  toJSON () {
    return this._attributes.toJSON();
  }

  clone () {
    return clone(this);
  }
}
