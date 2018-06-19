# cartons
[![npm version](https://img.shields.io/npm/v/cartons.svg?maxAge=3600)](https://www.npmjs.org/package/cartons)

# Installation
```
npm install --save cartons
```

# Documentation
- [API](#api)
  - [Model](#model)
  - [Container](#container)
  - [Collection](#collection)
  - [key-creators](#key-creators)
    - [randomCreator](#randomCreator)
    - [incrementCreator](#incrementCreator)
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
}
```

##### Arguments
- `[initialAttributes]` 初始化属性 会和 `static initialAttributes`合并

##### Method
实例化后可以通过 `get`,`set`对属性进行读写
```
var m = new CustomModel([initialAttributes]);
m.get('test') // 1
m.set({ test: 2 })
m.get('test') // 2
```

### Container
对单个`Model`的一层包装
```
import Container from 'cartons/container';
class CustomContainer extends Container {
  static Model = CustomModel;
  static key;
  static initialAttributes = { test: 1 };
}

var container = new CustomContainer([initialAttributes], [contentInitialAttributes]);

console.log(container.content instanceof CustomModel) // true
```
##### Arguments
- `[initialAttributes]` 同`Model`的`initialAttributes`
- `[contentInitialAttributes]` content的初始化属性

##### Method
`Container` 同时拥有 `attributes` 和 `content(Model)` 且互不干扰。
- 可以通过 `get`, `set` 对`attributes`进行读写
- 通过 `content`, `updateContent` 对`content(Model)`进行读写
```
container.get('test') // 1
container.set({ test: 2 })
container.get('test') // 2
container.content.get('test') // 1
container.updateContent({ test: 2 })
container.content.get('test') // 2
```

### Collection
对`Model`集合的一层包装
```
import Collection from 'cartons/collection';
class CustomCollection extends Collection {
  static Model = CustomModel;
  static key;
  static initialAttributes = { test: 1 };
}

// new CustomCollection([initialAttributes], [initialAttributes[]]);
var collection = new CustomCollection(
  { attr2: 2 },
  [{ attr3: 3 }]
)
```
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

### key-creators
现在提供以下几种key生成规则

<a id="randomCreator"></a>

#### `randomCreator([length = 32], [radix = 16])` 生成一个随机数作为key

##### Arguments
- `[length = 32]` 以`2^length`的方式生成一个随机数
- `[radix = 16]`  输出的结果的数字基数，默认转换为16进制

<a id="incrementCreator"></a>

#### `incrementCreator(prefix = '')` 以递增方式返回key


