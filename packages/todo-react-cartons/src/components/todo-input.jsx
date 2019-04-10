import * as React from 'react';

const ENTER_KEY = 13;

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
      this.props.todos.actions.addTodo(val);
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