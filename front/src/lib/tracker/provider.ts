import { env } from '../env'

const MIXPANEL_PROVIDER_ENABLED = true

export interface TrackerProfileData {
  email: string
  [key: string]: any
}

export interface TrackerProvider {
  identify(s: string): void
  alias(s: string): void
  reset(): void
  track(n: string, data?: any): void
  setMyProfile(s: TrackerProfileData | null): void
}

export enum TrackerProviderEvents {
  'identify',
  'alias',
  'reset',
  'track',
}

let trackerProvider: TrackerProvider | null = null

export const registerTrackerProvider = (provider: TrackerProvider) => {
  trackerProvider = provider
}

export const setMyProfileData = (me: TrackerProfileData | null) => {
  trackerProvider?.setMyProfile(me)
}

export const invokeTrackerProviderEvent = (
  trackerEvent: TrackerProviderEvents,
  idOrEventName: string = '',
  data?: any
) => {
  switch (trackerEvent) {
    case TrackerProviderEvents.identify:
      trackerProvider?.identify(idOrEventName)
      break
    case TrackerProviderEvents.alias:
      trackerProvider?.alias(idOrEventName)
      break
    case TrackerProviderEvents.reset:
      trackerProvider?.reset()
      break
    case TrackerProviderEvents.track:
      trackerProvider?.track(idOrEventName, data)
      break
  }
}

if (MIXPANEL_PROVIDER_ENABLED && env.VITE_MIXPANEL_API_KEY) {
  import('./mixpanelProvider')
    .then(({ mixpanelProvider }) => {
      registerTrackerProvider(mixpanelProvider)
    })
    .catch((error) => {
      console.error('Module loading failed:', error)
    })
}
