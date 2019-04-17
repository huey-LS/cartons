<template>
<div class="todo-input">
    <input
      class="new-todo"
      placeholder="What needs to be done?"
      :value="newTodo"
      @keydown="handleNewTodoKeyDown($event)"
      @input="handleChange($event)"
      autoFocus="true"
    />
  </div>
</template>

<script>
const ENTER_KEY = 13;
export default {
  props: ['todos'],

  data: function () {
    return {
      newTodo: ''
    }
  },

  methods: {
    handleNewTodoKeyDown: function (event) {
      if (event.keyCode !== ENTER_KEY) {
        return;
      }

      event.preventDefault();

      var val = this.newTodo.trim();

      if (val) {
        this.todos.actions.addTodo(val);
        this.newTodo = '';
      }
    },

    handleChange: function (event) {
      this.newTodo = event.target.value;
    }
  }
}

</script>