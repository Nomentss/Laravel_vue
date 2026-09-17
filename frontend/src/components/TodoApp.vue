<script setup>
import { onMounted } from 'vue'
import { useTodoStore } from '../stores/todoStore'
import TodoInput from './TodoInput.vue'
import TodoItem from './TodoItem.vue'
import '../assets/todo.css'

const store = useTodoStore()

onMounted(() => {
  store.fetchTasks()
})

const filters = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
]

function countFor(key) {
  if (key === 'active') return store.activeCount
  if (key === 'completed') return store.completedCount
  return store.total
}
</script>

<template>
  <div class="todo-app">
    <header class="todo-app__header">
      <span class="todo-app__logo">🛡️</span>
      <h1 class="todo-app__title">Dynamic Todo App</h1>
      <span class="todo-app__emoji">🚀</span>
    </header>

    <div class="todo-app__toolbar">
      <TodoInput @add-task="store.addTask" />

      <div class="todo-app__filters">
        <button
          v-for="f in filters"
          :key="f.key"
          type="button"
          class="todo-app__filter"
          :class="{ 'todo-app__filter--active': store.filter === f.key }"
          @click="store.setFilter(f.key)"
        >
          {{ f.label }} ({{ countFor(f.key) }})
        </button>
      </div>
    </div>

    <div class="todo-app__progress">
      <p class="todo-app__progress-value">{{ store.progressPercent }}%</p>
      <div class="todo-app__progress-track">
        <div
          class="todo-app__progress-fill"
          :style="{ width: store.progressPercent + '%' }"
        />
      </div>
      <p class="todo-app__progress-remaining">
        {{ store.activeCount }} task{{ store.activeCount === 1 ? '' : 's' }} remaining
      </p>
    </div>

    <p v-if="store.error" class="todo-app__error">{{ store.error }}</p>

    <p v-if="store.loading" class="todo-app__loading">Loading tasks...</p>

    <ul v-else class="todo-app__list">
      <TodoItem
        v-for="task in store.filteredTasks"
        :key="task.id"
        :task="task"
        @toggle="store.toggleTask"
        @delete="store.deleteTask"
      />

      <li v-if="store.filteredTasks.length === 0" class="todo-app__empty">
        No tasks here.
      </li>
    </ul>
  </div>
</template>