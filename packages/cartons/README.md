# cartons
[![npm version](https://img.shields.io/npm/v/cartons.svg?maxAge=3600)](https://www.npmjs.org/package/cartons)

# Installation
```
npm install --save cartons
```

# Documentation
- [API](#api)
  - [Model](#model)
  - ~[Container](#container)~ ->  使用 `connectModel` 代替
  - [Collection](#collection)
  - [key-creators](#key-creators)
    - [randomCreator](#randomCreator)
    - [incrementCreator](#incrementCreator)
  - [actions](#actions)
- [Usage with react](https://github.com/ignous/cartons/tree/master/packages/cartons-react/README.md)

## API
### Model
构建一个自己的model

#### Usage
```js
import Model from 'cartons/model';
class CustomModel extends Model {
  static key; // key生成函数 默认使用 key-creators.incrementCreator
  static initialAttributes = { test: 1 }; // 每次实例初始化的属性

  // attributes set 前的 hook
  modelWillUpdate () {}

  // attributes set 后的 hook
  modelDidUpdate () {}
}
```

##### Static Attributes
- [initialAttributes] {Object|Function} - 建议`Function`
  设置为`Function`时，将会把返回值作为初始化的属性
- key - key生成函数 默认使用

#### Hooks
- modelWillUpdate {Function(prevAttributes, nextAttributes)} - 调用了`set`, 但还没有执行`set` 操作时，此时 `this.get(attributeName) === prevAttributes.get(attributeName)`
- modelDidUpdate {Function(prevAttributes, nextAttributes)} - 调用了`set`, `set`执行成功, 此时 `this.get(attributeName) === nextAttributes.get(attributeName)`

##### Arguments
- `[attributes]` 初始化属性 会和 `static initialAttributes`合并

##### Method
实例化后可以通过 `get`,`set`对属性进行读写
```js
var m = new CustomModel();
m.get('test') // 1
m.set({ test: 2 })
m.get('test') // 2

var m = new CustomModel({ test: 3 });
m.get('test') // 3
```

##### Events
- `update` - 通过`set`更新`attributes`后会触发

##### ConnectModel
`model`高级用法，关联2个不同的 `model`

###### usage
```js
import Model, { connectModel } from 'cartons/model';
import ModelA from './model-a';

class ModelB extends Model {
  @connectModel({
    modelDidUpdate: function () {
      // this === b
      // this.a === a
      // 需要的各种操作，比如更新属性等
    }
  })
  a = new ModelA();
}

let b = new ModelB();
```
这样`a`被修改的时候，会关联触发`b`的`update`事件

### Container
即将移除，请用 `connectModal` 代替

对单个`Model`的一层包装, 同时会自动监听子`Model`的`update`事件
```js
import Container from 'cartons/container';
class CustomContainer extends Container {
  static Model = CustomModel;
  static key;
  static initialAttributes = { test: 1 };
}

var container = new CustomContainer([initialAttributes], [contentInitialAttributes]);

console.log(container.content instanceof CustomModel) // true
```

##### Static Attributes
- key - 和`model`相同
- [initialAttributes] - 和`model`相同
- [Model] - 用于自动生成`content`的构造函数

#### Hooks
和`model`相同

##### Arguments
- `[initialAttributes]` 同`Model`的`initialAttributes`
- `[contentInitialAttributes]` content的初始化属性

##### Method
`Container` 同时拥有 `attributes` 和 `content(Model)` 且互不干扰。
- 可以通过 `get`, `set` 对`attributes`进行读写
- 通过 `content`, `updateContent` 对`content(Model)`进行读写
```js
container.get('test') // 1
container.set({ test: 2 })
container.get('test') // 2
container.content.get('test') // 1
container.updateContent({ test: 2 })
container.content.get('test') // 2
```

##### Events
- `update` - 触发时机：
  1. 通过`set`更新`attributes`后会触发
  2. `this.content`触发`update`事件后，也会自动响应并触发

### Collection
对`Model`集合的一层包装, 同时会自动监听所有子`Model`的`update`事件
```js
import Collection from 'cartons/collection';
class CustomCollection extends Collection {
  static Model = CustomModel;
  static key;
  static initialAttributes = { test: 1 };

  // hook: before add new child
  collectionWillAddChild () {}
  // hook: after add new child
  collectionDidAddChild () {}

  // hook: before create model
  collectionWillCreateChild () {}

  // hook: before remove child
  collectionWillRemoveChild () {}
  // hook: after remove child
  collectionDidRemoveChild () {}
}

// new CustomCollection([initialAttributes], [initialAttributes[]]);
var collection = new CustomCollection(
  { attr2: 2 },
  [{ attr3: 3 }]
)
```
##### Static Attributes
- key - 和`model`相同
- [initialAttributes] - 和`model`相同
- [Model] - 用于自动生成子元素的构造函数

#### Hooks
- `model`的所有hooks
- collectionWillCreateChild {Function(data)} - 创建子`model`之前触发，`data`是创建用的参数
- collectionWillAddChild {Function(newChild: Model)} - 添加子元素之前触发
- collectionDidAddChild {Function(newChild: Model)} - 添加子元素成功后触发
- collectionWillRemoveChild {Function(removeChild: Model)} - 移除子元素之前触发
- collectionDidRemoveChild {Function(removeChild: Model)} - 移除子元素成功后触发

##### Arguments
- `[initialAttributes]` 同`Model`的`initialAttributes`
- `[initialAttributes[]]` 集合的初始化数据

##### Method
- 可以使用`Array`的各种方法 已支持`forEach`, `map`, `reduce`, `reduceRight`, `slice`, `filter`, `find`, `findIndex`, `some`, `every`, `includes`, `indexOf`
  ```
    collection.forEach((item) => {
      console.log(item.get('attr3'))
    })
    // 3
    // 3
  ```
- `add` - 添加一个子元素到最后，并添加监听
  - @params item {Object} - 子元素属性内容
- `remove` - 移除一个子元素，并取消监听
  - @params item {Model} - 子元素实例
- `clean` - 移除所有子元素，并取消监听
- `reset` - 重设所有子元素，并添加监听
  - @params items {Array<Object>}
- `updateItem` - 更新一个节点(后期可以用`find`代替？)
  - @params item - 被更新节点，没有`filter`将用`key`做匹配
  - @params filter {Function()} - 参数同`findIndex`

##### Events
- `update` - 触发时机：
  1. 通过`set`更新`attributes`后会触发
  2. `add`,`remove`,`reset`等操作修改子元素个数的时候
  2. 每一个子元素触发`update`事件后，也会自动响应并触发


## 其他可用的功能
### key-creators
现在提供以下几种key生成规则

<a id="randomCreator"></a>

#### `randomCreator([length = 32], [radix = 16])` 生成一个随机数作为key

##### Arguments
- `[length = 32]` 以`2^length`的方式生成一个随机数
- `[radix = 16]`  输出的结果的数字基数，默认转换为16进制

<a id="incrementCreator"></a>

#### `incrementCreator(prefix = '')` 以递增方式返回key


### actions

#### `bindAction(filter: Function|Object)))`
##### usage
```js
class A {
  @bindAction((_self) => (_self.model)) action1 = action1;
  model = new CustomModel();
}

var a = new A();
a.action1(1);

function action1 (param) {
  // param === 1
  return function (model) {
    // model === a.model
  }
}
```

#### `bindActions(actions: Object.<Function>, options: { actionsAttributeName: string = 'action' })))`
##### usage
```js
class A {
  @bindActions({ action1, action2, ... })
  model = new CustomModel();
}

var a = new A();
a.model.actions.action1(1);
```

#### `createActions()`
##### usage
```js
class A extend Model {
  @createActions()
  actions = { action1, action2, ...}
}
```
