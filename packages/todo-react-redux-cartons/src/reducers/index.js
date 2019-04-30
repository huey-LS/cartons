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

export const initialState = new TodoCollection();

const reducerTypes = {
  [ADD_TODO] (todoCollection, action) {
    return todoCollection.clone().addChild(action.todo);
  },

  [REMOVE_TODO] (todoCollection, action) {
    return todoCollection.clone().removeChild(action.todo);
  },

  [EDIT_TODO] (todoCollection, action) {
    return todoCollection.clone().resetChildren(
      todoCollection.map((todo) => {
        if (todo.key === action.todo.key) {
          return todo.clone().set({ title: action.newTitle })
        } else {
          return todo;
        }
      })
    );
  },

  [MODIFY_TODO_COMPLETED] (todoCollection, action) {
    return todoCollection.clone().resetChildren(
      todoCollection.map((todo) => {
        if (todo.key === action.todo.key) {
          return todo.clone().set({ completed: action.completed });
        } else {
          return todo;
        }
      })
    );
  },

  [TOGGLE_ALL_COMPLETED] (todoCollection) {
    return todoCollection.clone().toggleAllCompleted();
  },

  [GO_FILTER_TODOS] (todoCollection, { filterType }) {
    return todoCollection.clone().set({ filterType })
  },

  [CLEAR_COMPLETED_TODOS] (todoCollection) {
    return todoCollection.clone().clearCompletedTodos()
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

