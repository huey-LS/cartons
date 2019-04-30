import Model from 'cartons/model';
import { keyCreators, descriptors } from 'cartons/helpers';

import {
  editTodo,
  toggleComplete
} from '../actions';

const { serialized, bindActions } = descriptors;
const { incrementCreator } = keyCreators;

export default class Todo extends Model {
  static key = incrementCreator('todo-');

  @bindActions()
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

  @serialized('title')
  title;

  @serialized({
    name: 'completed',
    type: Boolean
  })
  completed;

  toggleComplete () {
    return this.set({
      completed: !this.isCompleted()
    });
  }

  isCompleted () {
    return !!this.get('completed');
  }
}
