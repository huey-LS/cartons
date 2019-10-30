import Model, {
  CommonModelEventConfig
} from './model';
import Attributes from './attributes';
import {
  Event,
  TypedEventCallback,
  CommonEventConfig
} from './event-emitter';
import {
  MODEL_WILL_UPDATE,
  MODEL_DID_UPDATE,
  COLLECTION_WILL_UPDATE_CHILDREN,
  COLLECTION_DID_UPDATE_CHILDREN,
  COLLECTION_CHILD_DID_UPDATE
} from '../constants/life-cycle';
import { respond } from '../shared/spread';
import { mixinFunctionFromArray } from '../shared/utils';


type prevChildren<ModelClass> = ModelClass[];
type nextChildren<ModelClass> = ModelClass[];
interface CollectionUpdateChildrenEvent<ModelClass> extends Event {
  data: [
    prevChildren<ModelClass>,
    nextChildren<ModelClass>
  ]
}

export interface CommonCollectionEventConfig<ModelClass> extends CommonModelEventConfig {
  [COLLECTION_WILL_UPDATE_CHILDREN]: TypedEventCallback<CollectionUpdateChildrenEvent<ModelClass>>,
  [COLLECTION_DID_UPDATE_CHILDREN]: TypedEventCallback<CollectionUpdateChildrenEvent<ModelClass>>
}

const transformFromArrayMap = [
  'forEach', 'map', 'reduce', 'reduceRight',
  'slice', 'filter', 'find', 'findIndex', 'some', 'every', 'includes', 'indexOf'
];

@mixinFunctionFromArray(
  transformFromArrayMap,
  (target: any) => target._children
)
export default class Collection<ModelClass extends Model = Model, CollectionEventConfig extends CommonCollectionEventConfig<ModelClass> = CommonCollectionEventConfig<ModelClass>> extends Model<CollectionEventConfig> {
  static isCollection = function (obj: any): obj is Collection {
    return obj &&
        (
          obj instanceof Collection
          || obj.__cartons_collection
        )
  };

  static Model: typeof Model;

  static isChildModel?: (model: any) => boolean;

  static childrenJSONKey: string = 'children';

  readonly __cartons_collection = true;
  autoSubscribeChildren = true;

  get _Model () {
    const constructor = this.constructor as typeof Collection;
    return constructor.Model;
  }

  get _isChildModel () {
    const constructor = this.constructor as typeof Collection;
    return constructor.isChildModel || ((model) => (model instanceof this._Model));
  }
  _children: ModelClass[] = [];

  _childListener = (event: Event) => {
    if (
      ~[
        MODEL_DID_UPDATE,
        COLLECTION_CHILD_DID_UPDATE,
        COLLECTION_DID_UPDATE_CHILDREN,
      ].indexOf(event.type)
    ) {
      respond(
        COLLECTION_CHILD_DID_UPDATE,
        this,
        [
          event.target,
          event.data[0]
        ]
      );
    }
  }

  // transformFromArrayMap
  forEach!: Array<ModelClass>["forEach"];
  map!: Array<ModelClass>["map"];
  reduce!: Array<ModelClass>["reduce"];
  reduceRight!: Array<ModelClass>["reduceRight"];
  slice!: Array<ModelClass>["slice"];
  filter!: Array<ModelClass>["filter"];
  find!: Array<ModelClass>["find"];
  findIndex!: Array<ModelClass>["findIndex"];
  some!: Array<ModelClass>["some"];
  every!: Array<ModelClass>["every"];
  includes!: Array<ModelClass>["includes"];
  indexOf!: Array<ModelClass>["indexOf"];

  // before children change
  [COLLECTION_WILL_UPDATE_CHILDREN] (prevChildren: ModelClass[], nextChildren: ModelClass[]) {}
  // after children change
  [COLLECTION_DID_UPDATE_CHILDREN] (prevChildren: ModelClass[], nextChildren: ModelClass[]) {}
  // after one child change
  [COLLECTION_CHILD_DID_UPDATE] (model: ModelClass, prevAttributes: Attributes) {}

  clone () {
    const newThis = super.clone.call(this);

    newThis._children = this._children.slice(0);
    return newThis;
  }

  toJSON () {
    const constructor = this.constructor as typeof Collection;

    return {
      ...super.toJSON(),
      [constructor.childrenJSONKey]: this.toArray()
    };
  }

  toArray () {
    return this._children.map((item) => (item.toJSON()));
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

  addChild (item: ModelClass|any) {
    this._addChild(
      this._createModal(item)
    );
    return this;
  }

  removeChild (itemKey: any) {
    itemKey && this._removeChildByKey(
      itemKey
    );
    return this;
  }

  resetChildren (items:  (ModelClass|any)[]) {
    this._resetChild(
      items.map((item) => (
        this._createModal(item)
      ))
    );
    return this;
  }

  destroy () {
    super.destroy();
    // this._unsubscribeChildren();
  }

  _addChild (newChild: ModelClass) {
    // const newChild = this._createModal(item);
    const prevChildren = this._children;
    const nextChildren = [
      ...prevChildren,
      newChild
    ];
    this._resetChild(nextChildren);

    return this;
  }

  _removeChildByKey (key: any) {
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

  // _subscribeChildren () {
  //   if (this.autoSubscribeChildren) {
  //     this.forEach((child) => {
  //       child.addListener(
  //         this._childListener
  //       )
  //     })
  //   }
  // }

  // _unsubscribeChildren () {
  //   if (this.autoSubscribeChildren) {
  //     this.forEach((child) => {
  //       child.removeListener(
  //         this._childListener
  //       )
  //     })
  //   }
  // }

  _resetChild (nextChildren: ModelClass[]) {
    const prevChildren = this._children;
    respond(COLLECTION_WILL_UPDATE_CHILDREN, this, [prevChildren, nextChildren]);
    // this._unsubscribeChildren();
    this._children = nextChildren;
    // this._subscribeChildren();
    respond(COLLECTION_DID_UPDATE_CHILDREN, this, [prevChildren, nextChildren]);
    return this;
  }

  _createModal (item: any) {
    let current: ModelClass;
    if (this._isChildModel(item)) {
      current = item;
    } else {
      current = new this._Model(item) as ModelClass;
    }

    return current;
  }
}
