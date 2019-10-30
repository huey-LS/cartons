import Attributes from './attributes';
import EventEmitter, {
  Event,
  TypedEventCallback,
  CommonEventConfig
} from './event-emitter';
import {
  MODEL_DID_UPDATE,
  MODEL_WILL_UPDATE
 } from '../constants/life-cycle';
import { respond } from '../shared/spread';
import {
  KeyCreator,
  incrementCreator
} from './key-creators';

const defaultKeyCreator = incrementCreator();


type prevAttributes = Attributes;
type nextAttributes = Attributes;
interface ModelUpdateEvent extends Event {
  data: [prevAttributes, nextAttributes]
}

export interface CommonModelEventConfig extends CommonEventConfig {
  [MODEL_WILL_UPDATE]: TypedEventCallback<ModelUpdateEvent>,
  [MODEL_DID_UPDATE]: TypedEventCallback<ModelUpdateEvent>
}

export default class Model<ModelEvents extends CommonModelEventConfig = CommonModelEventConfig> extends EventEmitter<ModelEvents> {
  static isModel = function (obj: any): obj is Model {
    return obj &&
      (
        obj instanceof Model
        || obj.__cartons_model
      )
  }

  static initialAttributes: () => any;
  static key?: string|KeyCreator;

  readonly __cartons_model = true;

  _attributes: Attributes;

  key!: string;

  constructor (attributes = {}) {
    super();

    const constructor = this.constructor as typeof Model;

    let initialAttributesCreator = constructor.initialAttributes;
    let initialAttributes: any;
    if (typeof initialAttributesCreator === 'function') {
      initialAttributes = initialAttributesCreator();
    }
    this._attributes = new Attributes(Object.assign({}, initialAttributes, attributes));
    var keyCreator = constructor.key || defaultKeyCreator;

    if (typeof keyCreator === 'function') {
      this.key = keyCreator();
    } else {
      // use attribute
      Object.defineProperty(this, 'key', {
        get: function () {
          return this.get(keyCreator);
        }
      })
    }
  }

  [MODEL_WILL_UPDATE]? (prevAttributes: Attributes, nextAttributes: Attributes): void;
  [MODEL_DID_UPDATE]? (prevAttributes: Attributes, nextAttributes: Attributes): void;

  set (
    key: string|any,
    newValue?: any
  ) {
    let prevAttributes = this._attributes;
    let nextAttributes;
    if (typeof key === 'string') {
      nextAttributes = prevAttributes.set(key, newValue)
    } else {
      nextAttributes = prevAttributes.merge(key);
    }
    this.reset(nextAttributes)
    return this;
  }

  get (attributeName: string) {
    return this._attributes.get(attributeName);
  }

  remove (attributeName: string) {
    let nextAttributes = this._attributes.remove(attributeName);
    this.reset(nextAttributes)
    return this;
  }

  reset (nextAttributes: Attributes) {
    let prevAttributes = this._attributes;
    respond(MODEL_WILL_UPDATE, this, [prevAttributes, nextAttributes])
    this._attributes = nextAttributes;
    respond(MODEL_DID_UPDATE, this, [prevAttributes, nextAttributes])
    return this;
  }

  toJSON () {
    return this._attributes.toJSON();
  }
}
