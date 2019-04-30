import Attributes from "./src/core/attributes";
export default class Model {
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