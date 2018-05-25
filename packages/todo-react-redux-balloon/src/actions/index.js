import {
  ADD_TODO,
  REMOVE_TODO,
  EDIT_TODO,
  MODIFY_TODO_COMPLETED,
  TOGGLE_ALL_COMPLETED,
  GO_FILTER_TODOS,
  CLEAR_COMPLETED_TODOS
} from '../constants/actionTypes';

export const addTodo = (title) => ({
  type: ADD_TODO,
  todo: { title }
})

export const editTodo = (todo, newTitle) => ({
  type: EDIT_TODO,
  todo,
  newTitle
})

export const removeTodo = (todo) => ({
  type: REMOVE_TODO,
  todo
})

export const modifyTodoCompleted = (todo, completed) => ({
  type: MODIFY_TODO_COMPLETED,
  todo,
  completed
})

export const toggleAllCompleted = () => ({
  type: TOGGLE_ALL_COMPLETED
})

export const goFilterTodos = (filterType) => ({
  type: GO_FILTER_TODOS,
  filterType
})

export const clearAllCompleted = () => ({
  type: CLEAR_COMPLETED_TODOS,
})
