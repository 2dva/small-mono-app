const getRouteParams = <T extends Record<string, boolean>>(obj: T) => {
  return Object.keys(obj).reduce((acc, key) => ({ ...acc, [key]: `:${key}` }), {}) as Record<keyof T, string>
}

export const getSignUpRoute = () => '/signup'

export const getSignInRoute = () => '/signin'

export const getSignOutRoute = () => '/signout'

export const getEditProfileRoute = () => '/edit-profile'

export const getChangePasswordRoute = () => '/change-password'

export const getHomeRoute = () => '/'

export const getTreeRoute = () => '/tree'

export const getAllPostsRoute = () => '/posts'

export const getNewPostRoute = () => '/posts/new'

export const viewPostRouteParams = getRouteParams({ nick: true})
export type ViewPostRouteParams = typeof viewPostRouteParams
export const getViewPostRoute = ({ nick }: ViewPostRouteParams) => `/posts/${nick !== '' ? nick : ':nick'}`

export const editPostRouteParams = getRouteParams({ nick: true })
export type EditPostRouteParams = typeof editPostRouteParams
export const getEditPostRoute = ({ nick }: EditPostRouteParams) => `/posts/${nick !== '' ? nick : ':nick'}/edit`
