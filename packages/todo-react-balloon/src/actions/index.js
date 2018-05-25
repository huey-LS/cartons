export const addTodo = (todoCollection, title) => {
  return todoCollection.add({ title });
}

export const editTodo = (todoCollection, todo, newTitle) => {
  return todoCollection.updateItem(
    { title: newTitle },
    (item) => (item === todo)
  );
}

export const removeTodo = (todoCollection, todo) => {
  return todoCollection.remove(todo);
}

export const modifyTodoCompleted = (todoCollection, todo, completed) => {
  return todoCollection.updateItem(
    { completed: completed },
    (item) => (todo === item)
  );
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
