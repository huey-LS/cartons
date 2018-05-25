import ReactDOM, { render } from 'react-dom';
import * as React from 'react';

import './css/base.css';
import './css/app.css';

import Todos from './components/todos';
import TodoInput from './components/todo-input';
import Footer from './components/footer';


class App extends React.Component {
  render () {
    return (
      <div
        className="todoapp"
      >
        <TodoInput />
        <Todos />
        <Footer />
      </div>
    )
  }
}

render((<App />), document.getElementById('application'));
