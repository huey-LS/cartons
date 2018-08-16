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
