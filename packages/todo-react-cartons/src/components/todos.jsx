import * as React from 'react';

import { observer } from 'cartons-react';

import TodoItem from './todo-item';

@observer()
export default class Todos extends React.Component {
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
    const todos = this.props.todos;

    return todos.getFilterItems().map((todo, index) => (
      <TodoItem
        key={todo.key}
        todo={todo}
        remove={todos.actions.removeTodo}
        // edit={editTodo}
        // modifyCompleted={modifyTodoCompleted}
      />
    ))
  }

  toggleAll = () => {
    this.props.todos.actions.toggleAllCompleted();
  }
}