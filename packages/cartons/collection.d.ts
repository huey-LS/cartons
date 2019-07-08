
import Model from './model';

export default class Collection extends Model {
  static isCollection (any: any): boolean;
  static Model: (typeof Model) | (() => Model);
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

  forEach: Array<Model>["forEach"];
  map: Array<Model>["map"];
  reduce: Array<Model>["reduce"];
  reduceRight: Array<Model>["reduceRight"];
  slice: Array<Model>["slice"];
  find: Array<Model>["find"];
  findIndex: Array<Model>["findIndex"];
  some: Array<Model>["some"];
  every: Array<Model>["every"];
  includes: Array<Model>["includes"];
  indexOf: Array<Model>["indexOf"];
}