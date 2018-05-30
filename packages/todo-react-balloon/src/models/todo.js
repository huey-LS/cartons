import Model from 'balloon/model';
import { incrementCreator } from 'balloon/key-creators';

export default class Todo extends Model {
  static key = incrementCreator('todo-');

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
