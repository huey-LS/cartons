import assert from 'assert';

import {
  Model,
  serialize,
  output
} from '../../src/index';

class InitialAttributesModel extends Model {
  static initialAttributes = () => ({
    count: 1
  })

  @serialize('count')
  count!: number;


  @serialize({
    name: 'testDefault',
    default: 'default value'
  })
  testDefault!: string;

  @serialize({
    name: 'count'
  })
  differentKey!: string;

  @output({})
  getFormated () {
    return [
      'testDefault',
      'count'
    ]
  }

  @output({})
  getDifferentFormated () {
    return [
      'testDefault',
      'differentKey'
    ]
  }

}

describe('serialized', function () {
  var model = new InitialAttributesModel();

  it ('should get serialized attribute success', () => {
    assert.strictEqual(1, model.count);
  })

  it ('should get default serialized attribute success', () => {
    assert.strictEqual('default value', model.testDefault);
  })

  it ('should get serialize output success', () => {
    assert.deepStrictEqual(
      { count: 1, testDefault: 'default value' },
      model.getFormated()
    );
  })

  it ('should get serialize output with different key success', () => {
    assert.deepStrictEqual(
      { count: 1, testDefault: 'default value' },
      model.getDifferentFormated()
    );
  })
})

