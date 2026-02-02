export type TrackerProvider = {
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

export type TrackerProfileData = {
  email: string
  [key: string]: any
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
