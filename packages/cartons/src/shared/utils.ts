export function clone<T = any> (obj: T): T {
  let newModel = Object.assign({}, obj);
  (newModel as any).__proto__ = (obj as any).__proto__;
  return newModel;
}

export const mixinFunctionFromArray = (
  map: string[],
  transform: (target: any) => any
) => (target: any) => {
  if (Array.isArray(map) && 'function' === typeof transform) {
    map.forEach((key) => {
      if('function' === typeof (Array.prototype as any)[key]) {
        Object.defineProperty(target.prototype, key, {
          value: function (
            ...args: any[]
          ) {
            let currentTarget = transform(this);
            return currentTarget && currentTarget[key] && currentTarget[key](...args)
          },
          writable: true,
          enumerable: false,
          configurable: true
        });
      }
    })
  }
  return target;
}

interface ThunkAttributeDescriptor<OptionsType> {
  (
    options: OptionsType,
    target: any,
    key?: string,
    descriptor?: PropertyDescriptor
  ): void;
}

export function createThunkAttributeDescriptor<
  OptionsType
> (
  callback: ThunkAttributeDescriptor<OptionsType>
) {
  return function (
    options: OptionsType
  ) {
    return function (
      target: any,
      key: string,
      descriptor?: PropertyDescriptor
    ): any {
      return mixinDescriptor<OptionsType>(
        callback, options, target, key, descriptor
      );
    }
  }
}

function mixinThunkFunction<OptionsType> (
  callback: ThunkAttributeDescriptor<OptionsType>,
  options: OptionsType,
  target: Object
) {
  return callback.call(
    target,
    options,
    target
  );
}



function mixinDescriptor<OptionsType> (
  callback: ThunkAttributeDescriptor<OptionsType>,
  options: OptionsType,
  target: any,
  key: string,
  descriptor?: PropertyDescriptor
) {
  if (!descriptor) {
    descriptor = Object.create(null) as PropertyDescriptor;
  }


  const newValue = callback.call(
    target,
    options,
    target,
    key,
    descriptor
  )

  if (typeof newValue !== 'undefined') {
    descriptor.value = newValue;
  }

  return descriptor;
}
