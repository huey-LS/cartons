import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  removeTodo,
  editTodo,
  modifyTodoCompleted,
  toggleAllCompleted
} from '../actions';
import TodoItem from './todo-item';

const ENTER_KEY = 13;

@connect(
  ({ todoCollection }) => ({
    todoCollection
  }),
  (dispatch) => ({
    removeTodo: bindActionCreators(removeTodo, dispatch),
    editTodo: bindActionCreators(editTodo, dispatch),
    modifyTodoCompleted: bindActionCreators(modifyTodoCompleted, dispatch),
    toggleAllCompleted: bindActionCreators(toggleAllCompleted, dispatch)
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