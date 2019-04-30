import Model from './model';
import { respond } from '../shared/spread';
import { mixinFunctionFromTransform } from '../shared/utils';
// import { mixEventAutoEmit } from './event';

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

  __cartons_collection = true;
  autoSubscribeChildren = false;

  constructor (attributes) {
    super(attributes);
    this._Model = this.constructor.Model;
    this._children = [];

    this._unsubscribes = [];
  }

  // before children change
  collectionWillUpdateChildren () {}
  // after children change
  collectionDidUpdateChildren () {}

  clone () {
    const newThis = super.clone(this);
    newThis._children = this._children.slice(0);
    return newThis;
  }

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

  // @emitter('update')
  addChild (item) {
    this._add(item);
    this._resetSubscribeChildren();
    return this;
  }

  // @emitter('update')
  removeChild (item) {
    this._remove(item);
    this._resetSubscribeChildren();
    return this;
  }

  // @emitter('update')
  resetChildren (items) {
    this._reset(items);
    this._resetSubscribeChildren();
    return this;
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
    const newItem = this._createModal(item);
    const prevChildren = this._children;
    const nextChildren = [
      ...prevChildren,
      newItem
    ];
    respond('collectionWillUpdateChildren', this, [prevChildren, nextChildren]);
    this._children = nextChildren;
    respond('collectionDidUpdateChildren', this, [prevChildren, nextChildren]);
    return this;
  }

  _remove (item) {
    let currentItemIndex = this.findIndex((i) => i === item);
    if (currentItemIndex > -1) {
      const prevChildren = this._children;
      const nextChildren = [
        ...prevChildren.slice(0, currentItemIndex),
        ...prevChildren.slice(currentItemIndex + 1)
      ];
      respond('collectionWillUpdateChildren', this, [prevChildren, nextChildren]);
      this._children = nextChildren;
      respond('collectionDidUpdateChildren', this, [prevChildren, nextChildren]);
    }

    return this;
  }


  _resetSubscribeChildren () {
    this._unsubscribeChildren();
    this._subscribeChildren();
    return this;
  }

  _subscribeChildren () {
    if (this.autoSubscribeChildren) {
      this.forEach((child) => {
        // let unsubscribe = child.on('update', () => {
        //   this.emit('update');
        // })
        this._unsubscribes.push(unsubscribe);
      })
    }
  }
  _unsubscribeChildren () {
    if (this.autoSubscribeChildren) {
      this._unsubscribes.forEach((unsubscribe) => {
        unsubscribe();
      })
      this._unsubscribes = [];
    }
  }

  _clean () {
    this._children = [];
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
