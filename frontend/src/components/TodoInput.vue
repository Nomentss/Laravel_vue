<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['add-task'])

const newTaskTitle = ref('')
const MIN_LENGTH = 3

const isValid = computed(() => newTaskTitle.value.trim().length >= MIN_LENGTH)

function handleSubmit() {
  if (!isValid.value) return
  emit('add-task', newTaskTitle.value.trim())
  newTaskTitle.value = ''
}
</script>

<template>
  <form class="todo-input" @submit.prevent="handleSubmit">
    <input
      v-model="newTaskTitle"
      type="text"
      placeholder="Add a new task..."
      class="todo-input__field"
    />

    <button
      type="submit"
      class="todo-input__submit"
      :disabled="!isValid"
    >
      <span class="todo-input__submit-icon">+</span>
      Add Task
    </button>

    <p class="todo-input__hint">Min. {{ MIN_LENGTH }} characters</p>
  </form>
</template>