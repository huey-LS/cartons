interface descriptor {
  (target: Object, key: string, descriptor?: PropertyDescriptor): void;
}

interface thunkAttributeDescriptor {
  (options?: any): descriptor
}

declare namespace descriptors {
  export const serialized: thunkAttributeDescriptor;
}

declare namespace keyCreators {
  export interface incrementCreator {
    (prefix: string): () => string
  }

  export interface randomCreator {
    (length?: number, radix?: number): () => string
  }
}

export {
  descriptors,
  keyCreators
}