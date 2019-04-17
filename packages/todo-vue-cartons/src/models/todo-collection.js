import Collection from 'cartons/collection';
import { incrementCreator } from 'cartons/key-creators';
import Todo from './todo';

export default class TodoCollection extends Collection {
  static Model = Todo;
  static key = incrementCreator('todo-collection-');
  static initialAttributes = {
    filterType: 'ALL'
  }

  collectionDidAddChild (item) {
    console.log('collection add child', item);
  }

  collectionDidRemoveChild (item) {
    console.log('collection remove child', item)
  }

  isAllCompleted () {
    return this.every((todo) => (todo.isCompleted()))
  }

  toggleAllCompleted () {
    let targetCompleted = !this.isAllCompleted();
    return this.updateItems((item) => (
      item.set({ 'completed': targetCompleted })
    ))
  }

  getFilterItems () {
    const filterType = this.get('filterType');
    switch (filterType) {
      case 'COMPLETED':
        return this.getCompletedItems();
      case 'ACTIVE':
        return this.getActiveItems();
      default:
        return this.children;
    }
  }

  getCompletedItems () {
    return this.filter((item) => item.completed)
  }

  getActiveItems () {
    return this.filter((item) => !item.completed)
  }

  clearCompletedTodos () {
    return this.reset(
      this.filter((item) => !item.completed)
    )
  }
}
