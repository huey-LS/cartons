# Cartons React

[![npm version](https://img.shields.io/npm/v/cartons-react.svg?maxAge=3600)](https://www.npmjs.org/package/cartons-react)


# Installation
```
npm install --save cartons-react
```

# Documentation
- [API](#api)
  - [observer](#observer)
  - [observe](#observe)
  - [action](#action)
- [Create todo application](https://github.com/ignous/cartons/tree/master/packages/todo-react-cartons)


## API
### observer
```
  import Model from 'cartons/model';
  import { observer } from 'cartons-react';

  class Item extend Model {
    ...
  }

  @observer()
  class CustomComponent extends React.Component {
    render () {
      const item = this.props.item;
      return (
        <div>{item.title}</div>
      )
    }
  }

  (
    <CustomComponent item={new Item()} />
  )
```

### observe
```
  import Model from 'cartons/model';
  import { observe } from 'cartons-react';

  class Item extend Model {
    ...
  }

  class CustomComponent extends React.Component {
    @observe
    item = new Item();

    render () {
      const item = this.item;
      return (
        <div>{item.title}</div>
      )
    }
  }
```

### action
- `action.bound`
  ```
    import { action } from 'cartons-react';

    var someAction = (model) => {
      // model.set(...)
    }

    class Custom extends React.Component {
      @action.bound((_this) => (_this.props.model))
      someAction = someAction
    }
  ```

<a id="demo"></a>

## Create todo application
[example](https://github.com/ignous/cartons/tree/master/packages/todo-react-cartons)
