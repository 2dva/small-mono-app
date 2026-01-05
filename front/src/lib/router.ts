import { createRouter, createWebHistory } from 'vue-router'
import TreeRender from '../views/TreeRender.vue'
import HomeView from '../views/HomeView.vue'
import NotFound from '../views/NotFound.vue'
import Post from '../views/Post.vue'
import PostList from '../views/PostList.vue'
import PostView from '../views/PostView.vue'
import SignUp from '../views/SignUp.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  {
    path: '/posts',
    name: 'posts',
    component: Post,
    children: [
      { path: '/posts', name: 'post-list', component: PostList },
      { path: '/posts/:nick', name: 'post-view', component: PostView },
    ],
  },
  { path: '/tree', name: 'tree', component: TreeRender },
  { path: '/signup', name: 'signup', component: SignUp },
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
