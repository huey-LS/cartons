import * as React from 'react';

import { observer, action } from 'react-balloon';

import {
  removeTodo,
  editTodo,
  modifyTodoCompleted,
  toggleAllCompleted
} from '../actions';
import TodoItem from './todo-item';

const ENTER_KEY = 13;
const bindAction = action.bound((_this) => (_this.props.todos))

@observer()
export default class Todos extends React.Component {
  @bindAction removeTodo = removeTodo;
  // @bindAction editTodo = actions.editTodo;
  // @bindAction modifyTodoCompleted = actions.modifyTodoCompleted;
  @bindAction toggleAllCompleted = toggleAllCompleted;

  render () {
    const todos = this.props.todos;

    return (
      <section className="main">
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          onChange={this.toggleAll}
          checked={todos.isAllCompleted()}
        />
        <label
          htmlFor="toggle-all"
        />
        <div
          className="todo-list"
        >
          {this.renderTodos()}
        </div>
      </section>
    )
  }

  renderTodos () {
    const {
      removeTodo
    } = this;
    const todos = this.props.todos;

    return todos.getFilterItems().map((todo, index) => (
      <TodoItem
        key={todo.key}
        todo={todo}
        remove={removeTodo}
        // edit={editTodo}
        // modifyCompleted={modifyTodoCompleted}
      />
    ))
  }

  toggleAll = () => {
    this.toggleAllCompleted();
  }
}