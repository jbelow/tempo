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
    path: '/user-achievements',
    name: 'userAchievements',
    component: () => import('../views/UserAchievements.vue')
  },
  {
    path: '/user-statistics',
    name: 'userStatistics',
    component: () => import('../views/UserStatistics.vue'),
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router
