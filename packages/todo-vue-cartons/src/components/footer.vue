<template>
<div class="footer">
  <div class="todo-count">
    <strong>{{todos.length}}</strong> items
  </div>
  <ul class="filters">
    <li>
      <a
        href="javascript:"
        :class="todos.filterType === 'ALL' ? 'selected' : ''"
        @click="handleFilterShow('ALL')"
      >All</a>
    </li>
    <li>
      <a
        href="javascript:"
        :class="todos.filterType === 'ACTIVE' ? 'selected' : ''"
        @click="handleFilterShow('ACTIVE')"
      >Active</a>
    </li>
    <li>
      <a
        href="javascript:"
        :class="todos.filterType === 'COMPLETED' ? 'selected' : ''"
        @click="handleFilterShow('COMPLETED')"
      >Completed</a>
    </li>
  </ul>
  <button
    class="clear-completed"
    @click="todos.actions.clearAllCompleted()"
  >
    Clear completed
  </button>
</div>
</template>

<script>
export default {
  props: ['todos'],

  methods: {
    handleFilterShow: function (type) {
      this.todos.actions.goFilterTodos(type);
    }
  }
}
</script>