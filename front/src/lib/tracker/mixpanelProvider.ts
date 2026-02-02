import { env } from '../env'
import mixpanel from 'mixpanel-browser'
import { type TrackerProfileData, type TrackerProvider } from './provider'

export const mixpanelProvider: TrackerProvider = {
  setMyProfile(data: TrackerProfileData | null) {
    if (data !== null) {
      mixpanel.people.set({
        $email: data.email,
        nick: data.nick,
      })
    } else {
      mixpanel.reset()
    }
  },

  identify(userId: string) {
    mixpanel.identify(userId)
  },

  alias(userId: string) {
    mixpanel.alias(userId)
  },

  reset() {
    mixpanel.reset()
  },

  track(name: string, data?: any) {
    mixpanel.track(name, data)
  },
}

if (env.VITE_MIXPANEL_API_KEY) {
  mixpanel.init(env.VITE_MIXPANEL_API_KEY)
}
