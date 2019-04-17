# Cartons React

[![npm version](https://img.shields.io/npm/v/cartons-vue.svg?maxAge=3600)](https://www.npmjs.org/package/cartons-vue)


# Installation
```
npm install --save cartons-vue
```

# Documentation
- [API](#api)
  - [observer](#observer)
  - [observe](#observe)
- [Create todo application](https://github.com/ignous/cartons/tree/master/packages/todo-vue-cartons)


## API
### observe
```js
  import Model from 'cartons/model';
  import { observe } from 'cartons-vue';

  class Item extend Model {
    ...
  }

  new Vue({
    template: `
        <div>{{item.title}}</div>
    `,
    data: function () {
      return observe({
        item: new Item()
      })
    }
  })
```

<a id="demo"></a>

## Create todo application
[example](https://github.com/ignous/cartons/tree/master/packages/todo-vue-cartons)
