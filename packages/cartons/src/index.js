export * from './core/descriptors';
export { default as Model } from './core/model';
export { default as Collection } from './core/collection';
import * as descriptors from './core/descriptors';
export { descriptors };
import * as keyCreators from './utils/key-creators';
export { keyCreators };

export default {
  Model,
  Collection,
  descriptors,
  keyCreators,
  connect: descriptors.connect
}