import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { persistencePlugin } from './persistence/persistencePlugin'
import { useLabelsStore } from './stores/labelsStore'
import { useProjectsStore } from './stores/projectsStore'
import { useStagesStore } from './stores/stagesStore'
import { useSubtasksStore } from './stores/subtasksStore'
import { useTasksStore } from './stores/tasksStore'
import './assets/styles/tailwind.css'

const app = createApp(App)
const pinia = createPinia()

pinia.use(persistencePlugin())

app.use(pinia)

useProjectsStore(pinia)
useStagesStore(pinia)
useTasksStore(pinia)
useSubtasksStore(pinia)
useLabelsStore(pinia)

app.use(router)
app.mount('#app')
