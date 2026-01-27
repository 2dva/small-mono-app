import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFound from '../views/NotFound.vue'
import ChangePassword from '../views/auth/ChangePassword.vue'
import EditProfile from '../views/auth/EditProfile.vue'
import Profile from '../views/auth/Profile.vue'
import ShowProfile from '../views/auth/ShowProfile.vue'
import SignIn from '../views/auth/SignIn.vue'
import SignOut from '../views/auth/SignOut.vue'
import SignUp from '../views/auth/SignUp.vue'
import Post from '../views/post/Post.vue'
import PostAdd from '../views/post/PostAdd.vue'
import PostEdit from '../views/post/PostEdit.vue'
import PostList from '../views/post/PostList.vue'
import PostView from '../views/post/PostView.vue'
import TreeRender from '../views/tree/TreeRender.vue'
import {
  getAllPostsRoute,
  getChangePasswordRoute,
  getEditPostRoute,
  getEditProfileRoute,
  getHomeRoute,
  getNewPostRoute,
  getShowProfileRoute,
  getSignInRoute,
  getSignOutRoute,
  getSignUpRoute,
  getTreeRoute,
  getViewPostRoute,
} from './routes'

const routes = [
  { path: getHomeRoute.definition, name: 'home', component: HomeView },
  {
    path: getAllPostsRoute.definition,
    component: Post,
    children: [
      { path: getAllPostsRoute.definition, name: 'posts', component: PostList },
      { path: getNewPostRoute.definition, name: 'post-new', component: PostAdd },
      { path: getViewPostRoute.definition, name: 'post-view', component: PostView },
      { path: getEditPostRoute.definition, name: 'post-edit', component: PostEdit },
    ],
  },
  { path: getTreeRoute.definition, name: 'tree', component: TreeRender },
  { path: getSignUpRoute.definition, name: 'signup', component: SignUp },
  { path: getSignInRoute.definition, name: 'signin', component: SignIn },
  { path: getSignOutRoute.definition, name: 'signout', component: SignOut },
  {
    path: getShowProfileRoute.definition,
    component: Profile,
    children: [
      { path: getShowProfileRoute.definition, name: 'profile', component: ShowProfile },
      { path: getEditProfileRoute.definition, name: 'profile-edit', component: EditProfile },
      { path: getChangePasswordRoute.definition, name: 'change-pswd', component: ChangePassword },
    ],
  },
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
