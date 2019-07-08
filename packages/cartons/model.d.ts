interface RemoveListener {
  (name: string, callback: () => void): void;
  (callback: () => void): void;
}

interface AddListener {
  (name: string, callback: () => void): void;
  (callback: () => void): void;
}

declare class EventEmitter {
  static isEvent (): boolean;
  private readonly __cartons_event: boolean;
  private _events: Object;
  emit (name: string, data?: any): void;
  on: AddListener;
  addListener: AddListener;
  off: RemoveListener;
  removeListener: RemoveListener;
}

declare class Attributes {
  set (key: string, newValue: any): this|Attributes;
  get (attributeName: string): any;
  merge (attributes: any): Attributes
  remove (attributeName: string): this|Attributes;
  toJSON (): JSON;
}

export default class Model extends EventEmitter {
  static isModel (obj: any): boolean;
  static key?: string | Function;
  constructor (attributes?: Object);
  private readonly __cartons_model: boolean;
  private readonly _attributes: Attributes;
  modelWillUpdate (prevAttributes: Attributes, nextAttributes: Attributes): any;
  modelDidUpdate (prevAttributes: Attributes, nextAttributes: Attributes): any;
  key (): any;
  set (keyValue: Object): this;
  set (key: string, newValue: any): this;
  get (attributeName: string): any;
  remove (attributeName: string): this;
  toJSON (): JSON;
  clone (): Model
}