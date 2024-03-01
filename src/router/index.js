import { createRouter, createWebHistory } from 'vue-router'
import ViewOne from '../components/ViewOne.vue'
import ViewTwo from '../components/ViewTwo.vue'

const routes = [
  {
    path: '/',
    redirect: '/view-one'
  },
  {
    path: '/view-one',
    name: 'ViewOne',
    component: ViewOne
  },
  {
    path: '/view-two',
    name: 'ViewTwo',
    component: ViewTwo
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
