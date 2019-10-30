import {
  MODEL_DID_UPDATE,
  MODEL_WILL_UPDATE
} from '../../constants/life-cycle';

import {
  createThunkAttributeDescriptor
} from '../../shared/utils';
import Model from '../model';
import Attributes from '../attributes';

interface ConnectThunkDecorator {
  <M extends Model = Model, ConnectM extends Model = Model>(
    options: ConnectOptions<M, ConnectM>
  ): (target: any, key: string, descriptor?: PropertyDescriptor | undefined) => any
}

let connect =  createThunkAttributeDescriptor<ConnectOptions>(function (
  options = {},
  target,
  key,
  descriptor
) {
  if (descriptor && Model.isModel(target)) {
    let dataKey = Symbol();


    let oldDescriptorSet = descriptor.set;
    let oldDescriptorValue = descriptor.value;
    Object.defineProperty(
      target,
      dataKey,
      {
        configurable: true,
        enumerable: false,
        writable: true,
        value: {}
      }
    )
    if (oldDescriptorValue) {
      connectModel(
        oldDescriptorValue,
        target,
        dataKey,
        options
      );
    }

    descriptor.get = function () {
      return (this as any)[dataKey].value;
    }

    descriptor.set = function (newValue) {
      let nextValue = newValue;

      if (oldDescriptorSet) {
        nextValue = oldDescriptorSet.call(this, newValue);
      }
      if (Model.isModel(this)) {
        let _self = this as any;
        let prevValue = _self[dataKey].value;
        if (prevValue !== nextValue) {
          connectModel(
            nextValue,
            this,
            dataKey,
            options
          );
        }

        if (!_self[dataKey].boundWillDestroy) {
          this.addListener('willDestroy', () => {
            if (_self[dataKey].removeListener) {
              _self[dataKey].removeListener();
            }
            _self[dataKey] = {};
          })

          _self[dataKey].boundWillDestroy = true;
        }
      }
    }
  }
}) as ConnectThunkDecorator;

export default connect;

function connectModel<M extends Model = Model, ConnectM extends Model = Model> (
  connectedModel: any,
  target: any,
  dataKey: symbol,
  options: ConnectOptions<M, ConnectM>
) {
  if (target[dataKey].removeListener) {
    target[dataKey].removeListener();
  }
  if (Model.isModel(connectedModel)) {
    let removeWillUpdateListener = connectedModel.addListener(MODEL_WILL_UPDATE, ({ data }) => {
      if (typeof options.modelWillUpdate === 'function') {
        options.modelWillUpdate.call(target, target, connectedModel as ConnectM, ...data);
      }
    })

    let removeDidUpdateListener = connectedModel.addListener(MODEL_DID_UPDATE, ({ data }) => {
      if (typeof options.modelDidUpdate === 'function') {
        options.modelDidUpdate.call(target, target, connectedModel as ConnectM, ...data);
      }
    })

    target[dataKey] = {
      value: connectedModel,
      removeListener: () => {
        removeWillUpdateListener();
        removeDidUpdateListener();
      }
    }
  } else {
    target[dataKey] = {}
  }
}

interface ConnectOptions<M extends Model = Model, ConnectM extends Model = Model> {
  modelWillUpdate?: (
    target: M,
    connectedModel: ConnectM,
    prevAttribute: Attributes,
    nextAttribute: Attributes
  ) => void,
  modelDidUpdate?: (
    target: M,
    connectedModel: ConnectM,
    prevAttribute: Attributes,
    nextAttribute: Attributes
  ) => void
}
