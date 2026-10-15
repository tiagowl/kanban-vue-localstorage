import { createRouter, createWebHistory } from 'vue-router'
import ProjectsView from '@/pages/ProjectsView.vue'
import ProjectView from '@/pages/ProjectView.vue'
import AllTasksView from '@/pages/AllTasksView.vue'
import AllSubtasksView from '@/pages/AllSubtasksView.vue'
import NotFoundView from '@/pages/NotFoundView.vue'

const routes = [
  {
    path: '/',
    name: 'projects',
    component: ProjectsView
  },
  {
    path: '/projetos/:projectId',
    name: 'project',
    component: ProjectView,
    props: true
  },
  {
    path: '/tarefas',
    name: 'all-tasks',
    component: AllTasksView
  },
  {
    path: '/subtarefas',
    name: 'all-subtasks',
    component: AllSubtasksView
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
