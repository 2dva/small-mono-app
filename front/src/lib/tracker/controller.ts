import type { TrpcRouterOutput } from '@small-mono-app/backend/src/router'
import { invokeTrackerProviderEvent, setMyProfileData, TrackerProfileData, TrackerProviderEvents } from './provider'

const invokeTrackerEvent = (eventName: TrackerProviderEvents, idOrEventName?: string, data?: any) => {
  invokeTrackerProviderEvent(eventName, idOrEventName, data)
}

export const tracker = {
  setMyProfile: (me: TrpcRouterOutput['getMe']['me']) => {
    setMyProfileData(me as TrackerProfileData | null)
  },
  identify: (userId: string) => {
    invokeTrackerEvent(TrackerProviderEvents.identify, userId)
  },
  identifyAlias: (userId: string) => {
    invokeTrackerEvent(TrackerProviderEvents.alias, userId)
  },
  reset: () => {
    invokeTrackerEvent(TrackerProviderEvents.reset)
  },
  signIn: () => {
    invokeTrackerEvent(TrackerProviderEvents.track, 'signin')
  },
  signUp: () => {
    invokeTrackerEvent(TrackerProviderEvents.track, 'signup')
  },
  likePost: (post: TrpcRouterOutput['setPostLike']['post']) => {
    invokeTrackerEvent(TrackerProviderEvents.track, 'likePost', { postId: post.id })
  },
}
