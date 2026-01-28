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
  console.log(`mixpanel: identify ${userId}`)
  mixpanel.identify(userId)
})

export const mixpanelAlias = whenEnabled((userId: string) => {
  console.log(`mixpanel: alias ${userId}`)
  mixpanel.alias(userId)
})

export const mixpanelReset = whenEnabled(() => {
  console.log(`mixpanel: reset`)
  mixpanel.reset()
})

export const mixpanelPeopleSet = whenEnabled((me: NonNullable<TrpcRouterOutput['getMe']['me']>) => {
  console.log(`mixpanel: people set ${me.email}`)
  mixpanel.people.set({
    $email: me.email,
    nick: me.nick,
  })
})

export const mixpanelTrackSignUp = whenEnabled(() => {
  console.log(`mixpanel: sign up`)

  mixpanel.track('Sign Up')
})

export const mixpanelTrackSignIn = whenEnabled(() => {
  console.log(`mixpanel: sign in`)
  mixpanel.track('Sign In')
})

export const mixpanelSetPostLike = whenEnabled((post: TrpcRouterOutput['setPostLike']['post']) => {
  console.log(`mixpanel: like ${post.id}`)
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
