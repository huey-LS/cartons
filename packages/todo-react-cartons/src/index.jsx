import ReactDOM, { render } from 'react-dom';
import * as React from 'react';

import './css/base.css';
import './css/app.css';

import TodoCollection from './models/todo-collection';

import Todos from './components/todos';
import TodoInput from './components/todo-input';
import Footer from './components/footer';


class App extends React.Component {
  todos = new TodoCollection();

  render () {
    const todos = this.todos;
    return (
      <div
        className="todoapp"
      >
        <TodoInput
          todos={todos}
        />
        <Todos
          todos={todos}
        />
        <Footer
          todos={todos}
        />
      </div>
    )
  }
}

render((<App />), document.getElementById('application'));
