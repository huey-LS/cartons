import Collection from 'cartons/collection';
import { keyCreators } from 'cartons/helpers';
import Todo from './todo';

const { incrementCreator } = keyCreators;

export default class TodoCollection extends Collection {
  static Model = Todo;
  static key = incrementCreator('todo-collection-');
  static initialAttributes = {
    filterType: 'ALL'
  }

  // before children change
  collectionWillUpdateChildren (prevChildren, nextChildren) {
    console.log('collectionWillUpdateChildren', prevChildren, nextChildren)
  }
  // after children change
  collectionDidUpdateChildren (prevChildren, nextChildren) {
    console.log('collectionDidUpdateChildren', prevChildren, nextChildren)
  }

  isAllCompleted () {
    return this.every((todo) => (todo.isCompleted()))
  }

  toggleAllCompleted () {
    let targetCompleted = !this.isAllCompleted();
    return this.resetChildren(
      this.map((item) => (
        item.clone().set({ 'completed': targetCompleted })
      ))
    )
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
    return this.resetChildren(
      this.filter((item) => (
        !item.completed
      ))
    )
  }
}
