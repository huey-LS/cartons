import Model from './model';
import { emitter } from './event';
import { respond } from './spread';
import { mixinFunctionFromTransform } from '../utils/descriptors';

const transformFromArrayMap = [
  'forEach', 'map', 'reduce', 'reduceRight',
  'slice', 'filter', 'find', 'findIndex', 'some', 'every', 'includes', 'indexOf'
];

@mixinFunctionFromTransform(
  transformFromArrayMap,
  (target) => target._children
)
export default class Collection extends Model {
  static isCollection = function (obj) {
    return obj &&
      (
        obj instanceof Collection
        || obj.__cartons_collection
      )
  }

  static autoSubscribeChildren = true;

  __cartons_collection = true;

  constructor (attributes) {
    super(attributes);
    this._Model = this.constructor.Model;
    this._children = [];

    this._unsubscribes = [];
    this._autoSubscribeContent = this.constructor.autoSubscribeChildren;
  }

  // before add new child
  collectionWillAddChild () {}
  // after add new child
  collectionDidAddChild () {}

  collectionWillCreateChild () {}

  // before remove child
  collectionWillRemoveChild () {}
  // after remove child
  collectionDidRemoveChild () {}

  toJSON () {
    return {...this._attributes, children: this._children.map(item => item.toJSON())};
  }

  toArray () {
    return this._children.map(item => item.toJSON());
  }

  get children () {
    return this._children;
  }

  get length () {
    return this._children.length;
  }

  set length (value) {}

  @emitter('update')
  add (item) {
    return this._add(item);
  }

  @emitter('update')
  remove (item) {
    return this._remove(item);
  }

  updateItem (item, filter) {
    return this._updateItem(item, filter);
  }

  updateItems (fn) {
    // return this._updateItem(item, filter);
    this._children = this._children.map((item) => (fn(item)));
    return this;
  }

  @emitter('update')
  clean () {
    return this._clean();
  }

  @emitter('update')
  reset(items) {
    return this._reset(items);
  }

  _add (item) {
    if (item) {
      if (Array.isArray(item)) {
        item.forEach((item) => {
          this._addItem(item);
        })
      } else {
        this._addItem(item);
      }
    }

    return this;
  }

  _addItem (item) {
    respond('collectionWillCreateChild', this, [item]);
    const newItem = this._createModal(item);
    respond('collectionWillAddChild', this, [newItem]);
    this._children.push(
      newItem
    );
    respond('collectionDidAddChild', this, [newItem]);
    if (this._autoSubscribeContent) {
      let unsubscribe = newItem.on('update', () => {
        console.log('collection child update');
        this.emit('update');
      })
      this._unsubscribes.push(unsubscribe);
    }
  }

  _remove (item) {
    const collectionWillRemoveChild = this.collectionWillRemoveChild;
    let currentItemIndex = this.findIndex((i) => i === item);
    if (currentItemIndex > -1) {
      respond('collectionWillRemoveChild', this, item);
      this._children = [
        ...this._children.slice(0, currentItemIndex),
        ...this._children.slice(currentItemIndex + 1)
      ]
      respond('collectionDidRemoveChild', this, [item]);

      if (this._autoSubscribeContent) {
        let unsubscribe = this._unsubscribes[currentItemIndex];
        unsubscribe();
        this._unsubscribes = [
          ...this._unsubscribes.slice(0, currentItemIndex),
          ...this._unsubscribes.slice(currentItemIndex + 1)
        ]
      }
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
        this._children[targetIndex] = this._children[targetIndex].set(item);
      }
    }
    return this;
  }

  _clean () {
    this._children = [];
    if (this._autoSubscribeContent) {
      this._unsubscribes.forEach((unsubscribe) => {
        unsubscribe();
      })
      this._unsubscribes = [];
    }
    return this;
  }

  _reset (items) {
    this._clean();
    this._add(items);
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
