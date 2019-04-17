<template>
<section class="main">
    <input
      id="toggle-all"
      class="toggle-all"
      type="checkbox"
      @change="toggleAll()"
      :checked="todos.isAllCompleted()"
    />
    <label
      htmlFor="toggle-all"
    />
    <div
      class="todo-list"
    >
      <TodoItem
        v-for="todo in filterItems"
        :key="todo.key"
        :todo="todo"
        :remove="todos.actions.removeTodo"
      />
    </div>
  </section>
</template>

<script>
import TodoItem from './todo-item';

export default {
  components: {
    TodoItem
  },
  props: ['todos'],

  computed: {
    filterItems: function () {
      console.log('get filterItems')
      return this.todos.getFilterItems();
    }
  },

  methods: {
    toggleAll: function () {
      this.todos.actions.toggleAllCompleted();
    }
  }
}
</script>