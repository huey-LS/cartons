import Attributes from "./src/core/attributes";

export declare class Model {
  static isModel (obj: any): boolean;
  constructor (attributes?: Object);
  private readonly __cartons_model: boolean;
  modelWillUpdate (prevAttributes: Attributes, nextAttributes: Attributes): any;
  modelDidUpdate (prevAttributes: Attributes, nextAttributes: Attributes): any;
  set (keyValue: Object): this;
  set (key: string, newValue: any): this;
  get (attributeName: string): any;
  remove (attributeName: string): this;
  toJSON (): JSON;
}

export declare class Collection extends Model {
  static isCollection (any: any): boolean;
  static Model: Model | (() => Model);
  private readonly __cartons_collection: boolean;
  autoSubscribeChildren?: boolean;
  collectionWillUpdateChildren (prevChildren: Array<Model>, nextChildren: Array<Model>): any;
  collectionDidUpdateChildren (prevChildren: Array<Model>, nextChildren: Array<Model>): any;
  readonly children: Array<Model>;
  readonly length: number;
  addChild (child: Model|Object): this;
  removeChild (child: Model|Object): this;
  resetChildren (newChildren: Array<Model|Object>): this;
  toJSON (): JSON;
  toArray(): Array<JSON>;
}

export declare class Event {
  static isEvent (): boolean;
  private readonly __cartons_event: boolean;
  private _events: Object;
  emit (name: string, data: any): void;
  on (name: string, callback: () => void): () => void;
  off (name: string, callback: () => void): void;
}