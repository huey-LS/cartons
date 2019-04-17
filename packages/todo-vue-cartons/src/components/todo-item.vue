<template>
<div
  :class="`todo-item${editing ? ' editing' : ''}${todo.completed ? ' completed' : ''}`"
>
  <input
    v-if="editing"
    class="edit"
    type="text"
    @keyDown="handleKeyDown($event)"
    @input="handleChangeEditText($event)"
    :value="editText"
    autoFocus="true"
  />
  <div
    v-else
  >
    <input
      class="toggle"
      type="checkbox"
      :checked="todo.completed"
      @change="todo.actions.toggleComplete()"
    />
    <label @doubleClick="handleToEdit($event)">
      {{todo.title}}
    </label>
    <button class="destroy" @click="handleDestroy()" />
  </div>
</div>
</template>

<script>
const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

export default {
  props: ['todo', 'remove'],
  data: function () {
    return {
      editing: false,
      editText: ''
    }
  },

  methods: {
    handleDestroy: function () {
      const {
        remove,
        todo
      } = this;
      this.remove(todo);
    },

    handleToEdit: function () {
      this.editing = true,
      this.editText = this.todo.title;
    },

    handleChangeEditText: function (event) {
      this.editText = event.target.value;
    },

    handleKeyDown: function (event) {
      if (event.which === ESCAPE_KEY) {
        this.cancelEdit();
        event.preventDefault();
      } else if (event.which === ENTER_KEY) {
        this.editComplete();
        event.preventDefault();
      }
    },

    cancelEdit: function () {
      this.editing = false;
    },

    editComplete: function () {
      this.editing = false;
      this.todo.actions.editTodo(this.editText);
    }
  }
}
</script>
