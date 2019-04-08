import Model from './model';
import { emitter } from './event';
import { respond } from './spread';
export default class Container extends Model {
  static isContainer = function (obj) {
    return obj &&
      (
        obj instanceof Container
        || obj.__cartons_container
      )
  }

  static autoSubscribeContent = true;

  __cartons_container = true;

  constructor (attributes, content) {
    super(attributes);
    this._Model = this.constructor.Model;
    this._content = this._createModal(content);
    this._autoSubscribeContent = this.constructor.autoSubContent;

    if (this._autoSubscribeContent) {
      current.on('update', () => {
        this.emit('update');
      })
    }
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

  @emitter('update')
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
      current = new this._Model(content);
    }

    return current;
  }
}