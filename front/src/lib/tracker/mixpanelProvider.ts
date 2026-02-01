import { env } from '../env'
import mixpanel from 'mixpanel-browser'
import { registerTrackerProvider, type TrackerProfileData, TrackerProvider } from './provider'

const MIXPANEL_ENABLED = false

export const mixpanelProvider: TrackerProvider = {
  isEnabled: () => {
    return !!(MIXPANEL_ENABLED && env.VITE_MIXPANEL_API_KEY)
  },

  init: () => {
    if (env.VITE_MIXPANEL_API_KEY) {
      mixpanel.init(env.VITE_MIXPANEL_API_KEY)
    }
  },

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

if (mixpanelProvider.isEnabled()) {
  registerTrackerProvider(mixpanelProvider)
}
