import Model from '../../model';
import { descriptors } from '../../helpers';
import assert from 'assert';

const { serialized } = descriptors;

class TestModel extends Model {
  static initialAttributes = {
    count: 1
  }

  @serialized('count')
  count;
}


describe('Model', function () {
  var model = new TestModel();
  it ('should get initialAttributes success', () => {
    assert.strictEqual(1, model.get('count'));
  })

  it ('should get serialized attribute success', () => {
    assert.strictEqual(1, model.count);
  })

  it ('should set attribute success', () => {
    model.set('count', 2);
    assert.strictEqual(2, model.count);
  })

  it ('should life-cycle call success', (done) => {
    class LifeCycleModel extends Model {
      static initialAttributes = {
        count: 1
      }

      modelWillUpdate (prevAttribute, nextAttribute) {
        try {
          assert.strictEqual(prevAttribute, this._attributes);
          assert.strictEqual(1, prevAttribute.get('count'));
          assert.strictEqual(2, nextAttribute.get('count'));
        } catch (e) {
          done(e);
        }
      }

      modelDidUpdate (prevAttribute, nextAttribute) {
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
    const testModel = new TestModel();
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
    const testModel = new TestModel();
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

  it ('should model clone success', () => {
    let model = new TestModel();
    let cloneModel = model.clone();
    assert.notStrictEqual(model, cloneModel);
    assert.strictEqual(model.count, cloneModel.count);
    cloneModel.set('count', 2);
    assert.notStrictEqual(model.count, cloneModel.count);
  })
})
