import { createRouter, createWebHistory } from 'vue-router'

import AllPosts from '../pages/AllPosts.vue'
import TreeRender from '../pages/TreeRender.vue'
import HomeView from '../pages/HomeView.vue'
import NotFound from '../pages/NotFound.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/posts', name: 'posts', component: AllPosts },
  { path: '/tree', name: 'tree', component: TreeRender },
  {
    path: '/:pathMatch(.*)', // Matches all paths
    name: 'notfound',
    component: NotFound,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
