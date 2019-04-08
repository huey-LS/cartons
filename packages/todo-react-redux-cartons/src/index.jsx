import ReactDOM, { render } from 'react-dom';
import * as React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
// import { combineCartons, bindReducers } from 'cartons-redux';


import './css/base.css';
import './css/app.css';
import * as reducers from './reducers';
// import TodoCollection from './models/todo-collection';
import Todos from './components/todos';
import TodoInput from './components/todo-input';
import Footer from './components/footer';

const store = createStore(
  // combineCartons({
  //   todoCollection: bindReducers(
  //     reducers.initialState,
  //     reducers.reducer
  //   )
  // }),
  combineReducers(reducers),
  window.devToolsExtension && window.devToolsExtension()
)


class App extends React.Component {
  render () {
    return (
      <Provider
        store={store}
      >
        <div
          className="todoapp"
        >
          <TodoInput />
          <Todos />
          <Footer />
        </div>
      </Provider>
    )
  }
}

render((<App />), document.getElementById('application'));
