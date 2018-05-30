import * as React from 'react';

import todoCollection, { actions } from '../store/todo-collection';
import { connect } from 'react-balloon';

import {
  removeTodo,
  editTodo,
  modifyTodoCompleted,
  toggleAllCompleted
} from '../actions';
import TodoItem from './todo-item';

const ENTER_KEY = 13;

@connect(
  ({
    todoCollection
  }),
  ({
    removeTodo: actions.removeTodo,
    editTodo: actions.editTodo,
    modifyTodoCompleted: actions.modifyTodoCompleted,
    toggleAllCompleted: actions.toggleAllCompleted
  })
)
export default class Todos extends React.Component {
  render () {
    const {
      todoCollection
    } = this.props;

    return (
      <section className="main">
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          onChange={this.toggleAll}
          checked={todoCollection.isAllCompleted()}
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
      todoCollection,
      removeTodo,
      editTodo,
      modifyTodoCompleted
    } = this.props;
    return todoCollection.getFilterItems().map((todo, index) => (
      <TodoItem
        key={index}
        todo={todo}
        remove={removeTodo}
        edit={editTodo}
        modifyCompleted={modifyTodoCompleted}
      />
    ))
  }

  toggleAll = () => {
    this.props.toggleAllCompleted();
  }
}