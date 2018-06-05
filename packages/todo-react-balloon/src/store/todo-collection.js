import TodoCollection from '../models/todo-collection';
import * as pureActions from '../actions';


const todoCollection = new TodoCollection();

todoCollection.on('update', () => {
  console.log(todoCollection);
})

export default todoCollection;

export const actions = bindActionCreators(pureActions, todoCollection)

export function bindActionCreators (actions, model) {
  if (typeof actions === 'function') {
    return function (...args) {
      actions.call(this, model, ...args)
    }
  } else {
    return Object.keys(actions)
      .reduce((bindActions, key) => {
        let action = actions[key];
        bindActions[key] = function (...args) {
          action.call(this, model, ...args)
        }
        return bindActions;
      }, {});
  }
}
