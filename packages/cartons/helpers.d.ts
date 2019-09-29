interface descriptor {
  (target: Object, key: string, descriptor?: PropertyDescriptor): void;
}


declare namespace CartonsDescriptorsHelpers {
  export interface serialized {
    (options?: any): descriptor
  }
}

export const descriptors: {
  serialized: CartonsDescriptorsHelpers.serialized
}


declare namespace CartonsKeyCreatorsHelpers {
  export interface incrementCreator {
    (prefix: string): () => string
  }

  export interface randomCreator {
    (length?: number, radix?: number): () => string
  }
}

export const keyCreators: {
  incrementCreator: CartonsKeyCreatorsHelpers.incrementCreator,
  randomCreator: CartonsKeyCreatorsHelpers.randomCreator
};
