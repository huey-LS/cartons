import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  addTodo
} from '../actions';

const ENTER_KEY = 13;

@connect(
  null,
  (dispatch) => ({
    addTodo: bindActionCreators(addTodo, dispatch)
  })
)
export default class TodoInput extends React.Component {
  state = {
    newTodo: ''
  }

  handleNewTodoKeyDown = (event) => {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    var val = this.state.newTodo.trim();

    if (val) {
      if (this.props.addTodo) this.props.addTodo(val);
      this.setState({newTodo: ''});
    }
  }

  handleChange = (event) => {
    this.setState({ newTodo: event.target.value });
  }

  render () {
    return (
      <div className="todo-input">
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          value={this.state.newTodo}
          onKeyDown={this.handleNewTodoKeyDown}
          onChange={this.handleChange}
          autoFocus={true}
        />
      </div>
    )
  }
}