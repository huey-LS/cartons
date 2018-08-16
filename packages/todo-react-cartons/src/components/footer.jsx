import * as React from 'react';
import { observer } from 'cartons-react';

@observer()
export default class Footer extends React.Component {
  render () {
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
              onClick={() => (todos.actions.goFilterTodos('ALL'))}
            >All</a>
          </li>
          <li>
            <a
              href="javascript:"
              className={filterType === 'ACTIVE' ? 'selected' : ''}
              onClick={() => (todos.actions.goFilterTodos('ACTIVE'))}
            >Active</a>
          </li>
          <li>
            <a
              href="javascript:"
              className={filterType === 'COMPLETED' ? 'selected' : ''}
              onClick={() => (todos.actions.goFilterTodos('COMPLETED'))}
            >Completed</a>
          </li>
        </ul>
        <button
          className="clear-completed"
          onClick={todos.actions.clearAllCompleted}
        >
          Clear completed
        </button>
      </div>
    )
  }
}