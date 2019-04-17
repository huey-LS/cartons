<template>
<div
  class="todoapp"
>
  <TodoInput
    :todos="todos"
  />
  <Todos
    :todos="todos"
  />
  <Footer
    :todos="todos"
  />
</div>
</template>


<script>
import './css/base.css';
import './css/app.css';

import { modelBindActions } from 'cartons/actions';
import { observe } from 'cartons-vue';

import TodoCollection from './models/todo-collection';
import Todos from './components/todos';
import TodoInput from './components/todo-input';
import Footer from './components/footer';

import {
  removeTodo,
  goFilterTodos,
  toggleAllCompleted,
  clearAllCompleted,
  addTodo
} from './actions';


export default {
  components: {
    Todos,
    TodoInput,
    Footer
  },

  data: function () {

    let state = {
      todos: modelBindActions(
        new TodoCollection(),
        {
          goFilterTodos,
          addTodo,
          removeTodo,
          toggleAllCompleted,
          clearAllCompleted
        }
      )
    };

    state = observe(state);

    return state;
  }
}
</script>
