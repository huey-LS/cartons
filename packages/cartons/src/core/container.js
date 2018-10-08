import Model from './model';
import { emitter } from './event';
import { respond } from './spread';
import { immutable } from '../utils/descriptors';
export default class Container extends Model {
  static isContainer = function (obj) {
    return obj &&
      (
        obj instanceof Container
        || obj.__cartons_container
      )
  }

  __cartons_container = true;

  constructor (attributes, content) {
    super(attributes);
    this._Model = this.constructor.Model;
    this._content = this._createModal(content);
  }

  get content () {
    return this._content;
  }

  get contentId () {
    return this._content.id;
  }

  toJSON () {
    return { ...this._attributes, content: this._content.toJSON() };
  }

  @immutable()
  updateContent (content) {
    return this._updateContent(content);
  }

  _updateContent (content) {
    this._content = this._content.set(content);
    return this;
  }

  _createModal (content) {
    let current;
    if (item instanceof this._Model) {
      current = item;
    } else {
      current = new this._Model(item);
    }

    return current;
  }
}