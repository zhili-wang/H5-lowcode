// copy to vben-admin

const toString = Object.prototype.toString

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`
}

export function isDef<T = unknown>(val?: T): val is T {
  return typeof val !== 'undefined'
}

export function isUnDef<T = unknown>(val?: T): val is T {
  return !isDef(val)
}

export function isNullAndUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) && isNull(val)
}

export function isNullOrUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) || isNull(val)
}

export function isWindow(val: any): val is Window {
  return typeof window !== 'undefined' && is(val, 'Window')
}

export const isServer = typeof window === 'undefined'

export const isClient = !isServer

export function isUrl(path: string): boolean {
  const reg = /(((^https?:(?:\/\/)?)(?:[-:&=+$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-:&=+$,\w]+@)[A-Za-z0-9.-]+)(?:(?:\/[+~%/.\w-]*)?\??[-+=&%@.\w]*(?:#\w*)?)?)$/
  return reg.test(path)
}

export function isDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

// 是否是图片链接
export function isImgPath(path: string): boolean {
  return /(https?:\/\/|data:image\/).*?\.(png|jpg|jpeg|gif|svg|webp|ico)/i.test(path)
}

export function isEmptyVal(val: any): boolean {
  return val === '' || val === null || val === undefined
}
