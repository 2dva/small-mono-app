import { createRouter, createWebHistory } from 'vue-router'
import TreeRender from '../views/TreeRender.vue'
import HomeView from '../views/HomeView.vue'
import NotFound from '../views/NotFound.vue'
import Post from '../views/post/Post.vue'
import PostList from '../views/post/PostList.vue'
import PostView from '../views/post/PostView.vue'
import SignUp from '../views/auth/SignUp.vue'
import SignIn from '../views/auth/SignIn.vue'
import SignOut from '../views/auth/SignOut.vue'
import PostAdd from '../views/post/PostAdd.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  {
    path: '/posts',
    component: Post,
    children: [
      { path: '/posts', name: 'posts', component: PostList },
      { path: '/posts/add', name: 'post-add', component: PostAdd },
      { path: '/posts/:nick', name: 'post-view', component: PostView },
    ],
  },
  { path: '/tree', name: 'tree', component: TreeRender },
  { path: '/signup', name: 'signup', component: SignUp },
  { path: '/signin', name: 'signin', component: SignIn },
  { path: '/signout', name: 'signout', component: SignOut },
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
