export const addTodo = (title) => (todoCollection) => {
  return todoCollection.add({ title });
}

export const editTodo = (newTitle) => (todo) => {
  return todo.set(
    { title: newTitle }
  );
}

export const removeTodo = (todo) => (todoCollection) => {
  return todoCollection.remove(todo);
}

export const toggleComplete = () => (todo) => {
  return todo.toggleComplete();
}

export const toggleAllCompleted = () => (todoCollection) => {
  return todoCollection.toggleAllCompleted();
}

export const goFilterTodos = (filterType) => (todoCollection) => {
  return todoCollection.set({ filterType });
}

export const clearAllCompleted = () => (todoCollection) => {
  return todoCollection.clearCompletedTodos();
}
