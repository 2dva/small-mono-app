import { pgr } from "./pumpGetRoute"

export const getSignUpRoute = pgr(() => '/signup')

export const getSignInRoute = pgr(() => '/signin')

export const getSignOutRoute = pgr(() => '/signout')

export const getShowProfileRoute = pgr(() => '/profile')

export const getEditProfileRoute = pgr(() => '/profile/edit')

export const getChangePasswordRoute = pgr(() => '/profile/change-password')

export const getHomeRoute = pgr(() => '/')

export const getTreeRoute = pgr(() => '/tree')

export const getAllPostsRoute = pgr(() => '/posts')

export const getNewPostRoute = pgr(() => '/posts/new')

export const getViewPostRoute = pgr({ nick: true}, ({ nick }) => `/posts/${nick}`)

export const getEditPostRoute = pgr({ nick: true }, ({ nick }) => `/posts/${nick}/edit`)
