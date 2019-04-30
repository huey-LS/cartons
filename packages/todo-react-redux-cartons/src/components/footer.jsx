import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { observer } from 'cartons-react';

import { goFilterTodos, clearAllCompleted } from '../actions'

@connect(
  ({ todoCollection }) => ({
    todoCollection
  }),
  (dispatch) => ({
    goFilterTodos: bindActionCreators(goFilterTodos, dispatch),
    clearAllCompleted: bindActionCreators(clearAllCompleted, dispatch)
  })
)
export default class Footer extends React.Component {
  render () {
    const { todoCollection, goFilterTodos, clearAllCompleted } = this.props;
    const filterType = todoCollection.get('filterType');
    return (
      <div className="footer">
        <div className="todo-count">
          <strong>{todoCollection.length}</strong> items
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