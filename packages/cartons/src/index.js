export * from './core/descriptors';
export { default as Model } from './core/model';
export { default as Collection } from './core/collection';
import * as descriptors from './core/descriptors';
export { descriptors };

export default {
  Model,
  Collection,
  descriptors,
  connect: descriptors.connect
}