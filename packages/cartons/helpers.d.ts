interface descriptor {
  (target: Object, key: string, descriptor?: PropertyDescriptor): void;
}

interface thunkAttributeDescriptor {
  (options?: any): descriptor
}

declare namespace descriptors {
  export const serialized: thunkAttributeDescriptor;
}

export {
  descriptors
}