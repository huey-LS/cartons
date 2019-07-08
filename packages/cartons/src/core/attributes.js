import {
  formatPath,
  getDataWithPath
} from '../shared/path';

/**
 * @export
 * @class Attributes
 * @description immutable attributes
 */
export default class Attributes {
  static isAttributes = function (obj) {
    return obj &&
      (
        obj instanceof Attributes
        || obj.__cartons_attributes
      )
  }

  __cartons_attributes = true;
  _attributes;

  constructor (data = {}) {
    this._attributes = data;
  }

  toJSON () {
    return this._attributes;
  }

  get (path) {
    return getDataWithPath(path, this._attributes)
  }

  set (path, data) {
    let parentArray = this._getPathParent(path);
    if (parentArray) {
      let [ newProperties, parent, key ] = parentArray;
      parent[key] = data;
      return new Attributes(newProperties);
    } else {
      console.log(`${path} error`);
      return this;
    }
  }

  merge (newData) {
    let newProperties = Object.assign({}, this._attributes, newData);
    return new Attributes(newProperties);
  }

  remove (path) {
    let parentArray = this._getPathParent(path);
    if (parentArray) {
      let [ newProperties, parent, key ] = parentArray;
      if (Array.isArray(parent)) {
        parent.splice(key, 1)
      } else {
        delete parent[key];
      }
      return new Attributes(newProperties);
    } else {
      console.log(`${path} error`);
      return this;
    }
  }

  _getPathParent (path) {
    let pathArray = formatPath(path);
    let newProperties;
    if (Array.isArray(this._attributes)) {
      newProperties = [ ...this._attributes ];
    } else {
      newProperties = { ...this._attributes };
    }
    let next = newProperties;

    for (let i = 0, len = pathArray.length; i < len; i++) {
      const path = pathArray[i];
      let { key, type } = path;
      let arrayIndex = i;
      if (type === 'array') {
        // next to next
        if ('undefined' === typeof next[key]) {
          next[key] = [];
        } else {
          next[key] = [ ...next[key] ];
        }
        next = next[key];
        key = path.index;
      }

      if (arrayIndex === pathArray.length - 1) {
        // is last one
        // next[key] = data;
        return [
          newProperties,
          next,
          key
        ];
      } else {
        let oldValue = next[key];
        if (Array.isArray(oldValue)) {
          next[key] = [ ...oldValue ];
        } else if ('object' === typeof oldValue ) {
          next[key] = { ...oldValue }
        } else if ('undefined' === typeof next[key]) {
          next[key] = {};
        } else {
          next[key] = oldValue;
        }
        next = next[key];
      }
    }
  }
}
