import {
  Model
} from '../../src/index';

import assert from 'assert';

class InitialAttributesModel extends Model {
  static initialAttributes = () => ({
    count: 1
  })
}

class InitialAttributesByFunctionModel extends Model {
  static initialAttributes = () => ({count: 1});
}


class AutoKeyModel extends Model {
  static key = 'id';
}

describe('Model', function () {
  var model = new InitialAttributesModel();
  it ('should get initialAttributes success', () => {
    assert.strictEqual(1, model.get('count'));
  })

  it ('should get initialAttributes by function success', () => {
    let fnModel = new InitialAttributesByFunctionModel();
    assert.strictEqual(1, fnModel.get('count'));
  })


  it ('should set attribute success', () => {
    model.set('count', 2);
    assert.strictEqual(2, model.get('count'));
  })

  it ('should set attribute obj success', () => {
    model.set({ count: 3 });
    assert.strictEqual(3, model.get('count'));
  })

  it ('should remove attribute success', () => {
    model.remove('count');
    assert.strictEqual(undefined, model.get('count'));
  })

  it ('should set attribute with obj path success', () => {
    model.set('a.b', 1);
    assert.strictEqual(1, model.get('a.b'));
    assert.strictEqual(1, model.get('a').b);
  })

  it ('should set one array attribute success', () => {
    model.set('testArray[0]', 0);
    model.set('testArray.1', 1);
    assert.strictEqual(true, Array.isArray(model.get('testArray')));
    assert.strictEqual(0, model.get('testArray[0]'));
    assert.strictEqual(1, model.get('testArray.1'));
    assert.strictEqual('[0,1]', JSON.stringify(model.get('testArray')));
  })

  it ('should auto get key from attribute success', () => {
    const testKeyModel = new AutoKeyModel();
    testKeyModel.set('id', 1);
    assert.strictEqual(1, testKeyModel.get('id'));
    assert.strictEqual(1, testKeyModel.key);
  })


  it ('should life-cycle call success', (done) => {
    class LifeCycleModel extends Model {
      static initialAttributes = () => ({
        count: 1
      })

      modelWillUpdate (prevAttribute: any, nextAttribute: any) {
        try {
          assert.strictEqual(prevAttribute, this._attributes);
          assert.strictEqual(1, prevAttribute.get('count'));
          assert.strictEqual(2, nextAttribute.get('count'));
        } catch (e) {
          done(e);
        }
      }

      modelDidUpdate (prevAttribute: any, nextAttribute: any) {
        try {
          assert.strictEqual(nextAttribute, this._attributes);
          assert.strictEqual(1, prevAttribute.get('count'));
          assert.strictEqual(2, nextAttribute.get('count'));
          done();
        } catch (e) {
          done(e);
        }
      }
    }

    const lifeCycleModel = new LifeCycleModel();
    lifeCycleModel.set('count', 2);
  })

  it ('should event: modelWillUpdate listener success', (done) => {
    const testModel = new InitialAttributesModel();
    testModel.addListener('modelWillUpdate', (event) => {
      try {
        const [ prevAttribute, nextAttribute ] = event.data;
        assert.strictEqual('modelWillUpdate', event.type);
        assert.strictEqual(testModel, event.target);
        assert.strictEqual(prevAttribute, testModel._attributes);
        assert.strictEqual(1, prevAttribute.get('count'));
        assert.strictEqual(2, nextAttribute.get('count'));
        done();
      } catch (e) {
        done(e)
      }
    })
    testModel.set('count', 2);
  })

  it ('should event: modelDidUpdate listener success', (done) => {
    const testModel = new InitialAttributesModel();
    testModel.addListener('modelDidUpdate', (event) => {
      try {
        const [ prevAttribute, nextAttribute ] = event.data;
        assert.strictEqual('modelDidUpdate', event.type);
        assert.strictEqual(testModel, event.target);
        assert.strictEqual(nextAttribute, testModel._attributes);
        assert.strictEqual(1, prevAttribute.get('count'));
        assert.strictEqual(2, nextAttribute.get('count'));
        done();
      } catch (e) {
        done(e)
      }
    })
    testModel.set('count', 2);
  })

  // it ('should model clone success', () => {
  //   let model = new InitialAttributesModel();
  //   let cloneModel = model.clone();
  //   assert.notStrictEqual(model, cloneModel);
  //   assert.strictEqual(model.count, cloneModel.count);
  //   cloneModel.set('count', 2);
  //   assert.notStrictEqual(model.count, cloneModel.count);
  // })
})
