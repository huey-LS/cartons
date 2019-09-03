import Model from './model';
import { MODEL, COLLECTION } from '../constants/life-cycle';
import { Event } from './event';
import { respond } from '../shared/spread';
import { mixinFunctionFromTransform } from '../shared/utils';

const transformFromArrayMap = [
  'forEach', 'map', 'reduce', 'reduceRight',
  'slice', 'filter', 'find', 'findIndex', 'some', 'every', 'includes', 'indexOf'
];

@mixinFunctionFromTransform(
  transformFromArrayMap,
  (target) => target._children
)
export default class Collection extends Model {
  static isCollection = isCollection;

  __cartons_collection = true;
  autoSubscribeChildren = true;
  _childListener = (event) => {
    if (
      ~[
        MODEL.DID_UPDATE,
        COLLECTION.CHILD_DID_UPDATE,
        COLLECTION.DID_UPDATE_CHILDREN,
      ].indexOf(event.type)
    ) {
      const newEvent = new Event(event);
      newEvent.currentTarget = this;
      respond(COLLECTION.CHILD_DID_UPDATE, this, newEvent);
    }
  }

  constructor (attributes) {
    super(attributes);
    this._Model = this.constructor.Model;
    this._isChildModel = this.constructor.isChildModel || ((model) => (model instanceof this._Model));
    this._children = [];
  }

  // before children change
  [COLLECTION.WILL_UPDATE_CHILDREN] () {}
  // after children change
  [COLLECTION.DID_UPDATE_CHILDREN] () {}
  // after one child change
  [COLLECTION.CHILD_DID_UPDATE] () {}

  clone () {
    const newThis = super.clone(this);
    newThis._children = this._children.slice(0);
    return newThis;
  }

  toJSON () {
    return {...super.toJSON(), children: this._children.map(item => item.toJSON())};
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

  getChildren() {
    return this._children.slice(0);
  }

  addChild (item) {
    this._addChild(
      this._createModal(item)
    );
    return this;
  }

  removeChild (item) {
    item && this._removeChildByKey(
      item.key
    );
    return this;
  }

  resetChildren (items) {
    this._resetChild(
      items.map((item) => (
        this._createModal(item)
      ))
    );
    return this;
  }

  destroy () {
    super.destroy();
    this._unsubscribeChildren();
  }

  _addChild (newChild) {
    // const newChild = this._createModal(item);
    const prevChildren = this._children;
    const nextChildren = [
      ...prevChildren,
      newChild
    ];
    this._resetChild(nextChildren);

    return this;
  }

  _removeChildByKey (key) {
    let currentChildIndex = this.findIndex((i) => i.key === key);
    if (currentChildIndex > -1) {
      const prevChildren = this._children;
      const nextChildren = [
        ...prevChildren.slice(0, currentChildIndex),
        ...prevChildren.slice(currentChildIndex + 1)
      ];
      this._resetChild(nextChildren);
    }

    return this;
  }

  _subscribeChildren () {
    if (this.autoSubscribeChildren) {
      this.forEach((child) => {
        child.addListener(
          this._childListener
        )
      })
    }
  }

  _unsubscribeChildren () {
    if (this.autoSubscribeChildren) {
      this.forEach((child) => {
        child.removeListener(
          this._childListener
        )
      })
    }
  }

  _resetChild (nextChildren) {
    const prevChildren = this._children;
    respond(COLLECTION.WILL_UPDATE_CHILDREN, this, [prevChildren, nextChildren]);
    this._unsubscribeChildren();
    this._children = nextChildren;
    this._subscribeChildren();
    respond(COLLECTION.DID_UPDATE_CHILDREN, this, [prevChildren, nextChildren]);
    return this;
  }

  _createModal (item) {
    let current;
    if (this._isChildModel(item)) {
      current = item;
    } else {
      current = new this._Model(item);
    }

    return current;
  }
}

export function isCollection (obj) {
  return obj &&
      (
        obj instanceof Collection
        || obj.__cartons_collection
      )
}
