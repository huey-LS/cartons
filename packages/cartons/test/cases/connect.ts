import assert from 'assert';

import {
  Model,
  connect
} from '../../src/index';


class ConnectedModel extends Model {
  static initialAttributes = () => ({
    count: 1
  })
}

class InitialModel extends Model {
  @connect<InitialModel, ConnectedModel>({
    modelDidUpdate: function (self, connectedModel) {
      self.set('connectedCount', connectedModel.get('count'));
    }
  })
  _connectedModel = new ConnectedModel();
}


describe('connect model', function () {
  var model = new InitialModel();

  it ('should get connectedModel success', () => {
    assert.strictEqual(
      model._connectedModel instanceof ConnectedModel,
      true
    )
  })

  it ('should auto update after connectedModel update success', () => {
    model._connectedModel.set('count', 2);
    assert.strictEqual(
      model.get('connectedCount'),
      2
    )
  })
})
