import Model from 'cartons/model';

export default class Todo extends Model {
  static immutable = true;

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
