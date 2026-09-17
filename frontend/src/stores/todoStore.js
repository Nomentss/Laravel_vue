import { defineStore } from 'pinia'
import api from '../services/api'

export const useTodoStore = defineStore('todo', {
  state: () => ({
    tasks: [],
    filter: 'all', // 'all' | 'active' | 'completed'
    loading: false,
    error: null,
  }),

  getters: {
    total: (state) => state.tasks.length,

    activeCount: (state) => state.tasks.filter((t) => !t.completed).length,

    completedCount: (state) => state.tasks.filter((t) => t.completed).length,

    progressPercent: (state) => {
      if (state.tasks.length === 0) return 0
      const done = state.tasks.filter((t) => t.completed).length
      return Math.round((done / state.tasks.length) * 100)
    },

    filteredTasks: (state) => {
      if (state.filter === 'active') return state.tasks.filter((t) => !t.completed)
      if (state.filter === 'completed') return state.tasks.filter((t) => t.completed)
      return state.tasks
    },
  },

  actions: {
    setFilter(filter) {
      this.filter = filter
    },

    async fetchTasks() {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get('/tasks')
        this.tasks = Array.isArray(data) ? data : data.data
      } catch (e) {
        this.error = "Impossible de charger les tâches."
      } finally {
        this.loading = false
      }
    },

    async addTask(title) {
      const cleanTitle = title.trim()
      if (cleanTitle.length < 3) return

      try {
        const { data } = await api.post('/tasks', {
          title: cleanTitle,
          completed: false,
        })
        
        const newTask = data.data ?? data
        this.tasks.push(newTask)
      } catch (e) {
        this.error = "Impossible d'ajouter la tâche."
      }
    },

    async toggleTask(id) {
      const task = this.tasks.find((t) => t.id === id)
      if (!task) return

      const previous = task.completed
      task.completed = !task.completed // mise à jour optimiste

      try {
        await api.patch(`/tasks/${id}`, { completed: task.completed })
      } catch (e) {
        task.completed = previous // rollback si l'API échoue
        this.error = "Impossible de mettre à jour la tâche."
      }
    },

    async deleteTask(id) {
      const previous = this.tasks
      this.tasks = this.tasks.filter((t) => t.id !== id) // suppression optimiste

      try {
        await api.delete(`/tasks/${id}`)
      } catch (e) {
        this.tasks = previous // rollback si l'API échoue
        this.error = "Impossible de supprimer la tâche."
      }
    },
  },
})