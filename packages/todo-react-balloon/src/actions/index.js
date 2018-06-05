export const addTodo = (todoCollection, title) => {
  return todoCollection.add({ title });
}

export const editTodo = (todo, newTitle) => {
  return todo.set(
    { title: newTitle }
  );
}

export const removeTodo = (todoCollection, todo) => {
  return todoCollection.remove(todo);
}

export const toggleComplete = (todo) => {
  return todo.toggleComplete();
}

export const toggleAllCompleted = (todoCollection) => {
  return todoCollection.toggleAllCompleted();
}

export const goFilterTodos = (todoCollection, filterType) => {
  return todoCollection.set({ filterType })
}

export const clearAllCompleted = (todoCollection) => {
  return todoCollection.clearCompletedTodos()
}
