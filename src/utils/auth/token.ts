import { getLocal, getLocalExpire, removeLocal, setLocal } from '@/utils'
import api from '@/api'

export const TOKENKEY = 'iThings-token'
export const TOKEN_PREFIX = 'iThings'
export const SETTOKENKEY = 'iThings-set-token'
export const GUIDKEY = 'iThings-guid'
/** token过期时间：6小时 */
const DURATION = 6 * 60 * 60

export function getToken() {
  return getLocal(`${TOKEN_PREFIX}-token`)
}

export function setToken(token: string) {
  setLocal(TOKENKEY, token, DURATION)
}
export function setSetToken(token: string) {
  setLocal(SETTOKENKEY, token, DURATION)
}

export function removeToken() {
  removeLocal(TOKENKEY)
}

export async function refreshAccessToken() {
  const expire: number | null = getLocalExpire(TOKENKEY)

  // * token没有过期时间或者token离过期时间超过30分钟则不执行刷新
  if (!expire || expire - new Date().getTime() > 1000 * 60 * 30)
    return

  try {
    const res: any = await api.refreshToken()
    if (res.code === 0)
      setToken(res.data.token)
  }
  catch {
    // 无感刷新，有异常也不提示
  }
}

export const setUID = (uid: string) => {
  // return setLocal(`${TOKEN_PREFIX}-UID`, uid)
  return localStorage.setItem(`${TOKEN_PREFIX}-UID`, uid)
}

export const getUID = () => {
  // return getLocal(`${TOKEN_PREFIX}-UID`) ?? ''
  return localStorage.getItem(`${TOKEN_PREFIX}-UID`) ?? ''
}
