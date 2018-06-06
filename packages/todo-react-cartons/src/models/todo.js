import Model from 'cartons/model';
import { incrementCreator } from 'cartons/key-creators';

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
