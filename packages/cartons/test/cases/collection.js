import Model from '../../model';
import Collection from '../../collection';
import { descriptors } from '../../helpers';
import assert from 'assert';

const { serialized } = descriptors;

class TestModel extends Model {
  static initialAttributes = {
    count: 1
  }

  @serialized('count')
  count;

  @serialized('text')
  text;
}

class TestCollection extends Collection {
  static Model = TestModel;
}

describe('Collection', function () {
  it ('should addChild success', () => {
    let testCollection = new TestCollection();
    assert.strictEqual(0, testCollection.length);
    testCollection.addChild({ text: 'abc' });
    assert.strictEqual(1, testCollection.length);
    assert.strictEqual(true, testCollection.children[0] instanceof TestModel);
    let testModel = testCollection.children[0];
    assert.strictEqual(1, testModel.count);
    assert.strictEqual('abc', testModel.text);
  })

  it ('should removeChild success', () => {
    let testCollection = new TestCollection();
    assert.strictEqual(0, testCollection.length);
    testCollection.addChild({ text: 'abc' });
    assert.strictEqual(1, testCollection.length);
    let testModel = testCollection.children[0];
    testCollection.removeChild(testModel);
    assert.strictEqual(0, testCollection.length);
  })

  it ('should subscribe child update success', (done) => {
    const testCollection = new TestCollection();
    testCollection.addListener('collectionChildDidUpdate', (event) => {
      try {
        assert.strictEqual(testCollection, event.currentTarget);
        assert.strictEqual(testModel, event.target);
        done();
      } catch (e) {
        done(e);
      }
    })
    testCollection.addChild({ text: 'abc' });
    let testModel = testCollection.children[0];
    testModel.set('text', 'def');
  })
})
