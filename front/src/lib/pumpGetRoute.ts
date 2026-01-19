function pumpGetRoute<T extends Record<string, boolean>>(
  routeParamsDefinition: T,
  getRoute: (routeParams: Record<keyof T, string>) => string
): {
  (routeParams: Record<keyof T, string>): string
  placeholders: Record<keyof T, string>
  definition: string
}
function pumpGetRoute(getRoute: () => string): {
  (): string
  placeholders: {}
  definition: string
}
function pumpGetRoute(routeParamsOrGetRoute?: any, maybeGetRoute?: any) {
  const routeParamsDefinition = typeof routeParamsOrGetRoute === 'function' ? {} : routeParamsOrGetRoute
  const getRoute = typeof routeParamsOrGetRoute === 'function' ? routeParamsOrGetRoute : maybeGetRoute
  const placeholders = Object.keys(routeParamsDefinition).reduce((acc, key) => ({ ...acc, [key]: `:${key}` }), {})
  const definition = getRoute(placeholders)
  const pumpedGetRoute = (routeParams?: {}) => {
    return getRoute(routeParams)
  }
  pumpedGetRoute.placeholders = placeholders
  pumpedGetRoute.definition = definition
  return pumpedGetRoute
}

export type RouteParams<T extends { placeholders: Record<string, string> }> = T['placeholders']

export const pgr = pumpGetRoute
