import Model from './model';
import { mixinFunctionFromTransform, immutable, eventEmitter } from '../utils/descriptors';

const transformFromArrayMap = [
  'forEach', 'map', 'reduce', 'reduceRight',
  'slice', 'filter', 'find', 'findIndex', 'some', 'every', 'includes', 'indexOf'
];

@mixinFunctionFromTransform(
  transformFromArrayMap,
  (target) => target._items
)
export default class Collection extends Model {
  static isCollection = function (obj) {
    return obj &&
      (
        obj instanceof Collection
        || obj.__cartons_collection
      )
  }

  __cartons_collection = true;

  constructor (attributes) {
    super(attributes);
    this._Model = this.constructor.Model;
    this._items = [];
  }

  toJSON () {
    return {...this._attributes, items: this._items.map(item => item.toJSON())};
  }

  get length () {
    return this._items.length;
  }

  set length (value) {}

  @eventEmitter('update')
  @immutable()
  add (item) {
    return this._add(item);
  }

  @eventEmitter('update')
  @immutable()
  remove (item) {
    return this._remove(item);
  }

  @eventEmitter('update')
  @immutable()
  updateItem (item, filter) {
    return this._updateItem(item, filter);
  }

  @eventEmitter('update')
  @immutable()
  updateItems (fn) {
    // return this._updateItem(item, filter);
    this._items = this._items.map((item) => (fn(item)));
    return this;
  }

  @eventEmitter('update')
  @immutable()
  clean () {
    return this._clean();
  }

  @eventEmitter('update')
  @immutable()
  reset(items) {
    return this._reset(items);
  }

  _add (item) {
    if (item) {
      if (Array.isArray(item)) {
        item.forEach((item) => {
          const newItem = this._createModal(item);
          this._items.push(
            newItem
          );
          // newItem.on('update', () => this.emit('update'))
        })
      } else {
        const newItem = this._createModal(item);
        this._items.push(
          newItem
        );
        // newItem.on('update', () => this.emit('update'))
      }
    }

    return this;
  }

  _remove (item) {
    let currentItemIndex = this.findIndex((i) => i === item);
    if (currentItemIndex > -1) {
      this._items = [
        ...this._items.slice(0, currentItemIndex),
        ...this._items.slice(currentItemIndex + 1)
      ]
    }

    return this;
  }

  _updateItem (item, filter) {
    if ('function' !== typeof filter) {
      let key = this._Model.key;
      if (key && item[key]) {
        filter = (i) => (i.get(key) === item[key])
      }
    }
    if (filter) {
      let targetIndex = this.findIndex(filter);
      if (targetIndex >= 0) {
        this._items[targetIndex] = this._items[targetIndex].set(item);
      }
    }
    return this;
  }

  _clean () {
    this._items = [];
    return this;
  }

  _reset (items) {
    this._clean();
    if (Array.isArray(items)) {
      items.forEach((item) => {
        this._items.push(
          this._createModal(item)
        );
      })
    }
    return this;
  }

  _createModal (item) {
    let current;
    if (item instanceof this._Model) {
      current = item;
    } else {
      current = new this._Model(item);
    }

    return current;
  }
}
