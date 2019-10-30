import {
  createThunkAttributeDescriptor
} from '../../shared/utils';

import Model from '../model';


const serialize = createThunkAttributeDescriptor<string|{
  name: string,
  type?: Function,
  default?: any,
  writable?: boolean,
  writableType?: Function
}>(function (
  options,
  target,
  key,
  descriptor
) {
  let name: string;
  let type: Function|undefined;
  let writableType: Function|undefined;
  let defaultValue: any;
  let writable: boolean = false;

  let serializeMaps = target['__serialize_maps'];
  if (!serializeMaps) {
    serializeMaps = target['__serialize_maps'] = {};
  }

  if (typeof options === 'string') {
    name = options;
  } else {
    name = options.name;
    type = options.type;
    defaultValue = options.default;
    writable = !!options.writable;
    writableType = options.writableType;
  }

  if (key && descriptor) {
    descriptor.enumerable = true;
    descriptor.get = function () {
      if (Model.isModel(this)) {
        let value = (this as any).get(name);
        if (type) {
          value = type(value);
        } else if (typeof value === 'undefined'){
          value = defaultValue;
        }
        return value;
      }
    }

    if (writable) {
      descriptor.set = function (newValue) {
        if (Model.isModel(this)) {
          if (writableType) {
            newValue = writableType(newValue);
          }
          (this as any).set(name, newValue);
        }
      }
    }

    delete descriptor.writable;

    serializeMaps[key] = name;
  }
});

export default serialize;



const output = createThunkAttributeDescriptor(function (
  options,
  target,
  key,
  descriptor
) {

  if (descriptor) {
    let oldValue = descriptor.value;
    descriptor.value = function () {
      let serializeMaps = target['__serialize_maps'];
      let needSerializeKeys = oldValue();
      return needSerializeKeys.reduce((data: any, key: string) => {
        if (serializeMaps[key]) {
          data[
            serializeMaps[key]
          ] = (this as any)[key];
        }
        return data;
      }, {})
    }
  }
});

export { output };
