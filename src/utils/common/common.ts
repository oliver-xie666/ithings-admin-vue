import dayjs from 'dayjs'
import { isObject } from './is'
import type { Recordable } from '~/types/global'

type Time = undefined | string | Date

/** 格式化时间，默认格式：YYYY-MM-DD HH:mm:ss */
export function formatDateTime(time: Time, format = 'YYYY-MM-DD HH:mm:ss'): string {
  return dayjs(time).format(format)
}

/** 格式化日期，默认格式：YYYY-MM-DD */
export function formatDate(date: Time = undefined, format = 'YYYY-MM-DD') {
  return formatDateTime(date, format)
}

// 获取当前的时间戳，单位为 毫秒
export const getTimestamp = () => {
  return `${new Date().getTime()}`
}

export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string
  for (key in target)
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key])

  return src
}

// dynamic use hook props
export function getDynamicProps<T extends {}, U>(props: T): Partial<U> {
  const ret: Recordable = {}

  Object.keys(props).map((key) => {
    ret[key] = unref((props as Recordable)[key])
  })

  return ret as Partial<U>
}
