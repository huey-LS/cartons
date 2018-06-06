import Attributes from './attributes';
import Event from './event';
import { eventEmitter } from '../utils/descriptors';

export default class Store extends Event {
  constructor (models) {
    super();

    this._models = models;

    Object.keys(models).forEach((key) => {
      models[key].on('update', () => {
        this.emit('update', models[key])
      })
    })
  }
}