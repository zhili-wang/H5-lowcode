import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'
/**
 * @name: useGlobalProperties
 * @author: 卜启缘
 * @date: 2021/5/3 21:13
 * @description：useGlobalProperties
 * @update: 2021/5/3 21:13
 */
import { getCurrentInstance } from 'vue'

interface GlobalProperties {
  $$refs: any
  $route: RouteLocationNormalizedLoaded
  $router: Router
}

export function useGlobalProperties() {
  const globalProperties = getCurrentInstance()!.appContext.config.globalProperties as unknown as GlobalProperties

  const registerRef = (el, _vid: string) => el && (globalProperties.$$refs[_vid] = el)

  return {
    globalProperties,
    registerRef,
  }
}
