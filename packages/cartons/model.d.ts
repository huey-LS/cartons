import EventEmitter from './event-emitter';

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
  static initialAttributes?: Object | Function;
  constructor (attributes?: Object);
  readonly __cartons_model: boolean;
  private readonly _attributes: Attributes;
  modelWillUpdate (prevAttributes: Attributes, nextAttributes: Attributes): any;
  modelDidUpdate (prevAttributes: Attributes, nextAttributes: Attributes): any;
  key (): any;
  set (keyValue: Object): this;
  set (key: string, newValue: any): this;
  get (attributeName: string): any;
  remove (attributeName: string): this;
  toJSON (): Object;
  clone (): Model
}