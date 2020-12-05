import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/user-goals',
    name: 'userGoals',
    component: () => import('../views/UserGoals.vue')
  },

  {
    path: '/user-statistics',
    name: 'userStatistics',
    component: () => import('../views/UserStatistics.vue'),
  }
]

const router = new VueRouter({
  routes
})

export default router
