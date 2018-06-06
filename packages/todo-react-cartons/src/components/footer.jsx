import * as React from 'react';

import { observer, action } from 'cartons-react';

import {
  clearAllCompleted,
  goFilterTodos
} from '../actions';

const actionBindTodos = action.bound((_this) => _this.props.todos);

@observer()
export default class Footer extends React.Component {
  @actionBindTodos
  clearAllCompleted = clearAllCompleted;

  @actionBindTodos
  goFilterTodos = goFilterTodos;

  render () {
    const { goFilterTodos, clearAllCompleted } = this;
    const { todos } = this.props;
    const filterType = todos.get('filterType');
    return (
      <div className="footer">
        <div className="todo-count">
          <strong>{todos.length}</strong> items
        </div>
        <ul className="filters">
          <li>
            <a
              href="javascript:"
              className={filterType === 'ALL' ? 'selected' : ''}
              onClick={() => (goFilterTodos('ALL'))}
            >All</a>
          </li>
          <li>
            <a
              href="javascript:"
              className={filterType === 'ACTIVE' ? 'selected' : ''}
              onClick={() => (goFilterTodos('ACTIVE'))}
            >Active</a>
          </li>
          <li>
            <a
              href="javascript:"
              className={filterType === 'COMPLETED' ? 'selected' : ''}
              onClick={() => (goFilterTodos('COMPLETED'))}
            >Completed</a>
          </li>
        </ul>
        <button
          className="clear-completed"
          onClick={clearAllCompleted}
        >
          Clear completed
        </button>
      </div>
    )
  }
}