
import Model from './model';
import Collection from './collection';

export {
  Model,
  Collection
}

export declare class Event {
  static isEvent (): boolean;
  private readonly __cartons_event: boolean;
  private _events: Object;
  emit (name: string, data: any): void;
  on (name: string, callback: () => void): () => void;
  off (name: string, callback: () => void): void;
}