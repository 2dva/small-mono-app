import { createRouter, createWebHistory } from 'vue-router'

import TreeRender from '../pages/TreeRender.vue'
import HomeView from '../pages/HomeView.vue'
import NotFound from '../pages/NotFound.vue'
import PostsPage from '../pages/PostsPage.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/posts/:nick', name: 'postview', component: PostsPage },
  { path: '/posts', name: 'posts', component: PostsPage },
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
