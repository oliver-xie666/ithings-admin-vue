/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { AxiosResponse } from 'axios'
import { getLocal } from '../storage'
import { getTimestamp } from '../common'
import { GUIDKEY } from '../index'
import { AxiosRejectError, resolveResError } from './helpers'
import { SETTOKENKEY, getToken, setSetToken, setToken } from '~/src/utils/auth/token'
import { emitter } from '@/utils/common/bus'
import { TOKENKEY } from '@/utils/auth/token'
import type { RequestConfig } from '~/types/axios'

let acitveAxios = 0
let timer: number
const showLoading = () => {
  acitveAxios++
  if (timer)
    clearTimeout(timer)

  timer = window.setTimeout(() => {
    if (acitveAxios > 0)
      emitter.emit('showLoading')
  }, 400)
}

const closeLoading = () => {
  acitveAxios--
  if (acitveAxios <= 0) {
    clearTimeout(timer)
    emitter.emit('closeLoading')
  }
}

/** 请求拦截 */
export function reqResolve(config: RequestConfig) {
  if (!config?.donNotShowLoading)
    showLoading()

  // 处理不需要token的请求
  if (config?.noNeedToken)
    return config

  // @ts-expect-error
  config.headers[GUIDKEY] = getTimestamp()
  const token = getToken()
  if (token && config.headers)
    config.headers[TOKENKEY] = token

  const IThingsSetTokenValue = getLocal(SETTOKENKEY)

  if (IThingsSetTokenValue)
  // @ts-expect-error
    config.headers[TOKENKEY] = IThingsSetTokenValue

  return config
}

export const errorHandler = (error: { response: Response }): Promise<Response> => {
  const { response } = error

  if (response && response.status) {
    try {
      // @ts-expect-error
      const data = response?.data
      // @ts-expect-error
      window.$notification.error({
        content: `请求错误, 错误码:${data.code}`,
        meta: data.message || data.msg,
      })
    }
    catch {
      // @ts-expect-error
      window.$notification.error({
        content: `请求错误, 错误码:${response.status}`,
        // @ts-expect-error
        meta: response.data.toString(),
      })
    }
  }
  else if (!response) {
    window['$notification']?.error({ content: '您的网络发生异常，无法连接服务器' })
  }

  return Promise.reject(error)
}

// /** 请求错误拦截 */
// export function reqReject(error: AxiosError) {
//   // @ts-expect-error
//   if (!error?.config?.donNotShowLoading)
//     closeLoading()
//   window.$message?.error(error.message)
//   return Promise.reject(error)
// }

/** 响应拦截 */
export function resResolve(response: AxiosResponse) {
  // TODO: 处理不同的 response.headers
  const { data, status, config, statusText } = response
  // @ts-expect-error
  if (!response?.config?.donNotShowLoading)
    closeLoading()

  // @ts-expect-error
  const IThingsSetTokenValue = response.headers.get(SETTOKENKEY)
  if (IThingsSetTokenValue) {
    setToken(IThingsSetTokenValue)
    setSetToken(IThingsSetTokenValue)
  }
  else {
    setSetToken('')
  }

  if (data?.code === 200 || response.headers.success === 'true') {
    if (response.headers.msg)
      data.msg = decodeURI(response.headers.msg)

    return Promise.resolve(data)
  }

  if (data?.code !== 200) {
    const code = data?.code ?? status

    /** 根据code处理对应的操作，并返回处理后的message */
    const message = resolveResError(code, data?.message ?? statusText)

    const { noNeedTip } = config as RequestConfig
    !noNeedTip && window['$message']?.error(message)
    return Promise.reject(new AxiosRejectError({ code, message, data: data || response }))
  }
  return Promise.resolve(data.msg ? data : response)
}

// /** 响应错误拦截 */
// export function resReject(error: AxiosError) {
//   // @ts-expect-error
//   if (!error?.config?.donNotShowLoading)
//     closeLoading()

//   const { response } = error

//   if (response && response.status) {
//     try {
//       // @ts-expect-error
//       const data = JSON.parse(response.data)
//       window.$message?.error(data.code, {
//         render: props => renderMessage(props, data),
//         closable: true,
//       })
//     }
//     catch {
//       // @ts-expect-error
//       window.$message?.error(response.data, {
//         render: props => renderMessage(props, response),
//         closable: true,
//       })
//     }
//   }
//   else if (!response) {
//     window.$message?.error('您的网络发生异常，无法连接服务器')
//   }

//   return response

//   // if (!error || !error.response) {
//   //   const code = error?.code
//   //   /** 根据code处理对应的操作，并返回处理后的message */
//   //   const message = resolveResError(code, error.message)

//   //   window.$message?.error(message)
//   //   return Promise.reject(new AxiosRejectError({ code, message, data: error }))
//   // }
//   // const { data, status, config } = error.response
//   // // @ts-expect-error
//   // let { code, msg } = data as AxiosRejectError
//   // code = code ?? status
//   // msg = msg ?? error.message
//   // msg = resolveResError(code, msg)
//   // /** 需要错误提醒 */
//   // const { noNeedTip } = config as RequestConfig

//   // !noNeedTip && window.$message?.error(msg)
//   // return Promise.reject(new AxiosRejectError({ code, msg, data: error.response?.data || error.response }))
// }
