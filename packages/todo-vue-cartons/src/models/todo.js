import Model from 'cartons/model';
import { createActions } from 'cartons/actions';
import { incrementCreator } from 'cartons/key-creators';

import {
  editTodo,
  toggleComplete
} from '../actions';

export default class Todo extends Model {
  static key = incrementCreator('todo-');

  @createActions()
  actions = {
    editTodo,
    toggleComplete
  }

  modelWillUpdate (prevAttributes, nextAttributes) {
    console.log(`[model will update] new title ${nextAttributes.get('title')} from ${prevAttributes.get('title')}`)
  }

  modelDidUpdate (prevAttributes, newAttributes) {
    console.log(`[model did update] new title ${newAttributes.get('title')} from ${prevAttributes.get('title')}`)
  }

  get title () {
    return this.get('title');
  }

  get completed () {
    return this.isCompleted();
  }

  toggleComplete () {
    return this.set({
      completed: !this.isCompleted()
    });
  }

  isCompleted () {
    return !!this.get('completed');
  }
}
