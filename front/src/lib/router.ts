import { createRouter, createWebHistory } from 'vue-router'
import TreeRender from '../views/tree/TreeRender.vue'
import HomeView from '../views/HomeView.vue'
import NotFound from '../views/NotFound.vue'
import Post from '../views/post/Post.vue'
import PostList from '../views/post/PostList.vue'
import PostView from '../views/post/PostView.vue'
import SignUp from '../views/auth/SignUp.vue'
import SignIn from '../views/auth/SignIn.vue'
import SignOut from '../views/auth/SignOut.vue'
import PostAdd from '../views/post/PostAdd.vue'
import PostEdit from '../views/post/PostEdit.vue'
import {
  getAllPostsRoute,
  getChangePasswordRoute,
  getEditPostRoute,
  getEditProfileRoute,
  getHomeRoute,
  getNewPostRoute,
  getSignInRoute,
  getSignOutRoute,
  getSignUpRoute,
  getTreeRoute,
  getViewPostRoute,
} from './routes'
import EditProfile from '../views/auth/EditProfile.vue'
import ChangePassword from '../views/auth/ChangePassword.vue'

const routes = [
  { path: getHomeRoute(), name: 'home', component: HomeView },
  {
    path: getAllPostsRoute(),
    component: Post,
    children: [
      { path: getAllPostsRoute(), name: 'posts', component: PostList },
      { path: getNewPostRoute(), name: 'post-new', component: PostAdd },
      { path: getViewPostRoute({ nick: '' }), name: 'post-view', component: PostView },
      { path: getEditPostRoute({ nick: '' }), name: 'post-edit', component: PostEdit },
    ],
  },
  { path: getTreeRoute(), name: 'tree', component: TreeRender },
  { path: getSignUpRoute(), name: 'signup', component: SignUp },
  { path: getSignInRoute(), name: 'signin', component: SignIn },
  { path: getSignOutRoute(), name: 'signout', component: SignOut },
  { path: getEditProfileRoute(), name: 'profile-edit', component: EditProfile },
  { path: getChangePasswordRoute(), name: 'change-pswd', component: ChangePassword },
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
