
import Model from './model';

export default class Collection<T = Model> extends Model {
  static isCollection (any: any): boolean;
  static Model: (typeof Model) | ((attributes: Object) => Model);
  static isChildModel: (model: any) => boolean
  readonly __cartons_collection: boolean;
  autoSubscribeChildren?: boolean;
  collectionWillUpdateChildren (prevChildren: Array<T>, nextChildren: Array<T>): any;
  collectionDidUpdateChildren (prevChildren: Array<T>, nextChildren: Array<T>): any;
  readonly children: Array<T>;
  readonly length: number;
  addChild (child: T|Object): this;
  removeChild (child: T|Object): this;
  resetChildren (newChildren: Array<T|Object>): this;
  toJSON (): JSON;
  toArray(): Array<JSON>;

  forEach: Array<T>["forEach"];
  map: Array<T>["map"];
  filter: Array<T>["filter"];
  reduce: Array<T>["reduce"];
  reduceRight: Array<T>["reduceRight"];
  slice: Array<T>["slice"];
  find: Array<T>["find"];
  findIndex: Array<T>["findIndex"];
  some: Array<T>["some"];
  every: Array<T>["every"];
  includes: Array<T>["includes"];
  indexOf: Array<T>["indexOf"];
}