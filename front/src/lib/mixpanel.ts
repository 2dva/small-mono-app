import { env } from './env'
import type { TrpcRouterOutput } from '@small-mono-app/backend/src/router'
import mixpanel from 'mixpanel-browser'

const MIXPANEL_ENABLED = false

if (env.VITE_MIXPANEL_API_KEY) {
  mixpanel.init(env.VITE_MIXPANEL_API_KEY)
}

const whenEnabled = <T>(fn: T): T => {
  return MIXPANEL_ENABLED && env.VITE_MIXPANEL_API_KEY ? fn : ((() => {}) as T)
}

export const mixpanelIdentify = whenEnabled((userId: string) => {
  mixpanel.identify(userId)
})

export const mixpanelAlias = whenEnabled((userId: string) => {
  mixpanel.alias(userId)
})

export const mixpanelReset = whenEnabled(() => {
  mixpanel.reset()
})

export const mixpanelPeopleSet = whenEnabled((me: NonNullable<TrpcRouterOutput['getMe']['me']>) => {
  mixpanel.people.set({
    $email: me.email,
    nick: me.nick,
  })
})

export const mixpanelTrackSignUp = whenEnabled(() => {
  mixpanel.track('Sign Up')
})

export const mixpanelTrackSignIn = whenEnabled(() => {
  mixpanel.track('Sign In')
})

export const mixpanelSetPostLike = whenEnabled((post: TrpcRouterOutput['setPostLike']['post']) => {
  mixpanel.track('Like', { postId: post.id })
})

export const MixpanelUser = (myData: TrpcRouterOutput['getMe']['me']) => {
  if (myData !== null) {
    mixpanelPeopleSet(myData)
  } else {
    mixpanelReset()
  }
  return null
}
