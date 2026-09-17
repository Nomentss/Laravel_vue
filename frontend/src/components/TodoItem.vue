<script setup>
defineProps({
  task: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['toggle', 'delete'])
</script>

<template>
  <li class="todo-item" :class="{ 'todo-item--done': task.completed }">
    <button
      type="button"
      class="todo-item__check"
      :class="{ 'todo-item__check--done': task.completed }"
      @click="emit('toggle', task.id)"
      :aria-label="task.completed ? 'Mark as active' : 'Mark as completed'"
    >
      <svg v-if="task.completed" viewBox="0 0 20 20" fill="none" width="14" height="14">
        <path d="M4 10.5L8 14.5L16 5.5" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <div class="todo-item__content">
      <p class="todo-item__title">{{ task.title }}</p>
      <p v-if="task.description" class="todo-item__subtitle">{{ task.description }}</p>
    </div>

    <button
      type="button"
      class="todo-item__delete"
      @click="emit('delete', task.id)"
      aria-label="Delete task"
    >
      <svg viewBox="0 0 20 20" fill="none" width="15" height="15">
        <path d="M4 6h12M8 6V4.5A1.5 1.5 0 0 1 9.5 3h1A1.5 1.5 0 0 1 12 4.5V6m2 0v9a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 6 15V6h8Z"
          stroke="#ef4444" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </li>
</template>