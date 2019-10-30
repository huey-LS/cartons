import {
  getPathData,
  getNewParentPathData
} from '../shared/data-path';

/**
 * @export
 * @class Attributes
 * @description immutable attributes
 */
export default class Attributes {
  static isAttributes = function (obj: any) {
    return obj &&
      (
        obj instanceof Attributes
        || obj.__cartons_attributes
      )
  }

  readonly __cartons_attributes = true;
  _attributes: Object;

  constructor (data = {}) {
    this._attributes = data;
  }

  toJSON () {
    return { ...this._attributes };
  }

  get (path: string) {
    return getPathData(this._attributes, path)
  }

  set (path: string, data: any) {
    let [ newProperties, parent, key ] = getNewParentPathData(this._attributes, path);

    if (parent) {
      parent[key] = data;
      return new Attributes(newProperties);
    } else {
      return this;
    }
  }

  merge (newData: any) {
    let newProperties = Object.assign({}, this._attributes, newData);
    return new Attributes(newProperties);
  }

  remove (path: string) {
    let parentArray = getNewParentPathData(this._attributes, path);
    if (parentArray) {
      let [ newProperties, parent, key ] = parentArray;
      if (Array.isArray(parent)) {
        parent.splice(key, 1);
      } else {
        delete parent[key];
      }
      return new Attributes(newProperties);
    } else {
      return this;
    }
  }
}
