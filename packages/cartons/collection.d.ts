
import Model from './model';

export default class Collection extends Model {
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