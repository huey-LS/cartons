import {
  ADD_TODO,
  REMOVE_TODO,
  EDIT_TODO,
  MODIFY_TODO_COMPLETED,
  TOGGLE_ALL_COMPLETED,
  GO_FILTER_TODOS,
  CLEAR_COMPLETED_TODOS
} from '../constants/actionTypes';

import TodoCollection from '../models/todo-collection';

const initialState = new TodoCollection();

const reducerTypes = {
  [ADD_TODO] (todoCollection, action) {
    return todoCollection.add(action.todo);
  },

  [REMOVE_TODO] (todoCollection, action) {
    return todoCollection.remove(action.todo);
  },

  [EDIT_TODO] (todoCollection, action) {
    return todoCollection.updateItem(
      { title: action.newTitle },
      (todo) => (todo === action.todo)
    );
  },

  [MODIFY_TODO_COMPLETED] (todoCollection, action) {
    return todoCollection.updateItem(
      { completed: action.completed },
      (todo) => (todo === action.todo)
    );
  },

  [TOGGLE_ALL_COMPLETED] (todoCollection) {
    return todoCollection.toggleAllCompleted();
  },

  [GO_FILTER_TODOS] (todoCollection, { filterType }) {
    return todoCollection.set({ filterType })
  },

  [CLEAR_COMPLETED_TODOS] (todoCollection) {
    return todoCollection.clearCompletedTodos()
  }
}

export const todoCollection = createReducer({
  initialState,
  reducerTypes
});

function createReducer ({
  reducerTypes,
  initialState
}) {
  return (state = initialState, action) => {
    let { type } = action;
    let nextState = state;
    if (reducerTypes[type]) {
      nextState = reducerTypes[type](state, action);
      nextState = typeof nextState !== 'undefined' ? nextState : state;
    }
    return nextState;
  }
}

