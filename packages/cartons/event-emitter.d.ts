interface RemoveListener {
  (name: string, callback: () => void): void;
  (callback: () => void): void;
}

interface AddListener {
  (name: string, callback: (event: any) => void): void;
  (callback: (event: any) => void): void;
}

export default class EventEmitter {
  static isEvent (): boolean;
  readonly __cartons_event: boolean;
  private _events: Object;
  emit (name: string, data?: any): void;
  on: AddListener;
  addListener: AddListener;
  off: RemoveListener;
  removeListener: RemoveListener;

  destroy (): void;
}